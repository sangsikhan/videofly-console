# VideoFly SaaS — 전체 사이트 구조 및 사용자 여정

---

## 1. 도메인 구분

| 도메인 | 역할 |
|--------|------|
| `videofly.co.kr` | 마케팅 사이트 (랜딩, 기능, 요금제) |
| `console.videofly.co.kr` | 서비스 콘솔 (가입 후 사용) |
| `docs.videofly.co.kr` | 공개 기술 문서 |
| `api.videofly.co.kr` | REST API |
| `stream.videofly.co.kr` | HLS/DASH 동영상 스트리밍 (OCI CDN 경유) |
| `thumb.videofly.co.kr` | 썸네일 이미지 (OCI CDN 경유) |

---

## 2. 전체 페이지 구조

```
[비로그인 공개 영역]
videofly.co.kr/
├── /                           랜딩 페이지
├── /features                   기능 소개
├── /pricing                    요금제
├── /signup                     회원가입 (Free 카드 불필요)
├── /login                      로그인
├── /forgot-password            비밀번호 찾기
└── /reset-password             비밀번호 재설정

docs.videofly.co.kr/
├── /                           문서 홈
├── /quickstart                 5분 빠른 시작
├── /guides/*                   가이드 모음
└── /api/*                      API 레퍼런스

[로그인 후 콘솔]
console.videofly.co.kr/
├── /onboarding                 온보딩 (5단계)
│   ├── 조직 생성
│   ├── 플랜 선택 (Free/Pro)
│   ├── 용도 선택
│   ├── 첫 동영상 업로드
│   └── 재생 확인 (Aha Moment)
│
├── /dashboard                  대시보드 (조직 컨텍스트)
│
├── /videos                     동영상 목록
│   ├── /videos/upload          업로드 (OCI Direct Upload)
│   └── /videos/:vid_id         상세 (프로파일 에셋 현황 포함)
│
├── /live                       라이브 목록
│   ├── /live/new               새 라이브 생성
│   └── /live/:liv_id/studio    라이브 스튜디오
│
├── /analytics                  분석 (Flink + ClickHouse 기반)
│
└── /settings/
    ├── /settings/player        플레이어 설정
    ├── /settings/api           API 키 + 웹훅
    ├── /settings/organization  조직 기본 정보
    ├── /settings/members       사용자 관리 + 초대
    ├── /settings/roles         역할/권한 관리 (RBAC)
    └── /settings/billing       요금제 + 청구
```

---

## 3. 사용자 여정

### 3.1 신규 방문자 → 가입 → 첫 사용

```
[마케팅 유입 / 검색]
        │
        ▼
[랜딩 페이지]
 히어로 → 기능 → 데모 플레이어 → 요금제 → CTA
        │
        ▼
[회원가입 /signup]
 이메일 or Google OAuth  ·  카드 불필요(Free)
        │
        ▼
[이메일 인증]
        │
        ▼
[온보딩 /onboarding]
 1. 조직 생성 (org_id 발급)
 2. Free / Pro 체험 선택
 3. 용도 선택
 4. 첫 동영상 업로드 → OCI 저장 → JIT Warm-up
 5. 재생 확인 (vid_id + 임베드 코드 제공)
        │
        ▼
[대시보드 /dashboard]
```

### 3.2 개발자 → 문서 → 가입

```
[검색: "동영상 API 한국어"]
        │
        ▼
[docs.videofly.co.kr/quickstart]
        │ API 키 필요
        ▼
[회원가입 /signup]
        │
        ▼
[온보딩] → [API 키 발급 /settings/api]
```

### 3.3 Free → Paid 전환

```
[한도 90% 도달]
        │
        ▼
[인앱 업그레이드 배너]
        │
        ▼
[/settings/billing → 플랜 변경]
 카드 등록 → 플랜 선택 → 즉시 적용
```

### 3.4 팀 협업 시작 (멀티 유저)

```
[Admin]
  /settings/members → [멤버 초대]
  이메일 입력 + 역할 선택 (Admin/Manager/Developer/Viewer)
        │
        ▼
[초대 이메일 발송]
        │
        ▼
[피초대자: 수락]
  기존 계정 → 조직 합류
  신규 계정 → 가입 → 간소화 온보딩 → 조직 합류
```

---

## 4. 조직 모델

```
사용자 계정 (usr_id)
    │ 복수 조직 소속 가능
    ▼
┌───────────────────────┐  ┌───────────────────────┐
│  조직 A (org_id_AAA)  │  │  조직 B (org_id_BBB)  │
│  역할: Admin          │  │  역할: Developer       │
│                       │  │                       │
│  동영상 (vid_*)       │  │  동영상 (vid_*)        │
│  라이브 (liv_*)       │  │  라이브 (liv_*)        │
│  API 키               │  │  API 키                │
└───────────────────────┘  └───────────────────────┘
        ↑ 조직 간 리소스 완전 격리
```

---

## 5. 문서 파일 목록 (전체)

### 아키텍처 (`docs/architecture/`)

| 파일 | 내용 |
|------|------|
| `01-video-farm-oci.md` | OCI 동영상 팜 Data Plane 구조 |
| `02-jit-pipeline.md` | JIT 트랜스코딩 + 패키징 파이프라인 |
| `03-id-system.md` | ULID 기반 ID 체계 및 DB 스키마 |

### 요구사항 (`docs/requirements/`)

| 파일 | 내용 |
|------|------|
| `01-overview.md` | 서비스 개요, 기술 스택, KPI |
| `02-functional.md` | 기능 요구사항 (JIT, 조직, RBAC, 전환) |
| `03-non-functional.md` | 성능, 가용성, 보안 |
| `04-public-landing-auth.md` | 공개 영역 요구사항 |

### 공개 페이지 (`docs/pages/public/`)

| 파일 | Route |
|------|-------|
| `01-landing.md` | `/` |
| `02-pricing.md` | `/pricing` |
| `03-features.md` | `/features` |

### 인증 플로우 (`docs/pages/auth/`)

| 파일 | Route |
|------|-------|
| `01-signup.md` | `/signup` |
| `02-login.md` | `/login` |
| `03-password-reset.md` | `/forgot-password` |
| `04-onboarding.md` | `/onboarding` (5단계, 조직 생성 포함) |

### 공개 문서 사이트 (`docs/pages/docs-site/`)

| 파일 | Route |
|------|-------|
| `01-docs-home.md` | `docs./` |
| `02-quickstart.md` | `docs./quickstart` |

### 콘솔 페이지 (`docs/pages/` + `docs/pages/console/`)

| 파일 | Route |
|------|-------|
| `01-dashboard.md` | `/dashboard` (조직 컨텍스트) |
| `02-video-upload.md` | `/videos/upload` (OCI JIT 흐름) |
| `03-video-list.md` | `/videos` |
| `04-video-detail.md` | `/videos/:vid_id` (프로파일 에셋) |
| `05-live-list.md` | `/live` |
| `06-live-create.md` | `/live/new` |
| `07-live-studio.md` | `/live/:id/studio` |
| `08-analytics.md` | `/analytics` |
| `09-player-settings.md` | `/settings/player` |
| `10-api-settings.md` | `/settings/api` |
| `11-billing.md` | `/settings/billing` |
| `console/12-org-management.md` | `/settings/organization` |
| `console/13-user-management.md` | `/settings/members` |
| `console/14-role-management.md` | `/settings/roles` |

### API 레퍼런스 (`docs/api/`)

| 파일 | 내용 |
|------|------|
| `01-authentication.md` | 인증 (Basic Auth, JWT, Signed URL) |
| `02-videos-api.md` | 동영상 API |
| `03-live-streams-api.md` | 라이브 스트림 API |
| `04-player-api.md` | 플레이어 SDK |
| `05-analytics-api.md` | 분석 API |
| `06-webhooks.md` | 웹훅 |
| `07-organizations-api.md` | 조직/사용자/RBAC API |
