'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: '무료 플랜은 영구적으로 무료인가요?',
    answer:
      '네. Free 플랜은 신용카드 등록 없이 영구적으로 사용할 수 있습니다. 월 재생 500분, 저장 5GB 한도 내에서 비용이 발생하지 않습니다.',
  },
  {
    question: '한도를 초과하면 어떻게 되나요?',
    answer:
      'Free 플랜은 한도 도달 시 새 업로드·재생이 제한됩니다. 초과 사용 또는 플랜 업그레이드 중 선택할 수 있습니다. 80% 도달 시 미리 알림을 드립니다.',
  },
  {
    question: 'API로 직접 연동할 수 있나요?',
    answer:
      '네. REST API와 함께 JavaScript, Python, Go SDK를 제공합니다. API 키는 콘솔 → 설정 → API 메뉴에서 즉시 발급할 수 있습니다.',
  },
  {
    question: '직접 인코딩 서버가 필요한가요?',
    answer:
      '아니요. VideoFly의 OCI 기반 JIT 트랜스코딩 엔진이 모든 인코딩을 자동으로 처리합니다. 별도 서버나 FFmpeg 설정이 필요하지 않습니다.',
  },
  {
    question: '동영상은 어디에 저장되나요?',
    answer:
      '동영상 원본과 프로파일 에셋은 OCI Object Storage(기본 리전: ap-seoul-1)에 저장되며, OCI CDN을 통해 전 세계 엣지에서 빠르게 전송됩니다.',
  },
  {
    question: '계약·약정 기간이 있나요?',
    answer:
      '없습니다. 월 단위로 청구되며 언제든 해지할 수 있습니다. 연간 플랜 선택 시 20% 할인이 적용됩니다.',
  },
  {
    question: '라이브 스트리밍은 어떤 소프트웨어와 호환되나요?',
    answer:
      'RTMP · SRT 프로토콜을 지원하는 모든 소프트웨어와 호환됩니다. OBS Studio, vMix, Wirecast, XSplit 등을 바로 연결할 수 있습니다.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">자주 묻는 질문</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-slate-900 pr-4 text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
