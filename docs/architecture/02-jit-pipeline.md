# 아키텍처: JIT Transcoding + JIT Packaging 통합 파이프라인

---

## 1. 개요

VideoFly의 JIT(Just-In-Time) 엔진은 **트랜스코딩과 패키징을 단일 파이프라인**으로 통합합니다.

| 전통적 방식 | VideoFly JIT 방식 |
|-----------|-----------------|
| 업로드 → 사전 인코딩 (모든 프로파일) | 업로드 → 첫 재생 시 요청 프로파일만 처리 |
| 모든 프로파일 저장 | 자주 쓰는 프로파일만 캐시 |
| Transcode 완료 후 Package | Transcode → Package 동시 파이프라인 |
| 초기 처리 시간 길고 비용 높음 | 첫 재생 약간 지연, 이후 캐시 HIT |

---

## 2. JIT 처리 흐름

```
┌──────────────────────────────────────────────────────────────┐
│                   JIT Engine 처리 흐름                       │
│                                                              │
│  재생 요청                                                    │
│  GET /hls/{vid_id}/{prof_id}/manifest.m3u8                   │
│          │                                                   │
│          ▼                                                   │
│  [Cache Lookup]                                              │
│    HIT  ──────────────────────────────── 즉시 응답           │
│    MISS │                                                    │
│         ▼                                                    │
│  [원본 파일 로드]                                             │
│  OCI Object Storage                                          │
│  oci://vf-origin/orgs/{org_id}/videos/{vid_id}/source.*      │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────────────────────────────────┐                │
│  │  통합 JIT 파이프라인                     │                │
│  │                                         │                │
│  │  ① 프로파일 조회                        │                │
│  │     prof_id → 해상도, 비트레이트, 코덱  │                │
│  │                                         │                │
│  │  ② 세그먼트 범위 결정                   │                │
│  │     요청 시간 범위 (0~6초, 6~12초...)   │                │
│  │                                         │                │
│  │  ③ JIT Transcode (세그먼트 단위)        │                │
│  │     FFmpeg / HW Accelerated (GPU)       │                │
│  │     원본 → 목표 해상도/비트레이트       │                │
│  │                                         │                │
│  │  ④ JIT Package (동시 진행)              │                │
│  │     .ts 세그먼트 또는 fMP4 생성         │                │
│  │     HLS: .ts + #EXTM3U manifest         │                │
│  │     DASH: .m4s + MPD manifest           │                │
│  │                                         │                │
│  └─────────────────────────────────────────┘                │
│         │                                                    │
│         ▼                                                    │
│  [Cache Write]                                               │
│  세그먼트 → Redis (hot) + Object Storage (warm)              │
│         │                                                    │
│         ▼                                                    │
│  클라이언트 응답                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. 인코딩 프로파일 (Profile) 체계

### 기본 제공 프로파일

| Profile ID | 해상도 | 비트레이트 | 코덱 | 용도 |
|-----------|--------|----------|------|------|
| `prof_2160p_av1` | 3840×2160 | 8,000 kbps | AV1 | 4K HDR |
| `prof_1080p_h264` | 1920×1080 | 4,500 kbps | H.264 | Full HD (기본) |
| `prof_720p_h264` | 1280×720 | 2,500 kbps | H.264 | HD |
| `prof_480p_h264` | 854×480 | 1,000 kbps | H.264 | SD |
| `prof_360p_h264` | 640×360 | 500 kbps | H.264 | 저화질/모바일 |
| `prof_audio_aac` | — | 128 kbps | AAC | 오디오 전용 |
| `prof_1080p_hevc` | 1920×1080 | 3,000 kbps | H.265/HEVC | 효율 압축 |

### 커스텀 프로파일 (Pro 이상)

조직 관리자가 커스텀 프로파일 정의 가능:

```json
{
  "profile_id": "prof_custom_corp_720p",
  "name": "기업 내부용 720p",
  "codec": "h264",
  "resolution": "1280x720",
  "bitrate_kbps": 2000,
  "fps": 30,
  "keyframe_interval": 2,
  "audio_codec": "aac",
  "audio_bitrate_kbps": 128,
  "watermark": {
    "enabled": true,
    "image_url": "https://...",
    "position": "bottom-right",
    "opacity": 0.3
  }
}
```

### ABR(Adaptive Bitrate) 래더

재생 시 ABR을 위해 복수의 프로파일을 묶어 마스터 플레이리스트 제공:

```m3u8
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=4500000,RESOLUTION=1920x1080
/hls/{vid_id}/prof_1080p_h264/segment.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
/hls/{vid_id}/prof_720p_h264/segment.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=854x480
/hls/{vid_id}/prof_480p_h264/segment.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=640x360
/hls/{vid_id}/prof_360p_h264/segment.m3u8
```

---

## 4. 캐시 계층 전략

```
L1: Redis (In-Memory) — 최근 세그먼트, 고빈도 재생
    TTL: 1시간 (재생 중 갱신)
    용량: 64GB per 노드

L2: OCI Object Storage — 중간 빈도 재생
    TTL: 7일 (재생 횟수에 따라 연장)
    
L3: CDN Edge Cache — 글로벌 배포
    TTL: 6시간 (HLS 세그먼트), 24시간 (정적 파일)
    
Eviction: LRU + 재생 빈도 가중치
  → 자주 재생되는 동영상 캐시 유지
  → 30일 이상 미재생 → 결과 파일 삭제 (원본은 보존)
```

---

## 5. 라이브 스트리밍 JIT 처리

라이브는 사전 업로드 없이 실시간 스트림을 JIT 처리:

```
OBS / 인코더 → RTMP/SRT 수신 서버
                    │
                    ▼ 실시간 패킷 수신
              [라이브 JIT 엔진]
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   HLS 세그먼트 생성     DASH 세그먼트 생성
   (2초 단위)            (2초 단위)
          │
          ▼
   Origin Storage + CDN Edge 즉시 배포
          │
          ▼
   시청자 (지연: 2~6초 / LL-HLS: <1초)
```

---

## 6. 첫 재생 지연 최소화 전략

JIT 방식의 단점인 **첫 재생 지연(cold start)**을 줄이는 전략:

| 전략 | 설명 | 적용 기준 |
|------|------|----------|
| 사전 처리 (Warm-up) | 업로드 직후 1080p 프로파일 백그라운드 생성 | 모든 업로드 |
| 세그먼트 선행 생성 | 첫 30초 세그먼트 우선 처리 | 업로드 완료 직후 |
| GPU 가속 | NVENC/Quick Sync로 트랜스코딩 속도 향상 | JIT 엔진 하드웨어 |
| 원본 재생 옵션 | 처리 전 원본 직접 재생 (품질 낮을 수 있음) | 긴급 재생 시 |

---

## 7. 패키징 포맷

| 포맷 | 용도 | 세그먼트 포맷 | 마니페스트 |
|------|------|------------|---------|
| HLS | iOS, macOS, 기본 웹 | `.ts` 또는 fMP4 `.m4s` | `.m3u8` |
| MPEG-DASH | 안드로이드, MSE 지원 브라우저 | fMP4 `.m4s` | `.mpd` |
| HLS + fMP4 | EME DRM 지원 시 | `.m4s` | `.m3u8` |

**재생 URL 형식:**

```
HLS:
https://stream.videofly.co.kr/hls/{org_id}/{vid_id}/master.m3u8
또는 서명된 URL:
https://stream.videofly.co.kr/hls/{org_id}/{vid_id}/master.m3u8?token={JWT}

DASH:
https://stream.videofly.co.kr/dash/{org_id}/{vid_id}/manifest.mpd

특정 프로파일 고정:
https://stream.videofly.co.kr/hls/{org_id}/{vid_id}/{prof_id}/index.m3u8
```

---

## 8. 에러 및 폴백

| 상황 | 처리 |
|------|------|
| JIT 엔진 과부하 | 요청 큐잉 → 원본 파일 임시 직접 재생 |
| 프로파일 없음 | 가장 가까운 해상도 프로파일로 대체 |
| 원본 파일 없음 | 404 + 웹훅 `video.playback.error` 발송 |
| 캐시 만료 | 자동 재처리 |
| 트랜스코딩 실패 | 재시도 3회 → 웹훅 `video.transcode.failed` |
