# API 레퍼런스: 웹훅 (Webhooks)

---

## 1. 개요

웹훅은 VideoFly(Mux)에서 특정 이벤트 발생 시 등록된 URL로 HTTP POST 요청을 전송하는 기능입니다.  
동영상 인코딩 완료, 라이브 방송 시작 등 비동기 이벤트를 실시간으로 처리할 수 있습니다.

---

## 2. 웹훅 설정

[콘솔 → 설정 → API → 웹훅](https://console.videofly.co.kr/settings/api#webhooks)에서 설정.

또는 API로 관리:

```
GET    /api/v1/webhooks              — 웹훅 목록
POST   /api/v1/webhooks              — 웹훅 추가
GET    /api/v1/webhooks/:id          — 웹훅 상세
PATCH  /api/v1/webhooks/:id          — 웹훅 수정
DELETE /api/v1/webhooks/:id          — 웹훅 삭제
POST   /api/v1/webhooks/:id/test     — 테스트 전송
GET    /api/v1/webhooks/:id/logs     — 전송 이력
```

---

## 3. 웹훅 요청 형식

### HTTP 헤더

```
Content-Type: application/json
User-Agent: VideoFly-Webhook/1.0
Mux-Signature: t=1710499200,v1=abc123def456...
X-VideoFly-Event: video.asset.ready
X-VideoFly-Delivery: wh_delivery_xyz
```

### 페이로드 구조

```json
{
  "type": "video.asset.ready",
  "id": "evt_abc123",
  "created_at": "2024-03-15T09:45:00Z",
  "object": {
    "type": "asset",
    "id": "asset_abc123"
  },
  "data": {
    // 이벤트별 상세 데이터
  }
}
```

---

## 4. 서명 검증

모든 웹훅 요청에는 `Mux-Signature` 헤더가 포함됩니다.  
요청의 진위를 검증하기 위해 **반드시 서명을 확인**하세요.

### 서명 형식

```
Mux-Signature: t={timestamp},v1={signature}
```

- `t`: 이벤트 발생 Unix 타임스탬프
- `v1`: HMAC-SHA256 서명값

### 검증 로직

```
서명 대상 문자열 = "{timestamp}.{raw_request_body}"
서명 = HMAC-SHA256(서명 대상 문자열, webhook_secret)
검증 = "v1=" + 서명 === v1 값
```

### 코드 예시

**Node.js (Express)**

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

app.post('/webhooks/videofly', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['mux-signature'];
  const rawBody = req.body;
  const secret = process.env.VF_WEBHOOK_SECRET;

  // 서명 검증
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return res.status(401).json({ error: '서명 검증 실패' });
  }

  const event = JSON.parse(rawBody);
  console.log('이벤트:', event.type);

  // 이벤트 처리
  switch (event.type) {
    case 'video.asset.ready':
      handleAssetReady(event.data);
      break;
    case 'video.live_stream.active':
      handleLiveStreamActive(event.data);
      break;
    default:
      console.log('알 수 없는 이벤트:', event.type);
  }

  res.json({ received: true });
});

function verifyWebhookSignature(body, signature, secret) {
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t=')).split('=')[1];
  const v1 = parts.find(p => p.startsWith('v1=')).split('=')[1];
  
  const signedPayload = `${timestamp}.${body}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  // Timing-safe 비교
  return crypto.timingSafeEqual(
    Buffer.from(`v1=${expectedSig}`),
    Buffer.from(`v1=${v1}`)
  );
}
```

**Python (FastAPI)**

```python
import hmac
import hashlib
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.post("/webhooks/videofly")
async def webhook_handler(request: Request):
    body = await request.body()
    signature = request.headers.get("mux-signature", "")
    secret = os.environ["VF_WEBHOOK_SECRET"]
    
    if not verify_webhook(body, signature, secret):
        raise HTTPException(status_code=401, detail="서명 검증 실패")
    
    event = await request.json()
    
    if event["type"] == "video.asset.ready":
        await handle_asset_ready(event["data"])
    
    return {"received": True}

def verify_webhook(body: bytes, signature: str, secret: str) -> bool:
    parts = dict(p.split("=", 1) for p in signature.split(","))
    timestamp = parts.get("t", "")
    v1 = parts.get("v1", "")
    
    signed_payload = f"{timestamp}.{body.decode()}"
    expected = hmac.new(
        secret.encode(), signed_payload.encode(), hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"v1={expected}", f"v1={v1}")
```

---

## 5. 이벤트 유형별 페이로드

### video.asset.ready

```json
{
  "type": "video.asset.ready",
  "data": {
    "id": "asset_abc123",
    "status": "ready",
    "duration": 125.4,
    "max_stored_resolution": "1920x1080",
    "max_stored_frame_rate": 30,
    "playback_ids": [
      { "id": "pback_xyz789", "policy": "public" }
    ],
    "tracks": [
      { "id": "track_001", "type": "video" },
      { "id": "track_002", "type": "audio" }
    ],
    "created_at": "2024-03-15T09:30:00Z"
  }
}
```

### video.asset.errored

```json
{
  "type": "video.asset.errored",
  "data": {
    "id": "asset_abc123",
    "status": "errored",
    "errors": {
      "type": "invalid_input",
      "messages": ["입력 파일을 디코딩할 수 없습니다."]
    }
  }
}
```

### video.upload.asset_created

업로드 완료 후 에셋 생성 시:

```json
{
  "type": "video.upload.asset_created",
  "data": {
    "upload_id": "upload_abc123",
    "asset_id": "asset_def456"
  }
}
```

### video.live_stream.active

방송 시작 시:

```json
{
  "type": "video.live_stream.active",
  "data": {
    "id": "live_abc123",
    "status": "active",
    "playback_ids": [
      { "id": "pback_live_xyz", "policy": "public" }
    ],
    "active_asset_id": "asset_recording_001"
  }
}
```

### video.live_stream.idle

방송 종료 시:

```json
{
  "type": "video.live_stream.idle",
  "data": {
    "id": "live_abc123",
    "status": "idle"
  }
}
```

### video.live_stream.recording.ready

녹화 VOD 생성 완료 시:

```json
{
  "type": "video.live_stream.recording.ready",
  "data": {
    "live_stream_id": "live_abc123",
    "asset_id": "asset_rec_001",
    "duration": 5025.3,
    "playback_ids": [
      { "id": "pback_rec_xyz", "policy": "public" }
    ]
  }
}
```

---

## 6. 재시도 정책

웹훅 수신 서버가 2xx 이외의 응답을 반환하거나 타임아웃이 발생하면:

| 재시도 횟수 | 대기 시간 |
|-----------|---------|
| 1차 | 즉시 |
| 2차 | 5분 후 |
| 3차 | 30분 후 |
| 4차 | 2시간 후 |
| 5차 | 24시간 후 |

5번 모두 실패 시 해당 전송은 `failed` 상태로 기록됩니다.  
콘솔에서 수동 재전송 가능.

**요구사항:**
- 웹훅 핸들러는 **30초 이내**에 응답해야 합니다.
- 긴 처리가 필요한 경우 즉시 `200 OK` 응답 후 백그라운드에서 처리하세요.

---

## 7. 중복 처리 (Idempotency)

동일 이벤트가 중복 전송될 수 있으므로, 이벤트 ID 기반 중복 처리를 구현하세요:

```javascript
const processedEvents = new Set(); // 실제로는 Redis 또는 DB 사용

app.post('/webhooks/videofly', async (req, res) => {
  const event = req.body;
  
  // 중복 이벤트 무시
  if (processedEvents.has(event.id)) {
    return res.json({ received: true, duplicate: true });
  }
  
  processedEvents.add(event.id);
  
  // 이벤트 처리
  await handleEvent(event);
  
  res.json({ received: true });
});
```

---

## 8. 로컬 개발 환경 테스트

로컬 서버를 공개 URL 없이 웹훅을 테스트하려면 터널링 도구를 사용하세요:

```bash
# ngrok 사용
ngrok http 3000

# 출력된 URL을 웹훅 엔드포인트로 등록
# 예: https://abc123.ngrok.io/webhooks/videofly

# 또는 VideoFly CLI
videofly webhooks forward --url http://localhost:3000/webhooks/videofly
```
