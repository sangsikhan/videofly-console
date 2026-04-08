# VideoFly SaaS — 비기능 요구사항

## 1. 성능 (Performance)

| ID | 요구사항 | 목표값 |
|----|---------|--------|
| NF-PERF-01 | VideoFly API 응답 시간 (p50) | < 200ms |
| NF-PERF-02 | VideoFly API 응답 시간 (p99) | < 500ms |
| NF-PERF-03 | 콘솔 페이지 초기 로딩 시간 (LCP) | < 2.5초 |
| NF-PERF-04 | 동영상 재생 시작 시간 (Startup Time) | < 1초 (Mux SLA 기준) |
| NF-PERF-05 | 라이브 스트리밍 지연 시간 | 3~5초 (표준), < 1초 (LL-HLS) |
| NF-PERF-06 | Direct Upload 서명 URL 발급 응답 | < 300ms |
| NF-PERF-07 | 동시 업로드 처리 수 | 계정당 동시 10개 |

---

## 2. 가용성 및 안정성 (Availability & Reliability)

| ID | 요구사항 | 목표값 |
|----|---------|--------|
| NF-AVAIL-01 | 서비스 업타임 | 99.9% (월간 다운타임 < 43분) |
| NF-AVAIL-02 | Mux 인프라 가용성 (SLA) | 99.9% (Mux 보장) |
| NF-AVAIL-03 | VideoFly API 서버 다중화 | 최소 2개 인스턴스, 로드밸런서 |
| NF-AVAIL-04 | 데이터베이스 장애 복구 목표 시간 (RTO) | < 1시간 |
| NF-AVAIL-05 | 데이터 복구 목표 시점 (RPO) | < 1시간 |
| NF-AVAIL-06 | 웹훅 재시도 정책 | 최대 5회, 지수 백오프 |
| NF-AVAIL-07 | 배포 중 Zero-downtime 요구 | 블루-그린 배포 |

---

## 3. 확장성 (Scalability)

| ID | 요구사항 | 목표값 |
|----|---------|--------|
| NF-SCALE-01 | 동시 재생 스트림 수 | Mux CDN 무제한 |
| NF-SCALE-02 | 동시 라이브 스트림 수 | 계정 플랜별 제한 |
| NF-SCALE-03 | 트래픽 스파이크 자동 대응 | 오토스케일링 (ECS / K8s) |
| NF-SCALE-04 | 고객사 수 목표 (1년) | 1,000개 이상 |
| NF-SCALE-05 | 동시 접속자 (콘솔) | 10,000명 동시 지원 |

---

## 4. 보안 (Security)

| ID | 요구사항 | 기준 |
|----|---------|------|
| NF-SEC-01 | API 통신 암호화 | TLS 1.2 이상 |
| NF-SEC-02 | 데이터 저장 암호화 | AES-256 (at rest) |
| NF-SEC-03 | API 인증 방식 | HTTP Basic Auth (Mux 기준), Bearer JWT (VideoFly) |
| NF-SEC-04 | API 키 해싱 저장 | bcrypt 또는 Argon2 |
| NF-SEC-05 | 웹훅 서명 검증 | HMAC-SHA256 |
| NF-SEC-06 | Signed Playback URL 최소 만료 시간 | 1분 (권장 15분) |
| NF-SEC-07 | OWASP Top 10 취약점 대응 | 분기별 보안 점검 |
| NF-SEC-08 | 개인정보 처리 | 개인정보보호법 및 GDPR 준수 |
| NF-SEC-09 | 접근 로그 보존 기간 | 최소 6개월 |
| NF-SEC-10 | XSS / CSRF 방어 | CSP 헤더, SameSite Cookie |

---

## 5. 유지보수성 (Maintainability)

| ID | 요구사항 |
|----|---------|
| NF-MAINT-01 | API 버전 관리: URL 기반 (`/v1/`, `/v2/`) |
| NF-MAINT-02 | 하위 호환성: Major 버전 업 시 구버전 최소 6개월 지원 |
| NF-MAINT-03 | 구조화된 로깅 (JSON 형식, ELK 또는 CloudWatch) |
| NF-MAINT-04 | 오류 추적 (Sentry 또는 동급 서비스) |
| NF-MAINT-05 | API 문서 자동화 (OpenAPI 3.0 스펙) |
| NF-MAINT-06 | 코드 커버리지 목표: 단위 테스트 80% 이상 |
| NF-MAINT-07 | CI/CD 파이프라인: PR 머지 시 자동 배포 |

---

## 6. 사용성 (Usability)

| ID | 요구사항 |
|----|---------|
| NF-UX-01 | 한국어 UI 완전 지원 |
| NF-UX-02 | 반응형 웹: 모바일(360px 이상) ~ 데스크톱(1920px) |
| NF-UX-03 | 웹 접근성: WCAG 2.1 AA 수준 |
| NF-UX-04 | 크로스 브라우저: Chrome, Firefox, Safari, Edge 최신 버전 |
| NF-UX-05 | 에러 메시지: 사용자 친화적 한국어 오류 안내 |
| NF-UX-06 | 온보딩: 신규 가입 후 5분 이내 첫 동영상 재생 가능한 가이드 |

---

## 7. 규정 준수 (Compliance)

| ID | 요구사항 |
|----|---------|
| NF-COMP-01 | 개인정보보호법(한국) 준수 — 개인정보 수집 최소화 |
| NF-COMP-02 | 정보통신망법 준수 |
| NF-COMP-03 | 전자서명법 준수 |
| NF-COMP-04 | 저작권법: 불법 콘텐츠 신고 및 처리 절차 수립 |
| NF-COMP-05 | 결제 보안: PCI DSS (Stripe 위임) |
| NF-COMP-06 | 데이터 보존 및 삭제 정책 문서화 |

---

## 8. 모니터링 및 알림

| ID | 요구사항 |
|----|---------|
| NF-MON-01 | 서비스 상태 페이지 공개 (`status.videofly.co.kr`) |
| NF-MON-02 | API 오류율 > 1% 시 PagerDuty/Slack 알림 |
| NF-MON-03 | 라이브 스트림 비정상 종료 시 고객 이메일 알림 |
| NF-MON-04 | 사용량 90% 도달 시 플랜 한도 경고 알림 |
| NF-MON-05 | Mux 웹훅 전송 실패율 모니터링 |
| NF-MON-06 | 인프라 메트릭: CPU, 메모리, 디스크, 네트워크 I/O |
