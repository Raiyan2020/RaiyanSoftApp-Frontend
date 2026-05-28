'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const works = [
  {
    id: 1,
    title: 'تطبيق رايان الصحي',
    category: 'تطبيق جوال',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    desc: 'تجربة حجز ومتابعة صحية بواجهة عربية بسيطة وتنبيهات ذكية.',
    stats: ['+42% حجوزات', '3 شاشات رئيسية'],
  },
  {
    id: 2,
    title: 'متجر الموضة',
    category: 'متجر إلكتروني',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    desc: 'واجهة تسوق راقية مع تصنيفات واضحة، دفع سريع، وتجربة جوال محسنة.',
    stats: ['دفع مختصر', 'تصميم فاخر'],
  },
  {
    id: 3,
    title: 'منصة التعليم',
    category: 'منصة ويب',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    desc: 'لوحات تعلم تفاعلية تدعم الدروس المباشرة والملفات والمتابعة.',
    stats: ['لوحة طالب', 'محتوى مرن'],
  },
  {
    id: 4,
    title: 'هوية شركة النور',
    category: 'هوية بصرية',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=600&q=80',
    desc: 'نظام بصري متكامل يرفع الثقة ويوحد حضور الشركة رقمياً ومطبوعاً.',
    stats: ['دليل هوية', 'مواد إطلاق'],
  },
  {
    id: 5,
    title: 'تطبيق توصيل الطلبات',
    category: 'تطبيق جوال',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
    desc: 'تتبع مباشر، إدارة طلبات، وتجربة طلب مختصرة للمستخدمين والسائقين.',
    stats: ['تتبع حي', 'إدارة فروع'],
  },
  {
    id: 6,
    title: 'منصة عقارية',
    category: 'موقع ويب',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
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
              <div className="relative h-44 overflow-hidden sm:h-52 lg:h-60">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <span className="absolute right-4 top-4 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur ring-1 ring-white/10">
                  {work.category}
                </span>
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
