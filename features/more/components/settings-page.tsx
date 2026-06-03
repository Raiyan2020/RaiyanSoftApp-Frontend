import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Globe, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { useTheme } from '@/lib/themeContext';

export default function SettingsPage() {
  const router = useRouter();
  const { t, language, setLanguage, dir } = useTranslation();
  const { theme, setTheme } = useTheme();

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
          <h1 className="app-title">{t('more.settings')}</h1>
        </div>
      </header>

      <div className="space-y-4">
        <div className="app-card rounded-2xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border)]">
              <Globe size={20} />
            </div>
            <span className="text-sm font-medium text-[var(--text)]">{t('settings.language')}</span>
          </div>
          <div className="flex bg-[var(--surface-2)] rounded-lg p-1 border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                language === 'ar' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        <div className="app-card rounded-2xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border)]">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span className="text-sm font-medium text-[var(--text)]">{t('settings.theme')}</span>
          </div>
          <div className="flex bg-[var(--surface-2)] rounded-lg p-1 border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                theme === 'light' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {t('settings.theme_light')}
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                theme === 'dark' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {t('settings.theme_dark')}
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-4 px-2">{t('settings.more_options')}</p>
      </div>
    </motion.div>
  );
}
