import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import ClampText from '@/components/ui/clamp-text';
import { fetchPublicJobOpenings } from '@/features/landing-page/services/public-landing-api';
import { employmentTypeLabel } from '@/lib/employment-type';
import { getPageMetadata } from '@/lib/page-seo';
import { createJobPostingListJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('careers', await getServerLanguage());
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default async function CareersPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const jobs = await fetchPublicJobOpenings(language);

  return (
    <PublicSimplePage
      seoKey="careers"
      eyebrow={tt('Careers')}
      title={tt('Join a team building clear digital products')}
      description={tt('Open roles can be published from the admin dashboard.')}
    >
      <JsonLd
        id="careers-list-schema"
        data={createJobPostingListJsonLd(
          jobs.map((job) => ({
            title: job.title,
            department: job.department,
            location: job.location,
            workType: employmentTypeLabel(job.employment_type, language),
            description: stripHtml(job.description),
          })),
          language,
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <article key={job.id} className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <h2 className="text-xl font-black text-[var(--text)]">{job.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                {[job.department, job.location, employmentTypeLabel(job.employment_type, language)].map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-primary">{tag}</span>
                ))}
              </div>
              <div className="mt-4 pb-5">
                <ClampText lines={4}>
                  <PageHtmlContent html={job.description} />
                </ClampText>
              </div>
              {job.apply_url ? (
                <a
                  href={job.apply_url}
                  target={job.apply_url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-on-primary transition hover:bg-primary/90"
                >
                  {tt('Apply now')}
                </a>
              ) : null}
            </article>
          ))
        ) : (
          <BasicContentCard
            title={tt('No open roles')}
            description={tt('This page is ready for future opportunities in design, development, or product management.')}
          />
        )}
      </div>
    </PublicSimplePage>
  );
}
