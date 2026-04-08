import { Upload, Code2, Radio, BarChart3, Check } from 'lucide-react';

const blocks = [
  {
    icon: Upload,
    iconColor: 'text-blue-600',
    eyebrow: '동영상 업로드 & 인코딩',
    title: '드래그 앤 드롭으로\n업로드, 나머지는 VideoFly가',
    description:
      'OCI Object Storage에 직접 업로드 후 JIT 엔진이 자동으로 최적 화질을 결정합니다. 별도 인코딩 서버 없이도 4K·HDR·HLS ABR을 지원합니다.',
    points: ['4K · HDR · HLS ABR 지원', 'JIT 트랜스코딩 자동 처리', 'OCI CDN 글로벌 배포', 'URL 임포트 지원'],
    visual: (
      <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm">
        <p className="text-slate-500 mb-2"># 업로드 완료 → JIT 시작</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-slate-300">source.mp4 업로드 완료</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-slate-300">JIT Warm-up 시작 (30초)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span className="text-slate-300">1080p 프로파일 ✓ 준비됨</span>
          </div>
        </div>
        <div className="mt-4 bg-slate-800 rounded-lg p-3">
          <p className="text-slate-400 text-xs">vid_id</p>
          <p className="text-blue-300">vid_01HXYZ456DEF</p>
          <p className="text-slate-400 text-xs mt-2">HLS 스트리밍 URL</p>
          <p className="text-emerald-300 text-xs break-all">
            stream.videofly.co.kr/hls/org_01…/vid_01…/master.m3u8
          </p>
        </div>
      </div>
    ),
    reverse: false,
  },
  {
    icon: Code2,
    iconColor: 'text-purple-600',
    eyebrow: '플레이어 & 임베드',
    title: '한 줄 코드로 어디든\n플레이어를 삽입하세요',
    description:
      '브랜드 색상, 로고를 커스터마이즈하고 웹 컴포넌트 한 줄로 삽입하세요. React, Vue, iOS, Android SDK도 제공합니다.',
    points: ['Web Component 한 줄 임베드', 'React · Vue · iOS · Android SDK', '브랜드 색상 · 로고 커스터마이즈', '자막 · 챕터 · 썸네일 스프라이트'],
    visual: (
      <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm">
        <p className="text-slate-500 mb-3">&lt;!-- 임베드 코드 --&gt;</p>
        <div className="bg-slate-800 rounded-lg p-4 text-xs leading-relaxed">
          <span className="text-blue-400">&lt;vf-player</span>
          <br />
          <span className="text-slate-400">{'  '}vid-id=</span>
          <span className="text-emerald-300">&quot;vid_01HXYZ456DEF&quot;</span>
          <br />
          <span className="text-slate-400">{'  '}org-id=</span>
          <span className="text-emerald-300">&quot;org_01HXYZ123ABC&quot;</span>
          <br />
          <span className="text-slate-400">{'  '}theme-color=</span>
          <span className="text-emerald-300">&quot;#2563EB&quot;</span>
          <br />
          <span className="text-blue-400">&gt;&lt;/vf-player&gt;</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-slate-400 text-xs">재생 통계 자동 수집</span>
          <span className="text-emerald-400 text-xs flex items-center gap-1">
            <Check className="w-3 h-3" /> 활성
          </span>
        </div>
      </div>
    ),
    reverse: true,
  },
  {
    icon: Radio,
    iconColor: 'text-red-600',
    eyebrow: '라이브 스트리밍',
    title: 'OBS 연결 → 1분 만에\n방송 시작',
    description:
      'RTMP/SRT 스트림 키를 발급받아 OBS, vMix 등 방송 소프트웨어를 연결하세요. LL-HLS 저지연(3~5초) 방송 후 자동으로 VOD로 저장됩니다.',
    points: ['RTMP · SRT 스트림 키 즉시 발급', 'LL-HLS 저지연 3~5초', '방송 종료 후 자동 VOD 저장', '멀티 화질 자동 ABR'],
    visual: (
      <div className="bg-slate-900 rounded-2xl p-6 text-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-xs">라이브 스튜디오</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold">LIVE</span>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg aspect-video mb-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Radio className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-slate-400 text-xs">방송 중</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-800 rounded-lg p-2">
            <p className="text-slate-400">시청자</p>
            <p className="text-white font-bold">1,234</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-2">
            <p className="text-slate-400">지연</p>
            <p className="text-white font-bold">3.2초</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-2">
            <p className="text-slate-400">경과</p>
            <p className="text-white font-bold">42분</p>
          </div>
        </div>
      </div>
    ),
    reverse: false,
  },
  {
    icon: BarChart3,
    iconColor: 'text-emerald-600',
    eyebrow: '분석 & 모니터링',
    title: '누가, 어디서,\n얼마나 시청했는지',
    description:
      'Kafka → Flink → ClickHouse 실시간 분석 파이프라인. 재생 품질, 버퍼링, 이탈 지점을 실시간으로 파악하고 CSV나 API로 원본 데이터에 접근하세요.',
    points: ['실시간 재생 통계 대시보드', '버퍼링 · 품질 저하 알림', 'ClickHouse 기반 대용량 분석', 'CSV · API 원본 데이터 접근'],
    visual: (
      <div className="bg-slate-900 rounded-2xl p-6 text-sm">
        <p className="text-slate-400 text-xs mb-4">이번 달 재생 통계</p>
        {[
          { label: '재생 수', value: '12,500회', pct: 82 },
          { label: '시청 시간', value: '8,200분', pct: 65 },
          { label: '평균 시청률', value: '74%', pct: 74 },
        ].map((item) => (
          <div key={item.label} className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mt-2">
          <p className="text-emerald-400 text-xs">
            ↑ 전월 대비 재생수 +18% 증가
          </p>
        </div>
      </div>
    ),
    reverse: true,
  },
];

export default function FeatureDetails() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.eyebrow}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                block.reverse ? 'lg:[direction:rtl]' : ''
              }`}
            >
              {/* Text */}
              <div className="lg:[direction:ltr]">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-5 h-5 ${block.iconColor}`} />
                  <span className="text-sm font-semibold text-slate-500">{block.eyebrow}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5 whitespace-pre-line">
                  {block.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-8">{block.description}</p>
                <ul className="space-y-3">
                  {block.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-slate-700 text-sm">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className="lg:[direction:ltr]">{block.visual}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
