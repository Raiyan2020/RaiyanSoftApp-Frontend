import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Globe, ChevronRight } from 'lucide-react';
import SafeImage from '@/components/ui/safe-image';
import { useTranslation } from '@/lib/i18nContext';

export default function AboutPage() {
  const router = useRouter();
  const { t, dir } = useTranslation();

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
          <h1 className="app-title">{t('more.about')}</h1>
        </div>
      </header>

      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center pt-6">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <SafeImage
              src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
              className="w-full h-full object-contain relative z-10"
              alt="Raiyansoft Logo"
            />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Raiyansoft</h2>
          <p className="text-sm text-[var(--text-muted)] font-medium">Innovating Digital Solutions</p>
        </div>

        <div className="app-card rounded-2xl p-5">
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
            Raiyansoft is a leading software development company based in Kuwait, specializing in mobile applications,
            web platforms, and enterprise solutions.
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            We empower businesses with cutting-edge technology, from e-commerce platforms to custom CRM systems,
            ensuring scalability and performance.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--text)] mb-3 uppercase tracking-wider">Contact Us</h3>
          <div className="space-y-3">
            <a
              href="mailto:support@raiyansoft.com"
              className="flex items-center gap-3 p-3 app-card rounded-xl hover:border-primary/40 transition-colors"
            >
              <Mail size={18} className="text-primary" />
              <span className="text-sm text-[var(--text)]">support@raiyansoft.com</span>
            </a>
            <a
              href="https://raiyansoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 app-card rounded-xl hover:border-primary/40 transition-colors"
            >
              <Globe size={18} className="text-primary" />
              <span className="text-sm text-[var(--text)]">www.raiyansoft.com</span>
            </a>
          </div>
        </div>

        <div className="text-center pt-8 opacity-50">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Designed and developed in Kuwait</p>
        </div>
      </div>
    </motion.div>
  );
}
