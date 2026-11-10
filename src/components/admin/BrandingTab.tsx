import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Building, Sparkles, Check, Globe } from 'lucide-react';

export const BrandingTab: React.FC = () => {
  const { branding, updateBranding, settings, updateSettings } = useBuilder();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-400" />
          <span>Website Branding &amp; Corporate Identity</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure the global white-label identity, company naming, mission statement, and legal copyright.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Company Name (Brand Name)
            </label>
            <input
              type="text"
              value={branding.companyName}
              onChange={e => updateBranding({ companyName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. BLUE WIEN"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Reflected across navigation bars, document sanction letters, footers, and page titles.
            </p>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Corporate Tagline / Subtitle
            </label>
            <input
              type="text"
              value={branding.tagline}
              onChange={e => updateBranding({ tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Premier Corporate Lending & Financial Capital Advisory"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Displays beneath brand headers, meta tags, and hero banners.
            </p>
          </div>
        </div>

        {/* Brand Mission & Story */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Brand Narrative &amp; Corporate Overview
          </label>
          <textarea
            rows={3}
            value={branding.brandStory}
            onChange={e => updateBranding({ brandStory: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Describe the company's background, financial licensure, and market authority..."
          />
        </div>

        {/* Legal Copyright Text */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Copyright &amp; Regulatory Notice
          </label>
          <input
            type="text"
            value={branding.copyrightText}
            onChange={e => updateBranding({ copyrightText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="© 2026 BLUE WIEN FINANCIAL TECHNOLOGIES LLC. All Rights Reserved."
          />
        </div>

        {/* White Label Options */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <p className="text-sm font-semibold text-white">White Label Enforcement Mode</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Suppresses any external builder watermarks across the public website and client-facing loan portals.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.whiteLabelMode}
                onChange={e => updateSettings({ whiteLabelMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
