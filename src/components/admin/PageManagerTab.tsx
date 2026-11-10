import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { FileText, Plus, Edit2, Trash2, CheckCircle, Globe, ExternalLink, ShieldAlert } from 'lucide-react';
import { PageContent } from '../../types/index.ts';

export const PageManagerTab: React.FC = () => {
  const { pages, updatePage, addPage, deletePage, setActiveView, setActivePublicPage } = useBuilder();
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const selectedPage = pages.find(p => p.id === selectedPageId) || pages[0];

  const [formTitle, setFormTitle] = useState(selectedPage?.title || '');
  const [formSlug, setFormSlug] = useState(selectedPage?.slug || '');
  const [formSubtitle, setFormSubtitle] = useState(selectedPage?.subtitle || '');
  const [formContent, setFormContent] = useState(selectedPage?.content || '');
  const [formMetaTitle, setFormMetaTitle] = useState(selectedPage?.metaTitle || '');
  const [formMetaDesc, setFormMetaDesc] = useState(selectedPage?.metaDescription || '');
  const [formIsPublished, setFormIsPublished] = useState(selectedPage?.isPublished ?? true);

  const handleSelectPage = (page: PageContent) => {
    setIsCreatingNew(false);
    setSelectedPageId(page.id);
    setFormTitle(page.title);
    setFormSlug(page.slug);
    setFormSubtitle(page.subtitle || '');
    setFormContent(page.content);
    setFormMetaTitle(page.metaTitle);
    setFormMetaDesc(page.metaDescription);
    setFormIsPublished(page.isPublished);
  };

  const handleStartNewPage = () => {
    setIsCreatingNew(true);
    setFormTitle('');
    setFormSlug('');
    setFormSubtitle('');
    setFormContent('### New Page Heading\n\nEnter detailed page content here...');
    setFormMetaTitle('');
    setFormMetaDesc('');
    setFormIsPublished(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const finalSlug = formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isCreatingNew) {
      addPage({
        title: formTitle.trim(),
        slug: finalSlug,
        subtitle: formSubtitle.trim(),
        content: formContent,
        metaTitle: formMetaTitle.trim() || `${formTitle} | Blue Wien`,
        metaDescription: formMetaDesc.trim() || `Read more about ${formTitle} at Blue Wien.`,
        isPublished: formIsPublished,
      });
      setIsCreatingNew(false);
    } else if (selectedPage) {
      updatePage(selectedPage.id, {
        title: formTitle.trim(),
        slug: selectedPage.isSystemPage ? selectedPage.slug : finalSlug,
        subtitle: formSubtitle.trim(),
        content: formContent,
        metaTitle: formMetaTitle.trim(),
        metaDescription: formMetaDesc.trim(),
        isPublished: formIsPublished,
      });
    }
  };

  const previewOnPublicSite = (slug: string) => {
    setActivePublicPage(slug);
    setActiveView('public');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Content Page Management (8 Core CMS Pages)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Edit text, layout content, regulatory disclosures, and SEO metadata for standard and custom web pages.
          </p>
        </div>

        <button
          onClick={handleStartNewPage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom CMS Page</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pages Directory List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Website Pages ({pages.length})
            </p>
            {pages.map(page => {
              const isSelected = !isCreatingNew && selectedPage?.id === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => handleSelectPage(page)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                      : 'bg-slate-950/60 border border-slate-800/80 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs truncate">{page.title}</span>
                      {page.isSystemPage && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          System
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">
                      /{page.slug}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${page.isPublished ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Page Content & SEO Editor */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                {isCreatingNew ? 'Create New Page' : `Editing Page: ${selectedPage?.title}`}
              </h3>
              <p className="text-xs text-slate-400">
                {isCreatingNew ? 'Fill in page parameters and content.' : `Slug: /${selectedPage?.slug}`}
              </p>
            </div>

            {!isCreatingNew && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => previewOnPublicSite(selectedPage.slug)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/50 border border-blue-800/60 rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>View On Site</span>
                </button>

                {!selectedPage.isSystemPage && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete page "${selectedPage.title}"?`)) {
                        deletePage(selectedPage.id);
                        setSelectedPageId(pages[0].id);
                      }
                    }}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSavePage} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Page Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => {
                    setFormTitle(e.target.value);
                    if (isCreatingNew) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">URL Slug</label>
                <input
                  type="text"
                  disabled={!isCreatingNew && selectedPage?.isSystemPage}
                  value={formSlug}
                  onChange={e => setFormSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subtitle / Hero Descriptor</label>
              <input
                type="text"
                value={formSubtitle}
                onChange={e => setFormSubtitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="Institutional underwriting descriptor..."
              />
            </div>

            {/* Content Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Page Body Content (Markdown Supported)</label>
                <span className="text-[10px] text-slate-500">Supports ### headings, bold, bullet points</span>
              </div>
              <textarea
                rows={10}
                value={formContent}
                onChange={e => setFormContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white font-mono leading-relaxed"
                placeholder="### Section Heading&#10;&#10;Write comprehensive page text here..."
              />
            </div>

            {/* SEO Settings for Page */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Page SEO &amp; Meta Tags</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={formMetaTitle}
                    onChange={e => setFormMetaTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Meta Description</label>
                  <input
                    type="text"
                    value={formMetaDesc}
                    onChange={e => setFormMetaDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Published Toggle & Submit */}
            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsPublished}
                  onChange={e => setFormIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <span>Publish Page to Public Portal</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-900/40 cursor-pointer"
              >
                {isCreatingNew ? 'Create Page' : 'Save Page Content'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
