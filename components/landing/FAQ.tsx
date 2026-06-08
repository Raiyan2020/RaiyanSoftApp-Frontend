'use client';
import { useRef, useState } from 'react';
import { useSectionReveal } from './use-section-reveal';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, textAlign } = useLandingContent();
  const { faq } = content;

  return (
    <section id="faq" className="relative overflow-hidden bg-slate-50 py-24 dark:bg-navy-900 lg:py-28">
      <div ref={ref} className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className={`reveal ${textAlign}`}>
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            {faq.badge}
          </div>
          <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
            {faq.title} <span className="gradient-text">{faq.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{faq.description}</p>
        </div>

        <div className="space-y-4">
          {faq.items.map((item, i) => (
            <div
              key={item.q}
              className="reveal overflow-hidden rounded-3xl border border-cyan-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                id={`faq-trigger-${i}`}
                className="flex w-full items-center justify-between gap-4 p-5 font-bold text-slate-950 dark:text-white sm:p-6"
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span className={textAlign.includes('right') ? 'text-right' : 'text-left'}>{item.q}</span>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 ${open === i ? 'rotate-45' : 'rotate-0'}`}>+</span>
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 leading-relaxed text-slate-600 dark:text-slate-300 sm:px-6 sm:pb-6">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
