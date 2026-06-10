import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

interface BookingSuccessStepProps {
  onBookAnother: () => void;
}

export default function BookingSuccessStep({ onBookAnother }: BookingSuccessStepProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
      <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/30">
        <CheckCircle size={48} />
      </div>
      <h2 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Booking Confirmed!')}</h2>
      <p className="text-[var(--text-muted)] text-sm">{translateMessage('Your appointment request has been submitted successfully.')}</p>
      <button type="button" onClick={onBookAnother} className="bg-[var(--surface-3)] hover:bg-[var(--surface-3)] text-[var(--text)] px-8 py-3 rounded-xl font-bold transition-colors mt-6">
        {translateMessage('Book Another')}
      </button>
    </motion.div>
  );
}
