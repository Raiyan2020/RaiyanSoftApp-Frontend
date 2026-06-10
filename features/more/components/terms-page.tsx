'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { useTermsConditions } from '@/features/pages';
import { PageHtmlContent } from '@/features/pages';

export default function TermsPage() {
  const router = useRouter();
  const { t, dir } = useTranslation();
  const { data, loading, error } = useTermsConditions();

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
          <h1 className="app-title">{data?.title || t('more.terms')}</h1>
        </div>
      </header>

      <div className="app-card rounded-2xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-[var(--text-muted)]">
            <Loader2 className="me-2 animate-spin" size={18} />
            Loading...
          </div>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <PageHtmlContent html={data?.description} emptyMessage="Terms and conditions content is not available yet." />
        )}
      </div>
    </motion.div>
  );
}
