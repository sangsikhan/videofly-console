import Link from 'next/link';
import { Video, Radio, BarChart3, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Video,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'VOD 스트리밍',
    description:
      'JIT 트랜스코딩으로 업로드 즉시 HLS ABR 스트리밍. 360p~4K, HDR 지원. OCI CDN을 통한 글로벌 엣지 전송.',
    href: '/features#vod',
    highlights: ['JIT 트랜스코딩', 'HLS · DASH ABR', '4K · HDR 지원'],
  },
  {
    icon: Radio,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: '라이브 스트리밍',
    description:
      'RTMP/SRT 입력으로 1분 안에 방송 시작. 저지연 3~5초 LL-HLS, 방송 종료 후 자동 VOD 저장.',
    href: '/features#live',
    highlights: ['RTMP · SRT 입력', 'LL-HLS 저지연', '자동 VOD 저장'],
  },
  {
    icon: BarChart3,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    title: '실시간 분석',
    description:
      'Kafka → Flink → ClickHouse 분석 파이프라인. 재생 품질, 시청자 행동, 버퍼링 현황을 실시간으로 파악.',
    href: '/features#analytics',
    highlights: ['실시간 대시보드', '재생 품질 모니터링', 'CSV · API 내보내기'],
  },
];

export default function CoreFeatures() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">핵심 기능</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            동영상 서비스에 필요한 모든 것
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            인프라 구축 없이 API 하나로 VOD, 라이브, 분석을 모두 사용하세요.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className={`w-12 h-12 ${feat.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{feat.description}</p>

                <ul className="space-y-2 mb-8 flex-1">
                  {feat.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                <Link
                  href={feat.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-auto"
                >
                  더 알아보기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
