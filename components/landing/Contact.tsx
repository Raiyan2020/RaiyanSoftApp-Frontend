'use client';
import { useRef, useState } from 'react';
import { useSectionReveal } from './use-section-reveal';
import SectionHeader from './SectionHeader';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import PhoneInput from '@/components/ui/phone-input';
import { FieldError } from '@/components/ui/field';
import { getPhoneError } from '@/lib/phone';
import { useSubmitLandingAboutUsForm, type LandingPageContent } from '@/features/landing-page';
import PageHtmlContent from '@/features/pages/components/page-html-content';

type ContactProps = {
  homeData?: LandingPageContent | null;
};

export default function Contact({ homeData }: ContactProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, contactMethods } = useLandingContent();
  const { contact } = content;
  const banner = homeData?.banners?.project;

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const submitForm = useSubmitLandingAboutUsForm();
  const loading = submitForm.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextPhoneError = getPhoneError(phone);
    setPhoneError(nextPhoneError);
    if (nextPhoneError) return;
    try {
      await submitForm.mutateAsync({
        full_name: form.name,
        email: form.email,
        phone,
        project_details: form.message,
      });
      setSubmitted(true);
    } catch {
      // The shared API client already shows the backend validation/network toast.
    }
  };


  return (
    <section id="contact" className="relative overflow-hidden bg-slate-50 py-12 dark:bg-navy-900 sm:py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute end-10 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 start-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={<>{contact.title} <span className="gradient-text">{contact.titleHighlight}</span></>}
          description={contact.description}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <aside className="reveal space-y-5 lg:col-span-2">
            <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-cyan-950/20">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-2xl font-black">
                {banner?.caption ? banner.caption.slice(0, 2) : '24h'}
              </div>
              <h3 className="text-2xl font-bold">{banner?.title || contact.sidebarTitle}</h3>
              {banner?.description ? (
                <PageHtmlContent html={banner.description} className="mt-3 text-sm leading-relaxed text-slate-300" />
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{contact.description}</p>
              )}
              <div className="mt-6 space-y-4">
                {contact.sidebarSteps.map((step, i) => (
                  <div key={step} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-black text-cyan-300">{i + 1}</span>
                    <p className="text-sm font-semibold leading-relaxed text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {contactMethods.map((item) => (
                <div key={item.label} className="rounded-3xl border border-cyan-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs font-bold text-primary">{item.label}</p>
                  <p className="mt-1 font-bold text-slate-950 dark:text-white">
                    <bdi dir={item.dir}>{item.value}</bdi>
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.hint}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="reveal lg:col-span-3">
            <div className="rounded-[2rem] border border-cyan-950/10 bg-white p-5 shadow-2xl shadow-cyan-950/8 dark:border-white/10 dark:bg-white/5 sm:p-8">
              {submitted ? (
                <div className="py-14 text-center">
                  <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-emerald-400/15 text-4xl text-success">✓</div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">{contact.form.successTitle}</h3>
                  <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-300">{contact.form.successDescription}</p>
                  <button
                    type="button"
                      onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', message: '' });
                      setPhone('');
                    }}
                    className="premium-button touch-lift mt-7 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3 font-bold text-on-primary shadow-lg shadow-primary/25"
                  >
                    {contact.form.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {contact.form.name}
                      </label>
                      <Input
                        id="contact-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={contact.form.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {contact.form.email}
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={contact.form.email}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-phone" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {contact.form.phone}
                    </label>
                    <PhoneInput
                      id="contact-phone"
                      value={phone}
                      onChange={(value) => {
                        setPhone(value || '');
                        setPhoneError(undefined);
                      }}
                      placeholder={contact.form.phone}
                      required
                    />
                    <FieldError errors={[phoneError]} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {contact.form.message}
                    </label>
                    <Textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={contact.form.message}
                    />
                  </div>

                  <button
                    id="contact-submit"
                    type="submit"
                    disabled={loading}
                    className="premium-button touch-lift flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-primary to-primary-dark py-4 text-lg font-bold text-on-primary shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                        {contact.form.submitting}
                      </>
                    ) : (
                      contact.form.submit
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
