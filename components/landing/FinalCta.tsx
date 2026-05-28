'use client';

export default function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden bg-white px-4 py-16 dark:bg-navy-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-center text-white shadow-2xl shadow-cyan-950/20 sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.24),transparent_36%)]" />
        <div className="relative">
          <p className="mb-4 text-sm font-bold text-primary">الخطوة التالية</p>
          <h2 id="final-cta-title" className="mx-auto max-w-3xl text-2xl font-bold leading-[1.34] sm:text-3xl lg:text-[2.35rem]">
            إذا كان مشروعك مهماً، يستحق تجربة أولى لا تبدو عادية.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            أرسل الفكرة، وسنرتب لك تصوراً واضحاً للمرحلة الأولى قبل أي التزام كبير.
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="premium-button touch-lift mt-8 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
          >
            ابدأ النقاش الآن
          </button>
        </div>
      </div>
    </section>
  );
}
