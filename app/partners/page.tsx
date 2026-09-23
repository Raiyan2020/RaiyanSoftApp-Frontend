import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import ClampText from '@/components/ui/clamp-text';
import FallbackImage from '@/components/ui/fallback-image';
import { fetchPublicPartners } from '@/features/landing-page/services/public-landing-api';
import { getPageMetadata } from '@/lib/page-seo';
import { createItemListJsonLd, getCanonicalUrl } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('partners', await getServerLanguage());
}

export default async function PartnersPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const partners = await fetchPublicPartners(language);

  return (
    <PublicSimplePage
      seoKey="partners"
      eyebrow={tt('Partners')}
      title={tt('Partnerships that support digital execution.')}
      description={tt('Names and descriptions of approved partners can be managed from the dashboard.')}
    >
      <JsonLd
        id="partners-list-schema"
        data={createItemListJsonLd(
          partners.map((item) => ({
            name: item.name,
            description: item.description || '',
            url: item.url || getCanonicalUrl('/partners'),
          })),
          tt('Raiyan Soft partners'),
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {partners.length > 0 ? (
          partners.map((partner) => {
            const card = (
              <article className="flex h-full items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                {partner.logo ? (
                  <FallbackImage src={partner.logo} alt={partner.name} className="h-14 w-14 shrink-0 rounded-lg object-contain" />
                ) : null}
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-[var(--text)]">{partner.name}</h2>
                  {partner.description ? (
                    // Linked cards clamp without a toggle (no button inside <a>).
                    partner.url ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--text-muted)]">{partner.description}</p>
                    ) : (
                      <ClampText lines={3} className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{partner.description}</ClampText>
                    )
                  ) : null}
                  {partner.url ? <p className="mt-4 text-sm font-black text-primary">{tt('Visit website')}</p> : null}
                </div>
              </article>
            );
            return partner.url ? (
              <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                {card}
              </a>
            ) : (
              <div key={partner.id} className="h-full">{card}</div>
            );
          })
        ) : (
          <BasicContentCard title={tt('No partners listed yet')} description={tt('Approved partners will appear here soon.')} />
        )}
      </div>
    </PublicSimplePage>
  );
}
