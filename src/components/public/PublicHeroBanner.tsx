import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const PublicHeroBanner: React.FC = () => {
  const { banners, theme, openApplyModal, setActivePublicPage } = useBuilder();
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto advance every 7 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleCta = (url: string) => {
    if (url === '#apply') {
      openApplyModal();
    } else if (url.startsWith('#')) {
      const el = document.querySelector(url);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = url;
    }
  };

  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center bg-slate-950 overflow-hidden font-sans">
      {/* Background Imagery */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 640px)" srcSet={currentBanner.mobileImage || currentBanner.desktopImage} />
          <img
            src={currentBanner.desktopImage}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out"
          />
        </picture>
        {/* Darkening & Color Grading Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent transition-opacity duration-500"
          style={{ opacity: currentBanner.overlayOpacity }}
        />
        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          {currentBanner.badgeText && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentBanner.badgeText}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            {currentBanner.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed font-normal max-w-2xl">
            {currentBanner.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleCta(currentBanner.ctaLink)}
              style={{ backgroundColor: theme.primaryColor }}
              className="px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-950/50 hover:opacity-95 transition-all cursor-pointer flex items-center gap-2 rounded-xl group"
            >
              <span>{currentBanner.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {currentBanner.secondaryCtaText && (
              <button
                onClick={() => handleCta(currentBanner.secondaryCtaLink)}
                className="px-6 py-3.5 text-sm font-bold text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/20 hover:border-white/40 rounded-xl backdrop-blur-md transition-all cursor-pointer"
              >
                {currentBanner.secondaryCtaText}
              </button>
            )}
          </div>

          {/* Institutional Trust Pillars */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Prepayment Penalties</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sanctions in 24 Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Transparent Fixed &amp; Floating APR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows if multiple */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % activeBanners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
