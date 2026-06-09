export type PageSlug = 'privacy-policy' | 'terms-conditions' | 'about-us';

export interface PrivacyPolicyPage {
  title: string;
  description: string;
}

export interface TermsConditionsPage {
  title?: string;
  description: string;
}

export interface AboutUsSection {
  image: string | null;
  title: string;
  caption: string;
  description: string;
}

export interface ContactUsSection {
  email: string;
  url: string;
}

export interface AboutUsPage {
  about_us: AboutUsSection;
  contact_us: ContactUsSection;
}

export interface SimplePageForm {
  title: string;
  description: string;
}

export interface AboutUsForm extends SimplePageForm {
  caption: string;
  email: string;
  url: string;
}

export type PageFormState = SimplePageForm | AboutUsForm;
