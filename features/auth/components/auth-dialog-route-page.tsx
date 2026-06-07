'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import AuthDialog from './auth-dialog';
import SafeImage from '@/components/ui/safe-image';
import { guestStore } from '@/lib/guestStore';
import { useTranslation } from '@/lib/i18nContext';

export default function AuthDialogRoutePage() {
  const router = useRouter();
  const { t, dir } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.push('/');
  };

  const handleGuestLogin = () => {
    guestStore.setGuest(true);
    router.push('/home');
  };

  return (
    <div className="app-page app-page-narrow min-h-[calc(100dvh-5.5rem)] lg:min-h-[calc(100dvh-4.5rem)] flex items-center">
      <div className="w-full app-card rounded-3xl p-6 sm:p-8 text-center">
        <div className="flex justify-center mb-8">
          <SafeImage
            src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
            alt="Logo"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-[var(--text)] mb-3">{t('auth.phone_dialog_title')}</h1>
        <p className="text-sm text-[var(--text-muted)] mb-7">{t('auth.phone_dialog_subtitle')}</p>
        <Button type="button" onClick={() => setIsOpen(true)} className="w-full">
          {t('auth.login_action')}
        </Button>
        <Button
          variant="outline"
          onClick={handleGuestLogin}
          className="w-full mt-4 flex items-center justify-center gap-2"
        >
          <span>{t('auth.continue_guest')}</span>
          <ArrowRight size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
        </Button>
      </div>

      <AuthDialog isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}
