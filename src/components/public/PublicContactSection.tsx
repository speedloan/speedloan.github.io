import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  Building,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const PublicContactSection: React.FC = () => {
  const { contact, theme, branding, submitEnquiry, settings } = useBuilder();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestedAmount, setRequestedAmount] = useState<number>(250000);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'builtin' | 'google-form'>('builtin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const success = await submitEnquiry({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      productName: 'Direct Advisory Inquiry',
      requestedAmount: Number(requestedAmount),
      tenureMonths: 36,
      adminNotes: `Client Inquiry Note: ${message.trim() || 'No additional note provided.'}`,
    });

    setIsSubmitting(false);
    if (success) {
      setIsSubmitted(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span style={{ color: theme.accentColor }} className="text-xs font-extrabold uppercase tracking-widest block">
            GLOBAL ADVISORY DESKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect With {branding.companyName} Underwriting
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Reach out directly to our credit directors across New York, London, Zurich, and Singapore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Map Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-6 shadow-xl">
              <h3 className="text-lg font-bold tracking-tight">Global Headquarters &amp; Desks</h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Physical Center</span>
                    <span className="text-slate-300 leading-relaxed block mt-0.5">{contact.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneCall className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Toll-Free &amp; Direct</span>
                    <span className="text-slate-300 block mt-0.5">Toll-Free: {contact.tollFree}</span>
                    <span className="text-slate-400 block">Direct Line: {contact.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Corporate Correspondence</span>
                    <span className="text-blue-300 font-medium block mt-0.5">{contact.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Operating Schedule</span>
                    <span className="text-slate-400 block mt-0.5">{contact.operatingHours}</span>
                  </div>
                </div>
              </div>

              {/* Regional Office Badges */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Regional Lending Hubs
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {contact.branchLocations.slice(0, 4).map((b, i) => (
                    <div key={i} className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                      <span className="font-bold text-slate-200 block truncate">{b.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">{b.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            {contact.googleMapsEmbedUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-52">
                <iframe
                  title="Blue Wien Headquarters Location"
                  src={contact.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Quick Advisory Contact Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Request Direct Advisory Consultation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Complete this priority inquiry form. A senior underwriting advisor will respond within 4 hours.
            </p>

            {/* Google Form Switcher if enabled */}
            {settings.enableGoogleFormEmbed && settings.googleFormEmbedUrl && (
              <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-xl mt-4 mb-6 max-w-sm">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('builtin')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeFormTab === 'builtin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Quick Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('google-form')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeFormTab === 'google-form'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {settings.googleFormButtonText || 'Google Form'}
                </button>
              </div>
            )}

            {settings.enableGoogleFormEmbed && settings.googleFormEmbedUrl && activeFormTab === 'google-form' ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-slate-600">Official Google Form Application</span>
                  <a
                    href={settings.googleFormEmbedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Open in new window</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="w-full h-[620px] rounded-xl overflow-hidden border border-slate-300 bg-white shadow-inner">
                  <iframe
                    src={settings.googleFormEmbedUrl.includes('?') ? `${settings.googleFormEmbedUrl}&embedded=true` : `${settings.googleFormEmbedUrl}?embedded=true`}
                    width="100%"
                    height="100%"
                    title="Google Form Embed"
                    className="w-full h-full border-0"
                  >
                    Loading form...
                  </iframe>
                </div>
              </div>
            ) : isSubmitted ? (
              <div className="mt-8 p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-950">Inquiry Lodged Successfully</h4>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you. Your capital inquiry has been assigned to a Senior Underwriting Director at {branding.companyName}. We will review your requirements and reach out promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Richard Vance"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. r.vance@company.com"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target Loan Capital ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      value={requestedAmount}
                      onChange={e => setRequestedAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Financing Objective / Notes
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Briefly describe your capital requirements, business domain, or preferred borrowing timeline..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: theme.primaryColor }}
                    className="w-full py-3.5 text-xs font-bold text-white rounded-xl shadow-lg shadow-blue-900/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Submit Priority Loan Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
