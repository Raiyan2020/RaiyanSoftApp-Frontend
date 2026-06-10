'use client';
import { useRef, useState } from 'react';
import { useSectionReveal } from './use-section-reveal';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import PhoneInput from '@/components/ui/phone-input';

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, contactMethods, textAlign } = useLandingContent();
  const { contact } = content;

  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass =
    'w-full rounded-2xl border border-cyan-950/10 bg-slate-50 px-4 py-3.5 text-slate-950 placeholder-slate-400 transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:focus:bg-white/10';

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-50 py-12 dark:bg-navy-900 sm:py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute right-10 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal mb-10 text-center lg:mb-12 ${textAlign}`}>
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            {contact.badge}
          </div>
          <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
            {contact.title} <span className="gradient-text">{contact.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {contact.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <aside className="reveal space-y-5 lg:col-span-2">
            <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-cyan-950/20">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-2xl font-black">
                24h
              </div>
              <h3 className="text-2xl font-bold">{contact.sidebarTitle}</h3>
              <div className="mt-6 space-y-4">
                {contact.sidebarSteps.map((step, i) => (
                  <div key={step} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-black text-primary">{i + 1}</span>
                    <p className="text-sm font-semibold leading-relaxed text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {contactMethods.map((item) => (
                <div key={item.label} className="rounded-3xl border border-cyan-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs font-bold text-primary">{item.label}</p>
                  <p className="mt-1 font-bold text-slate-950 dark:text-white" dir={item.dir}>
                    {item.value}
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
                  <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-emerald-400/15 text-4xl text-emerald-500">✓</div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">{contact.form.successTitle}</h3>
                  <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-300">{contact.form.successDescription}</p>
                  <button
                    type="button"
                      onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', service: '', message: '' });
                      setPhone('');
                    }}
                    className="premium-button touch-lift mt-7 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3 font-bold text-white shadow-lg shadow-primary/25"
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
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {contact.form.email}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="contact-phone" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {contact.form.phone}
                      </label>
                      <PhoneInput value={phone} onChange={(value) => setPhone(value || '')} required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-service" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {contact.form.service}
                      </label>
                      <select
                        id="contact-service"
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">{contact.form.servicePlaceholder}</option>
                        {contact.serviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {contact.form.message}
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {contact.promises.map((promise) => (
                      <span key={promise} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                        {promise}
                      </span>
                    ))}
                  </div>

                  <button
                    id="contact-submit"
                    type="submit"
                    disabled={loading}
                    className="premium-button touch-lift flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-primary to-primary-dark py-4 text-lg font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
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
