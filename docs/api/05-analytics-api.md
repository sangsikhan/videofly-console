# API 레퍼런스: 분석 (Analytics API)

**Base URL:** `https://api.videofly.co.kr/v1`

---

## 엔드포인트 목록

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/analytics/summary` | 계정 전체 분석 요약 |
| GET | `/analytics/videos` | 동영상별 분석 목록 |
| GET | `/analytics/videos/:id` | 특정 동영상 상세 분석 |
| GET | `/analytics/live-streams/:id` | 라이브 스트림 분석 |
| GET | `/analytics/monitoring` | 실시간 모니터링 |
| GET | `/analytics/export` | CSV 내보내기 |

---

## 공통 Query Parameters

| 파라미터 | 형식 | 기본값 | 설명 |
|---------|------|--------|------|
| `period` | string | `30d` | `today`, `7d`, `30d`, `90d` |
| `from` | ISO 8601 | - | 커스텀 시작일 (`period` 대신 사용) |
| `to` | ISO 8601 | 현재 | 커스텀 종료일 |
| `timezone` | string | `Asia/Seoul` | 타임존 |

---

## GET /analytics/summary

계정 전체 분석 요약.

### 응답 예시

```json
HTTP/1.1 200 OK

{
  "period": {
    "from": "2024-03-01T00:00:00+09:00",
    "to": "2024-03-31T23:59:59+09:00"
  },
  "views": {
    "total": 48200,
    "unique_viewers": 31500,
    "change_pct": 12.3
  },
  "watch_time": {
    "total_minutes": 16200,
    "avg_minutes_per_view": 0.34,
    "change_pct": 15.1
  },
  "quality": {
    "startup_time_avg_ms": 820,
    "rebuffering_ratio": 0.003,
    "playback_failure_rate": 0.001,
    "upscale_percentage": 0.12
  },
  "completion_rate": 0.72,
  "top_videos": [
    {
      "video_id": "asset_abc123",
      "title": "제품 데모 v2",
      "views": 8200,
      "watch_minutes": 2100
    }
  ],
  "daily_series": [
    { "date": "2024-03-01", "views": 1500, "watch_minutes": 510 },
    { "date": "2024-03-02", "views": 1800, "watch_minutes": 612 }
  ]
}
```

---

## GET /analytics/videos/:id

특정 동영상의 상세 분석.

### Query Parameters (추가)

| 파라미터 | 설명 |
|---------|------|
| `dimension` | 추가 분석 차원: `country`, `device_type`, `os`, `browser` |

### 응답 예시

```json
HTTP/1.1 200 OK

{
  "video_id": "asset_abc123",
  "title": "제품 데모 v2",
  "period": { "from": "...", "to": "..." },
  "summary": {
    "views": 8200,
    "unique_viewers": 5400,
    "watch_minutes": 2100,
    "avg_view_duration_seconds": 103.4,
    "completion_rate": 0.78,
    "play_rate": 0.62
  },
  "quality": {
    "startup_time_avg_ms": 780,
    "rebuffering_ratio": 0.002,
    "playback_failure_rate": 0.0008
  },
  "audience": {
    "by_country": [
      { "country": "KR", "views": 6200, "pct": 0.756 },
      { "country": "US", "views": 900, "pct": 0.110 },
      { "country": "JP", "views": 400, "pct": 0.049 }
    ],
    "by_device": [
      { "device": "desktop", "views": 4264, "pct": 0.52 },
      { "device": "mobile", "views": 3116, "pct": 0.38 },
      { "device": "tablet", "views": 820, "pct": 0.10 }
    ],
    "by_os": [
      { "os": "iOS", "views": 2050, "pct": 0.25 },
      { "os": "Android", "views": 1640, "pct": 0.20 },
      { "os": "Windows", "views": 2460, "pct": 0.30 }
    ]
  },
  "engagement": {
    "heatmap": [
      { "second": 0, "retention_pct": 1.0 },
      { "second": 30, "retention_pct": 0.85 },
      { "second": 60, "retention_pct": 0.72 },
      { "second": 90, "retention_pct": 0.61 },
      { "second": 120, "retention_pct": 0.45 }
    ]
  },
  "daily_series": [
    { "date": "2024-03-01", "views": 300 },
    { "date": "2024-03-02", "views": 350 }
  ]
}
```

---

## GET /analytics/live-streams/:id

특정 방송 회차 (asset_id 또는 live_stream_id) 분석.

```json
HTTP/1.1 200 OK

{
  "live_stream_id": "live_abc123",
  "session": {
    "started_at": "2024-03-15T14:00:00Z",
    "ended_at": "2024-03-15T15:23:45Z",
    "duration_seconds": 5025
  },
  "audience": {
    "peak_concurrent_viewers": 521,
    "total_views": 1203,
    "avg_view_duration_seconds": 750
  },
  "concurrent_viewers_timeline": [
    { "timestamp": "2024-03-15T14:00:00Z", "viewers": 50 },
    { "timestamp": "2024-03-15T14:05:00Z", "viewers": 180 },
    { "timestamp": "2024-03-15T14:30:00Z", "viewers": 521 }
  ],
  "input_quality_timeline": [
    { "timestamp": "2024-03-15T14:00:00Z", "bitrate_kbps": 3500, "fps": 30 },
    { "timestamp": "2024-03-15T14:05:00Z", "bitrate_kbps": 3480, "fps": 30 }
  ]
}
```

---

## GET /analytics/monitoring

실시간 모니터링 데이터 (< 20초 지연).

```json
HTTP/1.1 200 OK

{
  "timestamp": "2024-03-15T14:32:10Z",
  "active_views": 342,
  "active_live_streams": 2,
  "error_rate": 0.0008,
  "avg_startup_time_ms": 900,
  "rebuffering_ratio": 0.004,
  "alerts": [
    {
      "severity": "warning",
      "type": "high_error_rate",
      "segment": "device_type:mobile, os:android",
      "value": 0.023,
      "baseline": 0.001,
      "affected_viewers": 45
    }
  ]
}
```

---

## GET /analytics/export

분석 데이터 CSV 내보내기.

### Query Parameters

| 파라미터 | 설명 |
|---------|------|
| `type` | `summary`, `views`, `quality` |
| `period` 또는 `from`/`to` | 기간 |

### 응답

```
HTTP/1.1 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="analytics-2024-03.csv"

date,views,unique_viewers,watch_minutes,startup_time_ms,rebuffering_ratio
2024-03-01,1500,980,510,820,0.003
2024-03-02,1800,1150,612,790,0.002
...
```

---

## Mux Data SDK 직접 연동

플레이어에 분석 SDK를 직접 통합하여 상세 데이터 수집:

```javascript
import MuxPlayer from '@mux/mux-player-react';

// metadata 속성으로 Mux Data에 컨텍스트 전달
<MuxPlayer
  playbackId="xyz789"
  metadata={{
    video_id: 'asset_abc123',
    video_title: '제품 데모 v2',
    video_series: '제품 시리즈',
    viewer_user_id: 'user_123',
    experiment_name: 'player_ab_test_v2',
    sub_property_id: 'ko',
    player_name: 'VideoFly Player',
    page_type: 'watchpage',
    page_url: window.location.href,
  }}
/>
```
