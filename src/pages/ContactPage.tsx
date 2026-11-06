import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SEOHead } from '../components/common/SEOHead';
import { useInquiry } from '../context/InquiryContext';

const SILK = [0.22, 1, 0.36, 1] as const;

const INTERESTS = ['Neon flex samples', 'LED strip samples', 'Wall grazer', 'LED sheet', 'Custom profile / OEM', 'Something else'];

const CHANNELS = [
  { k: 'Email', v: 'info@tyrialight.com', href: 'mailto:info@tyrialight.com' },
  { k: 'WhatsApp', v: '+86 189 3869 3458', href: 'https://wa.me/8618938693458' },
  { k: 'Phone', v: '+86 755 3693 1652', href: 'tel:+8675536931652' },
];

/** Text field whose label floats up out of the way when you type. */
function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const up = focus || value.length > 0;
  const common = {
    value,
    required,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    className: 'peer w-full bg-transparent px-5 pb-3 pt-7 text-[15px] text-ink focus:outline-none',
  };
  return (
    <label
      className={`relative block rounded-[22px] transition-all duration-500 ease-silk ${
        focus ? 'bg-paper shadow-[0_12px_30px_-18px_rgba(17,17,17,0.45)]' : 'bg-stone/55 hover:bg-stone/80'
      }`}
    >
      <motion.span
        animate={{ y: up ? -9 : 0, scale: up ? 0.78 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`pointer-events-none absolute left-5 top-[18px] origin-left text-[15px] ${up ? 'text-mute' : 'text-graphite'}`}
      >
        {label}
        {required && ' *'}
      </motion.span>
      {textarea ? (
        <textarea rows={5} {...common} onChange={(e) => onChange(e.target.value)} className={`${common.className} resize-none`} />
      ) : (
        <input type={type} {...common} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export const ContactPage: React.FC = () => {
  const { items, setIsDrawerOpen } = useInquiry();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', country: '', email: '', whatsapp: '', message: '' });
  const [interest, setInterest] = useState(INTERESTS[0]);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'contact', interest, ...form }),
        });
      } catch {
        // fall through to the thank-you state either way
      }
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen pb-[12vh] pt-32">
      <SEOHead
        title="Contact & Samples"
        description="Contact Shenzhen Tyria Lighting Technology Co., Ltd. for free engineering samples, quotes, datasheets and IES files."
        canonicalPath="/contact"
      />
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="micro mb-5">Contact</div>
          <h1 className="font-display text-[clamp(52px,7.4vw,128px)] font-light leading-[0.9] tracking-[-0.06em] text-ink">
            Let’s light it.
          </h1>
          <p className="mt-8 max-w-[40ch] text-[16px] leading-relaxed text-graphite">
            Tell us about the project. Engineers in Shenzhen reply with recommendations, quotes and free samples.
          </p>

          <ul className="mt-12 space-y-2">
            {CHANNELS.map((c) => (
              <li key={c.k}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-full bg-stone/50 py-3 pl-6 pr-3 transition-all duration-500 ease-silk hover:bg-ink hover:pl-8"
                >
                  <span>
                    <span className="micro block group-hover:text-canvas/60">{c.k}</span>
                    <span className="text-[16px] text-ink group-hover:text-canvas">{c.v}</span>
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-silk group-hover:rotate-45">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-5 text-[14px] leading-relaxed text-graphite">
            <p><span className="micro block mb-1">Factory 01 · HQ</span>Antonio Technology Park, Shajing, Bao’an, Shenzhen, China</p>
            <p><span className="micro block mb-1">Factory 02</span>Shancheng Industrial Zone, Shiyan, Bao’an, Shenzhen, China</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[40px] bg-paper p-6 shadow-[0_40px_80px_-50px_rgba(17,17,17,0.45)] sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: SILK }}
                  className="flex min-h-[520px] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
                    className="grid h-20 w-20 place-items-center rounded-full bg-ink text-canvas"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <motion.path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      />
                    </svg>
                  </motion.div>
                  <h2 className="mt-8 font-display text-[40px] font-light tracking-[-0.045em] text-ink">Thank you, {form.name.split(' ')[0] || 'friend'}.</h2>
                  <p className="mt-3 max-w-[40ch] text-[15px] text-graphite">We will reply to {form.email || 'you'} shortly.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                  <div className="micro mb-3">I’m interested in</div>
                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {INTERESTS.map((it) => (
                      <button
                        key={it}
                        type="button"
                        onClick={() => setInterest(it)}
                        className={`relative rounded-full px-4 py-2 text-[13px] ${interest === it ? '' : 'bg-stone/55'}`}
                      >
                        {interest === it && (
                          <motion.span layoutId="interest" transition={{ type: 'spring', stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-ink" />
                        )}
                        <span className={`relative ${interest === it ? 'text-canvas' : 'text-graphite'}`}>{it}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name" value={form.name} onChange={set('name')} required />
                    <Field label="Company" value={form.company} onChange={set('company')} />
                    <Field label="Email" type="email" value={form.email} onChange={set('email')} required />
                    <Field label="WhatsApp / phone" value={form.whatsapp} onChange={set('whatsapp')} />
                  </div>
                  <Field label="Country" value={form.country} onChange={set('country')} />
                  <Field label="Project, quantities, colour temperature…" value={form.message} onChange={set('message')} textarea />

                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(true)}
                      className="flex w-full items-center justify-between rounded-[22px] bg-ink/5 px-5 py-4 text-left text-[14px] text-ink transition-colors hover:bg-ink/10"
                    >
                      <span>{items.length} model{items.length > 1 ? 's' : ''} in your sample list</span>
                      <span className="text-graphite">Review →</span>
                    </button>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                    <span className="text-[12.5px] text-mute">We only use your details to answer this request.</span>
                    <button type="submit" className="pill-ink h-12 px-8">Send</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
