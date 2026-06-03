'use client';

import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';
import { useNavbar } from './use-navbar';

export default function Navbar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
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

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-cyan-950/5 bg-white/90 shadow-lg shadow-cyan-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-navy-950/90'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20 w-full">
          <NavbarDesktop
            dark={dark}
            onToggleDark={onToggleDark}
            user={user}
            activeHref={activeHref}
            pagesOpen={pagesOpen}
            setPagesOpen={setPagesOpen}
            scrollTo={scrollTo}
          />
          <NavbarMobile
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            user={user}
            activeHref={activeHref}
            scrollTo={scrollTo}
          />
        </div>
      </div>
    </header>
  );
}
