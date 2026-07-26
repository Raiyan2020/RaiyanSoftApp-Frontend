'use client';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { translateMessage } from '@/lib/i18n-utils';

const sectors = [
  { title: 'E-commerce', body: 'Product pages, checkout, shipping, and higher conversion.' },
  { title: 'Services & Bookings', body: 'Booking journeys and lighter operational tracking dashboards.' },
  { title: 'Education & Platforms', body: 'Learning, content, and Arabic user dashboards.' },
  { title: 'Real Estate & Auctions', body: 'Search, maps, and unit pages that drive contact.' },
  { title: 'Restaurants & Delivery', body: 'Fast ordering, branches, tracking, and mobile menus.' },
  { title: 'Emerging Brands', body: 'Identity, launch website, and consistent presence.' },
];

export default function Sectors() {
  const shouldReduceMotion = useReducedMotion();
  const container: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06 },
        },
      };
  const item: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
      };

  return (
    <section id="sectors" className="relative overflow-hidden bg-white py-12 dark:bg-navy-950 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 premium-grid opacity-35" />
      <div className="pointer-events-none absolute -start-32 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        variants={container}
        initial={false}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <motion.div variants={item} className="max-w-xl">
            <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              {translateMessage('Sectors')}
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] tracking-[-0.01em] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.2rem]">
              {translateMessage('We tailor the solution to')} <span className="gradient-text">{translateMessage('your industry and customer behavior')}</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {translateMessage("We don't use one template for every project. We reorder the message, trust, and call-to-action based on the buying decision in your industry.")}
            </p>
          </motion.div>

          <motion.div variants={item} className="rounded-[2rem] border border-cyan-950/10 bg-slate-950 p-5 text-white shadow-2xl shadow-cyan-950/20 dark:border-white/10 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-bold text-primary">{translateMessage('Our Thinking')}</p>
                <h3 className="mt-3 text-2xl font-bold leading-[1.35] sm:text-3xl">
                  {translateMessage('Every sector has a different decision moment.')}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                {translateMessage('We identify what the customer needs to trust, then build the interface around that moment: a clear product, a short path, and social proof in the right place.')}
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
                <h3 className="text-base font-bold text-slate-950 dark:text-white sm:text-lg">{translateMessage(sector.title)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{translateMessage(sector.body)}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
