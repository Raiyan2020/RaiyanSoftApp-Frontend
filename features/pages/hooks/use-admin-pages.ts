'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AboutUsForm, PageSlug, SimplePageForm } from '../types/page.types';
import { usePrivacyPolicy } from './use-privacy-policy';
import { useTermsConditions } from './use-terms-conditions';
import { useAdminAboutUs } from './use-about-us';
import { useUpdatePage } from './use-update-page';
import { translateMessage } from '@/lib/i18n-utils';

const emptySimpleForm = (): SimplePageForm => ({
  title: '',
  description: '',
});

const emptyAboutForm = (): AboutUsForm => ({
  title: '',
  description: '',
  caption: '',
  email: '',
  url: '',
});

const validTabs: PageSlug[] = ['privacy-policy', 'terms-conditions', 'about-us'];

export function useAdminPages() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as PageSlug | null;
  const [activeTab, setActiveTab] = useState<PageSlug>(
    tabParam && validTabs.includes(tabParam) ? tabParam : 'privacy-policy'
  );

  const [privacyForm, setPrivacyForm] = useState<SimplePageForm>(emptySimpleForm);
  const [termsForm, setTermsForm] = useState<SimplePageForm>(emptySimpleForm);
  const [aboutForm, setAboutForm] = useState<AboutUsForm>(emptyAboutForm);

  const privacy = usePrivacyPolicy();
  const terms = useTermsConditions();
  const about = useAdminAboutUs();

  const privacyUpdate = useUpdatePage('privacy-policy');
  const termsUpdate = useUpdatePage('terms-conditions');
  const aboutUpdate = useUpdatePage('about-us');

  // The four blocks below adjust state during render (comparing against the
  // previous value of the relevant dependency) instead of using effects, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }

  const [prevPrivacyData, setPrevPrivacyData] = useState(privacy.data);
  if (privacy.data !== prevPrivacyData) {
    setPrevPrivacyData(privacy.data);
    if (privacy.data) {
      setPrivacyForm({
        title: privacy.data.title || '',
        description: privacy.data.description || '',
      });
    }
  }

  const [prevTermsData, setPrevTermsData] = useState(terms.data);
  if (terms.data !== prevTermsData) {
    setPrevTermsData(terms.data);
    if (terms.data) {
      setTermsForm({
        title: terms.data.title || translateMessage('Terms and Conditions'),
        description: terms.data.description || '',
      });
    }
  }

  const [prevAboutData, setPrevAboutData] = useState(about.data);
  if (about.data !== prevAboutData) {
    setPrevAboutData(about.data);
    if (about.data) {
      setAboutForm({
        title: about.data.title || '',
        caption: about.data.caption || '',
        description: about.data.description || '',
        email: about.data.email || '',
        url: about.data.url || '',
      });
    }
  }

  const activeState = useMemo(() => {
    if (activeTab === 'privacy-policy') {
      return {
        form: privacyForm,
        setForm: (value: SimplePageForm | AboutUsForm) => setPrivacyForm(value as SimplePageForm),
        loading: privacy.loading,
        error: privacy.error,
        saveLoading: privacyUpdate.loading,
        saveError: privacyUpdate.error,
        saveMessage: privacyUpdate.message,
        save: () => privacyUpdate.save(privacyForm),
        reload: privacy.reload,
      };
    }

    if (activeTab === 'terms-conditions') {
      return {
        form: termsForm,
        setForm: (value: SimplePageForm | AboutUsForm) => setTermsForm(value as SimplePageForm),
        loading: terms.loading,
        error: terms.error,
        saveLoading: termsUpdate.loading,
        saveError: termsUpdate.error,
        saveMessage: termsUpdate.message,
        save: () => termsUpdate.save(termsForm),
        reload: terms.reload,
      };
    }

    return {
      form: aboutForm,
      setForm: (value: SimplePageForm | AboutUsForm) => setAboutForm(value as AboutUsForm),
      loading: about.loading,
      error: about.error,
      saveLoading: aboutUpdate.loading,
      saveError: aboutUpdate.error,
      saveMessage: aboutUpdate.message,
      save: () => aboutUpdate.save(aboutForm),
      reload: about.reload,
    };
  }, [
    activeTab,
    privacyForm,
    termsForm,
    aboutForm,
    privacy,
    terms,
    about,
    privacyUpdate,
    termsUpdate,
    aboutUpdate,
  ]);

  const changeTab = useCallback((tab: PageSlug) => {
    setActiveTab(tab);
    privacyUpdate.clearFeedback();
    termsUpdate.clearFeedback();
    aboutUpdate.clearFeedback();
  }, [privacyUpdate, termsUpdate, aboutUpdate]);

  return {
    activeTab,
    changeTab,
    privacyForm,
    setPrivacyForm,
    termsForm,
    setTermsForm,
    aboutForm,
    setAboutForm,
    activeState,
  };
}
