import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

export const PublicFaq: React.FC = () => {
  const { visualSections, theme, openApplyModal } = useBuilder();
  const secConfig = visualSections.find(s => s.type === 'faq');

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How rapid is the Blue Wien loan sanction and underwriting turnaround?',
      a: 'Initial indicative term sheets and preliminary sanctions are generated digitally within 24 business hours following document upload. Once formal legal due diligence and covenants are ratified, capital is wired to borrower accounts within 48 to 72 hours.'
    },
    {
      q: 'What are the benchmark Annual Percentage Rates (APR) and fees?',
      a: 'Our commercial and mortgage lending rates range between 5.99% and 13.50% p.a., determined by debt coverage ratio, asset collateral grade, and borrowing tenure. All processing fees (typically 0.75% to 1.5%) are transparently itemized upfront in your term sheet.'
    },
    {
      q: 'Can our enterprise prepay or foreclose loans early without penalty?',
      a: 'Yes. Most Blue Wien facilities allow partial or complete prepayment with zero penalty after an initial 6 to 12-month moratorium, granting your CFO maximum balance sheet flexibility.'
    },
    {
      q: 'What documentation is typically required for commercial loans above $500,000?',
      a: 'Standard submissions include the last 2 to 3 fiscal cycles of audited financial statements, 6 months of corporate bank statements, business incorporation certificates, and brief project capex cashflow models.'
    },
    {
      q: 'Can international enterprises or multi-currency entities apply?',
      a: 'Yes. Blue Wien coordinates debt facilities across USD ($), EUR (€), GBP (£), and CHF, subject to regulatory compliance in the applicant jurisdiction.'
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          {secConfig?.badge && (
            <span style={{ color: theme.accentColor }} className="text-xs font-extrabold uppercase tracking-widest block">
              {secConfig.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {secConfig?.title || 'Frequently Asked Questions & Borrowing Guidelines'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {secConfig?.subtitle || 'Clear guidance on institutional underwriting covenants, tenure flexibility, and collateral verification.'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 rounded-2xl bg-blue-900/10 border border-blue-200 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            Have a custom financing structure or debt syndication requirement?
          </p>
          <button
            onClick={() => openApplyModal()}
            style={{ backgroundColor: theme.primaryColor }}
            className="px-6 py-2.5 text-xs font-bold text-white rounded-lg shadow inline-flex items-center gap-1.5 cursor-pointer hover:opacity-95"
          >
            <span>Consult With Senior Credit Underwriter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
