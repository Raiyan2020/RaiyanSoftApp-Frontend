'use client';

import React, { useState } from 'react';
import { Layout } from 'lucide-react';
import AdminHeroTab from './admin-hero-tab';
import AdminServicesTab from './admin-services-tab';
import AdminCapabilitiesTab from './admin-capabilities-tab';
import AdminOffersTab from './admin-offers-tab';
import AdminTestimonialsTab from './admin-testimonials-tab';
import AdminFaqsTab from './admin-faqs-tab';
import AdminAboutUsTab from './admin-about-us-tab';
import AdminAboutUsSubmissionsTab from './admin-about-us-submissions-tab';
import AdminBannersTab from './admin-banners-tab';
import AdminSettingsTab from './admin-settings-tab';
import AdminSocialMediaTab from './admin-social-media-tab';
import { translateMessage } from '@/lib/i18n-utils';

type Tab = 'hero' | 'services' | 'capabilities' | 'offers' | 'testimonials' | 'faqs' | 'about-us' | 'about-us-submissions' | 'banners' | 'settings' | 'social-media';

const TABS: { id: Tab; label: string }[] = [
  { id: 'hero',          label: 'Hero Section' },
  { id: 'services',      label: 'Services' },
  { id: 'capabilities',  label: 'Capabilities' },
  { id: 'offers',        label: 'Offers' },
  { id: 'testimonials',  label: 'Testimonials' },
  { id: 'faqs',          label: 'FAQs' },
  { id: 'about-us',      label: 'About Us' },
  { id: 'about-us-submissions', label: 'About Us Submissions' },
  { id: 'banners',       label: 'Banners' },
  { id: 'settings',      label: 'Site Settings' },
  { id: 'social-media',  label: 'Social Media' },
];

export default function AdminLandingPagePage() {
  const [activeTab, setActiveTab] = useState<Tab>('hero');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
          <Layout size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Landing Page')}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {translateMessage('Manage all landing page sections and content.')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[90px] whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {translateMessage(tab.label)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'hero'          && <AdminHeroTab />}
        {activeTab === 'services'      && <AdminServicesTab />}
        {activeTab === 'capabilities'  && <AdminCapabilitiesTab />}
        {activeTab === 'offers'        && <AdminOffersTab />}
        {activeTab === 'testimonials'  && <AdminTestimonialsTab />}
        {activeTab === 'faqs'          && <AdminFaqsTab />}
        {activeTab === 'about-us'      && <AdminAboutUsTab />}
        {activeTab === 'about-us-submissions' && <AdminAboutUsSubmissionsTab />}
        {activeTab === 'banners'       && <AdminBannersTab />}
        {activeTab === 'settings'      && <AdminSettingsTab />}
        {activeTab === 'social-media'  && <AdminSocialMediaTab />}
      </div>
    </div>
  );
}
