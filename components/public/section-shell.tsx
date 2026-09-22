import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

type SectionShellProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  tone?: 'white' | 'muted' | 'dark';
};

// Section tones read from the theme tokens, so a page alternates surfaces
// the same way in light and dark instead of switching palettes.
const tones = {
  white: 'bg-[var(--surface)] text-[var(--text)]',
  muted: 'bg-[var(--surface-2)] text-[var(--text)]',
  dark: 'bg-[var(--navy)] text-white',
};

export default async function SectionShell({ eyebrow, title, description, children, tone = 'white' }: SectionShellProps) {
  const language = await getServerLanguage();
  return (
    <section className={`${tones[tone]} py-14 sm:py-16 lg:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title || description || eyebrow ? (
          <div className="mb-10 max-w-3xl">
            {eyebrow ? <p className="mb-3 text-sm font-black text-primary">{translateMessage(eyebrow, language)}</p> : null}
            {title ? <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl">{translateMessage(title, language)}</h2> : null}
            {description ? <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-muted)]">{translateMessage(description, language)}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
