import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { ArrowLeft, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const PublicPages: React.FC<{ slug: string }> = ({ slug }) => {
  const { pages, setActivePublicPage, theme, branding, openApplyModal } = useBuilder();

  const page = pages.find(p => p.slug === slug) || pages.find(p => p.slug === 'about-us') || pages[0];

  // Helper to parse simple markdown headings and lists
  const renderFormattedContent = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-10 mb-4 tracking-tight">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return (
          <h4 key={idx} className="text-base font-bold text-slate-900 mt-4 mb-2">
            {trimmed.replace(/\*\*/g, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 text-sm text-slate-700 list-disc my-1">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Page Hero Header */}
      <div 
        style={{ backgroundColor: theme.secondaryColor }}
        className="text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => {
              setActivePublicPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-blue-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              {page.subtitle}
            </p>
          )}

          <div className="pt-2 text-[11px] text-slate-400">
            <span>Official Policy Document • Last ratified: {page.lastUpdated || '2026-11-01'}</span>
          </div>
        </div>
      </div>

      {/* Main Page Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 space-y-6">
          <div className="prose max-w-none text-slate-800">
            {renderFormattedContent(page.content)}
          </div>

          {/* Underwriting Assurance Box */}
          <div className="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-blue-950">Require Bespoke Structured Debt?</h4>
              <p className="text-xs text-blue-800">Our financial syndication desk crafts custom solutions for complex facilities.</p>
            </div>
            <button
              onClick={() => openApplyModal()}
              style={{ backgroundColor: theme.primaryColor }}
              className="px-6 py-2.5 text-xs font-extrabold text-white rounded-xl shadow hover:opacity-95 transition-all shrink-0 cursor-pointer"
            >
              Consult With Banker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
