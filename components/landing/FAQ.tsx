'use client';
import { useEffect, useRef, useState } from 'react';

const faqs = [
  {
    q: 'كم يستغرق تنفيذ المشروع؟',
    a: 'يعتمد على النطاق. المواقع التعريفية قد تبدأ من أسبوعين، والتطبيقات أو المنصات غالباً تمر بمراحل من 4 إلى 12 أسبوعاً حسب التكاملات والخصائص.',
  },
  {
    q: 'هل يمكن البدء بمرحلة صغيرة؟',
    a: 'نعم. نفضل أحياناً البدء بمرحلة اكتشاف أو نسخة أولى MVP لتقليل المخاطر وتوضيح التكلفة قبل التوسع.',
  },
  {
    q: 'هل تساعدون في التصميم فقط أو البرمجة فقط؟',
    a: 'نستطيع تنفيذ التصميم، البرمجة، أو الرحلة كاملة. لكن أفضل النتائج تحدث عندما نربط تجربة المستخدم بالتنفيذ من البداية.',
  },
  {
    q: 'هل الموقع سيكون متوافقاً مع الجوال ومحركات البحث؟',
    a: 'نعم، التوافق مع الجوال، الأداء، الأساسيات التقنية للـ SEO، وتجربة RTL العربية جزء من نظام العمل الأساسي.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" className="relative overflow-hidden bg-slate-50 py-24 dark:bg-navy-900 lg:py-28">
      <div ref={ref} className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="reveal text-center lg:text-right">
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            الأسئلة الشائعة
          </div>
          <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
            نزيل الغموض <span className="gradient-text">قبل التعاقد</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            إجابات مختصرة لأكثر الأسئلة التي تظهر قبل بدء أي مشروع رقمي.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={item.q} className="reveal overflow-hidden rounded-3xl border border-cyan-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5" style={{ transitionDelay: `${i * 0.06}s` }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                id={`faq-trigger-${i}`}
                className="flex w-full items-center justify-between gap-4 p-5 text-right font-bold text-slate-950 dark:text-white sm:p-6"
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span>{item.q}</span>
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
