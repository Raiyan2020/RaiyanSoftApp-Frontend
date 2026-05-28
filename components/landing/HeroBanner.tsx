'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const workIcons = [
  { icon: '📱', label: 'تطبيق الصحة' },
  { icon: '🛒', label: 'متجر إلكتروني' },
  { icon: '🏠', label: 'منصة عقارات' },
  { icon: '💳', label: 'تطبيق مالي' },
  { icon: '🎓', label: 'منصة تعليمية' },
  { icon: '🍕', label: 'تطبيق طلبات' },
];

export default function HeroBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTimeout(() => el.classList.add('visible'), 100);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/30 dark:from-navy-950 dark:via-navy-900 dark:to-slate-900"
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="noise-bg" />

      <div ref={ref} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Right side — Text */}
          <div className="order-2 lg:order-1 text-center lg:text-right space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              وكالة تقنية متكاملة
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
              نبني{' '}
              <span className="gradient-text">مستقبلك الرقمي</span>
              {' '}بإبداع وتقنية
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              رايان سوفت — شركة تقنية متخصصة في تطوير تطبيقات الجوال، المواقع الإلكترونية، المتاجر الرقمية، وتصميم الهوية البصرية. نحوّل أفكارك إلى منتجات رقمية احترافية تُحدث فارقاً حقيقياً.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-primary/40 hover:-translate-y-1"
              >
                ابدأ مشروعك الآن
              </button>
              <button
                onClick={() => document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl border-2 border-primary/30 hover:border-primary text-primary font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary/5"
              >
                استعرض أعمالنا
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              {[['50+', 'مشروع منجز'], ['30+', 'عميل سعيد'], ['5+', 'سنوات خبرة']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-bold gradient-text">{num}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Left side — Work icons grid */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-6">
            <div className="relative">
              {/* Central logo */}
              <div className="relative w-32 h-32 mx-auto mb-6 animate-float">
                <div className="w-full h-full rounded-3xl bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center overflow-hidden">
                  <Image src="/logo.webp" alt="رايان سوفت" width={80} height={80} className="object-contain" />
                </div>
                <div className="absolute inset-0 rounded-3xl ring-2 ring-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
              </div>

              {/* Works grid */}
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                {workIcons.map((item, i) => (
                  <div
                    key={item.label}
                    className="group relative bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 text-center shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 cursor-default"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">{item.label}</p>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>

              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full border border-dashed border-primary/20 animate-spin pointer-events-none" style={{ animationDuration: '20s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
        <span className="text-xs">تمرير للأسفل</span>
        <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
          <div className="w-1 h-3 bg-current rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
