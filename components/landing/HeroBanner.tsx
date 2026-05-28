'use client';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const stats = [
  ['50+', 'مشروع منجز'],
  ['30+', 'شريك نمو'],
  ['5+', 'سنوات خبرة'],
];

const capabilities = [
  { image: '/landing-icons/mobile-app.svg', label: 'تطبيقات' },
  { image: '/landing-icons/ecommerce.svg', label: 'متاجر' },
  { image: '/landing-icons/business-platform.svg', label: 'منصات' },
];

const proof = ['استشارة أولى مجانية', 'تصميم قبل البرمجة', 'تسليم مرحلي واضح'];

export default function HeroBanner() {
  const shouldReduceMotion = useReducedMotion();

  const parent = shouldReduceMotion
    ? {}
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.09, delayChildren: 0.08 },
        },
      };

  const item = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const float = shouldReduceMotion
    ? {}
    : {
        y: [0, -12, 0],
        transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
      };

  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden bg-[#06111f] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(18,169,217,0.28),transparent_32%),radial-gradient(circle_at_18%_58%,rgba(33,211,162,0.16),transparent_34%),linear-gradient(135deg,#020617_0%,#071827_52%,#06111f_100%)]" />
      <div className="premium-grid absolute inset-0 opacity-35" />
      <div className="noise-bg opacity-[0.06]" />
      <motion.div
        aria-hidden
        className="absolute left-[14%] top-[18%] h-72 w-72 rounded-full border border-primary/20"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[8%] right-[10%] h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8 lg:pb-20 lg:pt-32"
        variants={parent}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div variants={item} className="order-2 text-center lg:order-1 lg:text-right">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-cyan-200 shadow-2xl shadow-primary/10 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[var(--mint)] shadow-[0_0_18px_rgba(33,211,162,0.9)]" />
              وكالة تقنية تبني منتجات رقمية لا تُنسى
            </div>

            <h1 className="mx-auto max-w-4xl text-[1.75rem] font-black leading-[1.34] tracking-[-0.015em] text-white sm:text-[2.25rem] lg:mx-0 lg:text-[2.55rem] xl:text-[2.95rem]">
              اصنع حضوراً رقمياً
              <span className="mt-2 block bg-gradient-to-l from-cyan-200 via-primary to-emerald-300 bg-clip-text text-transparent">
                يوقف التمرير
              </span>
              ويحوّل الفضول إلى طلبات.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:mt-7 sm:text-lg sm:leading-9 lg:mx-0">
              نأخذ فكرتك من أول ملامحها إلى واجهة مصقولة، تجربة استخدام واضحة، ومنتج جاهز للإطلاق بثقة.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 lg:justify-start">
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3.5 text-base font-black text-white shadow-2xl shadow-primary/30 transition-all duration-300 hover:-translate-y-1 sm:px-8 sm:py-4 sm:text-lg"
              >
                احجز استشارة مجانية
              </button>
              <button
                onClick={() => document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' })}
                className="touch-lift rounded-2xl border border-white/15 bg-white/8 px-6 py-3.5 text-base font-black text-cyan-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 sm:px-8 sm:py-4 sm:text-lg"
              >
                شاهد الأعمال
              </button>
            </div>

            <motion.div variants={parent} className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 lg:justify-start">
              {proof.map((label) => (
                <motion.span key={label} variants={item} className="rounded-full border border-white/10 bg-white/7 px-4 py-2 text-xs font-bold text-slate-200 backdrop-blur">
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="order-1 lg:order-2">
            <div className="relative mx-auto min-h-[390px] w-full max-w-[560px] sm:min-h-[460px]">
              <motion.div
                aria-hidden
                className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/35 via-emerald-300/15 to-transparent blur-3xl"
                animate={shouldReduceMotion ? undefined : { opacity: [0.55, 0.9, 0.55] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full border border-primary/25"
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-10 rounded-full border border-dashed border-cyan-300/20"
                animate={shouldReduceMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
              />

              <motion.div
                animate={float}
                className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2.2rem] border border-white/15 bg-white/10 shadow-2xl shadow-primary/25 backdrop-blur-2xl sm:h-44 sm:w-44"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-primary shadow-2xl shadow-primary/45 sm:h-28 sm:w-28">
                  <Image src="/logo.webp" alt="رايان سوفت" fill className="object-cover" priority />
                </div>
              </motion.div>

              {capabilities.map((capability, index) => {
                const positions = [
                  'right-3 top-12 sm:right-8 sm:top-14',
                  'left-3 top-28 sm:left-8 sm:top-36',
                  'bottom-10 right-16 sm:bottom-14 sm:right-24',
                ];

                return (
                  <motion.div
                    key={capability.label}
                    className={`absolute ${positions[index]} flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/65 px-4 py-3 shadow-2xl backdrop-blur-2xl`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: [0, index % 2 ? 10 : -10, 0], scale: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.35 + index * 0.12, duration: index === 0 ? 4.6 : 5.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                  >
                    <div className="relative h-10 w-10">
                      <Image src={capability.image} alt="" fill className="object-contain" sizes="40px" />
                    </div>
                    <p className="text-sm font-black text-white">{capability.label}</p>
                  </motion.div>
                );
              })}

              <motion.div
                className="absolute bottom-4 left-4 right-4 rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-2xl sm:left-8 sm:right-8"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-black text-white">مسار الإطلاق</p>
                  <p className="text-xs font-bold text-primary">4 مراحل</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['اكتشاف', 'تصميم', 'بناء', 'إطلاق'].map((step, index) => (
                    <div key={step}>
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-l from-primary to-emerald-300"
                        initial={shouldReduceMotion ? false : { scaleX: 0 }}
                        animate={shouldReduceMotion ? undefined : { scaleX: 1 }}
                        transition={{ delay: 0.9 + index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: 'right' }}
                      />
                      <p className="mt-2 text-center text-[0.68rem] font-bold text-slate-400">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="absolute left-4 top-4 hidden rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl sm:block"
                animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-xs font-bold text-slate-300">نتائج موثقة</p>
                <p className="mt-1 text-2xl font-black text-primary">+50</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
