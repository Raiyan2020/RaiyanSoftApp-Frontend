'use client';

import Navbar from '@/components/landing/Navbar';
import { useLanding } from '@/screens/use-landing';

// Same floating navbar as the home page, for the server-rendered PublicLayout.
export default function PublicNavbar() {
  const { dark, toggleDark } = useLanding();

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <Navbar dark={dark} onToggleDark={toggleDark} />
    </>
  );
}
