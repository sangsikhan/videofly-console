# API 레퍼런스: 동영상 (Videos API)

**Base URL:** `https://api.videofly.co.kr/v1`

---

## 엔드포인트 목록

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/videos` | 동영상 목록 조회 |
| POST | `/videos` | URL로 동영상 생성 |
| GET | `/videos/:id` | 동영상 상세 조회 |
| PATCH | `/videos/:id` | 동영상 메타데이터 수정 |
| DELETE | `/videos/:id` | 동영상 삭제 |
| POST | `/videos/upload-url` | Direct Upload URL 발급 |
| POST | `/videos/:id/tracks` | 자막/오디오 트랙 추가 |
| DELETE | `/videos/:id/tracks/:track_id` | 트랙 삭제 |
| POST | `/videos/:id/playback-ids` | 재생 ID 추가 |
| DELETE | `/videos/:id/playback-ids/:playback_id` | 재생 ID 삭제 |

---

## GET /videos

동영상 목록 조회.

### Query Parameters

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `page` | integer | 1 | 페이지 번호 |
| `per_page` | integer | 20 | 페이지당 항목 수 (최대 100) |
| `status` | string | - | `ready`, `preparing`, `waiting`, `errored` |
| `q` | string | - | 제목 검색 키워드 |
| `sort` | string | `created_at:desc` | 정렬 기준 |

### 응답 예시

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": "asset_abc123",
      "title": "제품 데모 v2",
      "description": "신제품 소개 영상",
      "tags": ["demo", "product"],
      "status": "ready",
      "duration": 125.4,
      "max_stored_resolution": "1920x1080",
      "max_stored_frame_rate": 30,
      "playback_ids": [
        {
          "id": "pback_xyz789",
          "policy": "public"
        }
      ],
      "tracks": [
        {
          "id": "track_001",
          "type": "video",
          "max_width": 1920,
          "max_height": 1080
        },
        {
          "id": "track_002",
          "type": "text",
          "text_type": "subtitles",
          "language_code": "ko",
          "name": "한국어"
        }
      ],
      "created_at": "2024-03-15T09:30:00Z",
      "updated_at": "2024-03-15T09:45:00Z"
    }
  ],
  "meta": {
    "total": 198,
    "page": 1,
    "per_page": 20,
    "total_pages": 10
  }
}
```

---

## POST /videos/upload-url

Direct Upload URL 발급. 클라이언트가 VideoFly 서버를 거치지 않고 직접 Mux에 업로드할 수 있는 서명된 URL을 발급합니다.

### Request Body

```json
{
  "title": "제품 데모 v2",
  "description": "신제품 소개 영상",
  "tags": ["demo", "product"],
  "playback_policy": "public",
  "mp4_support": "none",
  "auto_generate_captions": false
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | 필수 | 동영상 제목 |
| `description` | string | 선택 | 설명 |
| `tags` | string[] | 선택 | 태그 목록 |
| `playback_policy` | string | 선택 | `public` (기본) 또는 `signed` |
| `mp4_support` | string | 선택 | `none` (기본), `capped-1080p`, `audio-only` |
| `auto_generate_captions` | boolean | 선택 | AI 자동 자막 생성 여부 |

### 응답 예시

```json
HTTP/1.1 201 Created

{
  "upload_id": "upload_abc123",
  "upload_url": "https://storage.googleapis.com/video-storage/...",
  "cors_origin": "*",
  "timeout": 3600
}
```

### 업로드 실행 (클라이언트 → Mux 직접)

```javascript
// 서버에서 upload_url 발급 후 클라이언트에서 실행
const response = await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
});
```

---

## POST /videos

URL에서 동영상을 직접 수집하여 에셋 생성.

### Request Body

```json
{
  "input_url": "https://cdn.example.com/video.mp4",
  "title": "외부 동영상",
  "playback_policy": "public"
}
```

### 응답 예시

```json
HTTP/1.1 201 Created

{
  "id": "asset_abc123",
  "title": "외부 동영상",
  "status": "preparing",
  "playback_ids": [],
  "created_at": "2024-03-15T09:30:00Z"
}
```

---

## GET /videos/:id

단일 동영상 상세 조회.

### 응답 예시

```json
HTTP/1.1 200 OK

{
  "id": "asset_abc123",
  "title": "제품 데모 v2",
  "status": "ready",
  "duration": 125.4,
  "thumbnail_url": "https://image.mux.com/pback_xyz789/thumbnail.png",
  "playback_ids": [
    { "id": "pback_xyz789", "policy": "public" }
  ],
  "static_renditions": {
    "status": "ready",
    "files": [
      { "name": "capped-1080p.mp4", "width": 1920, "height": 1080, "bitrate": 5000000 }
    ]
  }
}
```

---

## PATCH /videos/:id

동영상 메타데이터 수정. 일부 필드만 전송해도 됩니다(Partial Update).

### Request Body

```json
{
  "title": "제품 데모 v3",
  "description": "업데이트된 설명",
  "tags": ["demo", "product", "v3"]
}
```

---

## DELETE /videos/:id

동영상 영구 삭제. 삭제된 동영상은 복구 불가.

```
HTTP/1.1 204 No Content
```

---

## POST /videos/:id/tracks

자막 또는 오디오 트랙 추가.

### Request Body (자막 업로드)

```json
{
  "url": "https://storage.example.com/subtitle-ko.vtt",
  "type": "text",
  "text_type": "subtitles",
  "language_code": "ko",
  "name": "한국어",
  "closed_captions": false
}
```

### Request Body (AI 자동 자막 생성)

```json
{
  "type": "text",
  "text_type": "subtitles",
  "language_code": "ko",
  "name": "한국어 (자동)",
  "auto_generated": true
}
```

### 응답 예시

```json
HTTP/1.1 201 Created

{
  "id": "track_003",
  "type": "text",
  "text_type": "subtitles",
  "language_code": "ko",
  "name": "한국어",
  "status": "preparing"
}
```

---

## 썸네일 URL

별도 API 없이 URL 파라미터로 동적 생성:

```
https://image.mux.com/{PLAYBACK_ID}/thumbnail.png?time=10&width=1280
```

| 파라미터 | 기본값 | 설명 |
|---------|--------|------|
| `time` | 첫 프레임 | 캡처 시점 (초) |
| `width` | 원본 | 이미지 너비 |
| `height` | 비율 자동 | 이미지 높이 |
| `fit_mode` | `smartcrop` | `smartcrop`, `crop`, `pad`, `scale` |
| `format` | `png` | `png`, `jpg`, `webp` |

### Animated GIF

```
https://image.mux.com/{PLAYBACK_ID}/animated.gif?start=10&end=15&fps=10
```
