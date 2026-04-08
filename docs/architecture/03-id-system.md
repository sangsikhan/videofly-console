# 아키텍처: ID 체계 (ID System)

---

## 1. 개요

VideoFly는 모든 리소스를 **계층적 ID 체계**로 관리합니다.  
플랫폼 → 조직 → 비디오 → 프로파일 → 에셋의 명확한 계층 구조를 가집니다.

---

## 2. ID 계층 구조

```
플랫폼 (VideoFly)
│
├── 조직 (Organization)
│   org_{ulid}
│   예: org_01HXYZ123ABC
│   │
│   ├── 사용자 (User)
│   │   usr_{ulid}
│   │
│   ├── API 키 (API Key)
│   │   key_{ulid}
│   │
│   ├── 동영상 (Video)
│   │   vid_{ulid}
│   │   예: vid_01HXYZ456DEF
│   │   │
│   │   ├── 프로파일 결과 (Video Profile Asset)
│   │   │   vpa_{vid_id}_{prof_id}
│   │   │   예: vpa_01HXYZ456DEF_prof_1080p_h264
│   │   │
│   │   ├── 재생 엔드포인트 (Playback)
│   │   │   pbk_{ulid}
│   │   │   예: pbk_01HXYZ789GHI
│   │   │
│   │   ├── 자막 트랙 (Track)
│   │   │   trk_{ulid}
│   │   │
│   │   └── 썸네일 (Thumbnail)
│   │       thm_{ulid}
│   │
│   └── 라이브 스트림 (Live Stream)
│       liv_{ulid}
│       │
│       └── 녹화 (Recording)
│           rec_{ulid}
│
└── 인코딩 프로파일 (Encoding Profile)
    prof_{slug} 또는 prof_{ulid} (커스텀)
    예: prof_1080p_h264, prof_custom_01HXYZ
```

---

## 3. ID 형식

### 3.1 ULID (Universally Unique Lexicographically Sortable Identifier)

모든 리소스 ID는 **ULID** 기반으로 생성합니다.

```
01HXYZ123ABCDEFGHIJKLMNO
│         │
└─타임스탬프  └─랜덤 (16 bytes)
  (10자)
```

**UUID 대비 장점:**
- 정렬 가능 (시간 순서 내장)
- 128bit, URL-safe Base32 인코딩
- 데이터베이스 인덱스 성능 우수
- 생성 시간 역산 가능

### 3.2 리소스별 접두어 규칙

| 리소스 | 접두어 | 예시 |
|--------|--------|------|
| 조직 | `org_` | `org_01HXYZ123ABC` |
| 사용자 | `usr_` | `usr_01HXYZ456DEF` |
| API 키 ID | `key_` | `key_01HXYZ789GHI` |
| 동영상 | `vid_` | `vid_01HXYZABC123` |
| 인코딩 프로파일 (기본) | `prof_` | `prof_1080p_h264` |
| 인코딩 프로파일 (커스텀) | `prof_` | `prof_01HXYZDEF456` |
| 비디오-프로파일 에셋 | `vpa_` | `vpa_<vid_id>_<prof_id>` |
| 재생 엔드포인트 | `pbk_` | `pbk_01HXYZGHI789` |
| 자막 트랙 | `trk_` | `trk_01HXYZJKL012` |
| 썸네일 | `thm_` | `thm_01HXYZMNO345` |
| 라이브 스트림 | `liv_` | `liv_01HXYZPQR678` |
| 녹화 에셋 | `rec_` | `rec_01HXYZSTU901` |
| 웹훅 | `wh_` | `wh_01HXYZVWX234` |

---

## 4. 동영상(Video)과 프로파일(Profile)의 관계

```
동영상 (vid_ABC)
│   원본: oci://bucket/orgs/org_XXX/videos/vid_ABC/source.mp4
│
├── 프로파일 에셋 (vpa_ABC_prof_1080p_h264) — JIT 생성
│   결과: oci://bucket/.../vid_ABC/profiles/prof_1080p_h264/
│   HLS:  oci://bucket/.../vid_ABC/hls/prof_1080p_h264/
│
├── 프로파일 에셋 (vpa_ABC_prof_720p_h264) — JIT 생성
│   결과: oci://bucket/.../vid_ABC/profiles/prof_720p_h264/
│
├── 프로파일 에셋 (vpa_ABC_prof_480p_h264) — JIT 생성
│   결과: oci://bucket/.../vid_ABC/profiles/prof_480p_h264/
│
└── 재생 엔드포인트 (pbk_XYZ)
    URL: https://stream.videofly.co.kr/hls/org_XXX/vid_ABC/master.m3u8
    정책: public / signed
```

### 프로파일 에셋 상태

| 상태 | 설명 |
|------|------|
| `not_generated` | 아직 JIT 처리 없음 (캐시 없음) |
| `generating` | JIT 처리 진행 중 |
| `cached` | 결과 캐시됨, 즉시 재생 가능 |
| `expired` | TTL 만료, 다음 요청 시 재생성 |
| `failed` | 처리 실패 |

---

## 5. 오브젝트 스토리지 경로 규칙

```
oci://vf-origin-bucket/
└── orgs/
    └── {org_id}/
        └── videos/
            └── {vid_id}/
                ├── source.{ext}                    ← 원본 파일 (불변)
                ├── meta.json                       ← 동영상 메타데이터
                ├── thumbnails/
                │   ├── auto_{timestamp}.jpg        ← 자동 생성 썸네일
                │   └── custom_{thm_id}.jpg         ← 업로드 썸네일
                ├── subtitles/
                │   ├── {trk_id}_ko.vtt
                │   └── {trk_id}_en.vtt
                ├── profiles/
                │   └── {prof_id}/
                │       └── output.{ext}            ← 트랜스코드 결과
                └── hls/
                    └── {prof_id}/
                        ├── index.m3u8              ← 개별 프로파일 플레이리스트
                        ├── seg_000.ts
                        ├── seg_001.ts
                        └── ...
```

---

## 6. 재생 URL 구조

### 마스터 플레이리스트 (ABR)

```
https://stream.videofly.co.kr/hls/{org_id}/{vid_id}/master.m3u8
```

### 특정 프로파일 고정 재생

```
https://stream.videofly.co.kr/hls/{org_id}/{vid_id}/{prof_id}/index.m3u8
```

### DASH

```
https://stream.videofly.co.kr/dash/{org_id}/{vid_id}/manifest.mpd
```

### 서명된 재생 URL (Signed)

```
https://stream.videofly.co.kr/hls/{org_id}/{vid_id}/master.m3u8
  ?token={JWT}
```

**JWT Payload 예시:**
```json
{
  "sub": "pbk_01HXYZGHI789",
  "org": "org_01HXYZ123ABC",
  "vid": "vid_01HXYZABC123",
  "aud": "playback",
  "iat": 1710499200,
  "exp": 1710502800,
  "ip": "192.168.1.0/24",        // 선택: IP 제한
  "domain": "example.com"         // 선택: 도메인 제한
}
```

---

## 7. 썸네일 URL

```
기본 썸네일:
https://thumb.videofly.co.kr/{org_id}/{vid_id}/thumbnail.jpg

시점 지정:
https://thumb.videofly.co.kr/{org_id}/{vid_id}/thumbnail.jpg?t=30

크기 지정:
https://thumb.videofly.co.kr/{org_id}/{vid_id}/thumbnail.jpg?w=1280&h=720

애니메이션 GIF:
https://thumb.videofly.co.kr/{org_id}/{vid_id}/animated.gif?start=10&end=20&fps=10
```

---

## 8. DB 스키마 (핵심 테이블)

```sql
-- 조직
CREATE TABLE organizations (
  id          VARCHAR(30) PRIMARY KEY,  -- org_{ulid}
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,  -- URL용 식별자
  plan        ENUM('free','starter','pro','enterprise'),
  status      ENUM('active','suspended','deleted'),
  created_at  DATETIME NOT NULL,
  updated_at  DATETIME NOT NULL
);

-- 동영상
CREATE TABLE videos (
  id          VARCHAR(30) PRIMARY KEY,  -- vid_{ulid}
  org_id      VARCHAR(30) NOT NULL REFERENCES organizations(id),
  title       VARCHAR(255) NOT NULL,
  status      ENUM('uploading','uploaded','processing','ready','error'),
  source_path VARCHAR(1000),           -- OCI Object Storage 경로
  duration_ms BIGINT,
  file_size   BIGINT,
  created_at  DATETIME NOT NULL,
  updated_at  DATETIME NOT NULL,
  INDEX idx_org_id (org_id),
  INDEX idx_status (status)
);

-- 비디오-프로파일 에셋
CREATE TABLE video_profile_assets (
  id          VARCHAR(100) PRIMARY KEY,  -- vpa_{vid_id}_{prof_id}
  video_id    VARCHAR(30) NOT NULL REFERENCES videos(id),
  profile_id  VARCHAR(50) NOT NULL,
  status      ENUM('not_generated','generating','cached','expired','failed'),
  cache_path  VARCHAR(1000),
  cached_at   DATETIME,
  expires_at  DATETIME,
  created_at  DATETIME NOT NULL,
  UNIQUE KEY uq_vid_prof (video_id, profile_id)
);

-- 재생 엔드포인트
CREATE TABLE playback_endpoints (
  id          VARCHAR(30) PRIMARY KEY,  -- pbk_{ulid}
  video_id    VARCHAR(30) REFERENCES videos(id),
  live_id     VARCHAR(30) REFERENCES live_streams(id),
  policy      ENUM('public','signed'),
  domain_allowlist JSON,
  created_at  DATETIME NOT NULL
);
```
