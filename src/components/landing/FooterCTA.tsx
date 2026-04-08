import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export default function FooterCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          지금 바로 VideoFly를 시작해보세요
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          신용카드 없이 5분 만에 첫 동영상을 재생하세요.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg"
        >
          무료로 시작하기
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-200">
          <Shield className="w-4 h-4" />
          신용카드 불필요 · 언제든 해지 가능 · Free 플랜 영구 무료
        </div>
      </div>
    </section>
  );
}
