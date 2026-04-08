# 가이드: 5분 빠른 시작 (Quickstart)

**Route:** `docs.videofly.co.kr/quickstart`  
**대상:** 처음 VideoFly를 사용하는 개발자

---

## 목표

이 가이드를 완료하면:
- ✅ API 키를 발급받고
- ✅ 동영상을 업로드하고
- ✅ HLS URL로 재생하는 것을 확인합니다

**소요 시간:** 약 5분

---

## 사전 준비

1. [VideoFly 계정 만들기 →](https://videofly.co.kr/signup) (무료, 카드 불필요)
2. 터미널 또는 API 클라이언트 (curl, Postman 등)

---

## Step 1: API 키 발급

[콘솔 → 설정 → API 설정](https://console.videofly.co.kr/settings/api)에서 API 키를 발급합니다.

```
Key ID:     vf_key_xxxxxxxx
Secret Key: vfs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ Secret Key는 최초 1회만 표시됩니다. 반드시 저장해두세요.

환경 변수로 설정:

```bash
export VF_KEY_ID="vf_key_xxxxxxxx"
export VF_SECRET_KEY="vfs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Step 2: 동영상 업로드 URL 발급

```bash
curl -X POST https://api.videofly.co.kr/v1/videos/upload-url \
  -u "$VF_KEY_ID:$VF_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "나의 첫 번째 동영상",
    "playback_policy": "public"
  }'
```

**응답:**

```json
{
  "upload_id": "upload_abc123",
  "upload_url": "https://storage.googleapis.com/...",
  "timeout": 3600
}
```

---

## Step 3: 동영상 파일 업로드

발급받은 `upload_url`로 파일을 직접 업로드합니다:

```bash
curl -X PUT "{upload_url}" \
  -H "Content-Type: video/mp4" \
  --data-binary "@/path/to/your-video.mp4"
```

> 💡 파일 경로를 `/path/to/your-video.mp4`에 맞게 변경하세요.

---

## Step 4: 인코딩 완료 확인

업로드 후 Mux가 자동으로 인코딩을 시작합니다.  
완료까지 보통 1~5분 소요 (파일 크기에 따라 다름).

### 방법 A: 폴링으로 확인

```bash
# upload_id로 asset_id 조회
curl https://api.videofly.co.kr/v1/videos \
  -u "$VF_KEY_ID:$VF_SECRET_KEY"
```

`status`가 `ready`가 되면 재생 가능:

```json
{
  "data": [
    {
      "id": "asset_def456",
      "title": "나의 첫 번째 동영상",
      "status": "ready",
      "playback_ids": [
        { "id": "pback_xyz789", "policy": "public" }
      ]
    }
  ]
}
```

### 방법 B: 웹훅으로 수신 (권장)

```javascript
// Express.js 예시
app.post('/webhooks/videofly', (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'video.asset.ready') {
    const playbackId = data.playback_ids[0].id;
    console.log('재생 준비 완료! Playback ID:', playbackId);
    // DB에 playback_id 저장
  }
  
  res.json({ received: true });
});
```

웹훅 설정: [콘솔 → 설정 → API → 웹훅](https://console.videofly.co.kr/settings/api#webhooks)

---

## Step 5: 동영상 재생

`playback_id`를 사용해 재생합니다.

### HLS URL

```
https://stream.mux.com/{PLAYBACK_ID}.m3u8
```

### 브라우저에서 즉시 재생 (Mux Player)

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module"
    src="https://cdn.jsdelivr.net/npm/@mux/mux-player@2/dist/mux-player.mjs">
  </script>
</head>
<body>
  <mux-player
    playback-id="pback_xyz789"
    metadata-video-title="나의 첫 번째 동영상">
  </mux-player>
</body>
</html>
```

### React

```bash
npm install @mux/mux-player-react
```

```jsx
import MuxPlayer from '@mux/mux-player-react';

function App() {
  return (
    <MuxPlayer
      playbackId="pback_xyz789"
      metadata={{ video_title: '나의 첫 번째 동영상' }}
    />
  );
}
```

---

## 🎉 완료!

첫 번째 동영상을 성공적으로 업로드하고 재생했습니다.

---

## 다음 단계

| 주제 | 가이드 |
|------|--------|
| 클라이언트에서 직접 업로드 | [Direct Upload 구현하기 →]() |
| 접근 제어 설정 | [Signed URL 보안 재생 →]() |
| 라이브 방송 시작 | [라이브 스트리밍 가이드 →]() |
| 웹훅으로 이벤트 처리 | [웹훅 연동 가이드 →]() |
| 플레이어 커스터마이즈 | [플레이어 임베드 가이드 →]() |

---

## SDK로 더 편리하게

curl 대신 SDK를 사용하면 더 간결하게 구현할 수 있습니다:

### Node.js

```bash
npm install @videofly/sdk
```

```javascript
import VideoFly from '@videofly/sdk';

const vf = new VideoFly({
  keyId: process.env.VF_KEY_ID,
  secretKey: process.env.VF_SECRET_KEY,
});

// 업로드 URL 발급
const { uploadUrl, uploadId } = await vf.videos.createUploadUrl({
  title: '나의 첫 번째 동영상',
  playbackPolicy: 'public',
});

// 인코딩 완료 대기
const asset = await vf.videos.waitForReady(uploadId);
console.log('재생 URL:', `https://stream.mux.com/${asset.playbackIds[0].id}.m3u8`);
```

### Python

```bash
pip install videofly
```

```python
import videofly

vf = videofly.VideoFly(
    key_id=os.environ["VF_KEY_ID"],
    secret_key=os.environ["VF_SECRET_KEY"],
)

upload = vf.videos.create_upload_url(
    title="나의 첫 번째 동영상",
    playback_policy="public",
)
print(f"업로드 URL: {upload.upload_url}")
```

---

## 문제가 생겼나요?

- [자주 묻는 질문 →]()
- [커뮤니티 포럼 →]()
- [이메일 문의: support@videofly.co.kr](mailto:support@videofly.co.kr)

---

*이 페이지가 도움이 됐나요?*  
👍 도움됨    👎 개선 필요

[문서 피드백 보내기 →]()
