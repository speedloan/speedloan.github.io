import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  X,
  CheckCircle2,
  IndianRupee,
  Calendar,
  Building,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Send,
  UploadCloud,
  FileCheck,
  Sparkles
} from 'lucide-react';

export const LoanApplicationModal: React.FC = () => {
  const { 
    isApplyModalOpen, 
    closeApplyModal, 
    preselectedProductForApply, 
    products, 
    branding, 
    theme, 
    settings, 
    submitEnquiry 
  } = useBuilder();

  const [activeStep, setActiveStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [requestedAmount, setRequestedAmount] = useState<number>(2500000);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [employmentType, setEmploymentType] = useState<'Salaried' | 'Self-Employed' | 'Business Owner' | 'Professional'>('Business Owner');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(120000);
  const [notes, setNotes] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState('');

  // Pre-fill from selected product if supplied
  useEffect(() => {
    if (preselectedProductForApply) {
      setSelectedProductId(preselectedProductForApply.id);
      setRequestedAmount(preselectedProductForApply.minAmount || 100000);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [preselectedProductForApply, products]);

  if (!isApplyModalOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const ref = 'BW-' + Math.floor(100000 + Math.random() * 900000);
    const ok = await submitEnquiry({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      productId: currentProduct?.id,
      productName: currentProduct?.name || 'Standard Credit Facility',
      requestedAmount: Number(requestedAmount),
      tenureMonths: Number(tenureMonths),
      employmentType,
      monthlyIncome: Number(monthlyIncome),
      adminNotes: `Client Note: ${notes.trim() || 'No additional note provided.'} | Ref: ${ref}`,
    });

    setIsSubmitting(false);
    if (ok) {
      setGeneratedRefId(ref);
      setSubmissionSuccess(true);
    }
  };

  const handleResetAndClose = () => {
    setSubmissionSuccess(false);
    setActiveStep(1);
    closeApplyModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl text-slate-900 overflow-hidden font-sans border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Credit Application Portal</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Apply for Capital with {branding.companyName}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Preliminary sanction decisions issued within 24 business hours.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {submissionSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Application Submitted!</h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-xs space-y-1 text-slate-600">
                <p>Application Tracking Code: <strong className="text-blue-600 font-mono text-sm">{generatedRefId}</strong></p>
                <p>Applicant: <strong>{fullName}</strong> ({email})</p>
                <p>Requested Facility: <strong>{currentProduct?.name}</strong></p>
                <p>Amount: <strong>{settings.currencySymbol}{requestedAmount.toLocaleString('en-IN')}</strong> ({tenureMonths} Months)</p>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Your application has been received into our underwriting review pipeline. A senior credit officer will contact you within 24 hours to verify terms and request documentation.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                style={{ backgroundColor: theme.primaryColor }}
                className="mt-4 px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md"
              >
                Return to Website
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Selected Financing Facility *
                </label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  {products.filter(p => p.isActive).map(prod => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} ({prod.loanAmount} • {prod.interestRate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount and Tenure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Requested Capital Amount ({settings.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="50000"
                    step="50000"
                    value={requestedAmount}
                    onChange={e => setRequestedAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Tenure (Months) *
                  </label>
                  <select
                    value={tenureMonths}
                    onChange={e => setTenureMonths(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  >
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={60}>60 Months (5 Years)</option>
                    <option value={84}>84 Months (7 Years)</option>
                    <option value={120}>120 Months (10 Years)</option>
                    <option value={240}>240 Months (20 Years - Mortgage)</option>
                  </select>
                </div>
              </div>

              {/* Personal / Enterprise Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Legal Name / Director *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Business / Personal Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. m.vance@enterprise.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Direct Telephone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Applicant City &amp; Country
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. New York, USA"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Financial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Employment / Enterprise Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={e => setEmploymentType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Business Owner">Business Owner / Corporate Entity</option>
                    <option value="Self-Employed">Self-Employed Entrepreneur</option>
                    <option value="Professional">Medical / Legal Professional</option>
                    <option value="Salaried">Executive Salaried Officer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Monthly Revenue / Income ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={e => setMonthlyIncome(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Financing Objective &amp; Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Equipment lease expansion, inventory bridging, real estate acquisition..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Consent check */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={consentChecked}
                    onChange={e => setConsentChecked(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded mt-0.5 shrink-0"
                  />
                  <span>
                    I certify that the information provided is accurate and authorize {branding.companyName} credit underwriting to evaluate preliminary debt parameters in accordance with the regulatory privacy policy.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-full py-3.5 text-xs font-extrabold text-white rounded-xl shadow-lg shadow-blue-900/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting to Underwriting...' : 'Submit Digital Loan Application'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
