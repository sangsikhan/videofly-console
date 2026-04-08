# 페이지: 동영상 업로드 (Video Upload)

**Route:** `/videos/upload`  
**접근 권한:** Developer 역할 이상  
**조직 컨텍스트:** 현재 선택된 조직(org_id)에 귀속

---

## 1. 페이지 목적

동영상 파일을 VideoFly OCI 동영상 팜으로 업로드하고, JIT 처리를 시작하는 페이지.  
두 가지 업로드 방식 지원: **직접 업로드(Direct Upload)**, **URL 수집 업로드**.

---

## 2. 레이아웃 구성

```
┌──────────────────────────────────────────────────────────────┐
│  조직: (주)에이비씨  /  동영상 업로드                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [탭] ● 파일 업로드    ○ URL로 가져오기                      │
│                                                              │
│  ┌─────────────────────────────────────┐                    │
│  │   ⬆  파일을 드래그하거나 클릭하세요 │                    │
│  │   MP4, MOV, AVI, MKV...  최대 50GB  │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
│  [동영상 메타데이터]                                         │
│   제목 *: ___________________________                        │
│   설명  : ___________________________                        │
│   태그  : ___________________________                        │
│                                                              │
│  [고급 설정 ▼]                                               │
│   재생 정책: ● 공개  ○ 서명 필요                             │
│   ABR 프로파일 세트: ● 기본 (360p~1080p)  ○ 커스텀         │
│                                                              │
│  [업로드 시작]                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. 업로드 방식 상세

### 3.1 Direct Upload (파일 직접 업로드)

**흐름: 클라이언트 → OCI Object Storage 직접 전송**

```
[브라우저]
    │ ① POST /api/v1/videos/upload-url
    ▼
[VideoFly API Server]
    │ ② OCI Pre-Authenticated Request(PAR) URL 생성
    │    → oci://vf-origin/orgs/{org_id}/videos/{vid_id}/source.mp4
    ▼
[브라우저]
    │ ③ PUT {oci_par_url} (파일 바이너리, VideoFly 서버 미경유)
    ▼
[OCI Object Storage]
    │ ④ Kafka: video.uploaded (vid_id, org_id)
    ▼
[JIT Engine Warm-up]
    - 기본 프로파일(1080p) 백그라운드 사전 처리 시작
    - 첫 30초 세그먼트 우선 생성
    │ ⑤ Kafka: video.ready (첫 재생 가능)
    ▼
[VideoFly API] → Webhook 발송 → DB 상태 갱신
```

**진행률 UI:**
```
source.mp4 업로드 중  (vid_01HXYZ456DEF)
[████████████░░░░░░] 65%  1.5 GB / 2.3 GB
예상 남은 시간: 약 1분 30초

업로드 완료 후 JIT 프리워밍이 자동으로 시작됩니다.
```

### 3.2 URL로 가져오기 (URL Import)

외부 URL에서 OCI Object Storage로 직접 수집:

```
URL: [https://cdn.example.com/video.mp4          ]

지원: HTTPS 공개 URL · S3 서명 URL · GCS URL

[가져오기 시작]
```

**흐름:**
```
[VideoFly API Server]
    │ OCI Object Storage로 URL 내용 직접 수집
    ▼
[OCI Object Storage] → vid_{ulid} ID 부여
    │ Kafka: video.uploaded
    ▼
[JIT Engine Warm-up]
```

---

## 4. 메타데이터 및 설정

### 기본 정보

| 필드 | 타입 | 필수 | 제한 |
|------|------|------|------|
| 제목 | text | 필수 | 최대 255자 |
| 설명 | textarea | 선택 | 최대 5,000자 |
| 태그 | tag input | 선택 | 최대 20개 |

### 고급 설정

| 설정 | 기본값 | 설명 |
|------|--------|------|
| 재생 정책 | 공개(public) | `signed`: JWT 토큰 없이 재생 불가 |
| ABR 프로파일 세트 | 기본 (360p~1080p H.264) | 커스텀 프로파일 세트 선택 가능 (Pro 이상) |

---

## 5. 업로드 후 상태 흐름

```
파일 선택
    ↓
[1단계] 업로드 중 → OCI Object Storage 저장
    ↓
[2단계] JIT Warm-up 중 → 기본 프로파일 사전 처리
    ↓
[3단계] 재생 가능 (ready) → 동영상 상세 페이지 이동
         또는
         오류 (errored) → 오류 메시지 + 재시도 버튼
```

**상태 표시:**
```
✅ 업로드 완료   vid_01HXYZ456DEF
⏳ JIT 프리워밍 중...
   기본 프로파일(1080p) 처리 중입니다. 잠시 후 재생 가능합니다.
   [배경에서 처리 중 — 다른 작업 계속하세요]
```

---

## 6. API 연동

```bash
# Step 1: 업로드 URL 발급
POST /api/v1/videos/upload-url
X-Org-ID: org_01HXYZ123ABC
Authorization: Basic {key_id:secret}
Content-Type: application/json

{
  "title": "제품 데모 v2",
  "playback_policy": "public",
  "profile_set": "default"
}

Response 201:
{
  "vid_id": "vid_01HXYZ456DEF",
  "upload_url": "https://objectstorage.ap-seoul-1.oraclecloud.com/...",
  "upload_method": "PUT",
  "expires_at": "2024-03-15T10:00:00Z"
}

# Step 2: 파일 업로드 (클라이언트 → OCI 직접)
PUT {upload_url}
Content-Type: video/mp4
Body: <binary>

# Step 3: 상태 확인
GET /api/v1/videos/vid_01HXYZ456DEF
X-Org-ID: org_01HXYZ123ABC

Response:
{
  "id": "vid_01HXYZ456DEF",
  "status": "warming_up",
  "profiles": {
    "prof_1080p_h264": "generating",
    "prof_720p_h264": "not_generated",
    "prof_480p_h264": "not_generated"
  }
}
```
