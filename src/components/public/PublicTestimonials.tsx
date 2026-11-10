import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const PublicTestimonials: React.FC = () => {
  const { visualSections, theme, testimonials } = useBuilder();
  const secConfig = visualSections.find(s => s.type === 'testimonials');

  const activeStories = testimonials && testimonials.length > 0
    ? testimonials.filter(t => t.isActive)
    : [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {secConfig?.badge && (
            <span style={{ color: theme.accentColor }} className="text-xs font-extrabold uppercase tracking-widest block">
              {secConfig.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {secConfig?.title || 'Trusted By CEOs, Developers & Private Investors'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {secConfig?.subtitle || 'Hear directly from enterprise leadership whose corporate trajectory was accelerated with Blue Wien capital.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeStories.map((item, idx) => {
            const initials = item.name
              ? item.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
              : 'BW';

            return (
              <div 
                key={item.id || idx} 
                className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                {/* 1. First: Client Photo, Name & Title */}
                <div className="flex items-center gap-4">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-blue-500/30 shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-700 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-md ring-2 ring-blue-500/20 shrink-0">
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 leading-tight mt-0.5 line-clamp-2">{item.title}</p>
                    
                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 mt-2">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Then: Client Story / Testimonial Quote */}
                <div className="space-y-3 flex-1 relative bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm">
                  <Quote className="w-6 h-6 text-blue-500/20 absolute -top-2.5 right-3" />
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>

                {/* 3. Sanctioned Facility Amount in ₹ INR */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Sanctioned: {item.facility}</span>
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
