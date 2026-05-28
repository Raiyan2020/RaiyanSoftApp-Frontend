'use client';
import { useEffect, useRef } from 'react';

const partners = [
  { name: 'شركة الأفق للتقنية', emoji: '🏢', color: 'text-blue-500' },
  { name: 'مجموعة النور التجارية', emoji: '💡', color: 'text-amber-500' },
  { name: 'رواد للاستشارات', emoji: '🎯', color: 'text-green-500' },
  { name: 'البنيان العقاري', emoji: '🏗️', color: 'text-purple-500' },
  { name: 'مؤسسة الإبداع', emoji: '✨', color: 'text-pink-500' },
  { name: 'شركة المستقبل', emoji: '🚀', color: 'text-cyan-500' },
  { name: 'دار الحلول', emoji: '🔧', color: 'text-orange-500' },
  { name: 'الريادة للتجارة', emoji: '📈', color: 'text-indigo-500' },
];

export default function Partners() {
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
    <section id="partners" className="py-24 bg-white dark:bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent dark:from-primary/5 pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Heading */}
        <div className="reveal text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            شركاؤنا
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            يثقون <span className="gradient-text">بنا</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            شركاء نجاح تربطنا بهم علاقات مبنية على الثقة والإنجاز
          </p>
        </div>

        {/* Partners grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner, i) => (
            <div
              key={partner.name}
              id={`partner-${i + 1}`}
              className="reveal group bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-400 cursor-default"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div className={`text-4xl mb-3 group-hover:scale-125 transition-transform duration-300`}>
                {partner.emoji}
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors duration-300 leading-snug">
                {partner.name}
              </p>
            </div>
          ))}
        </div>

        {/* Marquee strip */}
        <div className="reveal mt-16 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="flex gap-8 animate-[marquee_20s_linear_infinite]">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <span className="text-xl">{p.emoji}</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
