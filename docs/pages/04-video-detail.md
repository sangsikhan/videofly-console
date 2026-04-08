# 페이지: 동영상 상세 및 편집 (Video Detail)

**Route:** `/videos/:vid_id`  
**접근 권한:** Viewer(조회) / Developer+(편집) / Manager+(삭제·정책변경)

---

## 1. 페이지 목적

개별 동영상의 상세 정보 조회, 메타데이터 편집, 프로파일 에셋 현황,  
자막·썸네일 관리, 재생 설정, 임베드 코드 생성, 통계 요약을 제공하는 페이지.

---

## 2. 레이아웃 구성

```
┌──────────────────────────────────────────────────────────────┐
│  ← 동영상 목록  /  제품 데모 v2        [저장] [삭제]         │
├───────────────────────────────────────────────────────────────┤
│                       │                                      │
│  [동영상 미리보기 플레이어]│  [탭]                            │
│                       │  ● 기본 정보                         │
│  상태: ● 재생 가능     │  ○ 프로파일 에셋                    │
│  vid_id: vid_01HXYZ…  │  ○ 자막  ○ 썸네일                   │
│  org_id: org_01HXYZ…  │  ○ 재생 설정  ○ 임베드  ○ 통계      │
│  생성일: 2024-03-15   │                                      │
└───────────────────────────────────────────────────────────────┘
```

---

## 3. 탭별 상세 내용

### 탭 1. 기본 정보 (Info)

| 필드 | 편집 | 설명 |
|------|------|------|
| 제목 | ✅ | 최대 255자 |
| 설명 | ✅ | 최대 5,000자 |
| 태그 | ✅ | 최대 20개 |
| Video ID (`vid_id`) | ❌ | `vid_01HXYZ456DEF` — 복사 버튼 |
| 조직 ID (`org_id`) | ❌ | `org_01HXYZ123ABC` |
| 재생 ID (`pbk_id`) | ❌ | `pbk_01HXYZGHI789` — 복사 버튼 |
| 상태 | ❌ | `ready` / `warming_up` / `error` |
| 재생 시간 | ❌ | hh:mm:ss |
| 원본 파일 크기 | ❌ | N GB |
| 업로드 일시 | ❌ | ISO 8601 |

**원본 파일 경로 (Admin만 표시):**
```
oci://vf-origin-bucket/orgs/org_01HXYZ.../videos/vid_01HXYZ.../source.mp4
```

---

### 탭 2. 프로파일 에셋 (Profile Assets)

각 `vpa_{vid_id}_{prof_id}` 에셋의 JIT 처리 현황 표시:

```
┌──────────────────────────────────────────────────────────────┐
│ 프로파일           상태          캐시 크기    만료       재생  │
├──────────────────────────────────────────────────────────────┤
│ 1080p H.264        ✅ 캐시됨     1.2 GB      6시간 후        │
│ prof_1080p_h264                                    [미리보기] │
├──────────────────────────────────────────────────────────────┤
│ 720p H.264         ✅ 캐시됨     680 MB      3시간 후        │
│ prof_720p_h264                                     [미리보기] │
├──────────────────────────────────────────────────────────────┤
│ 480p H.264         ⏳ 생성 중    —           —               │
│ prof_480p_h264     (JIT 처리 진행 중)                        │
├──────────────────────────────────────────────────────────────┤
│ 360p H.264         ○ 미생성      —           —               │
│ prof_360p_h264     (첫 재생 요청 시 생성됩니다)   [강제 생성] │
└──────────────────────────────────────────────────────────────┘
```

**상태 설명:**

| 상태 | 아이콘 | 설명 |
|------|--------|------|
| `cached` | ✅ | CDN/캐시에 있음, 즉시 재생 가능 |
| `generating` | ⏳ | JIT 처리 진행 중 |
| `not_generated` | ○ | 아직 JIT 처리 안 됨 (첫 재생 시 자동 생성) |
| `expired` | 🕐 | 캐시 만료 (다음 재생 요청 시 재생성) |
| `failed` | ❌ | 처리 실패 (재시도 버튼) |

**강제 생성 버튼:**  
`not_generated` 상태 프로파일을 즉시 JIT 처리 요청.

**ABR 마스터 플레이리스트 URL:**
```
https://stream.videofly.co.kr/hls/org_01HXYZ.../vid_01HXYZ.../master.m3u8
[복사]
```

---

### 탭 3. 자막 (Captions)

**자막 목록:**

| 언어 | Track ID | 유형 | 상태 | 작업 |
|------|----------|------|------|------|
| 한국어 (ko) | `trk_01HXYZ` | 업로드 | 활성 | 다운로드 / 삭제 |
| 영어 (en) | `trk_01HXYZ` | 자동 생성 | 활성 | 다운로드 / 삭제 |

**자막 추가:**
- 파일 업로드: `.vtt`, `.srt` → 언어 선택
- 저장 경로: `oci://vf-origin-bucket/.../videos/{vid_id}/subtitles/{trk_id}_ko.vtt`

---

### 탭 4. 썸네일 (Thumbnail)

**자동 생성 썸네일:**
```
https://thumb.videofly.co.kr/{org_id}/{vid_id}/thumbnail.jpg
```

**시점 지정 캡처:**
```
동영상에서 캡처할 시간: [00:01:30]
미리보기: [이미지 표시]
[이 시점으로 설정]
```

**커스텀 썸네일 업로드:**
- JPEG, PNG, WebP / 권장 1280×720 / 최대 5MB
- 저장 경로: `oci://vf-origin-bucket/.../videos/{vid_id}/thumbnails/custom_{thm_id}.jpg`

---

### 탭 5. 재생 설정 (Playback)

**재생 정책:**

| 옵션 | 설명 |
|------|------|
| ● 공개 (Public) | 누구나 재생 가능 |
| ○ 서명 필요 (Signed) | JWT 토큰 필요 |

**서명 필요 시 JWT 생성 예시:**
```javascript
const token = jwt.sign(
  {
    sub: "pbk_01HXYZGHI789",  // pbk_id
    org: "org_01HXYZ123ABC",  // org_id
    vid: "vid_01HXYZ456DEF",  // vid_id
    aud: "playback",
    exp: Math.floor(Date.now() / 1000) + 3600
  },
  signingPrivateKey,
  { algorithm: 'RS256', keyid: 'sign_key_abc' }
);

const url = `https://stream.videofly.co.kr/hls/org_01HXYZ.../vid_01HXYZ.../master.m3u8?token=${token}`;
```

**도메인 허용 목록:**
```
example.com
app.mysite.co.kr
```

---

### 탭 6. 임베드 (Embed)

**플레이어 설정 후 코드 생성:**

```html
<!-- iframe 임베드 -->
<iframe
  src="https://player.videofly.co.kr/vid_01HXYZ456DEF"
  width="640" height="360"
  frameborder="0" allowfullscreen>
</iframe>

<!-- VideoFly Player Web Component -->
<script src="https://cdn.videofly.co.kr/player/v1/player.js"></script>
<vf-player
  vid-id="vid_01HXYZ456DEF"
  org-id="org_01HXYZ123ABC">
</vf-player>

<!-- HLS 직접 재생 URL -->
https://stream.videofly.co.kr/hls/org_01HXYZ123ABC/vid_01HXYZ456DEF/master.m3u8
```

---

### 탭 7. 통계 (Stats)

기간 필터: 오늘 / 7일 / 30일 / 전체

| 지표 | 값 |
|------|---|
| 총 재생수 | 1,520회 |
| 순 시청자수 | 980명 |
| 시청 완료율 | 72% |
| 평균 시작 시간 | 1.2초 (JIT 캐시 Miss 제외 평균) |
| 리버퍼링 비율 | 0.3% |
| JIT 캐시 Hit율 | 91% |

---

## 4. 삭제 처리

```
이 동영상을 삭제하시겠습니까?

삭제 항목:
  ✗ 원본 파일 (OCI Object Storage)
  ✗ 모든 프로파일 에셋 (vpa_*)
  ✗ 캐시된 HLS/DASH 세그먼트
  ✗ 썸네일 파일
  ✗ 자막 파일
  ✗ 분석 데이터 (집계 데이터는 90일 보존)

동영상 제목: 제품 데모 v2
Video ID: vid_01HXYZ456DEF

[취소]        [영구 삭제]
```
