import React, { useState } from 'react';
import {
  X,
  Trash2,
  Send,
  MessageCircle,
  ShoppingBag,
  CheckCircle2,
  Plus,
  Minus,
  Mail,
} from 'lucide-react';
import { useInquiry } from '../../context/InquiryContext';

export const InquiryDrawer: React.FC = () => {
  const { items, removeItem, updateItem, clearBasket, isDrawerOpen, setIsDrawerOpen } =
    useInquiry();

  const [step, setStep] = useState<'list' | 'form' | 'success'>('list');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    whatsapp: '',
    projectType: 'Architectural Facade / Commercial',
    needSample: true,
    message: '',
  });

  const totalCount = items.reduce((acc, i) => acc + i.qty, 0);

  const buildSummaryText = () => {
    const lines = items.map(
      (item, idx) =>
        `${idx + 1}. ${item.model} (${item.itemNo}) | CCT: ${item.cct} | Power: ${
          item.wattage
        } | Run: ${item.lengthM}m × ${item.qty} reels | Entry: ${item.cableEntry}${
          item.note ? ` | Note: ${item.note}` : ''
        }`
    );
    return [
      `Hello TYRIA Lighting Engineering Team,`,
      `I would like to request a quote / sample kit for the following models:`,
      ...lines,
      ``,
      `Contact: ${formData.name || 'Engineer'} (${formData.company || 'Studio'}, ${
        formData.country || 'International'
      })`,
      `Email: ${formData.email}`,
      `Project Type: ${formData.projectType}`,
      `Free Sample Requested: ${formData.needSample ? 'Yes' : 'No'}`,
      formData.message ? `Notes: ${formData.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      submittedAt: new Date().toISOString(),
      contact: formData,
      items,
      summary: buildSummaryText(),
    };

    const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // Fallback gracefully to local confirmation + WhatsApp/Email actions
      }
    }

    setSubmitting(false);
    setStep('success');
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(buildSummaryText());
    window.open(`https://wa.me/8618938693458?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleEmailDirect = () => {
    const subject = encodeURIComponent(
      `RFQ & Sample Inquiry — ${formData.company || 'Lighting Project'} (${items.length} Models)`
    );
    const body = encodeURIComponent(buildSummaryText());
    window.location.href = `mailto:info@tyrialight.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Floating Right-Bottom Action Stack */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        <a
          href="https://wa.me/8618938693458?text=Hello%20TYRIA%20Lighting%2C%20I%20am%20inquiring%20about%20LED%20Neon%20Flex%20and%20IES%20files."
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[#16A34A] hover:bg-[#15803D] text-white font-mono text-xs font-medium shadow-lg transition-transform hover:scale-[1.02]"
          title="Chat with TYRIA Lighting Engineers on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp Engineer</span>
        </a>

        <button
          type="button"
          onClick={() => {
            setStep('list');
            setIsDrawerOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-primary)] font-mono text-xs font-semibold shadow-2xl glow-box hover:border-[var(--glow)] transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-[var(--glow)]" />
          <span>RFQ Basket ({totalCount})</span>
        </button>
      </div>

      {/* Slide-Over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[var(--bg-elevated)] border-l border-[var(--border-hairline)] h-full flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[var(--border-hairline)] flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  Engineering RFQ & Sample Basket
                </h2>
                <p className="font-mono text-xs text-[var(--text-muted)]">
                  Reply within 12 hours · Direct factory specification review
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Close Inquiry Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === 'list' && (
                <>
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                      <ShoppingBag className="w-10 h-10 text-[var(--text-muted)] stroke-[1.25]" />
                      <div className="font-display font-semibold text-base text-[var(--text-primary)]">
                        Your RFQ & Sample Basket is Empty
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] max-w-xs">
                        Add Silicone Neon Flex profiles, COB strips, or Wall Grazers from any product card or the Profile Atlas to build a structured specification inquiry.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.productId}
                          className="p-4 bg-[var(--bg-primary)] border border-[var(--border-hairline)] space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-display font-semibold text-sm text-[var(--text-primary)]">
                                {item.model}
                              </div>
                              <div className="font-mono text-xs text-[#1E6FD9]">
                                {item.itemNo} · {item.family}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="text-[var(--text-muted)] hover:text-red-400 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                            <div>
                              <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                                CCT / COLOR
                              </label>
                              <input
                                type="text"
                                value={item.cct}
                                onChange={(e) =>
                                  updateItem(item.productId, { cct: e.target.value })
                                }
                                className="w-full px-2 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                                WATTAGE
                              </label>
                              <input
                                type="text"
                                value={item.wattage}
                                onChange={(e) =>
                                  updateItem(item.productId, { wattage: e.target.value })
                                }
                                className="w-full px-2 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                                TOTAL METERS
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={item.lengthM}
                                onChange={(e) =>
                                  updateItem(item.productId, {
                                    lengthM: Math.max(1, Number(e.target.value)),
                                  })
                                }
                                className="w-full px-2 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                                CABLE ENTRY
                              </label>
                              <select
                                value={item.cableEntry}
                                onChange={(e) =>
                                  updateItem(item.productId, {
                                    cableEntry: e.target.value as
                                      | 'Front'
                                      | 'Side'
                                      | 'Bottom'
                                      | 'Standard',
                                  })
                                }
                                className="w-full px-2 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                              >
                                <option value="Front">Front Entry</option>
                                <option value="Side">Side Entry</option>
                                <option value="Bottom">Bottom Entry</option>
                                <option value="Standard">Standard Lead</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <input
                              type="text"
                              placeholder="Custom cut length, dimmer protocol, or profile note..."
                              value={item.note}
                              onChange={(e) =>
                                updateItem(item.productId, { note: e.target.value })
                              }
                              className="flex-1 mr-3 px-2.5 py-1 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                            />
                            <div className="flex items-center border border-[var(--border-hairline)] bg-[var(--bg-elevated)] font-mono text-xs">
                              <button
                                type="button"
                                onClick={() =>
                                  updateItem(item.productId, {
                                    qty: Math.max(1, item.qty - 1),
                                  })
                                }
                                className="px-2 py-1 hover:bg-[var(--bg-surface)]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 tabular-nums">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateItem(item.productId, { qty: item.qty + 1 })
                                }
                                className="px-2 py-1 hover:bg-[var(--bg-surface)]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 'form' && (
                <form id="rfq-submit-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-hairline)] font-mono text-xs text-[var(--text-secondary)]">
                    Selected {items.length} model(s) · {totalCount} batch unit(s). Complete your project details below to receive quotation, IES pack, and sample dispatch schedule.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-mono text-[11px] text-[var(--text-secondary)] mb-1">
                        YOUR NAME *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Marcus Vance"
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-[var(--text-secondary)] mb-1">
                        COMPANY / STUDIO *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Atelier Luminance GmbH"
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-[var(--text-secondary)] mb-1">
                        WORK EMAIL *
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@studio.com"
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-[var(--text-secondary)] mb-1">
                        COUNTRY / REGION *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. Germany / UAE / UK / USA"
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-[var(--text-secondary)] mb-1">
                        WHATSAPP / PHONE
                      </label>
                      <input
                        type="text"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+49 / +971 / +44 ..."
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-[var(--text-secondary)] mb-1">
                        APPLICATION TYPE
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) =>
                          setFormData({ ...formData, projectType: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                      >
                        <option>Architectural Facade / Exterior</option>
                        <option>Hospitality & Luxury Hotel</option>
                        <option>Commercial Office (UGR&lt;19)</option>
                        <option>Retail & Brand Signage</option>
                        <option>Landscape / Pool IP68</option>
                        <option>OEM / Wholesale Distribution</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.needSample}
                      onChange={(e) =>
                        setFormData({ ...formData, needSample: e.target.checked })
                      }
                      className="accent-[#1E6FD9]"
                    />
                    <span>Include Free Engineering Sample Box (0.5m cut samples + end-cap kit)</span>
                  </label>

                  <div>
                    <label className="block font-mono text-[11px] text-[var(--text-secondary)] mb-1">
                      PROJECT NOTES & CUSTOMIZATION (IP68 LEAD LENGTH, ALUMINIUM PROFILES, DALI/DMX)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify required custom reel lengths, dimming protocols, or delivery timeline..."
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                    />
                  </div>
                </form>
              )}

              {step === 'success' && (
                <div className="py-10 space-y-5 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                      Specification Inquiry Logged
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                      Our Shenzhen optical engineering team will review your {items.length} selected model(s) and reply within 12 hours with factory pricing, custom cutting drawings, and IES verification.
                    </p>
                  </div>

                  <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-left font-mono text-[11px] whitespace-pre-wrap text-[var(--text-secondary)] max-h-48 overflow-y-auto">
                    {buildSummaryText()}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-mono text-xs font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send Immediately via WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleEmailDirect}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E6FD9] hover:bg-[#185EC0] text-white font-mono text-xs font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Send via Email Client
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-[var(--border-hairline)] bg-[var(--bg-primary)] flex items-center justify-between gap-3">
              {step === 'list' && items.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={clearBasket}
                    className="text-xs font-mono text-[var(--text-muted)] hover:text-red-400"
                  >
                    Clear All
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="px-3 py-2 border border-[var(--border-hairline)] hover:border-white/30 text-xs font-mono flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      WhatsApp List
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="px-5 py-2 bg-[#1E6FD9] hover:bg-[#185EC0] text-white text-xs font-mono font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Proceed to Send Inquiry →
                    </button>
                  </div>
                </>
              )}

              {step === 'form' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStep('list')}
                    className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    ← Back to Models
                  </button>
                  <button
                    type="submit"
                    form="rfq-submit-form"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#1E6FD9] hover:bg-[#185EC0] text-white text-xs font-mono font-semibold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting...' : 'Submit Structured RFQ'}
                  </button>
                </>
              )}

              {step === 'success' && (
                <button
                  type="button"
                  onClick={() => {
                    clearBasket();
                    setStep('list');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full py-2 border border-[var(--border-hairline)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Done & Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
