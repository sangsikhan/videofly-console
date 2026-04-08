# API 레퍼런스: 조직 및 사용자 (Organizations & Users API)

**Base URL:** `https://api.videofly.co.kr/v1`

---

## 엔드포인트 목록

### 조직 (Organizations)

| 메서드 | 경로 | 설명 | 권한 |
|--------|------|------|------|
| GET | `/orgs` | 내 소속 조직 목록 | 로그인 |
| POST | `/orgs` | 조직 생성 | 로그인 |
| GET | `/orgs/:org_id` | 조직 상세 조회 | Member |
| PATCH | `/orgs/:org_id` | 조직 정보 수정 | Admin |
| DELETE | `/orgs/:org_id` | 조직 삭제 | Admin |

### 조직 멤버 (Members)

| 메서드 | 경로 | 설명 | 권한 |
|--------|------|------|------|
| GET | `/orgs/:org_id/members` | 멤버 목록 | Manager+ |
| POST | `/orgs/:org_id/members/invite` | 멤버 초대 | Admin |
| PATCH | `/orgs/:org_id/members/:user_id` | 역할 변경 | Admin |
| DELETE | `/orgs/:org_id/members/:user_id` | 멤버 제거 | Admin |
| GET | `/orgs/:org_id/invitations` | 초대 목록 | Admin |
| DELETE | `/orgs/:org_id/invitations/:inv_id` | 초대 취소 | Admin |
| POST | `/orgs/:org_id/invitations/:inv_id/resend` | 초대 재발송 | Admin |

### 내 계정 (Me)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/me` | 내 프로필 조회 |
| PATCH | `/me` | 내 프로필 수정 |
| GET | `/me/invitations` | 받은 초대 목록 |
| POST | `/me/invitations/:inv_id/accept` | 초대 수락 |
| POST | `/me/invitations/:inv_id/reject` | 초대 거절 |

---

## 공통 헤더: 조직 컨텍스트

조직 리소스(동영상, 라이브 등)에 접근하는 모든 요청에 조직 ID 필요:

```
X-Org-ID: org_01HXYZ123ABC
```

또는 URL 경로에 포함:

```
GET /api/v1/orgs/org_01HXYZ123ABC/videos
```

---

## POST /orgs — 조직 생성

### Request Body

```json
{
  "name": "(주)에이비씨",
  "slug": "abc-company",
  "plan": "free"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | string | 필수 | 조직명 (최대 100자) |
| `slug` | string | 필수 | URL용 식별자 (영문·숫자·하이픈, 고유) |
| `plan` | string | 선택 | `free` (기본), `starter`, `pro` |

### 응답

```json
HTTP/1.1 201 Created

{
  "id": "org_01HXYZ123ABC",
  "name": "(주)에이비씨",
  "slug": "abc-company",
  "plan": "free",
  "status": "active",
  "created_at": "2024-03-15T09:00:00Z",
  "owner": {
    "user_id": "usr_01HXYZ456DEF",
    "role": "admin"
  }
}
```

---

## POST /orgs/:org_id/members/invite — 멤버 초대

### Request Body

```json
{
  "emails": ["dev@example.com", "manager@example.com"],
  "role": "developer",
  "message": "VideoFly 프로젝트에 초대합니다."
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `emails` | string[] | 필수 | 초대할 이메일 (최대 10개) |
| `role` | string | 필수 | `admin`, `manager`, `developer`, `viewer` |
| `message` | string | 선택 | 초대 이메일에 포함할 메시지 |

### 응답

```json
HTTP/1.1 201 Created

{
  "invited": [
    {
      "id": "inv_01HXYZ789GHI",
      "email": "dev@example.com",
      "role": "developer",
      "expires_at": "2024-03-22T09:00:00Z"
    }
  ],
  "already_members": [],
  "failed": []
}
```

---

## PATCH /orgs/:org_id/members/:user_id — 역할 변경

### Request Body

```json
{
  "role": "manager"
}
```

### 검증 규칙

- `role`: `admin`, `manager`, `developer`, `viewer`만 허용
- 마지막 Admin 역할 변경 시 `409 Conflict` 반환
- 자기 자신 역할 변경 시 `403 Forbidden` 반환

### 응답

```json
HTTP/1.1 200 OK

{
  "user_id": "usr_01HXYZ456DEF",
  "org_id": "org_01HXYZ123ABC",
  "role": "manager",
  "updated_at": "2024-03-15T10:00:00Z"
}
```

---

## GET /orgs/:org_id/members — 멤버 목록

### Query Parameters

| 파라미터 | 설명 |
|---------|------|
| `role` | 역할 필터: `admin`, `manager`, `developer`, `viewer` |
| `page` | 페이지 번호 (기본: 1) |
| `per_page` | 페이지당 항목 수 (기본: 20) |

### 응답

```json
HTTP/1.1 200 OK

{
  "data": [
    {
      "user_id": "usr_01HXYZ456DEF",
      "name": "홍길동",
      "email": "admin@abc.co.kr",
      "role": "admin",
      "avatar_url": "https://cdn.videofly.co.kr/avatars/usr_01HXYZ456DEF.jpg",
      "joined_at": "2024-01-15T09:00:00Z",
      "last_active_at": "2024-03-15T14:32:00Z"
    },
    {
      "user_id": "usr_01HXYZ789GHI",
      "name": "김개발",
      "email": "dev@abc.co.kr",
      "role": "developer",
      "joined_at": "2024-02-01T09:00:00Z",
      "last_active_at": "2024-03-14T11:20:00Z"
    }
  ],
  "pending_invitations": [
    {
      "id": "inv_01HXYZ012JKL",
      "email": "pending@example.com",
      "role": "manager",
      "invited_at": "2024-03-15T09:00:00Z",
      "expires_at": "2024-03-22T09:00:00Z"
    }
  ],
  "meta": {
    "total_members": 4,
    "pending_invitations": 1,
    "plan_member_limit": 20
  }
}
```

---

## GET /me/invitations — 받은 초대 목록

```json
HTTP/1.1 200 OK

{
  "data": [
    {
      "id": "inv_01HXYZ789GHI",
      "org": {
        "id": "org_01HXYZABC123",
        "name": "(주)XYZ 테크",
        "logo_url": null
      },
      "role": "developer",
      "invited_by": {
        "name": "김관리자",
        "email": "admin@xyz.co.kr"
      },
      "message": "VideoFly 프로젝트에 초대합니다.",
      "expires_at": "2024-03-22T09:00:00Z"
    }
  ]
}
```

---

## POST /me/invitations/:inv_id/accept — 초대 수락

```json
HTTP/1.1 200 OK

{
  "org_id": "org_01HXYZABC123",
  "org_name": "(주)XYZ 테크",
  "role": "developer",
  "message": "조직에 성공적으로 합류했습니다."
}
```

---

## 오류 코드

| HTTP | 코드 | 설명 |
|------|------|------|
| 403 | `insufficient_role` | 해당 작업에 권한 부족 |
| 403 | `cross_org_access` | 다른 조직 리소스 접근 시도 |
| 404 | `org_not_found` | 조직을 찾을 수 없음 |
| 404 | `member_not_found` | 멤버를 찾을 수 없음 |
| 409 | `already_member` | 이미 조직 멤버인 이메일 초대 시도 |
| 409 | `last_admin` | 마지막 Admin 역할 변경·제거 시도 |
| 409 | `slug_taken` | 슬러그 중복 |
| 422 | `plan_member_limit` | 플랜 멤버 한도 초과 |

```json
{
  "error": {
    "code": "last_admin",
    "message": "조직의 마지막 Admin은 역할을 변경할 수 없습니다. 다른 Admin을 지정한 후 시도해주세요.",
    "request_id": "req_abc123"
  }
}
```

---

## 조직 컨텍스트의 동영상 API

동영상 API는 항상 조직 범위 내에서 동작합니다:

```bash
# 특정 조직의 동영상 목록
GET /api/v1/videos
X-Org-ID: org_01HXYZ123ABC
Authorization: Basic {key_id:secret}

# 또는 URL 경로 방식
GET /api/v1/orgs/org_01HXYZ123ABC/videos
Authorization: Basic {key_id:secret}
```

API 키는 발급된 조직의 리소스에만 접근 가능합니다.  
다른 조직 리소스 접근 시 `403 cross_org_access` 반환.
