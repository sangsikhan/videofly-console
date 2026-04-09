import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VideoFly — 동영상 호스팅·스트리밍 API 플랫폼',
  description:
    'OCI 기반 JIT 트랜스코딩 동영상 플랫폼. 업로드, 인코딩, HLS 스트리밍, 라이브 방송, 분석까지. 무료로 시작하세요.',
  openGraph: {
    title: 'VideoFly — 동영상 호스팅·스트리밍 API 플랫폼',
    description: 'API 한 줄로 VOD·라이브·분석을 시작하세요. 신용카드 불필요.',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
