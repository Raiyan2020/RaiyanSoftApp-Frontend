'use client';

import { useState } from 'react';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';
import { useNavbar } from './use-navbar';
import AuthDialog from '@/features/auth/components/auth-dialog';
import { QuickBookingDialog, QuickLeadDialog } from '@/features/quick-actions/components/quick-action-dialogs';

export default function Navbar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const {
    scrolled,
    menuOpen,
    setMenuOpen,
    pagesOpen,
    setPagesOpen,
    activeHref,
    user,
    scrollTo,
  } = useNavbar();

  const glassBarClass = scrolled
    ? 'border-slate-200/80 bg-white/92 shadow-lg shadow-slate-900/10 ring-slate-200/70 dark:border-white/12 dark:bg-slate-950/55 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_rgba(8,20,36,0.28)] dark:ring-cyan-300/10'
    : 'border-slate-200/70 bg-white/85 shadow-xl shadow-slate-900/10 ring-slate-200/60 dark:border-white/10 dark:bg-slate-950/40 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_60px_rgba(8,20,36,0.22)] dark:ring-cyan-300/10';

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 pt-3 transition-all duration-300 sm:px-6 lg:px-8">
      <div
        className={`mx-auto max-w-7xl rounded-3xl border backdrop-blur-2xl transition-all duration-300 ${glassBarClass}`}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-4 md:h-16 w-full">
          <NavbarDesktop
            dark={dark}
            onToggleDark={onToggleDark}
            user={user}
            activeHref={activeHref}
            pagesOpen={pagesOpen}
            setPagesOpen={setPagesOpen}
            scrollTo={scrollTo}
            onOpenAuth={() => setAuthOpen(true)}
            onOpenBooking={() => setBookingOpen(true)}
            onOpenLead={() => setLeadOpen(true)}
          />
          <NavbarMobile
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            user={user}
            activeHref={activeHref}
            scrollTo={scrollTo}
            onOpenAuth={() => setAuthOpen(true)}
            onOpenBooking={() => setBookingOpen(true)}
            onOpenLead={() => setLeadOpen(true)}
          />
        </div>
      </div>
      <AuthDialog isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <QuickBookingDialog isOpen={bookingOpen} onClose={() => setBookingOpen(false)} user={user} />
      <QuickLeadDialog isOpen={leadOpen} onClose={() => setLeadOpen(false)} user={user} />
    </header>
  );
}
