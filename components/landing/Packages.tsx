'use client';
import { useEffect, useRef } from 'react';

const packages = [
  {
    name: 'إطلاق سريع',
    bestFor: 'للمشاريع التي تحتاج حضوراً احترافياً بسرعة',
    features: ['صفحة تعريفية أو متجر بسيط', 'تصميم متجاوب', 'تهيئة SEO أساسية', 'نموذج تواصل وقياس'],
    cta: 'ابدأ بمرحلة أولى',
  },
  {
    name: 'منتج متكامل',
    bestFor: 'لتطبيق أو منصة تحتاج تجربة مستخدم ولوحة تحكم',
    features: ['تحليل وتجربة مستخدم', 'واجهات كاملة', 'تطوير وربط', 'اختبار وإطلاق مرحلي'],
    cta: 'ناقش المنتج',
    highlighted: true,
  },
  {
    name: 'نمو وتحسين',
    bestFor: 'لمنتج قائم يحتاج أداء أفضل وتحويل أعلى',
    features: ['مراجعة UX/UI', 'تحسين سرعة وSEO', 'تحسين CTAs', 'تقرير فرص النمو'],
    cta: 'اطلب تدقيقاً',
  },
];

export default function Packages() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="packages" className="relative overflow-hidden bg-slate-50 py-24 dark:bg-navy-900 lg:py-28">
      <div className="pointer-events-none absolute left-0 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="space-y-4 text-center lg:text-right">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              العروض
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              اختر نقطة البداية، <span className="gradient-text">ونصمم الطريق</span>
            </h2>
          </div>
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:text-right">
            لا نحتاج أن تبدأ بكل شيء. نحدد المرحلة الأعلى أثراً ونبني منها بثبات.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:items-stretch">
          {packages.map((item, i) => (
            <article
              key={item.name}
              className={`reveal rounded-[2rem] border p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 sm:p-8 ${
                item.highlighted
                  ? 'border-primary/30 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20 lg:-mt-6 lg:mb-6'
                  : 'border-cyan-950/10 bg-white text-slate-950 hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 dark:text-white'
              }`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {item.highlighted && (
                <span className="mb-5 inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                  الأكثر طلباً
                </span>
              )}
              <h3 className="text-2xl font-bold">{item.name}</h3>
              <p className={`mt-3 leading-relaxed ${item.highlighted ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{item.bestFor}</p>
              <ul className="mt-7 space-y-3">
                {item.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm font-semibold">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={`mt-8 w-full rounded-2xl px-5 py-3 font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                  item.highlighted
                    ? 'bg-gradient-to-l from-primary to-primary-dark text-white shadow-lg shadow-primary/25'
                    : 'border border-primary/25 text-primary hover:bg-primary/10'
                }`}
              >
                {item.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
