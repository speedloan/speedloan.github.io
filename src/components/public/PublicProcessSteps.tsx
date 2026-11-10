import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { FileEdit, ShieldCheck, CheckCircle2, Banknote, ArrowRight } from 'lucide-react';

export const PublicProcessSteps: React.FC = () => {
  const { visualSections, theme, openApplyModal } = useBuilder();
  const secConfig = visualSections.find(s => s.type === 'process');

  const steps = [
    {
      step: '01',
      title: 'Digital Loan Inquiry',
      desc: 'Submit your requested capital amount, business overview, and preferred tenure via our encrypted 3-minute form.',
      icon: FileEdit
    },
    {
      step: '02',
      title: 'Preliminary Credit Sanction',
      desc: 'Our algorithms issue an indicative conditional approval and transparent term sheet within 24 business hours.',
      icon: ShieldCheck
    },
    {
      step: '03',
      title: 'Document & Legal Verification',
      desc: 'Upload audited statements and KYC documents directly. Our legal team conducts rapid title & due diligence appraisal.',
      icon: CheckCircle2
    },
    {
      step: '04',
      title: 'Capital Wire Disbursal',
      desc: 'Execute formal loan agreements digitally. Capital funds are wired directly to your designated business bank account.',
      icon: Banknote
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 font-sans border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {secConfig?.badge && (
            <span style={{ color: theme.accentColor }} className="text-xs font-extrabold uppercase tracking-widest block">
              {secConfig.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {secConfig?.title || 'From Application to Disbursal in 4 Easy Steps'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {secConfig?.subtitle || 'Our streamlined financial architecture removes friction, keeping your corporate team updated at every underwriting milestone.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-200 font-mono tracking-tighter">
                    {st.step}
                  </span>
                  <div 
                    style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <span>Standard timeline: {idx === 0 ? '3 mins' : idx === 1 ? '24 hours' : idx === 2 ? '48 hours' : 'Instant Wire'}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => openApplyModal()}
            style={{ backgroundColor: theme.primaryColor }}
            className="px-8 py-3.5 text-xs font-extrabold text-white rounded-xl shadow-lg shadow-blue-900/30 hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Begin Online Application Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
