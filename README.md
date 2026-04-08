# VideoFly SaaS Console

> Mux 기반 동영상 SaaS 플랫폼 — VideoFly Console 개발 문서

## 프로젝트 개요

VideoFly SaaS는 [Mux](https://www.mux.com) 인프라를 기반으로 구축된 동영상 호스팅·스트리밍 플랫폼입니다.  
기업 및 개발자에게 동영상 업로드, 인코딩, 재생, 라이브 스트리밍, 분석 기능을 API 및 웹 콘솔 형태로 제공합니다.

---

## 문서 구조

```
docs/
├── requirements/          # 서비스 요구사항
│   ├── 01-overview.md          서비스 개요 및 목표
│   ├── 02-functional.md        기능 요구사항
│   └── 03-non-functional.md    비기능 요구사항
│
├── pages/                 # 페이지별 기획/설계
│   ├── 01-dashboard.md         대시보드
│   ├── 02-video-upload.md      동영상 업로드
│   ├── 03-video-list.md        동영상 목록
│   ├── 04-video-detail.md      동영상 상세 및 편집
│   ├── 05-live-list.md         라이브 목록
│   ├── 06-live-create.md       라이브 생성
│   ├── 07-live-studio.md       라이브 스튜디오
│   ├── 08-analytics.md         분석 / 통계
│   ├── 09-player-settings.md   플레이어 설정
│   ├── 10-api-settings.md      API 설정
│   └── 11-billing.md           요금제 및 청구
│
└── api/                   # API 레퍼런스
    ├── 01-authentication.md    인증
    ├── 02-videos-api.md        동영상 API
    ├── 03-live-streams-api.md  라이브 스트림 API
    ├── 04-player-api.md        플레이어 API
    ├── 05-analytics-api.md     분석 API
    └── 06-webhooks.md          웹훅
```

---

## 핵심 기술 스택

| 레이어 | 기술 |
|--------|------|
| 동영상 인프라 | [Mux Video](https://www.mux.com/video-streaming-api) |
| 라이브 스트리밍 | [Mux Live](https://www.mux.com/live) |
| 분석 | [Mux Data](https://www.mux.com/data) |
| 플레이어 | [Mux Player](https://www.mux.com/player) |
| 인코딩 | Mux per-title AI 인코딩 (H.264 / HEVC / AV1) |
| 전송 | HLS Adaptive Bitrate (ABR), CDN 글로벌 배포 |
| 보안 | Signed JWT Playback URL, DRM |
| 웹훅 | Mux Webhook → VideoFly 이벤트 처리 |

---

## 주요 기능 요약

- **동영상 관리** — 업로드(Direct Upload / URL 수집), 인코딩, 자막, 썸네일, 클립 생성
- **라이브 스트리밍** — RTMP/SRT 수신, 동시 멀티 송출(Simulcast), 자동 VOD 전환
- **플레이어** — 반응형 임베드, 브랜딩 커스터마이즈, 서명된 URL 재생
- **분석** — 재생 품질(QoE), 시청자 행동, 실시간 모니터링, 데이터 내보내기
- **보안** — 서명된 재생 URL, 도메인 허용 목록, DRM
- **API / 웹훅** — RESTful API, 이벤트 기반 웹훅, 다중 SDK 지원

---

## 관련 참고

- [Mux 공식 문서](https://docs.mux.com)
- [VideoFly 서비스 설정 참조](https://doc.m2live.co.kr/references/settings/functions/services/videofly.html)
- [Mux API 레퍼런스](https://docs.mux.com/api-reference/video)
