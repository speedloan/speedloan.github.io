import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { PublicNavbar } from './PublicNavbar.tsx';
import { PublicHeroBanner } from './PublicHeroBanner.tsx';
import { PublicStats } from './PublicStats.tsx';
import { PublicProductCatalog } from './PublicProductCatalog.tsx';
import { PublicLoanCalculator } from './PublicLoanCalculator.tsx';
import { PublicWhyChooseUs } from './PublicWhyChooseUs.tsx';
import { PublicProcessSteps } from './PublicProcessSteps.tsx';
import { PublicTestimonials } from './PublicTestimonials.tsx';
import { PublicFaq } from './PublicFaq.tsx';
import { PublicContactSection } from './PublicContactSection.tsx';
import { PublicFooter } from './PublicFooter.tsx';
import { ProductDetailModal } from './ProductDetailModal.tsx';
import { LoanApplicationModal } from './LoanApplicationModal.tsx';
import { PublicPages } from './PublicPages.tsx';
import { ArrowRight } from 'lucide-react';

export const PublicAppView: React.FC<{ isEmbeddedPreview?: boolean }> = ({ isEmbeddedPreview = false }) => {
  const { 
    visualSections, 
    settings, 
    theme, 
    branding, 
    activePublicPage, 
    openApplyModal
  } = useBuilder();

  const sortedSections = [...visualSections].sort((a, b) => a.order - b.order);

  // Render bottom CTA section
  const renderCtaBanner = (sec: any) => (
    <section 
      key={sec.id} 
      style={{ backgroundColor: theme.primaryColor }}
      className="py-20 px-4 sm:px-6 lg:px-8 text-white text-center font-sans relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {sec.badge && (
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300 block">
            {sec.badge}
          </span>
        )}
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {sec.title || 'Ready to Accelerate Your Enterprise Capital?'}
        </h2>
        <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
          {sec.subtitle || 'Connect with a senior credit underwriter today or complete our 3-minute preliminary loan inquiry.'}
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => openApplyModal()}
            className="px-8 py-3.5 text-xs font-black text-blue-900 bg-white hover:bg-slate-100 rounded-xl shadow-2xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>{sec.buttonText || 'Submit Loan Application'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Dynamic Branded Header */}
      <PublicNavbar isEmbeddedPreview={isEmbeddedPreview} />

      {/* Main Content: Either Home (Dynamic Sections) or Inner CMS Page */}
      <main className="flex-1">
        {activePublicPage !== 'home' ? (
          <PublicPages slug={activePublicPage} />
        ) : (
          <div className="space-y-0">
            {sortedSections.map(sec => {
              if (!sec.isVisible) return null;
              switch (sec.type) {
                case 'hero':
                  return <PublicHeroBanner key={sec.id} />;
                case 'stats':
                  return <PublicStats key={sec.id} />;
                case 'products':
                  return <PublicProductCatalog key={sec.id} />;
                case 'calculator':
                  return settings.enableCustomerLoanCalculator ? (
                    <PublicLoanCalculator key={sec.id} />
                  ) : null;
                case 'why_us':
                  return <PublicWhyChooseUs key={sec.id} />;
                case 'process':
                  return <PublicProcessSteps key={sec.id} />;
                case 'testimonials':
                  return <PublicTestimonials key={sec.id} />;
                case 'faq':
                  return <PublicFaq key={sec.id} />;
                case 'cta_banner':
                  return renderCtaBanner(sec);
                default:
                  return null;
              }
            })}

            {/* Always include Contact Section on Home */}
            <PublicContactSection />
          </div>
        )}
      </main>

      {/* Dynamic Branded Footer */}
      <PublicFooter />

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Loan Application Multi-step Modal */}
      <LoanApplicationModal />
    </div>
  );
};
