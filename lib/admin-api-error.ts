import type { ApiResponse } from './api-service';
import { translateMessage } from './i18n-utils';

/** First backend validation message per field key, e.g. `title.ar` or `features.en.2`. */
export type FieldErrors = Record<string, string>;

export class AdminApiError extends Error {
  fieldErrors: FieldErrors;

  constructor(message: string, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = 'AdminApiError';
    Object.setPrototypeOf(this, AdminApiError.prototype);
    this.fieldErrors = fieldErrors;
  }
}

/** Throws an AdminApiError carrying per-field messages when the request failed. */
export function assertApiOk(response: ApiResponse<unknown>): void {
  if (response.status) return;

  const fieldErrors: FieldErrors = {};
  if (response.errors && typeof response.errors === 'object' && !Array.isArray(response.errors)) {
    for (const [key, value] of Object.entries(response.errors)) {
      const first = Array.isArray(value) ? value[0] : value;
      if (first) fieldErrors[key] = String(first);
    }
  }

  throw new AdminApiError(translateMessage(response.message || 'Request failed.'), fieldErrors);
}

export function getFieldErrors(error: unknown): FieldErrors {
  return error instanceof AdminApiError ? error.fieldErrors : {};
}

/** Maps `key.ar` / `key.en` (or a whole-field `key` error) to BilingualFieldInputs errors. */
export function bilingualErrors(errors: FieldErrors, key: string): { ar?: string; en?: string } {
  return { ar: errors[`${key}.ar`] ?? errors[key], en: errors[`${key}.en`] ?? errors[key] };
}
