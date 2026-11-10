import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  Phone,
  ArrowRight,
  Menu,
  X,
  Shield,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const PublicNavbar: React.FC<{ isEmbeddedPreview?: boolean }> = ({ isEmbeddedPreview }) => {
  const { 
    branding, 
    theme, 
    header, 
    contact, 
    setActiveView, 
    adminUser, 
    activePublicPage, 
    setActivePublicPage,
    openApplyModal
  } = useBuilder();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getBorderRadius = () => {
    switch (theme.borderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-xl';
      case 'full': return 'rounded-full';
      default: return 'rounded-lg';
    }
  };

  const handleNavClick = (url: string) => {
    setMobileMenuOpen(false);
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
      setActivePublicPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`${header.isSticky ? 'sticky top-0 z-40' : 'relative z-40'} font-sans`}>
      {/* Announcement Ribbon */}
      {header.showAnnouncement && header.announcementText && (
        <div 
          style={{ backgroundColor: theme.secondaryColor }}
          className="text-white text-xs py-2 px-4 text-center border-b border-blue-900/50 flex items-center justify-center gap-2"
        >
          <span className="truncate">{header.announcementText}</span>
          {header.announcementLink && (
            <a 
              href={header.announcementLink} 
              onClick={(e) => { e.preventDefault(); handleNavClick(header.announcementLink); }}
              className="text-amber-400 font-bold hover:underline shrink-0 text-[11px] inline-flex items-center gap-1"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Top Bar for Corporate style */}
      {header.headerStyle === 'corporate' && (
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Toll-Free Advisory: <strong>{contact.tollFree || contact.phone}</strong></span>
            </div>
            <div className="text-slate-400">
              <span>Underwriting Desks: {contact.operatingHours}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              AAA Institutional Rating
            </span>
            <button
              onClick={() => setActiveView('admin')}
              className="text-blue-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav 
        className={`transition-all duration-200 ${
          header.headerStyle === 'floating'
            ? 'mx-4 my-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-white shadow-xl'
            : 'bg-white text-slate-900 border-b border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Company Name */}
            {/* Logo Container */}
            <div 
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 cursor-pointer group py-1"
            >
              {branding.logoUrl ? (
                <div className="flex items-center">
                  <img
                    src={branding.logoUrl}
                    alt={branding.companyName}
                    style={{ 
                      height: `${branding.logoHeight || 52}px`,
                      maxWidth: `${branding.logoMaxWidth || 260}px`
                    }}
                    className="object-contain object-left w-auto max-h-16 transition-transform group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <div 
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-md"
                >
                  BW
                </div>
              )}

              {/* Show company name text ONLY if explicitly enabled or if no logo image is set */}
              {(branding.showCompanyNameBesideLogo || !branding.logoUrl) && (
                <div>
                  <span className={`font-extrabold text-lg sm:text-xl tracking-tight block ${
                    header.headerStyle === 'floating' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {branding.companyName}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block -mt-0.5">
                    Financial Capital Group
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {header.navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.url)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    header.headerStyle === 'floating'
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => openApplyModal()}
                style={{ backgroundColor: theme.primaryColor }}
                className={`px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/30 hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 ${getBorderRadius()}`}
              >
                <span>{header.ctaButtonText || 'Apply For Loan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Admin shortcut badge if not in floating mode */}
              <button
                onClick={() => setActiveView('admin')}
                title="Switch to Admin Management Panel"
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${
                  header.headerStyle === 'floating' ? 'text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/50 p-4 space-y-2 bg-slate-900 text-white">
            {header.navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.url)}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openApplyModal();
                }}
                style={{ backgroundColor: theme.primaryColor }}
                className="w-full py-2.5 text-xs font-bold text-white rounded-lg text-center shadow"
              >
                {header.ctaButtonText || 'Apply For Loan'}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveView('admin');
                }}
                className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white text-center flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Administrator Console</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
