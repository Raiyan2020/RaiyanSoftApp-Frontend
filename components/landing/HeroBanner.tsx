'use client';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const HERO_VIDEO_ID = 'Z5c5-F3rApk';
const HERO_VIDEO_START = 2;

const proof = ['استشارة أولى مجانية', 'تصميم قبل البرمجة', 'تسليم مرحلي واضح'];

export default function HeroBanner() {
  const shouldReduceMotion = useReducedMotion();

  const parent: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.09, delayChildren: 0.08 },
        },
      };

  const item: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
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
            <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[540px] lg:max-w-[620px]">
              <div className="overflow-hidden rounded-2xl border border-white/15 shadow-lg shadow-black/25 sm:rounded-3xl">
                <div className="relative aspect-[16/10] w-full min-h-[220px] sm:min-h-[300px] lg:min-h-[360px]">
                  <iframe
                    src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?start=${HERO_VIDEO_START}&rel=0&modestbranding=1`}
                    title="ريان سوفت"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
