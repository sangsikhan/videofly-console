# VideoFly SaaS — 전체 사이트 구조 및 사용자 여정

## 1. 사이트 도메인 구분

| 도메인 | 역할 |
|--------|------|
| `videofly.co.kr` | 마케팅 사이트 (랜딩, 기능, 요금제) |
| `console.videofly.co.kr` | 서비스 콘솔 (가입 후 사용) |
| `docs.videofly.co.kr` | 공개 기술 문서 |
| `api.videofly.co.kr` | REST API |
| `stream.mux.com` | 동영상 재생 (Mux CDN) |

---

## 2. 전체 페이지 구조

```
[비로그인 공개 영역]
videofly.co.kr/
├── /                           랜딩 페이지 (메인)
├── /features                   기능 소개
├── /pricing                    요금제
├── /use-cases                  사용 사례 (기업, 개발자, 교육 등)
│
├── /signup                     회원가입
├── /login                      로그인
├── /forgot-password            비밀번호 찾기
└── /reset-password             비밀번호 재설정

docs.videofly.co.kr/
├── /                           문서 홈
├── /quickstart                 5분 빠른 시작
├── /guides/
│   ├── /video-upload           동영상 업로드 가이드
│   ├── /live-streaming         라이브 스트리밍 가이드
│   ├── /player-embed           플레이어 임베드 가이드
│   ├── /signed-playback        보안 재생 가이드
│   └── /webhooks               웹훅 연동 가이드
└── /api/
    ├── /videos                 동영상 API 레퍼런스
    ├── /live-streams           라이브 스트림 API 레퍼런스
    ├── /player                 플레이어 API 레퍼런스
    ├── /analytics              분석 API 레퍼런스
    └── /webhooks               웹훅 레퍼런스

[로그인 후 콘솔 영역]
console.videofly.co.kr/
├── /onboarding                 최초 로그인 온보딩 (신규 계정)
├── /dashboard                  대시보드
├── /videos                     동영상 목록
│   ├── /videos/upload          업로드
│   └── /videos/:id             상세
├── /live                       라이브 목록
│   ├── /live/new               새 라이브 생성
│   └── /live/:id/studio        라이브 스튜디오
├── /analytics                  분석
└── /settings/
    ├── /settings/player        플레이어 설정
    ├── /settings/api           API 설정
    └── /settings/account       계정 설정
```

---

## 3. 사용자 여정 (User Journey)

### 3.1 신규 방문자 → 가입 → 첫 사용

```
[마케팅 유입]
Google 검색 / SNS / 블로그
        │
        ▼
[랜딩 페이지 /]
히어로 섹션 → 핵심 기능 → 데모 영상 → 요금제 요약 → CTA
        │
        ├── 더 알아보기 → /features
        ├── 요금제 확인 → /pricing
        ├── 문서 보기  → docs.videofly.co.kr
        └── 무료 시작  → /signup
                │
                ▼
        [회원가입 /signup]
        이메일+비밀번호 또는 Google OAuth
                │
                ▼
        [이메일 인증]
        인증 링크 클릭
                │
                ▼
        [온보딩 /onboarding]
        서비스 용도 선택 → 사용 규모 입력 → 첫 단계 안내
                │
                ▼
        [대시보드 /dashboard]
        빠른 시작 가이드 표시
```

### 3.2 재방문 사용자 → 로그인

```
[랜딩 / 북마크]
        │
        ▼
[로그인 /login]
        │
        ├── 성공 → 마지막 방문 페이지 또는 /dashboard
        ├── 비밀번호 분실 → /forgot-password
        └── 미가입 → /signup 유도
```

### 3.3 개발자 → 문서 → 가입

```
[구글 검색: "동영상 API 한국어"]
        │
        ▼
[docs.videofly.co.kr/quickstart]
        │
        ▼
[API 키 필요] → "무료 계정 만들기" CTA
        │
        ▼
[/signup] → [온보딩] → [API 설정 /settings/api]
```

---

## 4. Free 플랜 전환 구조

```
[랜딩 / 요금제 페이지]
        │
   "무료로 시작" CTA 클릭
        │
        ▼
[/signup]
  Free 플랜 자동 적용 (카드 등록 불필요)
        │
        ▼
[Free 플랜 한도]
  - 재생 시간: 500분/월
  - 저장 용량: 5GB
  - 라이브: 불가
  - 신용카드 없이 즉시 사용 가능
        │
   한도 초과 또는 추가 기능 필요
        │
        ▼
[업그레이드 모달 / /billing]
  Starter · Pro · Enterprise 비교
```

---

## 5. 페이지 파일 목록 (전체)

### 공개 페이지 (`docs/pages/public/`)

| 파일 | Route | 상태 |
|------|-------|------|
| `01-landing.md` | `/` | 신규 |
| `02-features.md` | `/features` | 신규 |
| `03-pricing.md` | `/pricing` | 신규 |

### 인증 페이지 (`docs/pages/auth/`)

| 파일 | Route | 상태 |
|------|-------|------|
| `01-signup.md` | `/signup` | 신규 |
| `02-login.md` | `/login` | 신규 |
| `03-password-reset.md` | `/forgot-password`, `/reset-password` | 신규 |
| `04-onboarding.md` | `/onboarding` | 신규 |

### 공개 문서 (`docs/pages/docs-site/`)

| 파일 | Route | 상태 |
|------|-------|------|
| `01-docs-home.md` | `docs./` | 신규 |
| `02-quickstart.md` | `docs./quickstart` | 신규 |

### 콘솔 페이지 (`docs/pages/`) — 기존

| 파일 | Route | 상태 |
|------|-------|------|
| `01-dashboard.md` ~ `11-billing.md` | `/dashboard` 외 | 기존 ✅ |
