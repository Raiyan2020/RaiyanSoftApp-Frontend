'use client';
import { useEffect, useRef, useState } from 'react';

const contactMethods = [
  {
    label: 'البريد الإلكتروني',
    value: 'info@raiyansoft.com',
    hint: 'للعروض والتفاصيل الرسمية',
  },
  {
    label: 'رقم الهاتف',
    value: '+966 50 000 0000',
    hint: 'للاستفسارات السريعة',
  },
  {
    label: 'الموقع',
    value: 'المملكة العربية السعودية',
    hint: 'نخدم المشاريع عن بعد وحضورياً',
  },
];

const promises = ['رد خلال يوم عمل', 'استشارة أولى مجانية', 'خطة تنفيذ واضحة', 'خصوصية كاملة للفكرة'];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = 'w-full rounded-2xl border border-cyan-950/10 bg-slate-50 px-4 py-3.5 text-slate-950 placeholder-slate-400 transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:focus:bg-white/10';

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-50 py-24 dark:bg-navy-900 lg:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute right-10 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            تواصل معنا
          </div>
          <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
            ابدأ بخطوة صغيرة، <span className="gradient-text">ونرتب الباقي معاً</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            أخبرنا عن فكرتك وسنرد عليك بتصور أولي: ما الذي تحتاجه، كيف نبدأ، وما المرحلة الأنسب لميزانيتك.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <aside className="reveal space-y-5 lg:col-span-2">
            <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-cyan-950/20">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-2xl font-black">
                24h
              </div>
              <h3 className="text-2xl font-bold">ماذا يحدث بعد الإرسال؟</h3>
              <div className="mt-6 space-y-4">
                {['نراجع تفاصيل المشروع', 'نتواصل لتوضيح النقاط المهمة', 'نقترح المسار والمرحلة الأولى'].map((step, i) => (
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
                  <p className="mt-1 font-bold text-slate-950 dark:text-white" dir={item.value.startsWith('+') ? 'ltr' : 'rtl'}>{item.value}</p>
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
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">تم إرسال رسالتك بنجاح</h3>
                  <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-300">وصلتنا تفاصيلك، وسنراجعها ونعود لك بالخطوة التالية في أقرب وقت.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                    className="premium-button touch-lift mt-7 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3 font-bold text-white shadow-lg shadow-primary/25"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-sm font-bold text-slate-700 dark:text-slate-200">الاسم الكامل *</label>
                      <input id="contact-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اكتب اسمك" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-sm font-bold text-slate-700 dark:text-slate-200">البريد الإلكتروني *</label>
                      <input id="contact-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" className={inputClass} dir="ltr" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="contact-phone" className="text-sm font-bold text-slate-700 dark:text-slate-200">رقم الجوال</label>
                      <input id="contact-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+966 5X XXX XXXX" className={inputClass} dir="ltr" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-service" className="text-sm font-bold text-slate-700 dark:text-slate-200">نوع الخدمة</label>
                      <select id="contact-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inputClass}>
                        <option value="">اختر الخدمة</option>
                        <option value="mobile">تطبيق جوال</option>
                        <option value="web">موقع أو منصة ويب</option>
                        <option value="ecommerce">متجر إلكتروني</option>
                        <option value="identity">هوية بصرية</option>
                        <option value="other">غير ذلك</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-sm font-bold text-slate-700 dark:text-slate-200">تفاصيل المشروع *</label>
                    <textarea id="contact-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="صف الفكرة، الهدف، والموعد المتوقع إن وجد..." className={`${inputClass} resize-none`} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {promises.map((promise) => (
                      <span key={promise} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">{promise}</span>
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
                        جارٍ إرسال الرسالة...
                      </>
                    ) : 'أرسل تفاصيل المشروع'}
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
