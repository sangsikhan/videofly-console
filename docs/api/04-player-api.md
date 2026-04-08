# API 레퍼런스: 플레이어 (Player API)

---

## 1. 개요

VideoFly 플레이어는 [Mux Player](https://www.mux.com/player) 기반으로 제공됩니다.  
Web Component, React, Vue, iOS, Android SDK를 지원합니다.

---

## 2. 재생 URL 유형

### 공개 재생 (Public)

```
HLS:  https://stream.mux.com/{PLAYBACK_ID}.m3u8
DASH: https://stream.mux.com/{PLAYBACK_ID}.mpd
```

### 서명된 재생 (Signed)

재생 정책이 `signed`인 경우 JWT 토큰 필요:

```
https://stream.mux.com/{PLAYBACK_ID}.m3u8?token={JWT_TOKEN}
```

JWT 생성 방법은 [인증 문서](./01-authentication.md#5-signed-playback-url) 참조.

---

## 3. Mux Player (Web Component)

### 설치

```bash
npm install @mux/mux-player
```

### 기본 사용

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@mux/mux-player@2/dist/mux-player.mjs"></script>
</head>
<body>
  <mux-player
    playback-id="xyz789"
    metadata-video-title="제품 데모"
    metadata-viewer-user-id="user_123">
  </mux-player>
</body>
</html>
```

### 속성 (Attributes)

| 속성 | 타입 | 설명 |
|------|------|------|
| `playback-id` | string | 재생 ID (필수) |
| `stream-type` | string | `on-demand` (기본), `live`, `ll-live` |
| `autoplay` | boolean | 자동재생 |
| `muted` | boolean | 음소거 |
| `loop` | boolean | 반복 재생 |
| `preload` | string | `none`, `metadata`, `auto` |
| `poster` | string | 포스터 이미지 URL |
| `playback-token` | string | Signed URL JWT 토큰 |
| `thumbnail-token` | string | 서명된 썸네일 토큰 |
| `primary-color` | string | 플레이어 기본 색상 (HEX) |
| `secondary-color` | string | 보조 색상 |
| `metadata-video-title` | string | 분석용 동영상 제목 |
| `metadata-viewer-user-id` | string | 분석용 시청자 ID |
| `default-subtitles-lang` | string | 기본 자막 언어 코드 |

### 이벤트

```javascript
const player = document.querySelector('mux-player');

player.addEventListener('play', () => console.log('재생 시작'));
player.addEventListener('pause', () => console.log('일시정지'));
player.addEventListener('ended', () => console.log('재생 완료'));
player.addEventListener('error', (e) => console.error('오류:', e.detail));
player.addEventListener('timeupdate', () => {
  console.log('현재 시간:', player.currentTime);
});
```

### 메서드

```javascript
player.play();           // 재생
player.pause();          // 일시정지
player.currentTime = 30; // 30초로 이동
player.volume = 0.5;     // 볼륨 50%
player.muted = true;     // 음소거
```

---

## 4. React 컴포넌트

### 설치

```bash
npm install @mux/mux-player-react
```

### 기본 사용

```jsx
import MuxPlayer from '@mux/mux-player-react';

export function VideoPlayer({ playbackId, title }) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      metadata={{
        video_title: title,
        viewer_user_id: 'user_123',
      }}
      primaryColor="#0066FF"
      autoPlay={false}
      muted={false}
    />
  );
}
```

### 서명된 재생

```jsx
import MuxPlayer from '@mux/mux-player-react';

export function SignedVideoPlayer({ playbackId, token }) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      playbackToken={token}  // 서버에서 발급한 JWT
    />
  );
}
```

### 라이브 스트림

```jsx
<MuxPlayer
  playbackId="live_playback_id"
  streamType="live"          // 또는 "ll-live" (저지연)
  metadata={{ video_title: '제품 런칭 라이브' }}
/>
```

---

## 5. Vue 컴포넌트

```bash
npm install @mux/mux-player
```

```vue
<template>
  <mux-player
    :playback-id="playbackId"
    :metadata-video-title="title"
    primary-color="#0066FF"
  />
</template>

<script setup>
import '@mux/mux-player';

defineProps({
  playbackId: String,
  title: String,
});
</script>
```

---

## 6. iframe 임베드

서버 측 처리 없이 iframe으로 임베드:

```html
<iframe
  src="https://player.videofly.co.kr/{VIDEO_ID}?autoplay=0&muted=0"
  width="640"
  height="360"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>
```

### iframe URL 파라미터

| 파라미터 | 기본값 | 설명 |
|---------|--------|------|
| `autoplay` | `0` | `1`로 설정 시 자동재생 |
| `muted` | `0` | `1`로 설정 시 음소거 |
| `loop` | `0` | `1`로 설정 시 반복 재생 |
| `color` | 설정값 | 플레이어 색상 (HEX, `#` 제외) |
| `t` | `0` | 시작 시간 (초) |
| `cc_lang` | - | 기본 자막 언어 코드 |
| `token` | - | 서명된 재생 JWT 토큰 |

---

## 7. iOS (Swift)

```swift
import AVFoundation
import AVKit

let playbackId = "xyz789"
let urlString = "https://stream.mux.com/\(playbackId).m3u8"
let url = URL(string: urlString)!
let player = AVPlayer(url: url)
let playerController = AVPlayerViewController()
playerController.player = player

present(playerController, animated: true) {
    player.play()
}
```

---

## 8. Android (Kotlin)

```kotlin
// build.gradle
implementation 'com.google.android.exoplayer:exoplayer:2.19.0'

// Activity
val dataSourceFactory = DefaultDataSource.Factory(context)
val mediaSource = HlsMediaSource.Factory(dataSourceFactory)
    .createMediaSource(
        MediaItem.fromUri("https://stream.mux.com/{PLAYBACK_ID}.m3u8")
    )

val player = ExoPlayer.Builder(context).build()
playerView.player = player
player.setMediaSource(mediaSource)
player.prepare()
player.play()
```

---

## 9. 플레이어 설정 API

플레이어 기본값을 계정 단위로 설정:

```
GET    /api/v1/settings/player      — 플레이어 설정 조회
PUT    /api/v1/settings/player      — 플레이어 설정 저장
POST   /api/v1/signing-keys         — Signing Key 생성
GET    /api/v1/signing-keys         — Signing Key 목록
DELETE /api/v1/signing-keys/:id     — Signing Key 삭제
```

### PUT /api/v1/settings/player

```json
{
  "primary_color": "#0066FF",
  "logo_url": "https://cdn.example.com/logo.png",
  "logo_position": "top-left",
  "logo_link_url": "https://example.com",
  "autoplay": false,
  "muted_on_autoplay": true,
  "loop": false,
  "show_controls": true,
  "playback_rate_controls": true,
  "default_subtitle_language": "ko",
  "domain_allowlist": ["example.com", "*.mysite.co.kr"]
}
```
