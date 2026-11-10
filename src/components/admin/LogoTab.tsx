import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Image as ImageIcon, Sliders, Globe, UploadCloud, CheckCircle } from 'lucide-react';

const presetLogos = [
  {
    name: 'Blue Wien Wordmark (Official)',
    url: '/bluewien-logo.webp',
  },
  {
    name: 'Modern Blue Emblem',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Corporate Financial Crest',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  }
];

export const LogoTab: React.FC = () => {
  const { branding, updateBranding } = useBuilder();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-400" />
          <span>Logo &amp; Visual Asset Management</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload or link high-resolution SVG or PNG logos, favicons, and customize dimension scaling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
            {/* Primary Logo */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Primary Logo
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={branding.logoUrl}
                  onChange={e => updateBranding({ logoUrl: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://your-domain.com/logo.svg or upload from device"
                />
                <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 shadow-md">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => {
                          const res = ev.target?.result as string;
                          if (res) updateBranding({ logoUrl: res });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-400">
                Directly upload PNG, SVG, WebP from your computer/mobile or paste an external URL.
              </p>
            </div>

            {/* Quick Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Logo Presets
              </label>
              <div className="grid grid-cols-3 gap-3">
                {presetLogos.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateBranding({ logoUrl: preset.url })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      branding.logoUrl === preset.url
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="h-10 w-full object-contain bg-white/10 rounded p-1" />
                    <span className="text-[11px] font-medium text-center line-clamp-1">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions: Height & Max-Width Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              {/* Height Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    <span>Display Height ({branding.logoHeight}px)</span>
                  </label>
                </div>
                <input
                  type="range"
                  min="24"
                  max="90"
                  step="2"
                  value={branding.logoHeight}
                  onChange={e => updateBranding({ logoHeight: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Compact (24px)</span>
                  <span>Standard (52px)</span>
                  <span>Large (90px)</span>
                </div>
              </div>

              {/* Max Width Slider for Wide Horizontal Logos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Max Width ({branding.logoMaxWidth || 240}px)</span>
                  </label>
                </div>
                <input
                  type="range"
                  min="100"
                  max="380"
                  step="10"
                  value={branding.logoMaxWidth || 240}
                  onChange={e => updateBranding({ logoMaxWidth: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Square (100px)</span>
                  <span>Wide (240px)</span>
                  <span>Panoramic (380px)</span>
                </div>
              </div>
            </div>

            {/* Company Name Visibility Toggle Beside Logo */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={branding.showCompanyNameBesideLogo ?? false}
                  onChange={e => updateBranding({ showCompanyNameBesideLogo: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200">
                  Show Company Name text beside the Logo in Header
                </span>
              </label>
              <p className="text-[11px] text-slate-400 ml-7 leading-relaxed">
                Leave unchecked if your logo is a wide wordmark (like the <strong>Blue Wien</strong> logo) which already contains the company name, avoiding duplicate text.
              </p>
            </div>

            {/* Favicon URL */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Favicon (Browser Tab Icon)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={branding.faviconUrl}
                  onChange={e => updateBranding({ faviconUrl: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://your-domain.com/favicon.png or upload"
                />
                <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                  <UploadCloud className="w-4 h-4 text-blue-400" />
                  <span>Upload Icon</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => {
                          const res = ev.target?.result as string;
                          if (res) updateBranding({ faviconUrl: res });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Header Logo Preview
            </h3>

            {/* Light Preview */}
            <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-center gap-3 overflow-hidden">
              {branding.logoUrl ? (
                <img 
                  src={branding.logoUrl} 
                  alt="Logo Preview Light" 
                  style={{ 
                    height: `${branding.logoHeight}px`,
                    maxWidth: `${branding.logoMaxWidth || 240}px` 
                  }}
                  className="object-contain object-left rounded"
                />
              ) : (
                <span className="font-extrabold text-blue-900 text-lg">{branding.companyName}</span>
              )}
              {(branding.showCompanyNameBesideLogo || !branding.logoUrl) && (
                <span className="font-bold text-slate-900 text-sm truncate">{branding.companyName}</span>
              )}
            </div>

            {/* Dark Preview */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3 overflow-hidden">
              {branding.logoUrl ? (
                <div className="bg-white/90 p-1.5 rounded inline-flex">
                  <img 
                    src={branding.logoUrl} 
                    alt="Logo Preview Dark" 
                    style={{ 
                      height: `${branding.logoHeight}px`,
                      maxWidth: `${branding.logoMaxWidth || 240}px` 
                    }}
                    className="object-contain object-left rounded"
                  />
                </div>
              ) : (
                <span className="font-extrabold text-blue-400 text-lg">{branding.companyName}</span>
              )}
              {(branding.showCompanyNameBesideLogo || !branding.logoUrl) && (
                <span className="font-bold text-white text-sm truncate">{branding.companyName}</span>
              )}
            </div>

            {/* Browser Tab Preview */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/90 rounded border border-slate-700/80 truncate">
                {branding.faviconUrl ? (
                  <img src={branding.faviconUrl} alt="Favicon" className="w-3.5 h-3.5 rounded-full" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded bg-blue-500" />
                )}
                <span className="truncate font-medium">{branding.companyName} | Financial Services</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
