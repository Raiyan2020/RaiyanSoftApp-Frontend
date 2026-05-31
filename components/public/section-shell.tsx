type SectionShellProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  tone?: 'white' | 'muted' | 'dark';
};

const tones = {
  white: 'bg-white text-slate-950 dark:bg-navy-950 dark:text-white',
  muted: 'bg-slate-50 text-slate-950 dark:bg-navy-900 dark:text-white',
  dark: 'bg-slate-950 text-white',
};

export default function SectionShell({ eyebrow, title, description, children, tone = 'white' }: SectionShellProps) {
  return (
    <section className={`${tones[tone]} py-14 sm:py-18 lg:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title || description || eyebrow ? (
          <div className="mb-10 max-w-3xl">
            {eyebrow ? <p className="mb-3 text-sm font-black text-primary">{eyebrow}</p> : null}
            {title ? <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl">{title}</h2> : null}
            {description ? <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{description}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

