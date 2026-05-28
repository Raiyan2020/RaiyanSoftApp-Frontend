'use client';
import Image from 'next/image';

const links = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'أعمالنا', href: '#works' },
  { label: 'الثقة', href: '#partners' },
  { label: 'تواصل معنا', href: '#contact' },
];

const services = ['تطبيقات الجوال', 'المواقع والمنصات', 'المتاجر الإلكترونية', 'الهوية البصرية'];
const resources = ['طريقة العمل', 'دراسة المشروع', 'الأسئلة الشائعة', 'سياسة الخصوصية'];

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.2),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold text-primary">جاهز نبدأ؟</p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">خلنا نحول فكرتك إلى منتج واضح وقابل للنمو.</h2>
            </div>
            <button
              onClick={() => scrollTo('#contact')}
              className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
            >
              احجز استشارة مجانية
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-primary/30">
                <Image src="/logo.webp" alt="رايان سوفت" fill className="object-cover" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">رايان سوفت</p>
                <p className="text-xs text-slate-500">Raiyan Soft</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              وكالة تقنية تبني تطبيقات، مواقع، ومتاجر إلكترونية بهوية واضحة وتجربة استخدام مريحة ونتائج قابلة للقياس.
            </p>
            <div className="flex gap-2">
              {['X', 'IG', 'in'].map((label) => (
                <a key={label} href="#" aria-label={label} className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-sm font-black text-slate-300 transition-all duration-200 hover:-translate-y-1 hover:bg-primary hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <FooterList title="روابط سريعة" items={links.map((link) => link.label)} onClick={(label) => scrollTo(links.find((link) => link.label === label)?.href || '#home')} />
          <FooterList title="خدماتنا" items={services} onClick={() => scrollTo('#services')} />
          <FooterList title="موارد" items={resources} onClick={() => scrollTo('#contact')} />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} رايان سوفت. جميع الحقوق محفوظة.</p>
          <p>صُمم ليكون سريعاً، واضحاً، وقابلاً للتطوير.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items, onClick }: { title: string; items: string[]; onClick: (item: string) => void }) {
  return (
    <div>
      <h3 className="mb-5 text-lg font-bold text-white">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <button onClick={() => onClick(item)} className="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-40 transition-opacity group-hover:opacity-100" />
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
