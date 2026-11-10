import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  X,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  Percent,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedProductIdForDetail, 
    closeProductDetail, 
    openApplyModal, 
    theme, 
    settings 
  } = useBuilder();

  if (!selectedProductIdForDetail) return null;

  const product = products.find(p => p.id === selectedProductIdForDetail);
  if (!product) return null;

  const category = categories.find(c => c.id === product.category);

  const handleApply = () => {
    closeProductDetail();
    openApplyModal(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl text-slate-900 overflow-hidden font-sans border border-slate-200">
        {/* Modal Banner Header */}
        <div className="relative h-56 bg-slate-950 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={closeProductDetail}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-4 inset-x-6 text-white space-y-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
              {category?.name || 'Financial Facility'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">{product.name}</h2>
            {product.imageDescription && (
              <p className="text-[11px] text-slate-300 italic line-clamp-1">
                📸 {product.imageDescription}
              </p>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Sanction Range</span>
              <span className="text-sm font-extrabold text-slate-900">{product.loanAmount}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Benchmark APR</span>
              <span className="text-sm font-extrabold text-blue-600">{product.interestRate}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Tenure Period</span>
              <span className="text-sm font-extrabold text-slate-900">{product.tenure}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Processing Fee</span>
              <span className="text-sm font-extrabold text-slate-900">{product.processingFee || '1.0%'}</span>
            </div>
          </div>

          {/* Prospectus Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Facility Prospectus &amp; Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {product.detailedDescription || product.shortDescription}
            </p>
          </div>

          {/* Additional Custom Paragraphs and Images */}
          {product.paragraphs && product.paragraphs.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {product.paragraphs.map(para => (
                <div key={para.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                  {para.heading && (
                    <h4 className="text-sm font-bold text-slate-900">{para.heading}</h4>
                  )}
                  {para.text && (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{para.text}</p>
                  )}
                  {para.imageUrl && (
                    <div className="pt-2">
                      <img
                        src={para.imageUrl}
                        alt={para.imageDescription || para.heading || 'Product visual'}
                        className="w-full max-h-56 object-cover rounded-lg border border-slate-200 shadow-sm"
                      />
                      {para.imageDescription && (
                        <p className="text-[11px] text-slate-500 italic mt-1">
                          📸 {para.imageDescription}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Facility Advantages &amp; Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column: Eligibility Criteria & Required Documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Eligibility */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Borrower Eligibility Criteria
              </h3>
              <div className="space-y-2">
                {product.eligibilityCriteria.map((el, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{el}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Required Submissions &amp; KYC
              </h3>
              <div className="space-y-2">
                {product.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <FileCheck className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            onClick={closeProductDetail}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close Prospectus
          </button>

          <button
            onClick={handleApply}
            style={{ backgroundColor: theme.primaryColor }}
            className="px-7 py-3 text-xs font-extrabold text-white rounded-xl shadow-lg shadow-blue-900/30 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Digital Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
