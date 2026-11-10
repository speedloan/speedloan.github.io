import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  Linkedin,
  Twitter,
  Facebook,
  Phone,
  ArrowRight,
  Shield,
  Mail,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { footer, branding, theme, setActiveView, setActivePublicPage } = useBuilder();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const handleLinkClick = (url: string) => {
    if (url.startsWith('#page-')) {
      const slug = url.replace('#page-', '');
      setActivePublicPage(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (url.startsWith('#')) {
      setActivePublicPage('home');
      setTimeout(() => {
        const el = document.querySelector(url);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.location.href = url;
    }
  };

  return (
    <footer 
      style={{ backgroundColor: theme.secondaryColor }}
      className="text-white pt-16 pb-12 border-t border-slate-800 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter & Brand Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80 items-center">
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center gap-3">
              {branding.logoUrl ? (
                <div className="bg-white px-3 py-1 rounded-lg inline-flex items-center shadow-md">
                  <img
                    src={branding.logoUrl}
                    alt={branding.companyName}
                    style={{ 
                      height: `${Math.min(branding.logoHeight || 48, 44)}px`,
                      maxWidth: `${branding.logoMaxWidth || 220}px`
                    }}
                    className="object-contain object-left w-auto"
                  />
                </div>
              ) : (
                <div 
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm"
                >
                  BW
                </div>
              )}
              {(branding.showCompanyNameBesideLogo || !branding.logoUrl) && (
                <span className="text-xl font-bold tracking-tight text-white">{branding.companyName}</span>
              )}
            </div>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              {branding.tagline || 'Premier Institutional Corporate Lending & Debt Advisory Services.'}
            </p>
          </div>

          {footer.showNewsletter && (
            <div className="lg:col-span-6">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Subscribe to Monthly Market Rates &amp; Credit Insights
                </span>
                {subscribed ? (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 py-2">
                    <CheckCircle2 className="w-4 h-4" /> Thank you for subscribing to Blue Wien market bulletins.
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      placeholder="Enter corporate email..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      style={{ backgroundColor: theme.primaryColor }}
                      className="px-4 py-2 text-xs font-bold text-white rounded-lg hover:opacity-95 transition-all shrink-0 cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4 Multi-Column Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footer.columns.map(col => (
            <div key={col.id} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleLinkClick(link.url)}
                      className="hover:text-white transition-colors text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Regulatory Disclaimers */}
        <div className="pt-8 border-t border-slate-800/80 space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed text-justify">
            {footer.disclaimerText}
          </p>
        </div>

        {/* Copyright, Social Footprint & Admin Access */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{footer.copyrightText}</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={() => setActiveView('admin')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Management</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
