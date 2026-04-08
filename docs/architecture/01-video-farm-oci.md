# 아키텍처: OCI 동영상 팜 (Data Plane)

> VideoFly의 동영상 처리·전송 인프라는 Mux가 아닌 **OCI(Oracle Cloud Infrastructure) 위에 자체 구축한 동영상 팜**으로 운영됩니다.

---

## 1. 전체 아키텍처 개요

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CONTROL PLANE                                │
│                                                                      │
│   VideoFly API Server (OCI Compute / K8s)                           │
│   ├─ 사용자/조직 관리   ├─ 업로드 조율   ├─ 정책/권한               │
│   └─ 과금 / 웹훅 발송   └─ 메타데이터 DB  └─ 분석 집계             │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ 내부 API
┌──────────────────────────▼───────────────────────────────────────────┐
│                        DATA PLANE  (OCI)                            │
│                                                                      │
│  ┌─────────────┐   ┌──────────────────┐   ┌────────────────────┐   │
│  │   Ingest    │   │   JIT Engine     │   │   Origin Storage   │   │
│  │   Service   │──▶│  Transcode +     │──▶│   OCI Object       │   │
│  │  (Upload)   │   │  Package 통합    │   │   Storage          │   │
│  └─────────────┘   └──────────────────┘   └────────────────────┘   │
│                             │                        │              │
│                    ┌────────▼────────┐               │              │
│                    │  Segment Cache  │◀──────────────┘              │
│                    │  (OCI Cache /   │                              │
│                    │   Redis Cluster)│                              │
│                    └────────┬────────┘                              │
│                             │                                       │
│                    ┌────────▼────────┐                              │
│                    │  Analytics      │                              │
│                    │  Collector      │                              │
│                    │  (Kafka + Flink)│                              │
│                    └─────────────────┘                              │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────────┐
│                        DELIVERY                                     │
│                                                                      │
│   OCI CDN  (글로벌 엣지)                                            │
│   ├─ HLS / DASH 세그먼트 캐시                                        │
│   └─ 썸네일·자막·플레이어 정적 자산                                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. 핵심 구성 요소

### 2.1 Ingest Service (업로드 수신)

| 역할 | 설명 |
|------|------|
| 직접 업로드 수신 | 클라이언트 → 서명된 URL → OCI Object Storage Multipart |
| URL 수집 | 외부 URL 크롤링 후 Object Storage에 저장 |
| 청크 조합 | 멀티파트 파트 조합 및 무결성 확인 |
| 이벤트 발행 | 업로드 완료 → Kafka `video.uploaded` 토픽 발행 |

**업로드 파일 저장 경로:**

```
oci://vf-origin-bucket/
└── orgs/{org_id}/
    └── videos/{vid_id}/
        └── source.{ext}       ← 원본 파일
```

### 2.2 JIT Engine (통합 JIT 처리)

VideoFly의 핵심 컴포넌트. **JIT Transcoding과 JIT Packaging을 단일 파이프라인**에서 처리합니다.

자세한 내용: [02-jit-pipeline.md](./02-jit-pipeline.md)

### 2.3 Origin Storage (OCI Object Storage)

| 저장 유형 | 경로 | 설명 |
|---------|------|------|
| 원본 파일 | `/orgs/{org_id}/videos/{vid_id}/source.*` | 업로드 원본 (불변) |
| 트랜스코드 결과 | `/orgs/{org_id}/videos/{vid_id}/profiles/{prof_id}/` | 프로파일별 트랜스코드 결과 |
| HLS 세그먼트 | `/orgs/{org_id}/videos/{vid_id}/hls/{prof_id}/` | 패키징된 .ts/.m4s 세그먼트 |
| 썸네일 | `/orgs/{org_id}/videos/{vid_id}/thumbnails/` | 생성된 썸네일 이미지 |
| 자막 | `/orgs/{org_id}/videos/{vid_id}/subtitles/` | VTT, SRT 파일 |

**보존 정책:**
- 원본 파일: 계정 삭제 전 영구 보존 (요금제별 저장 한도)
- JIT 트랜스코드 결과: 캐시 정책에 따라 TTL 설정 (기본 7일, 자주 재생 시 연장)
- HLS 세그먼트: CDN + 로컬 캐시 (TTL 1~24시간)

### 2.4 Analytics Collector

| 컴포넌트 | 역할 |
|---------|------|
| Kafka | 플레이어 이벤트 대용량 스트리밍 수신 (초당 수십만 이벤트) |
| Apache Flink | 실시간 스트림 처리, 집계, 이상 감지 |
| ClickHouse | 대용량 분석 쿼리 저장소 (컬럼 DB) |
| OCI Data Flow | 배치 분석 (일/주/월 리포트 생성) |

자세한 내용: [분석 아키텍처 →](./04-analytics-architecture.md)

---

## 3. OCI 구성 상세

### 3.1 Compute / K8s

| 서비스 | OCI 제품 | 스펙 (초기) |
|--------|---------|------------|
| JIT Engine | OCI Compute (GPU/CPU 혼합) | VM.Standard3.Flex × N |
| API Server | OCI Container Engine (OKE) | 3 Node × 8 vCPU |
| Ingest Service | OCI Container Engine (OKE) | 2 Node × 4 vCPU |
| Analytics (Kafka) | OCI Streaming | 관리형 |
| Analytics (Flink) | OCI Data Flow | 관리형 |
| Analytics (ClickHouse) | OCI Compute | VM.Standard3.Flex × 3 |

### 3.2 Storage

| 역할 | OCI 제품 | 설정 |
|------|---------|------|
| 원본·결과 파일 | OCI Object Storage | Standard Tier, 리전 복제 |
| 세그먼트 캐시 | OCI Cache (Redis) | 64GB 클러스터 |
| 메타데이터 DB | OCI MySQL DB System | HA, 자동 백업 |
| 이벤트 로그 | OCI Object Storage (Archive Tier) | 6개월 보존 |

### 3.3 네트워크 / CDN

| 항목 | OCI 제품 | 설정 |
|------|---------|------|
| CDN | OCI CDN | 글로벌 엣지 (한국 포함) |
| 로드밸런서 | OCI Load Balancer | 유연형, SSL 종료 |
| DNS | OCI DNS | 지역 라우팅 |
| WAF | OCI WAF | DDoS + 웹 공격 방어 |

---

## 4. 리전 구성

```
Primary Region: ap-seoul-1 (서울)
DR Region:      ap-tokyo-1 (도쿄)

[서울 리전]
  ├─ Ingest Service (Active)
  ├─ JIT Engine (Active)
  ├─ Origin Storage (Primary)
  └─ ClickHouse Cluster (Primary)

[도쿄 리전]
  ├─ Origin Storage (Replica — 크로스 리전 복제)
  └─ ClickHouse (Replica — 읽기 전용)
```

---

## 5. 데이터 흐름 요약

### 업로드 흐름

```
클라이언트
    │ 1. PUT (multipart)
    ▼
OCI Object Storage (원본)
    │ 2. Kafka: video.uploaded
    ▼
JIT Engine — 사전 프로파일 생성 (선택적)
    │ 3. 프로파일 결과 저장
    ▼
OCI Object Storage (프로파일 결과)
    │ 4. Kafka: video.ready
    ▼
API Server → WebHook 발송
```

### 재생 흐름 (JIT)

```
플레이어 → CDN
    │ Cache Miss
    ▼
JIT Engine
    ├─ 1. 원본 파일 참조 (Object Storage)
    ├─ 2. 요청 프로파일로 JIT Transcode
    ├─ 3. JIT Package → HLS/DASH 세그먼트 생성
    └─ 4. 세그먼트 캐시 저장 + CDN 응답
    
다음 요청 → CDN 캐시 HIT → 즉시 응답
```

### 분석 이벤트 흐름

```
플레이어 (1,000~100,000 동시 뷰어)
    │ heartbeat, quality 이벤트 (5초 간격)
    ▼
Analytics Collector API (수신 전용)
    │ Kafka 토픽: vf.player.events
    ▼
Flink 실시간 처리
    ├─ 집계: 동시 시청자 수, QoE 지표
    ├─ 이상 감지: 오류율 급등, 리버퍼링 급증
    └─ ClickHouse 저장
    ▼
API Server → 대시보드/알림
```
