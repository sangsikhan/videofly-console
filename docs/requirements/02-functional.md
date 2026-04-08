# VideoFly SaaS — 기능 요구사항

## 1. 동영상 관리

### 1.1 동영상 업로드

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-VID-01 | Direct Upload: 클라이언트에서 서버를 거치지 않고 Mux로 직접 업로드하는 서명된 URL 발급 | P0 |
| F-VID-02 | URL 수집 업로드: 외부 URL(S3, GCS, HTTP 등)을 입력하면 Mux가 직접 수집 | P0 |
| F-VID-03 | 멀티파트 업로드: 대용량 파일(> 5GB) 청크 분할 업로드 지원 | P1 |
| F-VID-04 | 업로드 진행률 실시간 표시 (Progress Bar) | P0 |
| F-VID-05 | 지원 포맷: MP4, MOV, AVI, MKV, WebM, FLV, WMV 등 주요 컨테이너 | P0 |
| F-VID-06 | 최대 파일 크기: 플랜별 설정 (기본 50GB) | P1 |
| F-VID-07 | 업로드 완료 후 인코딩 상태 자동 폴링 또는 웹훅 수신 | P0 |

### 1.2 인코딩 및 처리

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-ENC-01 | AI 기반 퍼-타이틀(per-title) 인코딩으로 콘텐츠별 최적 비트레이트 자동 결정 | P0 |
| F-ENC-02 | HLS Adaptive Bitrate (ABR) 스트리밍 출력 | P0 |
| F-ENC-03 | 최대 해상도 4K (2160p) 지원 | P1 |
| F-ENC-04 | MP4 다운로드 파일 생성 옵션 (static rendition) | P1 |
| F-ENC-05 | Master 파일 접근 옵션 (원본 보존) | P2 |
| F-ENC-06 | 인코딩 완료 시 웹훅 이벤트 `video.asset.ready` 발송 | P0 |
| F-ENC-07 | 인코딩 실패 시 웹훅 이벤트 `video.asset.errored` 발송 및 오류 로그 제공 | P0 |

### 1.3 동영상 목록 및 검색

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-LIST-01 | 동영상 목록 페이지 (테이블/그리드 뷰 전환) | P0 |
| F-LIST-02 | 제목, 태그, 상태(인코딩 중/완료/오류)로 필터링 | P0 |
| F-LIST-03 | 업로드 날짜, 재생 수, 용량 기준 정렬 | P1 |
| F-LIST-04 | 페이지네이션 (기본 20개/페이지) | P0 |
| F-LIST-05 | 동영상 썸네일 미리보기 | P0 |
| F-LIST-06 | 일괄 삭제 / 태그 일괄 적용 | P2 |

### 1.4 동영상 상세 및 편집

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-DETAIL-01 | 제목, 설명, 태그 편집 | P0 |
| F-DETAIL-02 | 썸네일: 동영상 내 특정 시점 캡처 또는 이미지 파일 업로드 | P1 |
| F-DETAIL-03 | 자막/캡션 파일(VTT, SRT) 업로드 및 언어 설정 | P1 |
| F-DETAIL-04 | AI 자동 자막 생성 요청 (20+ 언어) | P2 |
| F-DETAIL-05 | 재생 정책: 공개(public) / 서명 필요(signed) 전환 | P0 |
| F-DETAIL-06 | 임베드 코드 생성 (iframe / Mux Player 스니펫) | P0 |
| F-DETAIL-07 | 동영상 미리보기 플레이어 (콘솔 내) | P0 |
| F-DETAIL-08 | 재생 통계 요약 (총 재생수, 시청 시간) | P1 |
| F-DETAIL-09 | 클립 생성: 시작/종료 시간 지정 후 새 에셋으로 생성 | P2 |

---

## 2. 라이브 스트리밍

### 2.1 라이브 스트림 생성 및 관리

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-LIVE-01 | RTMP 수신 엔드포인트 및 스트림 키 자동 생성 | P0 |
| F-LIVE-02 | SRT 수신 엔드포인트 지원 | P1 |
| F-LIVE-03 | 스트림 이름, 설명 설정 | P0 |
| F-LIVE-04 | 최대 동시 연결 수 제한 설정 | P1 |
| F-LIVE-05 | 재연결 허용 시간(reconnect_window) 설정 (기본 60초) | P1 |
| F-LIVE-06 | 라이브 스트림 상태: `idle` → `active` → `disconnected` 전환 관리 | P0 |
| F-LIVE-07 | 스트림 종료 시 자동 VOD 에셋 생성 | P0 |
| F-LIVE-08 | 스트림 키 재발급 기능 | P1 |

### 2.2 라이브 스튜디오 (모니터링)

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-STUDIO-01 | 실시간 입력 신호 상태 표시 (비트레이트, 해상도, FPS) | P0 |
| F-STUDIO-02 | 라이브 미리보기 플레이어 (지연 ~3-5초) | P0 |
| F-STUDIO-03 | 현재 시청자 수 실시간 표시 | P1 |
| F-STUDIO-04 | 방송 시작/종료 수동 제어 버튼 | P0 |
| F-STUDIO-05 | 라이브 채팅 연동 (Phase 2) | P2 |
| F-STUDIO-06 | Simulcast 대상 설정 (YouTube, Facebook, Twitch) | P2 |

### 2.3 라이브 녹화

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-REC-01 | 라이브 자동 녹화 활성화/비활성화 설정 | P0 |
| F-REC-02 | 방송 종료 즉시 VOD 에셋 생성 (추가 처리 시간 없음) | P0 |
| F-REC-03 | 녹화 완료 웹훅 이벤트 `video.live_stream.recording.ready` | P0 |

---

## 3. 플레이어

### 3.1 임베드 플레이어

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-PLAYER-01 | Mux Player Web Component 기반 반응형 플레이어 | P0 |
| F-PLAYER-02 | 공개 재생: `https://stream.mux.com/{PLAYBACK_ID}.m3u8` | P0 |
| F-PLAYER-03 | 서명된 재생: JWT 토큰 기반 접근 제어 | P1 |
| F-PLAYER-04 | 자동재생 / 음소거 / 자막 기본값 설정 | P1 |
| F-PLAYER-05 | 브랜드 색상, 로고 커스터마이즈 | P1 |
| F-PLAYER-06 | iframe 임베드 코드 원클릭 복사 | P0 |
| F-PLAYER-07 | React, Vue, iOS, Android SDK 코드 스니펫 제공 | P1 |

### 3.2 보안 재생

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-SEC-01 | Signed Playback URL: JWT 토큰 만료 시간 설정 | P1 |
| F-SEC-02 | 도메인 허용 목록(Domain Allowlist) 설정 | P1 |
| F-SEC-03 | IP 제한 (Phase 2) | P2 |
| F-SEC-04 | DRM (Widevine, FairPlay, PlayReady) 지원 (Phase 2) | P2 |

---

## 4. 분석 / 통계

### 4.1 동영상 분석

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-ANA-01 | 총 재생수(Views), 순 시청자수(Unique Viewers) | P0 |
| F-ANA-02 | 총 시청 시간, 평균 시청 시간, 완료율 | P0 |
| F-ANA-03 | 시작 시간(Startup Time), 리버퍼링 비율(Rebuffering Rate) | P1 |
| F-ANA-04 | 시청자 지역(국가/도시) 분포 | P1 |
| F-ANA-05 | 기기 유형(데스크톱/모바일/태블릿) 분포 | P1 |
| F-ANA-06 | 동영상별 시청 구간 히트맵 (Heatmap) | P2 |
| F-ANA-07 | 기간 필터: 오늘/7일/30일/커스텀 | P0 |
| F-ANA-08 | CSV 내보내기 | P1 |

### 4.2 라이브 분석

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-LANA-01 | 동시 시청자 수 타임라인 그래프 | P1 |
| F-LANA-02 | 총 시청자 수, 시청 시간 요약 | P1 |
| F-LANA-03 | 입력 스트림 품질(비트레이트, FPS) 타임라인 | P1 |

### 4.3 계정 전체 통계

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-ACANA-01 | 이번 달 총 재생 분(Minutes Watched) | P0 |
| F-ACANA-02 | 저장 용량 사용량 (GB) | P0 |
| F-ACANA-03 | 라이브 스트리밍 시간 사용량 | P1 |
| F-ACANA-04 | 플랜 한도 대비 사용률 시각화 | P0 |

---

## 5. API 및 웹훅

### 5.1 API 키 관리

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-API-01 | API 키(Key ID + Secret) 발급 및 삭제 | P0 |
| F-API-02 | 키 이름, 권한 범위(Read / Write / Admin) 설정 | P1 |
| F-API-03 | 키 생성 시 Secret은 최초 1회만 표시 (이후 마스킹) | P0 |
| F-API-04 | API 사용량 로그 조회 (최근 100건) | P1 |

### 5.2 웹훅

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-WH-01 | 웹훅 엔드포인트 URL 등록 및 삭제 | P0 |
| F-WH-02 | 이벤트 유형 선택 구독 | P0 |
| F-WH-03 | 웹훅 서명 검증용 Secret 발급 | P0 |
| F-WH-04 | 웹훅 전송 이력 조회 (상태, 페이로드, 응답) | P1 |
| F-WH-05 | 수동 재전송(Retry) 기능 | P1 |

**지원 웹훅 이벤트:**

```
video.asset.created
video.asset.ready
video.asset.errored
video.asset.deleted
video.live_stream.created
video.live_stream.active
video.live_stream.disconnected
video.live_stream.idle
video.live_stream.recording.ready
video.upload.created
video.upload.asset_created
video.upload.cancelled
video.upload.errored
```

---

## 6. 계정 및 플랜 관리

### 6.1 인증

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-AUTH-01 | 이메일 + 비밀번호 회원가입/로그인 | P0 |
| F-AUTH-02 | Google OAuth 소셜 로그인 | P1 |
| F-AUTH-03 | 이메일 인증 (회원가입 후) | P0 |
| F-AUTH-04 | 비밀번호 재설정 (이메일 링크) | P0 |
| F-AUTH-05 | 2단계 인증 (TOTP, Phase 2) | P2 |

### 6.2 플랜 및 청구

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-BILL-01 | 플랜 목록 표시 (Free / Starter / Pro / Enterprise) | P0 |
| F-BILL-02 | 플랜 업그레이드/다운그레이드 | P0 |
| F-BILL-03 | 신용카드 등록 및 관리 | P0 |
| F-BILL-04 | 월별 청구 내역 조회 | P0 |
| F-BILL-05 | 초과 사용 시 자동 종량제 과금 알림 | P1 |
| F-BILL-06 | 세금계산서 발행 (한국 사업자) | P1 |
