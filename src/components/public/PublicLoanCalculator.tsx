import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Calculator, ArrowRight, IndianRupee, Calendar, Percent, Sparkles, CheckCircle2 } from 'lucide-react';

export const PublicLoanCalculator: React.FC = () => {
  const { theme, settings, openApplyModal, visualSections } = useBuilder();
  const secConfig = visualSections.find(s => s.type === 'calculator');

  // Calculator State in INR (Default: ₹25,00,000 / 25 Lakhs)
  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureMonths;
    if (r === 0) return P / n;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI();
  const totalRepayment = monthlyEMI * tenureMonths;
  const totalInterest = totalRepayment - loanAmount;

  const principalRatio = Math.round((loanAmount / totalRepayment) * 100);
  const interestRatio = 100 - principalRatio;

  const handleApplyWithTerms = () => {
    openApplyModal();
  };

  return (
    <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {secConfig?.badge && (
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block">
              {secConfig.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {secConfig?.title || 'Interactive EMI & Loan Repayment Calculator'}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {secConfig?.subtitle || 'Model your enterprise financing, commercial overdraft, or personal loan installments in INR with zero hidden costs.'}
          </p>
        </div>

        {/* Calculator Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Input Column */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 backdrop-blur-xl">
            {/* Loan Amount Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                  <span>Borrowing Principal Amount</span>
                </label>
                <span className="text-xl font-extrabold text-white font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                  {settings.currencySymbol}{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="50000000"
                step="50000"
                value={loanAmount}
                onChange={e => setLoanAmount(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>{settings.currencySymbol}50,000 (50k)</span>
                <span>{settings.currencySymbol}50,00,000 (50L)</span>
                <span>{settings.currencySymbol}2,00,00,000 (2Cr)</span>
                <span>{settings.currencySymbol}5,00,00,000 (5Cr)</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Repayment Tenure (Term)</span>
                </label>
                <span className="text-xl font-extrabold text-white font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                  {tenureMonths} Months ({Math.round(tenureMonths / 12 * 10) / 10} yrs)
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="120"
                step="6"
                value={tenureMonths}
                onChange={e => setTenureMonths(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>12 Months (1 Yr)</span>
                <span>36 Months (3 Yrs)</span>
                <span>60 Months (5 Yrs)</span>
                <span>120 Months (10 Yrs)</span>
              </div>
            </div>

            {/* Interest Rate Slider (Up to 50% Max as requested) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-400" />
                  <span>Indicative Interest Rate (p.a.)</span>
                </label>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                  <input
                    type="number"
                    min="1.0"
                    max="50.0"
                    step="0.25"
                    value={interestRate}
                    onChange={e => {
                      const val = Number(e.target.value);
                      if (val >= 0 && val <= 50) setInterestRate(val);
                    }}
                    className="w-16 bg-transparent text-xl font-extrabold text-amber-400 font-mono text-right focus:outline-none"
                  />
                  <span className="text-xl font-extrabold text-amber-400 font-mono">%</span>
                </div>
              </div>
              <input
                type="range"
                min="1.0"
                max="50.0"
                step="0.25"
                value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>1.0% (Prime Base)</span>
                <span>15.0%</span>
                <span>30.0%</span>
                <span className="text-amber-400 font-bold">50.0% (Max Limit)</span>
              </div>

              {/* Quick Preset Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-medium mr-1">Quick Select:</span>
                {[8.5, 12.0, 16.5, 24.0, 36.0, 50.0].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setInterestRate(rate)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                      interestRate === rate
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EMI Output Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-blue-900/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                Projected Monthly EMI
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {settings.currencySymbol}{monthlyEMI.toLocaleString('en-IN')}
                <span className="text-base text-slate-400 font-normal"> / month</span>
              </div>
            </div>

            {/* Summary Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Principal Borrowed:</span>
                <span className="font-bold text-white font-mono">
                  {settings.currencySymbol}{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Interest Payable:</span>
                <span className="font-bold text-amber-400 font-mono">
                  {settings.currencySymbol}{totalInterest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm">
                <span className="font-semibold text-slate-300">Total Capital Repayment:</span>
                <span className="font-black text-white font-mono">
                  {settings.currencySymbol}{totalRepayment.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Principal vs Interest Proportion Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Principal ({principalRatio}%)</span>
                <span>Interest ({interestRatio}%)</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex border border-slate-700">
                <div style={{ width: `${principalRatio}%` }} className="bg-blue-600 transition-all duration-300" />
                <div style={{ width: `${interestRatio}%` }} className="bg-amber-500 transition-all duration-300" />
              </div>
            </div>

            <button
              onClick={handleApplyWithTerms}
              style={{ backgroundColor: theme.primaryColor }}
              className="w-full py-3.5 text-xs font-extrabold text-white rounded-xl shadow-lg shadow-blue-900/50 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply With These Terms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
