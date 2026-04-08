# API 인증 (Authentication)

**Base URL:** `https://api.videofly.co.kr/v1`

---

## 1. 개요

VideoFly API는 두 가지 인증 방식을 지원합니다:

| 방식 | 사용 상황 |
|------|----------|
| HTTP Basic Auth | 서버 간 통신, API 직접 호출 |
| Bearer JWT | 웹 콘솔, 클라이언트 세션 |

---

## 2. API 키 발급

[콘솔 → 설정 → API 설정](https://console.videofly.co.kr/settings/api)에서 API 키를 발급합니다.

- **Key ID**: `vf_key_prod_abc123`
- **Secret Key**: `vfs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (최초 1회만 표시)

> Secret Key는 발급 시 반드시 안전한 곳에 저장하세요. 분실 시 재발급 필요.

---

## 3. HTTP Basic Auth

### 형식

```
Authorization: Basic {base64(KEY_ID:SECRET_KEY)}
```

### 예시

```bash
# Key ID: vf_key_abc  /  Secret: vfs_xyz
echo -n "vf_key_abc:vfs_xyz" | base64
# → dmZfa2V5X2FiYzp2ZnNfeHl6

curl -X GET https://api.videofly.co.kr/v1/videos \
  -H "Authorization: Basic dmZfa2V5X2FiYzp2ZnNfeHl6"
```

### SDK 사용

```javascript
// Node.js
const videofly = new VideoFly({
  keyId: process.env.VF_KEY_ID,
  secretKey: process.env.VF_SECRET_KEY,
});

const videos = await videofly.videos.list();
```

```python
# Python
import videofly

client = videofly.VideoFly(
    key_id=os.environ["VF_KEY_ID"],
    secret_key=os.environ["VF_SECRET_KEY"],
)

videos = client.videos.list()
```

---

## 4. Bearer JWT (세션 토큰)

콘솔 로그인 후 발급되는 세션 JWT. API 직접 호출 시는 API 키 사용을 권장합니다.

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**JWT Payload:**
```json
{
  "sub": "user_123",
  "org_id": "org_abc",
  "role": "admin",
  "iat": 1710499200,
  "exp": 1710585600
}
```

---

## 5. Signed Playback URL

동영상 재생 정책이 `signed`인 경우, 재생 URL에 JWT 서명 토큰을 추가해야 합니다.

### Signing Key 발급

콘솔에서 RSA 서명 키 쌍 발급:

```
Key ID: sign_key_abc123
Private Key: -----BEGIN RSA PRIVATE KEY----- ...
```

### 토큰 생성 (Node.js)

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('signing-key.pem');

const token = jwt.sign(
  {
    sub: 'xyz789',          // Playback ID
    aud: 'v',               // 'v'(video), 't'(thumbnail), 's'(storyboard)
    exp: Math.floor(Date.now() / 1000) + 3600,  // 1시간 후 만료
    kid: 'sign_key_abc123', // Key ID
  },
  privateKey,
  { algorithm: 'RS256' }
);

// 재생 URL
const playbackUrl = `https://stream.mux.com/xyz789.m3u8?token=${token}`;
```

### 토큰 생성 (Python)

```python
import jwt
import time

with open("signing-key.pem", "rb") as f:
    private_key = f.read()

token = jwt.encode(
    {
        "sub": "xyz789",
        "aud": "v",
        "exp": int(time.time()) + 3600,
        "kid": "sign_key_abc123",
    },
    private_key,
    algorithm="RS256",
)

playback_url = f"https://stream.mux.com/xyz789.m3u8?token={token}"
```

---

## 6. 오류 응답

| HTTP 상태 | 코드 | 설명 |
|----------|------|------|
| 401 | `unauthorized` | API 키 없음 또는 잘못됨 |
| 403 | `forbidden` | 권한 부족 (Read 키로 삭제 시도 등) |
| 429 | `rate_limited` | 요청 속도 제한 초과 |

```json
{
  "error": {
    "code": "unauthorized",
    "message": "API 키가 유효하지 않습니다.",
    "request_id": "req_abc123"
  }
}
```

---

## 7. 요청 속도 제한 (Rate Limiting)

| 플랜 | 분당 요청 수 |
|------|------------|
| Free | 60 req/min |
| Starter | 300 req/min |
| Pro | 1,000 req/min |
| Enterprise | 무제한 |

초과 시 응답 헤더:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1710499260
Retry-After: 60
```

---

## 8. 보안 권장사항

- API 키를 소스 코드에 하드코딩하지 마세요. 환경 변수(`process.env`) 사용.
- Secret Key를 클라이언트(브라우저, 모바일 앱)에 노출하지 마세요.
- 서명 전용 키(Signing Key Private Key)는 서버에만 보관하세요.
- 키 유출 시 즉시 삭제하고 재발급하세요.
- 목적별로 별도 API 키를 발급하고, 최소 권한 원칙을 적용하세요.
