import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Search, Globe, Share2, Code2, CheckCircle2 } from 'lucide-react';

export const SeoTab: React.FC = () => {
  const { seo, updateSEO, branding } = useBuilder();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          <span>Search Engine Optimization (SEO) &amp; Social Graph</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure search metadata, OpenGraph social media sharing cards, structured data, and search indexation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SEO Configuration Inputs */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Site Title Tag (SERP Title) *
            </label>
            <input
              type="text"
              value={seo.siteTitle}
              onChange={e => updateSEO({ siteTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Length: {seo.siteTitle.length}/60 characters recommended.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Meta Description (Search Snippet) *
            </label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={e => updateSEO({ metaDescription: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Length: {seo.metaDescription.length}/160 characters recommended.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={seo.keywords}
              onChange={e => updateSEO({ keywords: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Canonical URL
              </label>
              <input
                type="text"
                value={seo.canonicalUrl}
                onChange={e => updateSEO({ canonicalUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={seo.googleAnalyticsId}
                onChange={e => updateSEO({ googleAnalyticsId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Social Share OpenGraph Image URL
            </label>
            <input
              type="text"
              value={seo.ogImageUrl}
              onChange={e => updateSEO({ ogImageUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={seo.enableRobotsIndex}
                onChange={e => updateSEO({ enableRobotsIndex: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span>Allow Search Engines to Index (Robots Index, Follow)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={seo.structuredDataEnabled}
                onChange={e => updateSEO({ structuredDataEnabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span>Generate JSON-LD Schema</span>
            </label>
          </div>
        </div>

        {/* Live Search and Social Previews */}
        <div className="lg:col-span-5 space-y-6">
          {/* Google SERP Preview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Google Search Result Preview
            </span>
            <div className="p-4 bg-white rounded-xl shadow border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-700">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">BW</span>
                <span className="truncate">{seo.canonicalUrl || 'https://bluewien.com'}</span>
              </div>
              <p className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                {seo.siteTitle || branding.companyName}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2">
                {seo.metaDescription}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              LinkedIn / Twitter Social Card Preview
            </span>
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
              <img
                src={seo.ogImageUrl}
                alt="OG Preview"
                className="w-full h-32 object-cover"
              />
              <div className="p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {seo.canonicalUrl.replace('https://', '')}
                </span>
                <p className="text-xs font-bold text-white line-clamp-1">{seo.siteTitle}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{seo.metaDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
