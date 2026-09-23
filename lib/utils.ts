import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Display a dialling code as "+NN" whether it was stored as "NN", "+NN" or " + NN". */
export function formatCallingCode(code?: string | null) {
  const digits = (code ?? '').trim().replace(/^[+\s]+/, '');
  return digits ? `+${digits}` : '';
}

/**
 * wa.me chat link for an international phone ("+965 5555-1234", "965...", ...), or null when unusable.
 * Bare 8-digit numbers are treated as Kuwaiti (legacy rows saved without a country code).
 */
export function toWhatsAppUrl(phone?: string | null, text?: string): string | null {
  let digits = (phone ?? '').replace(/\D/g, '');
  if (digits.length === 8) digits = `965${digits}`;
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
