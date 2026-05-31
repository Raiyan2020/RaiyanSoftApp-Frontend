'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type PublicFaqProps = {
  items: { question: string; answer: string }[];
};

export default function PublicFaq({ items }: PublicFaqProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question} className="overflow-hidden rounded-lg border border-cyan-950/10 bg-white dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              id={`public-faq-trigger-${index}`}
              aria-expanded={open}
              aria-controls={`public-faq-panel-${index}`}
              onClick={() => setOpenIndex(open ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right font-black text-slate-950 dark:text-white"
            >
              <span>{item.question}</span>
              <ChevronDown className={`shrink-0 text-primary transition ${open ? 'rotate-180' : ''}`} size={20} />
            </button>
            <div
              id={`public-faq-panel-${index}`}
              role="region"
              aria-labelledby={`public-faq-trigger-${index}`}
              className={`grid transition-all ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-8 text-slate-600 dark:text-slate-300">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

