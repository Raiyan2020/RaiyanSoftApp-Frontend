'use client';
import { useEffect, useRef } from 'react';

const works = [
  { id: 1, title: 'تطبيق رايان الصحي', category: 'تطبيق جوال', emoji: '🏥', gradient: 'from-violet-500 to-purple-600', desc: 'تطبيق لإدارة المواعيد الطبية وتتبع الصحة' },
  { id: 2, title: 'متجر الموضة', category: 'متجر إلكتروني', emoji: '👗', gradient: 'from-pink-500 to-rose-600', desc: 'منصة تسوق متكاملة مع بوابات دفع محلية' },
  { id: 3, title: 'منصة التعليم', category: 'موقع ويب', emoji: '📚', gradient: 'from-primary to-cyan-500', desc: 'منصة تعليمية تفاعلية تدعم الفيديو المباشر' },
  { id: 4, title: 'هوية شركة النور', category: 'هوية بصرية', emoji: '✨', gradient: 'from-amber-500 to-orange-600', desc: 'هوية بصرية احترافية متكاملة بأسلوب عصري' },
  { id: 5, title: 'تطبيق توصيل الطلبات', category: 'تطبيق جوال', emoji: '🛵', gradient: 'from-emerald-500 to-teal-600', desc: 'تطبيق توصيل سريع مع تتبع لحظي' },
  { id: 6, title: 'موقع الشركة العقارية', category: 'موقع ويب', emoji: '🏢', gradient: 'from-indigo-500 to-blue-600', desc: 'موقع عقاري متكامل مع خرائط تفاعلية' },
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
    <section id="works" className="py-24 bg-slate-50 dark:bg-navy-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="reveal text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            معرض الأعمال
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            أعمالنا <span className="gradient-text">السابقة</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            نماذج من مشاريعنا الناجحة التي أحدثت فارقاً حقيقياً لعملائنا
          </p>
        </div>

        {/* Works grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work, i) => (
            <div
              key={work.id}
              id={`work-${work.id}`}
              className="reveal group relative bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* Preview area */}
              <div className={`relative h-48 bg-gradient-to-br ${work.gradient} flex items-center justify-center overflow-hidden`}>
                <div className="text-7xl group-hover:scale-125 transition-transform duration-500">{work.emoji}</div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                {/* Category badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                  {work.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {work.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{work.desc}</p>

                <div className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>عرض التفاصيل</span>
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal text-center mt-12">
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl border-2 border-primary/30 hover:border-primary text-primary font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary/5"
          >
            شاهد جميع الأعمال
          </button>
        </div>
      </div>
    </section>
  );
}
