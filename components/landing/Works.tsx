'use client';
import { useEffect, useRef } from 'react';

const works = [
  {
    id: 1,
    title: 'تطبيق رايان الصحي',
    category: 'تطبيق جوال',
    gradient: 'from-sky-500 to-indigo-500',
    desc: 'تجربة حجز ومتابعة صحية بواجهة عربية بسيطة وتنبيهات ذكية.',
    stats: ['+42% حجوزات', '3 شاشات رئيسية'],
  },
  {
    id: 2,
    title: 'متجر الموضة',
    category: 'متجر إلكتروني',
    gradient: 'from-rose-500 to-orange-400',
    desc: 'واجهة تسوق راقية مع تصنيفات واضحة، دفع سريع، وتجربة جوال محسنة.',
    stats: ['دفع مختصر', 'تصميم فاخر'],
  },
  {
    id: 3,
    title: 'منصة التعليم',
    category: 'منصة ويب',
    gradient: 'from-primary to-emerald-400',
    desc: 'لوحات تعلم تفاعلية تدعم الدروس المباشرة والملفات والمتابعة.',
    stats: ['لوحة طالب', 'محتوى مرن'],
  },
  {
    id: 4,
    title: 'هوية شركة النور',
    category: 'هوية بصرية',
    gradient: 'from-amber-400 to-yellow-600',
    desc: 'نظام بصري متكامل يرفع الثقة ويوحد حضور الشركة رقمياً ومطبوعاً.',
    stats: ['دليل هوية', 'مواد إطلاق'],
  },
  {
    id: 5,
    title: 'تطبيق توصيل الطلبات',
    category: 'تطبيق جوال',
    gradient: 'from-emerald-500 to-teal-500',
    desc: 'تتبع مباشر، إدارة طلبات، وتجربة طلب مختصرة للمستخدمين والسائقين.',
    stats: ['تتبع حي', 'إدارة فروع'],
  },
  {
    id: 6,
    title: 'منصة عقارية',
    category: 'موقع ويب',
    gradient: 'from-blue-600 to-cyan-500',
    desc: 'بحث عقاري سريع، صفحات وحدات مقنعة، وخرائط تساعد العميل يقرر أسرع.',
    stats: ['بحث ذكي', 'خرائط تفاعلية'],
  },
];

export default function Works() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="works" className="relative overflow-hidden bg-slate-50 py-16 dark:bg-navy-900 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="pointer-events-none absolute -right-32 top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-10 flex flex-col gap-4 text-center lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:text-right">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              معرض الأعمال
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              مشاريع تبدو حقيقية <span className="gradient-text">وتقنع بسرعة</span>
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">
            نعرض العمل كقصة نتائج، لا كصور متفرقة. كل بطاقة توضّح المجال، الحل، والقيمة المتوقعة.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {works.map((work, i) => (
            <article
              key={work.id}
              id={`work-${work.id}`}
              className="reveal group overflow-hidden rounded-[1.75rem] border border-cyan-950/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 lg:rounded-[2rem]"
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${work.gradient} p-4 sm:h-48 lg:h-56 lg:p-5`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(255,255,255,0.42),transparent_30%)]" />
                <div className="relative h-full rounded-3xl border border-white/30 bg-white/18 p-3 shadow-2xl backdrop-blur transition-transform duration-500 group-hover:scale-[1.03] sm:p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-white/22 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/25">{work.category}</span>
                    <span className="h-3 w-3 rounded-full bg-white/80" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 w-3/5 rounded-full bg-white/80" />
                    <div className="h-3 w-4/5 rounded-full bg-white/40" />
                    <div className="h-3 w-2/3 rounded-full bg-white/35" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2 sm:bottom-4 sm:left-4 sm:right-4">
                    <div className="h-10 rounded-2xl bg-white/75 sm:h-14 lg:h-16" />
                    <div className="h-10 rounded-2xl bg-white/45 sm:h-14 lg:h-16" />
                    <div className="h-10 rounded-2xl bg-white/60 sm:h-14 lg:h-16" />
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="mb-2 text-lg font-bold text-slate-950 transition-colors duration-300 group-hover:text-primary dark:text-white sm:text-xl">
                  {work.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:min-h-12">{work.desc}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {work.stats.map((stat) => (
                    <span key={stat} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                      {stat}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-800 transition-all duration-300 hover:gap-4 hover:text-primary dark:text-slate-200"
                >
                  ناقش مشروعاً مشابهاً
                  <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-8 rounded-[2rem] border border-cyan-950/10 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8 lg:mt-12">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">لديك فكرة وتريد تصوراً مشابهاً؟</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            نجهز لك تصوراً أولياً لمسار المنتج، أهم الشاشات، وخطة تنفيذ مناسبة للميزانية والوقت.
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="premium-button touch-lift mt-5 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1 sm:mt-6 sm:px-8 sm:py-4 sm:text-lg"
          >
            اطلب تصوراً لمشروعك
          </button>
        </div>
      </div>
    </section>
  );
}
