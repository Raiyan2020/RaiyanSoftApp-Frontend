'use client';
import { useEffect, useRef } from 'react';

const services = [
  {
    id: 'mobile',
    title: 'تطبيقات الجوال',
    eyebrow: 'iOS و Android',
    description: 'نصمم ونطور تطبيقات مستقرة وسريعة بواجهات عربية أنيقة، رحلة استخدام واضحة، وتجربة إطلاق قابلة للتوسع.',
    outcome: 'تطبيق جاهز للنشر مع لوحة تحكم وخطة تحسين بعد الإطلاق.',
    gradient: 'from-sky-500 to-cyan-500',
    points: ['تصميم UX/UI', 'تطوير Flutter أو React Native', 'اختبارات وتجهيز المتاجر'],
    metric: '4-8 أسابيع',
  },
  {
    id: 'web',
    title: 'المواقع والمنصات',
    eyebrow: 'Next.js و SEO',
    description: 'نبني مواقع تعريفية ومنصات أعمال سريعة، واضحة، ومتوافقة مع محركات البحث حتى تتحول الزيارة إلى تواصل فعلي.',
    outcome: 'موقع سريع، قابل للإدارة، ومهيأ للظهور والقياس.',
    gradient: 'from-primary to-emerald-400',
    points: ['أداء عال', 'هيكل SEO', 'تصميم متجاوب بالكامل'],
    metric: '95+ أداء',
  },
  {
    id: 'ecommerce',
    title: 'المتاجر الإلكترونية',
    eyebrow: 'مبيعات ومدفوعات',
    description: 'نجهز تجربة شراء متكاملة من عرض المنتج حتى الدفع، مع صفحات مقنعة وسلة سلسة وربط مناسب لاحتياجك.',
    outcome: 'متجر مصمم للبيع لا للعرض فقط، مع مسارات شراء مختصرة.',
    gradient: 'from-emerald-500 to-teal-500',
    points: ['كتالوج منتجات', 'بوابات دفع وشحن', 'تقارير ومخزون'],
    metric: 'جاهز للبيع',
  },
  {
    id: 'identity',
    title: 'الهوية البصرية',
    eyebrow: 'Brand System',
    description: 'نصنع هوية متماسكة تعطي مشروعك حضوراً احترافياً من الشعار والألوان إلى واجهات المنتج والمواد التسويقية.',
    outcome: 'نظام بصري قابل للتطبيق على الموقع، التطبيق، والحملات.',
    gradient: 'from-amber-400 to-orange-500',
    points: ['شعار وألوان', 'دليل استخدام', 'مواد إطلاق'],
    metric: 'هوية موحدة',
  },
];

const process = [
  ['01', 'اكتشاف', 'نفهم الهدف والجمهور ونحدد الأولويات.'],
  ['02', 'تصميم', 'نرسم التجربة والواجهات قبل البرمجة.'],
  ['03', 'تنفيذ', 'نبني المنتج على مراحل واضحة ومراجعات دورية.'],
  ['04', 'إطلاق', 'نختبر، ننشر، ونقيس التحسينات التالية.'],
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="relative overflow-hidden bg-white py-16 dark:bg-navy-950 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(18,169,217,0.12),transparent_34%),linear-gradient(to_bottom,#ffffff,rgba(247,251,253,0.82))] dark:bg-[radial-gradient(circle_at_top_right,rgba(18,169,217,0.12),transparent_32%),linear-gradient(to_bottom,#020617,#071827)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-10 grid gap-4 lg:mb-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="space-y-4 text-center lg:text-right">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              خدماتنا
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              حلول رقمية <span className="gradient-text">تُبنى للنمو</span> لا للعرض فقط
            </h2>
          </div>
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0 lg:text-right">
            كل خدمة لدينا تبدأ من سؤال واحد: كيف نجعل المنتج أوضح، أسرع، وأكثر قدرة على تحويل الزوار إلى عملاء؟
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {services.map((service, i) => (
            <article
              key={service.id}
              id={`service-${service.id}`}
              className="reveal group relative overflow-hidden rounded-[1.75rem] border border-cyan-950/10 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 sm:p-7 lg:rounded-[2rem] lg:p-8"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className={`absolute -left-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${service.gradient} opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-25`} />
              <div className="relative z-10 flex h-full flex-col gap-4 sm:gap-6 lg:gap-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-3 text-sm font-bold text-primary">{service.eyebrow}</p>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">{service.title}</h3>
                  </div>
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${service.gradient} text-xs font-black text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16 sm:text-sm`}>
                    {service.metric}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">{service.description}</p>

                <div className="hidden rounded-3xl border border-cyan-950/10 bg-slate-50/80 p-4 text-sm font-semibold leading-relaxed text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:block">
                  {service.outcome}
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  {service.points.map((point) => (
                    <span key={point} className="rounded-full border border-cyan-950/10 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* <div className="reveal mt-8 rounded-[2rem] border border-cyan-950/10 bg-slate-950 p-4 text-white shadow-2xl shadow-cyan-950/10 dark:border-white/10 lg:mt-10">
          <div className="grid gap-3 md:grid-cols-4">
            {process.map(([num, title, desc]) => (
              <div key={num} className="rounded-3xl border border-white/10 bg-white/7 p-4 sm:p-5">
                <p className="mb-2 text-sm font-black text-primary sm:mb-4">{num}</p>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="hidden text-sm leading-relaxed text-slate-300 sm:block">{desc}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
