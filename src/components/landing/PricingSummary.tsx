'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: '개인 프로젝트 및 테스트',
    cta: '무료로 시작',
    ctaHref: '/signup',
    ctaStyle: 'border border-slate-200 hover:bg-slate-50 text-slate-700',
    note: '신용카드 불필요',
    popular: false,
    features: [
      '재생 500분 / 월',
      '저장 5 GB',
      '라이브 스트리밍 ✕',
      '멤버 1명',
      'API 접근',
      '기본 분석',
    ],
  },
  {
    name: 'Starter',
    monthlyPrice: 29000,
    yearlyPrice: 23200,
    description: '성장하는 팀과 소규모 서비스',
    cta: '14일 무료 체험',
    ctaHref: '/signup?plan=starter',
    ctaStyle: 'border border-slate-200 hover:bg-slate-50 text-slate-700',
    note: '체험 후 자동 결제',
    popular: false,
    features: [
      '재생 2,000분 / 월',
      '저장 20 GB',
      '라이브 2시간 / 월',
      '멤버 5명',
      'API 접근',
      '고급 분석',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 99000,
    yearlyPrice: 79200,
    description: '본격 서비스를 위한 올인원 플랜',
    cta: '14일 무료 체험',
    ctaHref: '/signup?plan=pro',
    ctaStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
    note: '체험 후 자동 결제',
    popular: true,
    features: [
      '재생 10,000분 / 월',
      '저장 50 GB',
      '라이브 10시간 / 월',
      '멤버 20명',
      'API 접근 + 웹훅',
      '실시간 분석 + CSV',
    ],
  },
];

export default function PricingSummary() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">요금제</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            필요한 만큼만 사용하세요
          </h2>
          <p className="text-lg text-slate-600">무료로 시작하고 서비스가 성장하면 업그레이드하세요.</p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!yearly ? 'text-slate-900' : 'text-slate-400'}`}>월간</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? 'bg-blue-600' : 'bg-slate-200'}`}
              aria-label="연간 결제 전환"
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  yearly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${yearly ? 'text-slate-900' : 'text-slate-400'}`}>연간</span>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                20% 할인
              </span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.popular
                  ? 'shadow-xl border-2 border-blue-500 ring-4 ring-blue-100'
                  : 'shadow-sm border border-slate-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    ⭐ 인기
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.monthlyPrice === 0 ? (
                  <div>
                    <span className="text-4xl font-extrabold text-slate-900">₩0</span>
                    <span className="text-slate-400 ml-1 text-sm">/ 월</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-extrabold text-slate-900">
                      ₩{(yearly ? plan.yearlyPrice : plan.monthlyPrice).toLocaleString()}
                    </span>
                    <span className="text-slate-400 ml-1 text-sm">/ 월</span>
                    {yearly && (
                      <p className="text-xs text-emerald-600 mt-1">
                        연 ₩{(plan.yearlyPrice * 12).toLocaleString()} 청구
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Link
                href={plan.ctaHref}
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors mb-6 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
              {plan.note && (
                <p className="text-xs text-slate-400 text-center -mt-4 mb-6">{plan.note}</p>
              )}

              <ul className="space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            자세한 요금제 비교
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
