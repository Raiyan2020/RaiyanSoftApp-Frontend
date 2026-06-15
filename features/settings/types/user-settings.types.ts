export interface SocialMediaLinks {
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  telegram?: string | null;
  [platform: string]: string | null | undefined;
}

export interface ApiSocialMediaItem {
  id: number;
  platform: string;
  link: string;
  image: string | null;
}

export interface UserSettings {
  site_name: string;
  site_logo: string | null;
  site_favicon: string | null;
  site_description: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  social_media: SocialMediaLinks;
  first_footer_text?: string;
  second_footer_text?: string;
}
