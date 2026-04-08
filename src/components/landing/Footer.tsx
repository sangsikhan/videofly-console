import Link from 'next/link';
import { Play } from 'lucide-react';

const links = {
  제품: [
    { label: '기능', href: '/features' },
    { label: '요금제', href: '/pricing' },
    { label: '사용 사례', href: '/use-cases' },
    { label: '변경 이력', href: '/changelog' },
  ],
  개발자: [
    { label: '문서', href: 'https://docs.videofly.co.kr' },
    { label: 'API 레퍼런스', href: 'https://docs.videofly.co.kr/api' },
    { label: 'SDK', href: 'https://docs.videofly.co.kr/sdk' },
    { label: '상태 페이지', href: 'https://status.videofly.co.kr' },
  ],
  회사: [
    { label: '소개', href: '/about' },
    { label: '블로그', href: '/blog' },
    { label: '채용', href: '/careers' },
    { label: '문의하기', href: 'mailto:support@videofly.co.kr' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-white">VideoFly</span>
            </Link>
            <p className="text-sm leading-relaxed">
              OCI 기반 JIT 동영상 플랫폼.
              <br />
              API 한 줄로 VOD·라이브·분석을 시작하세요.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          {/* Business info */}
          <div className="text-xs leading-relaxed mb-6 space-y-1">
            <p>
              <span className="text-slate-500">상호:</span> (주)M2Live&nbsp;&nbsp;
              <span className="text-slate-500">대표:</span> OOO&nbsp;&nbsp;
              <span className="text-slate-500">사업자등록번호:</span> XXX-XX-XXXXX
            </p>
            <p>
              <span className="text-slate-500">통신판매업신고:</span> 제 XXXX호&nbsp;&nbsp;
              <span className="text-slate-500">주소:</span> 서울특별시 ...
            </p>
            <p>
              <span className="text-slate-500">고객센터:</span>&nbsp;
              <a href="mailto:support@videofly.co.kr" className="hover:text-white transition-colors">
                support@videofly.co.kr
              </a>
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-xs">© 2024 VideoFly. All rights reserved.</p>
            <div className="flex gap-6 text-xs">
              <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
              <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
