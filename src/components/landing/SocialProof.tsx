'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 5, suffix: '분 이내', label: '첫 동영상 재생', description: '업로드부터 HLS 스트리밍까지' },
  { value: 99.9, suffix: '%', label: '서비스 업타임', description: 'OCI 다중 리전 이중화' },
  { value: 1, suffix: '억+ 분', label: '월간 재생 시간', description: '확장 가능한 동영상 팜' },
];

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(target % 1 === 0 ? 0 : 1)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target, duration]);

  return count;
}

function StatCard({ value, suffix, label, description, started }: {
  value: number;
  suffix: string;
  label: string;
  description: string;
  started: boolean;
}) {
  const count = useCountUp(value, 1400, started);

  return (
    <div className="text-center px-8 py-2">
      <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tabular-nums">
        {count}
        <span className="text-blue-600">{suffix}</span>
      </div>
      <div className="mt-2 text-base font-semibold text-slate-700">{label}</div>
      <div className="mt-1 text-sm text-slate-500">{description}</div>
    </div>
  );
}

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
