import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';

export default function DemoPlayer() {
  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">라이브 데모</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          직접 확인해보세요
        </h2>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
          아래 플레이어는 VideoFly API로 업로드·JIT 인코딩된 영상입니다.
          OCI CDN을 통해 HLS ABR로 스트리밍됩니다.
        </p>

        {/* Player mockup */}
        <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl aspect-video max-w-3xl mx-auto mb-10">
          {/* Fake video frame */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-slate-900" />

          {/* Center play button */}
          <button className="absolute inset-0 flex items-center justify-center group" aria-label="재생">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Play className="w-7 h-7 text-slate-900 fill-slate-900 ml-1" />
            </div>
          </button>

          {/* Demo label overlay */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <p className="text-xs font-semibold text-white">VideoFly 기능 소개 (90초)</p>
          </div>

          {/* Stream info */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <p className="text-xs text-white font-mono">HLS · 1080p · 0.8s latency</p>
          </div>

          {/* Player controls bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
            <div className="w-full h-1 bg-white/20 rounded-full mb-3 overflow-hidden">
              <div className="h-full w-1/3 bg-blue-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Play className="w-4 h-4 text-white fill-white" />
                <span className="text-xs text-white/80 font-mono">0:32 / 1:30</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60 font-mono">1080p</span>
                <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <p className="text-slate-600 mb-6">
          이 플레이어를 <strong className="text-slate-900">5분 만에</strong> 내 사이트에 추가할 수 있습니다.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          무료 계정 만들기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
