import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
