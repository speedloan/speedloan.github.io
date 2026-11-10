import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  PackageCheck,
  Inbox,
  FileText,
  Flag,
  Palette,
  Edit3,
  Globe,
  Database,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  IndianRupee,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';

export const DashboardTab: React.FC = () => {
  const { 
    branding, 
    products, 
    enquiries, 
    pages, 
    banners, 
    isFirebaseConnected, 
    firebaseStatusMessage,
    setActiveAdminTab,
    setActiveView,
    settings
  } = useBuilder();

  const activeProductsCount = products.filter(p => p.isActive).length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;
  const inReviewCount = enquiries.filter(e => e.status === 'In Review').length;
  const approvedCount = enquiries.filter(e => e.status === 'Approved').length;

  const totalRequestedPipeline = enquiries.reduce((sum, e) => sum + (e.requestedAmount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-900/40 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>White Label CMS Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {branding.companyName} Management Console
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Welcome to your visual no-code website builder. Seamlessly customize brand aesthetics, financial loan products, marketing hero banners, and visual sections in real-time.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveAdminTab('visual-editor')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Launch Visual Editor</span>
            </button>
            <button
              onClick={() => setActiveView('public')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Preview Public Website</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products */}
        <div 
          onClick={() => setActiveAdminTab('products')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Products</span>
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold text-white">{activeProductsCount}</span>
            <span className="text-xs text-slate-400 ml-2">of {products.length} cataloged</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-400 font-medium">
            <span>Manage lending catalog</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Customer Inquiries */}
        <div 
          onClick={() => setActiveAdminTab('enquiries')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Leads</span>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold text-white">{enquiries.length}</span>
            {newEnquiriesCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 ml-2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {newEnquiriesCount} New
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <span>View loan applications</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pipeline Value */}
        <div 
          onClick={() => setActiveAdminTab('enquiries')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pipeline Capital</span>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {settings.currencySymbol}
              {totalRequestedPipeline >= 10000000 
                ? `${(totalRequestedPipeline / 10000000).toFixed(2)} Cr`
                : totalRequestedPipeline >= 100000 
                  ? `${(totalRequestedPipeline / 100000).toFixed(2)} Lakh`
                  : totalRequestedPipeline.toLocaleString('en-IN')
              }
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-400 font-medium">
            <span>Requested loan volume</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CMS Pages & Banners */}
        <div 
          onClick={() => setActiveAdminTab('pages')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-purple-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CMS Pages</span>
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold text-white">{pages.length}</span>
            <span className="text-xs text-slate-400 ml-2">Pages + {banners.length} Banners</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-purple-400 font-medium">
            <span>Manage content pages</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Inquiries & Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Loan Inquiries */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-white">Latest Customer Inquiries</h3>
            </div>
            <button
              onClick={() => setActiveAdminTab('enquiries')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>View all ({enquiries.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {enquiries.slice(0, 4).map(enquiry => (
              <div key={enquiry.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-white truncate">{enquiry.fullName}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      enquiry.status === 'New' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : enquiry.status === 'In Review'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : enquiry.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {enquiry.productName || 'General Inquiry'} • {enquiry.phone} • {enquiry.email}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-white">
                    {settings.currencySymbol}{(enquiry.requestedAmount || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture & Quick Actions */}
        <div className="space-y-6">
          {/* Cloud Database Architecture Status */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">System Architecture</h4>
              </div>
              <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-semibold text-slate-200">Firebase Firestore</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Security Rules</span>
                <span className="font-semibold text-emerald-400">ABAC Hardened</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Hosting Target</span>
                <span className="font-semibold text-blue-400">GitHub Pages / SPA</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {firebaseStatusMessage}
            </p>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => setActiveAdminTab('products')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-950/70 hover:bg-slate-800 rounded-lg border border-slate-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>Add New Financial Product</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveAdminTab('branding')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-950/70 hover:bg-slate-800 rounded-lg border border-slate-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Customize Company Branding</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveAdminTab('banners')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-950/70 hover:bg-slate-800 rounded-lg border border-slate-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5 text-purple-400" />
                  <span>Update Hero Banners</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
