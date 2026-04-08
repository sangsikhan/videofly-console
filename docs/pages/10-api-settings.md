# 페이지: API 설정 (API Settings)

**Route:** `/settings/api`  
**접근 권한:** Admin 권한

---

## 1. 페이지 목적

VideoFly API 접근에 필요한 API 키를 관리하고,  
이벤트 기반 연동을 위한 웹훅 엔드포인트를 설정하는 페이지.

---

## 2. 레이아웃 구성

```
┌──────────────────────────────────────────────────────────┐
│  "API 설정"                                              │
│  [탭] ● API 키   ○ 웹훅   ○ 사용 로그                   │
├──────────────────────────────────────────────────────────┤
│  [탭 콘텐츠]                                             │
└──────────────────────────────────────────────────────────┘
```

---

## 3. 탭 1. API 키 관리

### API 키 목록

```
[+ 새 API 키 생성]

┌─────────────────────────────────────────────────────────┐
│ 이름: 프로덕션 서버 키          권한: Write              │
│ Key ID: vf_key_prod_abc123     생성일: 2024-01-15        │
│ 마지막 사용: 2024-03-15 14:32  Status: ● 활성           │
│                              [삭제]                      │
├─────────────────────────────────────────────────────────┤
│ 이름: CI/CD 읽기 전용          권한: Read               │
│ Key ID: vf_key_ci_def456       생성일: 2024-02-01        │
│ 마지막 사용: 2024-03-14 09:10  Status: ● 활성           │
│                              [삭제]                      │
└─────────────────────────────────────────────────────────┘
```

### 새 API 키 생성

```
[새 API 키 생성] 버튼 → 슬라이드 패널 또는 모달

이름 *: [___________________________]
권한 범위:
  ○ Read    — 목록 조회, 상세 조회만 가능
  ● Write   — Read + 생성, 수정, 삭제
  ○ Admin   — Write + 설정, 사용자, 청구 관리

[생성]
```

**생성 결과 (최초 1회만 표시):**

```
✅ API 키가 생성되었습니다.

Key ID:     vf_key_xxxx
Secret Key: vfs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

⚠️ Secret Key는 이 화면에서만 확인 가능합니다.
   반드시 안전한 곳에 저장하세요.

[복사]    [닫기]
```

### 권한 범위 설명

| 권한 | 가능한 작업 |
|------|-----------|
| Read | GET 요청 전체 (목록, 상세, 통계 조회) |
| Write | Read + 동영상 업로드/삭제, 라이브 생성/삭제, 자막/썸네일 관리 |
| Admin | Write + 플레이어 설정, API 키 관리, 웹훅 관리, 사용자 관리 |

### API 키 삭제

```
[삭제] 클릭 → 확인 모달:

"API 키를 삭제하시겠습니까?
이 키를 사용하는 서비스의 API 요청이 즉시 실패합니다."

[취소]  [삭제]
```

---

## 4. 탭 2. 웹훅 (Webhooks)

### 웹훅 목록

```
[+ 웹훅 추가]

┌─────────────────────────────────────────────────────────┐
│ URL: https://api.myapp.com/webhooks/videofly            │
│ 이벤트: video.asset.ready, video.live_stream.active (2개)│
│ 상태: ● 활성  마지막 전송: 2024-03-15 14:32 (성공 200) │
│ [상세] [수정] [테스트] [삭제]                           │
└─────────────────────────────────────────────────────────┘
```

### 웹훅 추가/수정

```
웹훅 URL *: [https://api.myapp.com/webhooks/videofly]

이벤트 선택:
  동영상
  ☑ video.asset.created     동영상 업로드 시작 시
  ☑ video.asset.ready       인코딩 완료 시
  ☑ video.asset.errored     인코딩 오류 시
  ☐ video.asset.deleted     동영상 삭제 시

  업로드
  ☑ video.upload.created    업로드 URL 생성 시
  ☑ video.upload.asset_created  에셋 생성 완료 시
  ☐ video.upload.cancelled  업로드 취소 시
  ☐ video.upload.errored    업로드 오류 시

  라이브 스트리밍
  ☑ video.live_stream.created       스트림 생성 시
  ☑ video.live_stream.active        방송 시작 시
  ☑ video.live_stream.disconnected  연결 끊김 시
  ☑ video.live_stream.idle          방송 종료 시
  ☑ video.live_stream.recording.ready  녹화 VOD 준비 완료 시

웹훅 Secret: (자동 생성, 서명 검증용)
  whs_xxxxxxxxxxxxxxxxxxxxxxxx  [재생성]

[저장]
```

### 웹훅 서명 검증 안내

```
웹훅 페이로드 서명 검증 방법:

VideoFly는 모든 웹훅 요청에 서명 헤더를 추가합니다:
  mux-signature: t=1710499200,v1=abc123...

Node.js 검증 예시:
┌─────────────────────────────────────────────────────────┐
│ const crypto = require('crypto');                       │
│                                                         │
│ function verifyWebhook(body, signature, secret) {       │
│   const [t, v1] = signature.split(',');                 │
│   const timestamp = t.split('=')[1];                    │
│   const expected = crypto                               │
│     .createHmac('sha256', secret)                       │
│     .update(`${timestamp}.${body}`)                     │
│     .digest('hex');                                     │
│   return `v1=${expected}` === v1.split('=')[1];         │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
[코드 복사]
```

### 웹훅 테스트

[테스트] 버튼 → 선택한 이벤트 더미 페이로드 전송:

```
테스트 이벤트 전송: video.asset.ready
URL: https://api.myapp.com/webhooks/videofly

결과:
  상태 코드: 200 OK
  응답 시간: 234ms
  응답 본문: {"received": true}

[재전송]
```

---

## 5. 탭 3. 사용 로그 (Usage Log)

```
최근 API 요청 (최근 100건)

┌──────────────────────────────────────────────────────┐
│ 시간             메서드  경로              상태코드   │
│ 2024-03-15 14:32 POST    /v1/videos/upload-url 201  │
│ 2024-03-15 14:31 GET     /v1/videos         200     │
│ 2024-03-15 14:30 DELETE  /v1/videos/abc123  204     │
│ ...                                                  │
└──────────────────────────────────────────────────────┘

오류 요청만 보기 □   Key ID 필터: [전체 ▼]
```

---

## 6. API 빠른 참조

```
Base URL: https://api.videofly.co.kr/v1

인증:
  Authorization: Basic {base64(key_id:secret_key)}
  또는
  Authorization: Bearer {jwt_token}

예시:
  curl -u vf_key_xxxx:vfs_yyyy \
    https://api.videofly.co.kr/v1/videos
```

[API 전체 문서 보기 →] 링크
