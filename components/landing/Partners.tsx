'use client';
import { useRef } from 'react';
import { useSectionReveal } from './use-section-reveal';

const trustCards = [
  { title: 'التزام سعودي', body: 'نراعي احتياجات السوق المحلي واللغة العربية وتجربة المستخدم RTL من البداية.', stat: 'RTL' },
  { title: 'شركاء نمو', body: 'نعمل مع العميل كفريق منتج، لا كمورد ينفذ قائمة طلبات فقط.', stat: '+30' },
  { title: 'تسليم شفاف', body: 'مراحل واضحة، مراجعات دورية، ومخرجات قابلة للقياس بعد كل مرحلة.', stat: '4 مراحل' },
];

const partners = ['الأفق التقنية', 'مجموعة النور', 'رواد للاستشارات', 'البنيان العقاري', 'مؤسسة الإبداع', 'دار الحلول', 'الريادة للتجارة', 'المستقبل الرقمي'];

const testimonials = [
  {
    quote: 'الفريق ساعدنا نحول الفكرة إلى تجربة واضحة، والأهم أن كل مرحلة كانت مفهومة قبل التنفيذ.',
    name: 'مدير منتج',
    company: 'منصة خدمات',
  },
  {
    quote: 'الفرق كان في التفاصيل الصغيرة: سرعة الموقع، ترتيب الرسائل، وسهولة وصول العميل للطلب.',
    name: 'مؤسس متجر',
    company: 'تجارة إلكترونية',
  },
];

export default function Partners() {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);

  return (
    <section id="partners" className="relative overflow-hidden bg-white py-24 dark:bg-navy-950 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(33,211,162,0.14),transparent_34%)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            الثقة والشراكات
          </div>
          <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
            قبل أن تبدأ معنا، <span className="gradient-text">اعرف كيف نعمل</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            الثقة ليست شعاراً في الفوتر. هي طريقة إدارة، وضوح في التسليم، وتجربة محلية تفهم جمهورك.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {trustCards.map((card, i) => (
            <article
              key={card.title}
              className="reveal rounded-[2rem] border border-cyan-950/10 bg-slate-50/80 p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:bg-white hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-lg font-black text-white shadow-lg shadow-primary/20">
                {card.stat}
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-950 dark:text-white">{card.title}</h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{card.body}</p>
            </article>
          ))}
        </div>

        {/* <div className="reveal mt-8 overflow-hidden rounded-[2rem] border border-cyan-950/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex gap-3 overflow-hidden">
            {[...partners, ...partners].map((partner, i) => (
              <div key={`${partner}-${i}`} className="flex min-w-max items-center gap-3 rounded-2xl border border-cyan-950/10 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-white/5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                  {partner.slice(0, 1)}
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{partner}</span>
              </div>
            ))}
          </div>
        </div> */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {testimonials.map((item, i) => (
            <article
              key={`${item.name}-${item.company}`}
              className="reveal rounded-[2rem] border border-cyan-950/10 bg-slate-950 p-6 text-white shadow-2xl shadow-cyan-950/10 dark:border-white/15 dark:bg-white/8"
              style={{ transitionDelay: `${(i + 3) * 0.08}s` }}
            >
              <p className="text-3xl font-black text-primary">“</p>
              <blockquote className="mt-2 text-lg font-semibold leading-relaxed">{item.quote}</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-emerald-400" />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.company}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
