import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';

const sections = [
  {
    title: '1. Overview',
    body: 'Raiyansoft values your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have.',
  },
  {
    title: '2. Information We Collect',
    body: 'We may collect account information, usage information, support communications, and technical information such as IP address, approximate location, logs, and diagnostics.',
  },
  {
    title: '3. How We Use Information',
    body: 'We use information to provide and operate the service, improve performance and security, respond to support requests, and send important administrative messages.',
  },
  {
    title: '4. Sharing and Disclosure',
    body: 'We may share information with service providers, professional advisors, authorities when required by law, and marketing or advertising partners where permitted by applicable law and your choices.',
  },
  {
    title: '5. Marketing Choices',
    body: 'You may opt out of promotional communications at any time by using unsubscribe options, if available, or by contacting us. Some service messages are non-promotional and may still be sent.',
  },
  {
    title: '6. Data Retention',
    body: 'We retain information as long as needed for the purposes described, unless a longer retention period is required by law.',
  },
  {
    title: '7. Security',
    body: 'We use reasonable administrative, technical, and organizational measures designed to protect your information. No method of transmission or storage is completely secure.',
  },
  {
    title: '8. International Transfers',
    body: 'Your information may be processed in countries other than your own, which may have different data protection laws.',
  },
  {
    title: '9. Children\'s Privacy',
    body: 'Our services are not intended for children, and we do not knowingly collect personal information from children.',
  },
  {
    title: '10. Your Rights',
    body: 'Depending on your location, you may have rights to access, correct, delete, or object to certain processing of your information. To request these rights, contact us.',
  },
  {
    title: '11. Changes to This Policy',
    body: 'We may update this policy from time to time. We will update the effective date and provide notice where required.',
  },
];

export default function PrivacyPage() {
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
          <h1 className="app-title">{t('more.privacy')}</h1>
        </div>
      </header>

      <div className="app-card rounded-2xl p-6 text-sm text-[var(--text-muted)] leading-relaxed space-y-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[var(--text)] mb-1">Privacy Policy</h2>
          <p className="text-[var(--text-muted)] text-xs">Effective Date: December 26, 2025</p>
        </div>

        {sections.map((section) => (
          <section key={section.title}>
            <h3 className="text-[var(--text)] font-bold mb-2">{section.title}</h3>
            <p>{section.body}</p>
          </section>
        ))}

        <section>
          <h3 className="text-[var(--text)] font-bold mb-2">12. Contact Us</h3>
          <p>
            For privacy questions, contact: <span className="text-primary">privacy@raiyansoft.com</span>
          </p>
        </section>
      </div>
    </motion.div>
  );
}
