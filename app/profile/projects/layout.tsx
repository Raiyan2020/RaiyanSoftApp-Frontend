import PublicNavbar from '@/components/public/public-navbar';
import Footer from '@/components/landing/Footer';

// /profile renders its own Navbar per-page, so the shared public navbar is
// mounted here (not in app/profile/layout.tsx) to avoid a second one on /profile.
// The legacy (mobile) /projects/[id] route keeps its mobile shell instead.
export default function ProfileProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <PublicNavbar />
      {/* The navbar is fixed; this offset matches /profile. */}
      <main className="flex-grow pb-12 pt-20 sm:pb-16 sm:pt-24">{children}</main>
      <Footer />
    </div>
  );
}
