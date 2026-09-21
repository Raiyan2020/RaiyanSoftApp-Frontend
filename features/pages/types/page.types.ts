export type PageSlug = 'privacy-policy' | 'terms-conditions' | 'about-us';

export interface PrivacyPolicyPage {
  title: string;
  description: string;
}

export interface TermsConditionsPage {
  title?: string;
  description: string;
}

export interface AboutUsPage {
  id?: number;
  slug?: PageSlug;
  title: string;
  description: string;
  image: string | null;
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
