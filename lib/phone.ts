import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

// English keys; FieldError / translateMessage render the Arabic version.
export const PHONE_REQUIRED_MESSAGE = 'Phone number is required';
export const PHONE_INVALID_MESSAGE = 'Please enter a valid phone number';

/** Returns the error message for an E.164 value from `PhoneInput`, or undefined when OK. */
export function getPhoneError(value: string | undefined, required = true) {
  if (!value) return required ? PHONE_REQUIRED_MESSAGE : undefined;
  return isValidPhoneNumber(value) ? undefined : PHONE_INVALID_MESSAGE;
}

export const requiredPhoneSchema = z
  .string()
  .min(1, PHONE_REQUIRED_MESSAGE)
  .refine((value) => !value || isValidPhoneNumber(value), PHONE_INVALID_MESSAGE);

export const optionalPhoneSchema = z
  .string()
  .optional()
  .refine((value) => !value || isValidPhoneNumber(value), PHONE_INVALID_MESSAGE);
