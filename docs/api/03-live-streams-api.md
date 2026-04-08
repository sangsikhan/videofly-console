# API 레퍼런스: 라이브 스트림 (Live Streams API)

**Base URL:** `https://api.videofly.co.kr/v1`

---

## 엔드포인트 목록

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/live-streams` | 라이브 스트림 목록 조회 |
| POST | `/live-streams` | 라이브 스트림 생성 |
| GET | `/live-streams/:id` | 라이브 스트림 상세 조회 |
| PATCH | `/live-streams/:id` | 라이브 스트림 설정 수정 |
| DELETE | `/live-streams/:id` | 라이브 스트림 삭제 |
| PUT | `/live-streams/:id/complete` | 스트림 강제 종료 |
| POST | `/live-streams/:id/reset-stream-key` | 스트림 키 재발급 |
| GET | `/live-streams/:id/recordings` | 녹화 목록 조회 |
| GET | `/live-streams/:id/metrics` | 실시간 지표 조회 |
| POST | `/live-streams/:id/simulcast-targets` | Simulcast 대상 추가 |
| DELETE | `/live-streams/:id/simulcast-targets/:target_id` | Simulcast 대상 삭제 |

---

## 라이브 스트림 상태 머신

```
[생성됨]
    │
    ↓ 인코더 연결
 idle ────────────→ active ─────────────→ disconnected
                      │                       │
                      │ 방송 종료              │ reconnect_window 초과
                      ↓                       ↓
                   idle (재사용 가능)      idle (자동 종료)
```

| 상태 | 설명 |
|------|------|
| `idle` | 스트림 준비됨, 방송 중 아님 |
| `active` | 인코더 연결됨, 방송 중 |
| `disconnected` | 연결 끊김, 재연결 대기 중 |

---

## POST /live-streams

라이브 스트림 생성.

### Request Body

```json
{
  "name": "제품 런칭 라이브",
  "description": "신제품 런칭 라이브 방송",
  "playback_policy": "public",
  "auto_recording": true,
  "reconnect_window": 60,
  "reduced_latency": false,
  "low_latency": false
}
```

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `name` | string | 필수 | - | 스트림 이름 |
| `description` | string | 선택 | - | 설명 |
| `playback_policy` | string | 선택 | `public` | `public` 또는 `signed` |
| `auto_recording` | boolean | 선택 | `true` | 자동 녹화 여부 |
| `reconnect_window` | integer | 선택 | 60 | 재연결 허용 시간 (초, 0~1800) |
| `reduced_latency` | boolean | 선택 | `false` | 저지연 모드 (3~5초) |
| `low_latency` | boolean | 선택 | `false` | LL-HLS (<1초) |

### 응답 예시

```json
HTTP/1.1 201 Created

{
  "id": "live_abc123",
  "name": "제품 런칭 라이브",
  "status": "idle",
  "stream_key": "abcd-efgh-ijkl-mnop",
  "ingest_url": {
    "rtmp": "rtmp://global-live.mux.com/app",
    "srt": "srt://global-live.mux.com:9000?streamid=abcd-efgh-ijkl-mnop"
  },
  "playback_ids": [
    { "id": "pback_live_xyz", "policy": "public" }
  ],
  "auto_recording": true,
  "reconnect_window": 60,
  "created_at": "2024-03-15T09:00:00Z"
}
```

---

## GET /live-streams/:id

라이브 스트림 상세 조회.

```json
HTTP/1.1 200 OK

{
  "id": "live_abc123",
  "name": "제품 런칭 라이브",
  "status": "active",
  "stream_key": "abcd-efgh-ijkl-mnop",
  "ingest_url": {
    "rtmp": "rtmp://global-live.mux.com/app"
  },
  "playback_ids": [
    { "id": "pback_live_xyz", "policy": "public" }
  ],
  "active_asset_id": "asset_recording_001",
  "recent_asset_ids": ["asset_prev_001", "asset_prev_002"],
  "auto_recording": true,
  "reconnect_window": 60,
  "active_input_info": {
    "bitrate": 3500000,
    "resolution": "1920x1080",
    "frame_rate": 30.0
  },
  "created_at": "2024-03-15T09:00:00Z"
}
```

---

## PUT /live-streams/:id/complete

방송을 강제로 종료합니다.

```
HTTP/1.1 200 OK

{
  "id": "live_abc123",
  "status": "idle"
}
```

---

## POST /live-streams/:id/reset-stream-key

스트림 키를 재발급합니다. 기존 키는 즉시 무효화됩니다.

```json
HTTP/1.1 200 OK

{
  "stream_key": "wxyz-1234-5678-9abc"
}
```

---

## GET /live-streams/:id/recordings

스트림의 녹화 VOD 목록 조회.

```json
HTTP/1.1 200 OK

{
  "data": [
    {
      "asset_id": "asset_rec_001",
      "status": "ready",
      "duration": 5025.3,
      "started_at": "2024-03-15T14:00:00Z",
      "ended_at": "2024-03-15T15:23:45Z",
      "playback_id": "pback_rec_xyz"
    },
    {
      "asset_id": "asset_rec_002",
      "status": "ready",
      "duration": 3900.0,
      "started_at": "2024-03-10T10:00:00Z",
      "ended_at": "2024-03-10T11:05:00Z",
      "playback_id": "pback_rec_abc"
    }
  ]
}
```

---

## GET /live-streams/:id/metrics

실시간 지표 조회 (5초 주기 폴링용).

```json
HTTP/1.1 200 OK

{
  "id": "live_abc123",
  "status": "active",
  "stream_duration_seconds": 5025,
  "concurrent_viewers": 342,
  "peak_viewers": 521,
  "total_views": 1203,
  "input": {
    "connected": true,
    "video_bitrate_kbps": 3500,
    "audio_bitrate_kbps": 192,
    "resolution": "1920x1080",
    "fps": 30.0,
    "video_codec": "h264",
    "audio_codec": "aac"
  },
  "bitrate_history_60s": [3450, 3520, 3500, 3480, 3510]
}
```

---

## POST /live-streams/:id/simulcast-targets

Simulcast 대상 추가 (YouTube, Facebook, Twitch 등 동시 송출).

### Request Body

```json
{
  "url": "rtmp://a.rtmp.youtube.com/live2",
  "stream_key": "xxxx-xxxx-xxxx-xxxx",
  "platform": "youtube",
  "passthrough": "YouTube 라이브"
}
```

### 응답 예시

```json
HTTP/1.1 201 Created

{
  "id": "simulcast_001",
  "url": "rtmp://a.rtmp.youtube.com/live2",
  "status": "idle",
  "platform": "youtube"
}
```

---

## 재생 URL

```
HLS (공개):
https://stream.mux.com/{PLAYBACK_ID}.m3u8

HLS (서명됨):
https://stream.mux.com/{PLAYBACK_ID}.m3u8?token={JWT}

LL-HLS (저지연):
https://stream.mux.com/{PLAYBACK_ID}.m3u8?protocol=ll-hls
```

---

## 연동 예시 (OBS 자동화)

```javascript
// 라이브 스트림 생성 → OBS WebSocket으로 자동 설정
const stream = await videofly.liveStreams.create({
  name: '오늘의 라이브',
  auto_recording: true,
});

// OBS에 적용할 설정값
console.log({
  server: stream.ingest_url.rtmp,
  key: stream.stream_key,
  viewer_url: `https://stream.mux.com/${stream.playback_ids[0].id}.m3u8`,
});
```
