'use client';
import { motion, useReducedMotion } from 'framer-motion';

const sectors = [
  { title: 'التجارة الإلكترونية', body: 'صفحات منتجات، دفع، شحن، وتحويل أعلى.' },
  { title: 'الخدمات والحجوزات', body: 'رحلات حجز ولوحات متابعة أخف تشغيلياً.' },
  { title: 'التعليم والمنصات', body: 'تعلم ومحتوى ولوحات مستخدمين عربية.' },
  { title: 'العقار والمزادات', body: 'بحث، خرائط، وصفحات وحدات تقود للتواصل.' },
  { title: 'المطاعم والتوصيل', body: 'طلب سريع، فروع، تتبع، وقوائم جوال.' },
  { title: 'العلامات الناشئة', body: 'هوية وموقع إطلاق وحضور متناسق.' },
];

export default function Sectors() {
  const shouldReduceMotion = useReducedMotion();
  const container = shouldReduceMotion
    ? {}
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06 },
        },
      };
  const item = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
      };

  return (
    <section id="sectors" className="relative overflow-hidden bg-white py-16 dark:bg-navy-950 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 premium-grid opacity-35" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        variants={container}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <motion.div variants={item} className="max-w-xl">
            <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              القطاعات
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] tracking-[-0.01em] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.2rem]">
              نخصص الحل حسب <span className="gradient-text">مجالك وسلوك عملائك</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              لا نستخدم قالباً واحداً لكل مشروع. نعيد ترتيب الرسالة، الثقة، والدعوة للإجراء حسب قرار الشراء في مجالك.
            </p>
          </motion.div>

          <motion.div variants={item} className="rounded-[2rem] border border-cyan-950/10 bg-slate-950 p-5 text-white shadow-2xl shadow-cyan-950/20 dark:border-white/10 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-bold text-primary">طريقة التفكير</p>
                <h3 className="mt-3 text-2xl font-bold leading-[1.35] sm:text-3xl">
                  كل قطاع له لحظة قرار مختلفة.
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                نحدد ما يحتاجه العميل ليثق، ثم نبني الواجهة حول تلك اللحظة: منتج واضح، مسار قصير، ودليل اجتماعي في المكان الصحيح.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={container} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, index) => (
            <motion.article
              key={sector.title}
              variants={item}
              className="group flex items-start gap-4 rounded-3xl border border-cyan-950/10 bg-white/80 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white sm:text-lg">{sector.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{sector.body}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
