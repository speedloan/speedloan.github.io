import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { TrendingUp, ShieldCheck, Clock, Users } from 'lucide-react';

export const PublicStats: React.FC = () => {
  const { theme, branding, settings } = useBuilder();

  const metrics = [
    { label: 'Cumulative Sanctioned Capital', value: `${settings.currencySymbol}25,000 Cr+`, icon: TrendingUp, desc: 'Across commercial and mortgage debt portfolios' },
    { label: 'Institutional Approval Accuracy', value: '99.4%', icon: ShieldCheck, desc: 'Algorithmic pre-qualification underwriting' },
    { label: 'Expedited Sanction Velocity', value: '24-48h', icon: Clock, desc: 'Digital underwriting turnarounds' },
    { label: 'Enterprise & Retail Borrowers', value: '35,000+', icon: Users, desc: 'Served across pan-India regions' },
  ];

  return (
    <div className="bg-white border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="space-y-1.5 border-l-2 border-blue-600/30 pl-4 sm:pl-6">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {m.value}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">{m.label}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
