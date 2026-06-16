'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SafeImage from '@/components/ui/safe-image';
import { useTranslation } from '@/lib/i18nContext';
import { useAboutUs } from '@/features/pages';
import { PageHtmlContent } from '@/features/pages';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';

export default function AboutPage() {
  const router = useRouter();
  const { t, dir } = useTranslation();
  const { data, loading, error } = useAboutUs();

  return (
    <motion.div
      initial={false}
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
          <h1 className="app-title">{data?.title || t('more.about')}</h1>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
          <Loader2 className="me-2 animate-spin" size={18} />
          {translateMessage('Loading...')}
        </div>
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center pt-6">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <SafeImage
                src={data?.image || 'https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png'}
                className="w-full h-full object-contain relative z-10"
                alt="Raiyansoft Logo"
              />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">{data?.title || 'Raiyansoft'}</h2>
          </div>

          <div className="app-card rounded-2xl p-5">
            <PageHtmlContent html={data?.description} emptyMessage="About us content is not available yet." />
          </div>

          <div className="text-center pt-8 opacity-50">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{translateMessage('Designed and developed in Kuwait')}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
