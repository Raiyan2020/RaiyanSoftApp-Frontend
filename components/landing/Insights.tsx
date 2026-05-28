'use client';
import { useEffect, useRef } from 'react';

const insights = [
  {
    title: 'كيف تحدد تكلفة تطبيقك قبل البدء؟',
    type: 'دليل عملي',
    body: 'العوامل التي تغيّر السعر: عدد الأدوار، التكاملات، لوحة التحكم، ومستوى التصميم المطلوب.',
  },
  {
    title: 'علامات أن موقعك لا يحوّل الزوار إلى عملاء',
    type: 'تحسين تحويل',
    body: 'رسالة غير واضحة، CTA ضعيف، بطء تحميل، أو نموذج طويل بلا طمأنة كافية.',
  },
  {
    title: 'متى تختار متجر جاهز ومتى تبني متجر مخصص؟',
    type: 'تجارة إلكترونية',
    body: 'القرار يعتمد على النموذج التجاري، التكاملات، الميزانية، وسرعة الوصول للسوق.',
  },
];

export default function Insights() {
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
    <section id="insights" className="relative overflow-hidden bg-white py-24 dark:bg-navy-950 lg:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-14 flex flex-col gap-6 text-center lg:flex-row lg:items-end lg:justify-between lg:text-right">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              المعرفة
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              محتوى يساعدك <span className="gradient-text">تقرر بثقة</span>
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0">
            طبقة SEO وسلطة محتوى شبيهة بمواقع الوكالات القوية: إجابات واضحة قبل التواصل.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {insights.map((item, i) => (
            <article
              key={item.title}
              className={`reveal spotlight-card group rounded-[2rem] border border-cyan-950/10 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[var(--shadow-glow)] dark:border-white/10 sm:p-8 ${
                i === 0
                  ? 'bg-slate-950 text-white lg:col-span-6 lg:row-span-2'
                  : 'bg-slate-50/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/8 lg:col-span-3'
              }`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{item.type}</span>
              <h3 className={`mt-6 font-bold leading-[1.36] transition-colors group-hover:text-primary ${i === 0 ? 'text-2xl text-white sm:text-3xl' : 'text-2xl text-slate-950 dark:text-white'}`}>{item.title}</h3>
              <p className={`mt-4 leading-relaxed ${i === 0 ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{item.body}</p>
              {i === 0 && (
                <div className="mt-10 grid grid-cols-2 gap-3">
                  {['تقدير نطاق', 'خفض مخاطر', 'وضوح قرار', 'خطة أولى'].map((label) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/7 p-4 text-sm font-bold text-slate-200">
                      {label}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-7 text-sm font-bold text-primary"
              >
                اسألنا عن هذا الموضوع
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
