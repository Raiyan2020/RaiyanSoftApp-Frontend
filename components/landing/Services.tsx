'use client';
import { useEffect, useRef } from 'react';

const services = [
  {
    id: 'mobile',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'تطبيقات الجوال',
    description: 'نطوّر تطبيقات iOS و Android عالية الأداء بتجربة مستخدم استثنائية تُقنع جمهورك من اللحظة الأولى.',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-100 dark:border-violet-800/30',
    iconBg: 'bg-violet-500',
    features: ['iOS & Android', 'Flutter & React Native', 'UI/UX محترف'],
  },
  {
    id: 'web',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'برمجة المواقع',
    description: 'مواقع ويب سريعة وآمنة ومتوافقة مع محركات البحث، مبنية بأحدث التقنيات لضمان حضور رقمي قوي.',
    gradient: 'from-primary to-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'border-cyan-100 dark:border-cyan-800/30',
    iconBg: 'bg-primary',
    features: ['Next.js & React', 'تحسين SEO', 'سرعة فائقة'],
  },
  {
    id: 'ecommerce',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'المتاجر الإلكترونية',
    description: 'نبني متاجر إلكترونية احترافية متكاملة مع بوابات الدفع وإدارة المخزون لتحقيق أقصى مبيعاتك.',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-100 dark:border-emerald-800/30',
    iconBg: 'bg-emerald-500',
    features: ['بوابات دفع متعددة', 'لوحة تحكم متطورة', 'تصميم احترافي'],
  },
  {
    id: 'identity',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'تصميم الهوية البصرية',
    description: 'نصمم هويات بصرية متكاملة تعكس قيم علامتك التجارية وتُميّزها في السوق بأسلوب احترافي وإبداعي.',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-100 dark:border-rose-800/30',
    iconBg: 'bg-rose-500',
    features: ['شعار احترافي', 'هوية متكاملة', 'مواد تسويقية'],
  },
];

export default function Services() {
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
    <section id="services" className="py-24 bg-white dark:bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white dark:from-navy-900/50 dark:to-navy-950 pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Heading */}
        <div className="reveal text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            خدماتنا
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            ماذا نقدم <span className="gradient-text">لك؟</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            حلول تقنية متكاملة تُغطي كافة احتياجاتك الرقمية من الفكرة حتى الإطلاق
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <div
              key={service.id}
              id={`service-${service.id}`}
              className={`reveal group relative ${service.bg} ${service.border} border rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{service.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white/60 dark:bg-white/5 border border-current/10 text-slate-600 dark:text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover:gap-4 transition-all duration-300`}>
                  اعرف أكثر
                  <svg className="w-4 h-4 rotate-180" style={{ stroke: 'currentColor' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
