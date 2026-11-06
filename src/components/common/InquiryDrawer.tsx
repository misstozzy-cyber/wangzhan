import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInquiry } from '../../context/InquiryContext';

const SILK = [0.22, 1, 0.36, 1] as const;

const input =
  'w-full rounded-[18px] bg-stone/55 px-4 py-3 text-[14px] text-ink placeholder:text-mute transition-colors focus:bg-paper focus:outline-none focus:shadow-[0_10px_24px_-16px_rgba(17,17,17,0.5)]';

export const InquiryDrawer: React.FC = () => {
  const { items, removeItem, updateItem, clearBasket, isDrawerOpen, setIsDrawerOpen } = useInquiry();
  const [step, setStep] = useState<'list' | 'form' | 'success'>('list');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', country: '', email: '', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const summary = () =>
    [
      'Hello Tyria Lighting,',
      'I would like samples / a quote for:',
      ...items.map(
        (it, i) =>
          `${i + 1}. ${it.model} (${it.itemNo}) | ${it.cct} | ${it.wattage} | ${it.lengthM} m × ${it.qty} | entry: ${it.cableEntry}`,
      ),
      '',
      `${form.name}${form.company ? `, ${form.company}` : ''}${form.country ? ` (${form.country})` : ''}`,
      form.email,
      form.message,
    ]
      .filter(Boolean)
      .join('\n');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submittedAt: new Date().toISOString(), contact: form, items, summary: summary() }),
        });
      } catch {
        // the success screen still offers WhatsApp and email
      }
    }
    setSubmitting(false);
    setStep('success');
  };

  const close = () => {
    setIsDrawerOpen(false);
    if (step === 'success') {
      clearBasket();
      setStep('list');
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-ink/25 backdrop-blur-sm" onClick={close} />
          <motion.aside
            data-lenis-prevent
            initial={{ x: '105%', scale: 0.96 }}
            animate={{ x: 0, scale: 1 }}
            exit={{ x: '105%', scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            className="absolute bottom-3 right-3 top-3 flex w-[calc(100%-24px)] max-w-[520px] flex-col overflow-hidden rounded-[32px] bg-canvas shadow-[0_40px_100px_-40px_rgba(17,17,17,0.6)]"
          >
            <div className="flex items-center justify-between px-7 pb-4 pt-7">
              <div>
                <div className="micro">Sample request</div>
                <div className="mt-1 font-display text-[28px] font-light tracking-[-0.04em] text-ink">
                  {step === 'success' ? 'Sent.' : step === 'form' ? 'Your details' : `${items.length} model${items.length === 1 ? '' : 's'}`}
                </div>
              </div>
              <button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-full bg-stone/70 text-ink transition-transform duration-500 ease-silk hover:rotate-90" aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <AnimatePresence mode="wait" initial={false}>
                {step === 'list' && (
                  <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: SILK }}>
                    {items.length === 0 ? (
                      <p className="px-3 py-10 text-[15px] text-graphite">Your list is empty. Add models from any product page.</p>
                    ) : (
                      <ul className="space-y-2">
                        <AnimatePresence initial={false}>
                          {items.map((it) => (
                            <motion.li
                              key={it.productId}
                              layout
                              exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.4, ease: SILK }}
                              className="rounded-[24px] bg-paper p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="truncate font-display text-[18px] tracking-[-0.025em] text-ink">{it.model}</div>
                                  <div className="truncate font-mono text-[10.5px] text-mute">{it.itemNo}</div>
                                </div>
                                <button type="button" onClick={() => removeItem(it.productId)} className="rounded-full px-3 py-1 text-[12px] text-mute hover:bg-stone/70 hover:text-ink">
                                  Remove
                                </button>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {[it.cct, it.wattage, `Entry ${it.cableEntry}`].filter(Boolean).map((t) => (
                                  <span key={t} className="rounded-full bg-stone/60 px-3 py-1 text-[12px] text-graphite">{t}</span>
                                ))}
                              </div>
                              <div className="mt-3 flex items-center gap-3">
                                <span className="micro">Length</span>
                                <div className="flex items-center rounded-full bg-stone/60 p-1">
                                  <button type="button" onClick={() => updateItem(it.productId, { lengthM: Math.max(1, it.lengthM - 5) })} className="grid h-7 w-7 place-items-center rounded-full hover:bg-paper">−</button>
                                  <span className="w-14 text-center text-[13px] tabular-nums">{it.lengthM} m</span>
                                  <button type="button" onClick={() => updateItem(it.productId, { lengthM: it.lengthM + 5 })} className="grid h-7 w-7 place-items-center rounded-full hover:bg-paper">+</button>
                                </div>
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </motion.div>
                )}

                {step === 'form' && (
                  <motion.form id="rfq-form" key="form" onSubmit={submit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4, ease: SILK }} className="space-y-2.5 px-3">
                    <input className={input} placeholder="Name *" required value={form.name} onChange={set('name')} />
                    <input className={input} placeholder="Company" value={form.company} onChange={set('company')} />
                    <input className={input} placeholder="Email *" type="email" required value={form.email} onChange={set('email')} />
                    <input className={input} placeholder="Country" value={form.country} onChange={set('country')} />
                    <textarea className={`${input} resize-none`} rows={4} placeholder="Project notes" value={form.message} onChange={set('message')} />
                  </motion.form>
                )}

                {step === 'success' && (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: SILK }} className="px-3 py-6">
                    <p className="text-[15px] leading-relaxed text-graphite">
                      Thank you. We will reply to {form.email}. For a faster answer, send the same list directly:
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <a className="pill-ink h-11" href={`https://wa.me/8618938693458?text=${encodeURIComponent(summary())}`} target="_blank" rel="noreferrer">WhatsApp</a>
                      <a className="pill-soft h-11" href={`mailto:info@tyrialight.com?subject=${encodeURIComponent('Sample request')}&body=${encodeURIComponent(summary())}`}>Email</a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {step !== 'success' && items.length > 0 && (
              <div className="flex items-center justify-between gap-3 px-7 pb-7 pt-3">
                {step === 'form' ? (
                  <button type="button" onClick={() => setStep('list')} className="text-[14px] text-graphite hover:text-ink">← Back</button>
                ) : (
                  <button type="button" onClick={clearBasket} className="text-[14px] text-graphite hover:text-ink">Clear</button>
                )}
                {step === 'list' ? (
                  <button type="button" onClick={() => setStep('form')} className="pill-ink h-12 px-7">Continue</button>
                ) : (
                  <button type="submit" form="rfq-form" disabled={submitting} className="pill-ink h-12 px-7">
                    {submitting ? 'Sending…' : 'Send request'}
                  </button>
                )}
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
