'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BadgePercent, Bell, Calendar, FileText, FolderKanban, Info, LayoutDashboard, Loader2, MessageCircle, Pencil } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { User } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import ProfileTable from '@/components/profile/profile-table';
import ProfileBookingsPanel from '@/components/profile/profile-bookings-panel';
import ProfileChatPanel from '@/components/profile/profile-chat-panel';
import { ProfileRecordType } from '@/components/profile/profile-records-data';
import { QuickBookingDialog, QuickLeadDialog } from '@/features/quick-actions/components/quick-action-dialogs';
import Button from '@/components/ui/button';
import ProfileEditDialog from '@/features/profile/components/profile-edit-dialog';
import { useUserProfile } from '@/features/profile/hooks/use-user-profile';

type ProfileTab = 'all' | ProfileRecordType | 'chat';

const staticProfileUser: User = {
  id: 101,
  first_name: 'Abdullah',
  last_name: 'Mohammed',
  country_code: '+965',
  phone: '55555555',
  email: 'abdullah@example.com',
  unread_notifications_count: 3,
};

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, dir } = useTranslation();

  const {
    user: profileUser,
    isFetching,
    errorMessage,
    updateProfile,
    isUpdating,
    updateError,
    updateSuccess,
  } = useUserProfile();
  const currentUser = profileUser ?? staticProfileUser;
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('all');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Route detection from query params. Auth is intentionally bypassed for now.
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['all', 'booking', 'deal', 'project', 'notification', 'info', 'chat'].includes(tabParam)) {
      setActiveTab(tabParam as ProfileTab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'all', label: dir === 'rtl' ? 'كل السجلات' : 'All Records', icon: LayoutDashboard },
    { id: 'booking', label: dir === 'rtl' ? 'الحجوزات' : 'Bookings', icon: Calendar },
    { id: 'deal', label: dir === 'rtl' ? 'العروض' : 'Deals', icon: BadgePercent },
    { id: 'chat', label: dir === 'rtl' ? 'المحادثة' : 'Chat', icon: MessageCircle },
    { id: 'project', label: dir === 'rtl' ? 'المشاريع' : 'Projects', icon: FolderKanban },
    { id: 'notification', label: dir === 'rtl' ? 'الإشعارات' : 'Notifications', icon: Bell },
    { id: 'info', label: dir === 'rtl' ? 'معلومات أكثر' : 'More Info', icon: Info },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col" dir={dir}>
      <Navbar dark={dark} onToggleDark={toggleDark} />
      
      <main className="flex-grow pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6 flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:mb-8 sm:pb-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 text-start">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent sm:text-3xl">
                {t('profile.title')}
              </h1>
              <p className="mt-2 break-words text-sm text-[var(--text-muted)]">
                {currentUser.first_name} {currentUser.last_name} &bull; {currentUser.email}
              </p>
              {errorMessage ? (
                <p className="mt-2 text-xs font-bold text-amber-400">
                  {dir === 'rtl' ? 'تعذر تحديث بيانات الملف الشخصي من الخادم.' : 'Could not refresh profile data from the server.'}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {isFetching ? (
                <div className="hidden items-center gap-2 text-xs font-bold text-[var(--text-muted)] sm:flex">
                  <Loader2 size={14} className="animate-spin" />
                  {dir === 'rtl' ? 'تحديث البيانات' : 'Refreshing'}
                </div>
              ) : null}
              <Button type="button" onClick={() => setProfileDialogOpen(true)} className="gap-2">
                <Pencil size={17} />
                {dir === 'rtl' ? 'تعديل الملف' : 'Edit profile'}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
            <aside className="min-w-0 lg:sticky lg:top-28 lg:h-fit" dir={dir}>
              <div className="mb-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
                <div className="flex items-center gap-3 text-start">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[var(--text-muted)]">
                      {dir === 'rtl' ? 'لوحة العميل' : 'Client panel'}
                    </p>
                    <p className="truncate text-sm font-black text-[var(--text)]">
                      {currentUser.first_name} {currentUser.last_name}
                    </p>
                    <p className="truncate text-xs text-[var(--text-muted)]" dir="ltr">
                      {[currentUser.country_code, currentUser.phone].filter(Boolean).join(' ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileDialogOpen(true)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-primary/40 hover:text-primary"
                    aria-label={dir === 'rtl' ? 'تعديل الملف الشخصي' : 'Edit profile'}
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              </div>

              <nav
                className="flex flex-row gap-1 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1 no-scrollbar lg:flex-col lg:overflow-visible"
                aria-label="Profile sections"
                dir={dir}
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        router.replace(`/profile?tab=${tab.id}`, { scroll: false });
                      }}
                      className={`flex shrink-0 items-center justify-start gap-2 px-3 py-2.5 text-start text-sm font-bold rounded-xl transition-all whitespace-nowrap sm:gap-3 sm:px-4 sm:py-3 lg:w-full ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/25'
                          : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl sm:rounded-3xl sm:p-6">
              {activeTab === 'booking' ? (
                <ProfileBookingsPanel />
              ) : activeTab === 'chat' ? (
                <ProfileChatPanel />
              ) : (
                <ProfileTable
                  scope={activeTab}
                  selectedRecordId={searchParams.get('record')}
                  onOpenBookingDialog={() => setBookingDialogOpen(true)}
                  onOpenLeadDialog={() => setLeadDialogOpen(true)}
                />
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <QuickBookingDialog
        isOpen={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        user={currentUser}
      />
      <QuickLeadDialog
        isOpen={leadDialogOpen}
        onClose={() => setLeadDialogOpen(false)}
        user={currentUser}
      />
      <ProfileEditDialog
        isOpen={profileDialogOpen}
        user={currentUser}
        isSaving={isUpdating}
        error={updateError}
        success={updateSuccess}
        onClose={() => setProfileDialogOpen(false)}
        onSubmit={async (values) => {
          await updateProfile(values);
        }}
      />
    </div>
  );
}
