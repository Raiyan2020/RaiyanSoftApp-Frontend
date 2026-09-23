'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FallbackImage from '@/components/ui/fallback-image';
import { authService } from '@/lib/auth-service';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.subscribe(({ user }) => {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);


  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-[#0f172a] to-[#020617]"
    >
      <motion.div
        initial={false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-32 h-32 mb-12"
      >
        <FallbackImage
          src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
          alt="Raiyansoft Logo"
          className="w-full h-full object-contain drop-shadow-[0_0_20px_rgb(var(--primary-glow-rgb) / 0.3)]"
        />
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-primary shadow-[0_0_10px_rgb(var(--primary-glow-rgb) / 0.4)]"
      />
    </motion.div>
  );
}
