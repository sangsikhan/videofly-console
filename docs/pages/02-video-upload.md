# 페이지: 동영상 업로드 (Video Upload)

**Route:** `/videos/upload`  
**접근 권한:** Write 권한 이상

---

## 1. 페이지 목적

동영상 파일을 VideoFly(Mux)로 업로드하고 인코딩을 시작하는 페이지.  
두 가지 업로드 방식 지원: **직접 업로드(Direct Upload)**, **URL 수집 업로드**.

---

## 2. 레이아웃 구성

```
┌──────────────────────────────────────────────────────────┐
│  헤더: "동영상 업로드"                                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [탭] ● 파일 업로드    ○ URL로 가져오기                   │
│                                                          │
│  ┌─────────────────────────────────────┐                 │
│  │                                     │                 │
│  │   ⬆  파일을 여기에 드래그하거나      │                 │
│  │      클릭하여 선택하세요             │                 │
│  │                                     │                 │
│  │   지원 형식: MP4, MOV, AVI, MKV...  │                 │
│  │   최대 크기: 50GB                   │                 │
│  └─────────────────────────────────────┘                 │
│                                                          │
│  [동영상 메타데이터 입력]                                  │
│   제목 *: ___________________________                     │
│   설명  : ___________________________                     │
│   태그  : ___________________________                     │
│                                                          │
│  [고급 설정 펼치기 ▼]                                     │
│   재생 정책: ● 공개  ○ 서명 필요                          │
│   MP4 다운로드 허용: □                                    │
│   자동 자막 생성: □                                       │
│                                                          │
│  [업로드 시작] 버튼                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 3. 업로드 방식 상세

### 3.1 Direct Upload (파일 직접 업로드)

**흐름:**

```
[브라우저] → VideoFly API: "업로드 URL 요청"
[VideoFly API] → Mux API: POST /video/v1/uploads
[Mux API] → [VideoFly API]: { upload_url, upload_id }
[VideoFly API] → [브라우저]: { upload_url }
[브라우저] → Mux 직접: PUT {upload_url} (파일 바이너리)
[Mux] → VideoFly Webhook: video.upload.asset_created
[VideoFly] → DB: asset_id 저장
```

**UI 동작:**
1. 드래그 앤 드롭 또는 파일 선택
2. "업로드 시작" 클릭 시 VideoFly API에서 서명 URL 발급
3. 파일을 Mux로 직접 전송 (VideoFly 서버 통과 없음)
4. 진행률 바 표시 (0~100%)
5. 업로드 완료 → 인코딩 상태 표시 ("인코딩 중...")
6. 인코딩 완료 → 동영상 상세 페이지로 이동

**진행률 UI:**
```
파일명: product-demo.mp4 (2.3 GB)
[████████████░░░░░░░░] 60% — 1.38 GB / 2.3 GB
예상 남은 시간: 약 2분
```

### 3.2 URL로 가져오기 (URL Import)

외부 URL에서 영상 파일 수집:

```
URL 입력: https://cdn.example.com/video.mp4

[가져오기 시작] 버튼
```

**지원 URL 유형:**
- HTTPS 공개 URL
- Amazon S3 (서명된 URL)
- Google Cloud Storage
- Cloudflare R2

**흐름:**
```
[VideoFly API] → Mux API: POST /video/v1/assets
  { "input": [{ "url": "https://..." }] }
[Mux]: 백그라운드에서 URL 수집 및 인코딩 시작
[Mux] → Webhook: video.asset.ready
```

---

## 4. 메타데이터 입력 필드

| 필드 | 타입 | 필수 | 제한 |
|------|------|------|------|
| 제목 | text | 필수 | 최대 255자 |
| 설명 | textarea | 선택 | 최대 5,000자 |
| 태그 | tag input | 선택 | 쉼표 구분, 최대 20개 |

### 고급 설정

| 설정 | 기본값 | 설명 |
|------|--------|------|
| 재생 정책 | 공개(public) | `signed`: JWT 토큰 없이 재생 불가 |
| MP4 다운로드 | 비활성 | `capped-1080p`, `audio-only` 옵션 |
| 자동 자막 생성 | 비활성 | Mux AI 기반, 20개+ 언어 |

---

## 5. 업로드 후 상태 흐름

```
파일 선택
    ↓
업로드 중 (0~100%)
    ↓
인코딩 대기 (waiting)
    ↓
인코딩 중 (preparing)
    ↓
준비 완료 (ready) → 동영상 상세로 이동
    또는
오류 (errored)   → 오류 메시지 + 재시도 버튼
```

---

## 6. 검증 규칙

| 규칙 | 처리 |
|------|------|
| 파일 크기 > 플랜 허용 한도 | 업로드 시작 전 오류 표시 |
| 지원하지 않는 파일 형식 | 파일 선택 시 즉시 경고 |
| 제목 미입력 | 제출 시 인라인 오류 표시 |
| 네트워크 중단 | 재개 가능 업로드 (tus 프로토콜 지원 시) |

---

## 7. 다중 파일 업로드 (Phase 2)

- 파일 여러 개 동시 선택 → 큐(Queue)로 순차 처리
- 업로드 큐 UI: 파일별 상태, 진행률, 취소 버튼

---

## 8. API 연동 예시

```bash
# 1. 업로드 URL 발급
POST /api/v1/videos/upload-url
Authorization: Bearer {token}
Content-Type: application/json
{
  "title": "제품 데모",
  "playback_policy": "public"
}

Response:
{
  "upload_url": "https://storage.googleapis.com/...",
  "upload_id": "mux_upload_xxxx",
  "asset_id": null  // 인코딩 완료 후 생성
}

# 2. 파일 업로드 (클라이언트 → Mux 직접)
PUT {upload_url}
Content-Type: video/mp4
Body: <binary file>
```
