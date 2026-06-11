import type { ImageUploadValue } from '@/components/ui/image-upload';

export interface AdminCountry {
  id: number;
  name: string;
  image: string | null;
  country_code: string;
  phone_code: string;
  is_active: boolean;
}

export interface CountryFormValues {
  name: string;
  countryCode: string;
  phoneCode: string;
  isActive: boolean;
  image: ImageUploadValue | null;
}

export interface CountryPayload {
  name: string;
  country_code: string;
  phone_code: string;
  is_active: boolean;
  image?: File;
}
