import type { BilingualField } from '@/features/landing-page';
import { isValidLandingButtonUrl } from '@/features/landing-page';
import { translateMessage } from '@/lib/i18n-utils';

export type BilingualFieldErrors = Partial<Record<keyof BilingualField, string>>;
export type TagRowErrors = Partial<Record<'ar' | 'en' | 'url', string>>;

const REQUIRED_MESSAGE = translateMessage('This field is required');
const BUTTON_URL_MESSAGE = translateMessage('Invalid button URL. Use #section, /path, or https://...');
const TAG_URL_MESSAGE = translateMessage('Invalid tag URL. Use #section, /path, or https://...');
const URL_MESSAGE = translateMessage('Please enter a valid URL');

export function validateRequiredBilingual(value: BilingualField): BilingualFieldErrors {
  const errors: BilingualFieldErrors = {};

  if (!value.ar.trim()) errors.ar = REQUIRED_MESSAGE;
  if (!value.en.trim()) errors.en = REQUIRED_MESSAGE;

  return errors;
}

export function hasBilingualErrors(errors?: BilingualFieldErrors) {
  return Boolean(errors?.ar || errors?.en);
}

export function validateLandingButtonUrl(value: string): string {
  return isValidLandingButtonUrl(value) ? '' : BUTTON_URL_MESSAGE;
}

export function validateLandingTagUrls(tags: { name: BilingualField; url: string }[]): TagRowErrors[] {
  return tags.map((tag) => {
    const errors: TagRowErrors = {};

    if (!isValidLandingButtonUrl(tag.url)) {
      errors.url = TAG_URL_MESSAGE;
    }

    return errors;
  });
}

export function hasTagErrors(errors: TagRowErrors[]) {
  return errors.some((error) => error.ar || error.en || error.url);
}

export function validateOptionalAbsoluteUrl(value: string): string {
  if (!value.trim()) return '';

  try {
    new URL(value);
    return '';
  } catch {
    return URL_MESSAGE;
  }
}
