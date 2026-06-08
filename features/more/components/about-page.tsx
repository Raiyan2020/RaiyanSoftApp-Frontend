'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, Loader2, Mail } from 'lucide-react';
import SafeImage from '@/components/ui/safe-image';
import { useTranslation } from '@/lib/i18nContext';
import { useAboutUs } from '@/features/pages/hooks/use-about-us';
import PageHtmlContent from '@/features/pages/components/page-html-content';

export default function AboutPage() {
  const router = useRouter();
  const { t, dir } = useTranslation();
  const { data, loading, error } = useAboutUs();

  const about = data?.about_us;
  const contact = data?.contact_us;

  return (
    <motion.div
      initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
      className="app-page app-page-narrow"
    >
      <header className="app-header">
        <div>
          <button
            type="button"
            onClick={() => router.push('/more')}
            className="text-[var(--text-muted)] hover:text-[var(--text)] mb-4 flex items-center gap-1"
          >
            {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <span className="text-sm">{t('auth.back')}</span>
          </button>
          <h1 className="app-title">{about?.title || t('more.about')}</h1>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
          <Loader2 className="me-2 animate-spin" size={18} />
          Loading...
        </div>
      ) : error ? (
        <p className="text-red-400 px-2">{error}</p>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center pt-6">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <SafeImage
                src={about?.image || 'https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png'}
                className="w-full h-full object-contain relative z-10"
                alt="Raiyansoft Logo"
              />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">{about?.title || 'Raiyansoft'}</h2>
            {about?.caption ? (
              <p className="text-sm text-[var(--text-muted)] font-medium">{about.caption}</p>
            ) : null}
          </div>

          <div className="app-card rounded-2xl p-5">
            <PageHtmlContent html={about?.description} emptyMessage="About us content is not available yet." />
          </div>

          {contact?.email || contact?.url ? (
            <div>
              <h3 className="text-sm font-bold text-[var(--text)] mb-3 uppercase tracking-wider">Contact Us</h3>
              <div className="space-y-3">
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 p-3 app-card rounded-xl hover:border-primary/40 transition-colors"
                  >
                    <Mail size={18} className="text-primary" />
                    <span className="text-sm text-[var(--text)]">{contact.email}</span>
                  </a>
                ) : null}
                {contact.url ? (
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 app-card rounded-xl hover:border-primary/40 transition-colors"
                  >
                    <Globe size={18} className="text-primary" />
                    <span className="text-sm text-[var(--text)]">{contact.url.replace(/^https?:\/\//, '')}</span>
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="text-center pt-8 opacity-50">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Designed and developed in Kuwait</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
