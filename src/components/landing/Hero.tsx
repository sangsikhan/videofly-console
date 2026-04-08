import Link from 'next/link';
import { ArrowRight, Play, Zap, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">JIT 트랜스코딩 · OCI 기반 동영상 팜</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              동영상 인프라 없이도
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                VOD·라이브를
              </span>
              <br />
              즉시 서비스하세요
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
              API 한 줄로 업로드, JIT 인코딩, HLS 스트리밍, 분석까지.
              <br />
              VideoFly가 OCI 기반 동영상 팜에서 모두 처리합니다.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-base"
              >
                무료로 시작하기
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors border border-white/20 text-base"
              >
                <Play className="w-4 h-4 fill-white" />
                데모 보기
              </Link>
            </div>

            {/* Trust */}
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4 text-green-400" />
              신용카드 불필요 · Free 플랜 영구 무료 · 5분 만에 시작
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            {/* Mock console UI */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/60 border-b border-slate-700/60">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-slate-500 font-mono">console.videofly.co.kr</span>
                </div>
              </div>

              {/* Console content */}
              <div className="p-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: '이번 달 재생', value: '12,500회', delta: '+18%' },
                    { label: '저장 용량', value: '20.4 GB', delta: '/ 50 GB' },
                    { label: '활성 라이브', value: '2개', delta: '진행중' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-700/50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-sm font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-emerald-400">{stat.delta}</p>
                    </div>
                  ))}
                </div>

                {/* Video list */}
                <div className="space-y-2">
                  {[
                    { id: 'vid_01HXYZ', title: '제품 소개 영상.mp4', status: 'ready', time: '3시간 전' },
                    { id: 'vid_01HABC', title: '튜토리얼 01.mp4', status: 'ready', time: '1일 전' },
                    { id: 'vid_01HDEF', title: '고객 사례 인터뷰.mp4', status: 'warming_up', time: '방금' },
                  ].map((v) => (
                    <div key={v.id} className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2.5">
                      <div className="w-10 h-6 bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
                        <Play className="w-3 h-3 text-slate-300 fill-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate">{v.title}</p>
                        <p className="text-xs text-slate-500">{v.id}…</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                          v.status === 'ready'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {v.status === 'ready' ? '준비됨' : 'JIT 준비중'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* JIT status bar */}
                <div className="mt-4 bg-slate-900/60 rounded-lg px-3 py-2.5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-400">JIT 처리 중: 3개 · 대기: 7개 · 오늘 완료: 124개</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">첫 재생까지</p>
                <p className="text-lg font-extrabold text-emerald-600 leading-none">3초 이내</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
