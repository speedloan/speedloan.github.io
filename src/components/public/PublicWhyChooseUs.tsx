import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { ShieldCheck, Zap, Lock, Landmark, Award, BadgeCheck } from 'lucide-react';

export const PublicWhyChooseUs: React.FC = () => {
  const { visualSections, theme } = useBuilder();
  const secConfig = visualSections.find(s => s.type === 'why_us');

  const pillars = [
    {
      icon: Landmark,
      title: 'Institutional Capital Balance Sheet',
      desc: 'Direct syndicate debt with access to global sovereign liquidity, enabling high-ticket financing up to ₹50,00,00,000 (50 Crores) with flexible terms.'
    },
    {
      icon: Zap,
      title: 'Algorithmic Express Underwriting',
      desc: 'Our proprietary credit decisioning models evaluate operational balance sheets within minutes, issuing binding sanctions within 24 hours.'
    },
    {
      icon: Lock,
      title: 'Discreet Private Wealth Stewardship',
      desc: 'All corporate disclosures and private director assets remain secured under Swiss-grade encryption protocols and strict confidentiality.'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Hidden Prepayment Costs',
      desc: 'Complete fiscal transparency. All margin rates, appraisal fees, and early liquidation covenants are disclosed upfront.'
    },
    {
      icon: Award,
      title: 'Dedicated Senior Credit Director',
      desc: 'Work directly with an experienced investment banker throughout the loan life cycle, from preliminary structuring to disbursal.'
    },
    {
      icon: BadgeCheck,
      title: 'Customized Amortization Schedules',
      desc: 'Repayments tailored to your specific commercial seasonality, including deferred moratoriums, bullet payments, and revenue shares.'
    }
  ];

  return (
    <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {secConfig?.badge && (
            <span style={{ color: theme.accentColor }} className="text-xs font-extrabold uppercase tracking-widest block">
              {secConfig.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {secConfig?.title || 'Why Leading Enterprises Partner With Blue Wien'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {secConfig?.subtitle || 'We eliminate bureaucratic latency, replacing slow legacy underwriting with agile institutional credit structuring.'}
          </p>
        </div>

        {/* Custom Section Feature Photo if configured */}
        {secConfig?.imageUrl && (
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group">
            <img 
              src={secConfig.imageUrl} 
              alt={secConfig.imageDescription || secConfig.title} 
              className="w-full max-h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
            />
            {secConfig.imageDescription && (
              <div className="p-3 bg-slate-950 text-slate-300 text-xs italic text-center border-t border-slate-800">
                📷 {secConfig.imageDescription}
              </div>
            )}
          </div>
        )}

        {/* Custom Section Paragraphs if configured by admin */}
        {secConfig?.paragraphs && secConfig.paragraphs.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4 bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm">
            {secConfig.paragraphs.map((paraText, pIdx) => (
              <div key={pIdx} className="space-y-1">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {paraText}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500/40 hover:shadow-xl transition-all duration-300 space-y-4 group"
              >
                <div 
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
