import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    whatsapp: '',
    interest: 'Silicone LED Neon Flex Sample Kit',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'contact_sample_request', ...form }),
        });
      } catch {
        // fallback gracefully
      }
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-14 bg-[var(--bg-primary)]">
      <SEOHead
        title="Contact TYRIA LIGHTING & Request Free Engineering Samples"
        description="Contact Shenzhen Tyria Lighting Technology Co., Ltd. Request free LED neon flex and COB strip sample kits, custom quotes, or IES files. Guaranteed response within 12 hours."
        canonicalPath="/contact"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Heading */}
        <div className="border-b border-[var(--border-hairline)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-medium text-3xl sm:text-5xl tracking-tight text-[var(--text-primary)]">
              Contact & Sample Request Desk
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[64ch]">
              Direct communication with TYRIA optical and structural sales engineers in Shenzhen. No middlemen — receive specification quotes, custom cutting drawings, and sample tracking numbers.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-mono text-xs shrink-0">
            <Clock className="w-4 h-4" />
            <span>GUARANTEED REPLY WITHIN 12 HOURS</span>
          </div>
        </div>

        {/* 12-Col Layout: Contact Details (5 cols) + Form (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Direct Channels & Factory Addresses */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-4">
              <div className="font-mono text-xs text-[#111111] font-semibold">
                DIRECT ENGINEERING CHANNELS
              </div>

              <div className="space-y-3 font-mono text-xs">
                <a
                  href="https://wa.me/8618938693458?text=Hello%20TYRIA%20Lighting%2C%20I%20have%20a%20project%20inquiry."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 bg-[#16A34A]/15 border border-[#16A34A]/40 hover:bg-[#16A34A]/25 text-[var(--text-primary)] transition-colors"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    WhatsApp Instant Chat
                  </span>
                  <span className="text-emerald-700">+86 189 3869 3458 →</span>
                </a>

                <a
                  href="mailto:info@tyrialight.com"
                  className="flex items-center justify-between p-3.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] hover:border-white/30 text-[var(--text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#111111]" />
                    Official Email
                  </span>
                  <span>info@tyrialight.com</span>
                </a>

                <a
                  href="tel:+8675536931652"
                  className="flex items-center justify-between p-3.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] hover:border-white/30 text-[var(--text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#111111]" />
                    Factory Landline
                  </span>
                  <span>+86 755 3693 1652</span>
                </a>
              </div>
            </div>

            <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-4 text-xs">
              <div className="font-mono text-xs text-[#111111] font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>TWO SHENZHEN MANUFACTURING BASES</span>
              </div>

              <div className="space-y-1 pb-3 border-b border-[var(--border-hairline)]">
                <div className="font-display font-medium text-sm text-[var(--text-primary)]">
                  Factory 1 (HQ, Silicone Neon Co-Extrusion & Photometric Lab)
                </div>
                <p className="text-[var(--text-secondary)]">
                  2F, D Building, Antonio Technology Park, Ma&apos;anshan Community, Shajing Street, Bao&apos;an District, Shenzhen, Guangdong, China
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-display font-medium text-sm text-[var(--text-primary)]">
                  Factory 2 (SMD LED Packaging & Automated SMT Base)
                </div>
                <p className="text-[var(--text-secondary)]">
                  Shancheng Industrial Zone, Shiyan Town, Bao&apos;an District, Shenzhen, Guangdong, China
                </p>
              </div>
            </div>
          </div>

          {/* Right Sample & Quote Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h2 className="font-display font-medium text-2xl text-[var(--text-primary)]">
                  Thank You — Your Request Has Been Received
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  A senior TYRIA lighting engineer will respond to <span className="font-mono text-[var(--text-primary)]">{form.email}</span> within 12 hours with your requested datasheets, IES files, and sample dispatch details.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 border border-[var(--border-hairline)] font-mono text-xs"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display font-medium text-xl text-[var(--text-primary)]">
                  Request Free Engineering Samples or Project Quote
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                      YOUR NAME *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                      COMPANY / DESIGN STUDIO *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Company Name"
                      className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                      WORK EMAIL *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                      COUNTRY / CITY *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      placeholder="e.g. London, UK / Dubai, UAE"
                      className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                      WHATSAPP / MOBILE
                    </label>
                    <input
                      type="text"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="+44 / +49 / +1 ..."
                      className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                      PRIMARY INTEREST
                    </label>
                    <select
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                    >
                      <option>Silicone LED Neon Flex Sample Kit</option>
                      <option>160–180lm/W & COB LED Strip Sample Kit</option>
                      <option>Flexible Wall Grazer 2621 Pro / 1615</option>
                      <option>Anti-Glare UGR&lt;19 Office Series</option>
                      <option>Custom Profile / OEM Distribution Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="font-mono text-xs">
                  <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                    PROJECT SPECIFICATIONS (MODELS, CCT, WATTAGE, REQUIRED METERS) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us which cross-section sizes (e.g. 1617 TV, 1220 SV, R25 360°), CCT, IP rating, or custom lead lengths your project requires..."
                    className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Specification & Sample Request (12h Response)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
