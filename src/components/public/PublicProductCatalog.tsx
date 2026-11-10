import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  ArrowRight,
  CheckCircle2,
  Percent,
  Clock,
  DollarSign,
  FileText,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { Product } from '../../types/index.ts';

export const PublicProductCatalog: React.FC = () => {
  const { 
    products, 
    categories, 
    theme, 
    settings, 
    openProductDetail, 
    openApplyModal,
    visualSections
  } = useBuilder();

  const secConfig = visualSections.find(s => s.type === 'products');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeProducts = products.filter(p => p.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

  const displayedProducts = activeProducts.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const getBorderRadius = () => {
    switch (theme.borderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-2xl';
      case 'full': return 'rounded-3xl';
      default: return 'rounded-xl';
    }
  };

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {secConfig?.badge && (
            <span 
              style={{ color: theme.accentColor }}
              className="text-xs font-extrabold uppercase tracking-widest block"
            >
              {secConfig.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {secConfig?.title || 'Premier Institutional Lending Solutions'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {secConfig?.subtitle || 'Tailored financing structures engineered for corporate growth, asset acquisition, and working capital optimization.'}
          </p>

          {/* Category Tabs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Facilities ({activeProducts.length})
            </button>
            {categories.map(cat => {
              const count = activeProducts.filter(p => p.category === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map(product => {
            const cat = categories.find(c => c.id === product.category);
            return (
              <div
                key={product.id}
                className={`bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group ${getBorderRadius()}`}
              >
                {/* Product Card Image */}
                <div className="relative h-52 bg-slate-950 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/95 text-slate-900 shadow backdrop-blur-md">
                      {cat?.name || 'Commercial Facility'}
                    </span>
                  </div>

                  {product.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Highlights Bar on image */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                    <div>
                      <span className="text-[10px] text-slate-300 block uppercase">Sanction Range</span>
                      <span className="font-extrabold text-sm text-white">{product.loanAmount}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-300 block uppercase">Benchmark APR</span>
                      <span className="font-extrabold text-sm text-amber-300">{product.interestRate}</span>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Features list bullet points */}
                    <div className="pt-2 space-y-1.5 border-t border-slate-100">
                      {product.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => openApplyModal(product)}
                      style={{ backgroundColor: theme.primaryColor }}
                      className="w-full py-2.5 text-xs font-bold text-white rounded-lg shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{product.applyButtonText || 'Apply Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openProductDetail(product.id)}
                      className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-center cursor-pointer"
                    >
                      View Full Terms &amp; Eligibility
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
