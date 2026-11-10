import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { PanelBottom, Plus, Trash2, Check, Share2 } from 'lucide-react';
import { FooterStyle } from '../../types/index.ts';

const footerStyles: { id: FooterStyle; name: string; desc: string }[] = [
  { id: 'corporate_4col', name: 'Corporate Multi-Column (Standard)', desc: 'Institutional 4-column layout with brand narrative, link columns, regulatory disclosures, and copyright.' },
  { id: 'modern_grid', name: 'Modern Structured Grid', desc: 'Sleek grid with newsletter integration, contact badges, and social media tiles.' },
  { id: 'minimal', name: 'Minimalist Clean Bar', desc: 'Direct centered brand line, privacy links, and copyright statement.' },
];

export const FooterTab: React.FC = () => {
  const { footer, updateFooter } = useBuilder();
  const [newColTitle, setNewColTitle] = useState('');

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    const newCol = {
      id: 'col-' + Date.now(),
      title: newColTitle.trim(),
      links: [
        { label: 'Overview', url: '#' },
        { label: 'Learn More', url: '#' }
      ]
    };
    updateFooter({ columns: [...footer.columns, newCol] });
    setNewColTitle('');
  };

  const handleRemoveColumn = (colId: string) => {
    updateFooter({ columns: footer.columns.filter(c => c.id !== colId) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <PanelBottom className="w-5 h-5 text-blue-400" />
          <span>Footer Architecture &amp; Legal Disclosures</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage regulatory fine-print, multi-column navigation links, newsletter subscriptions, and social footprints.
        </p>
      </div>

      {/* Footer Style Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Footer Architecture &amp; Layout
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {footerStyles.map(st => {
            const isSelected = footer.footerStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => updateFooter({ footerStyle: st.id })}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500 text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{st.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Disclaimers & Newsletter */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Regulatory Disclosures &amp; Modules</h3>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={footer.showNewsletter}
              onChange={e => updateFooter({ showNewsletter: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <span>Show Newsletter Subscription Box</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Statutory Financial Disclaimer &amp; APR Warning
          </label>
          <textarea
            rows={3}
            value={footer.disclaimerText}
            onChange={e => updateFooter({ disclaimerText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            placeholder="Blue Wien operates as a regulated non-banking lending syndicate..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Footer Copyright Line
          </label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={e => updateFooter({ copyrightText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      {/* Columns & Link Sections */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Footer Link Columns</h3>
          <span className="text-xs text-slate-400">{footer.columns.length} columns active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {footer.columns.map((col, cIdx) => (
            <div key={col.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={col.title}
                  onChange={e => {
                    const updated = footer.columns.map(c => c.id === col.id ? { ...c, title: e.target.value } : c);
                    updateFooter({ columns: updated });
                  }}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-bold text-white w-3/4"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColumn(col.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-links */}
              <div className="space-y-2 pt-1">
                {col.links.map((link, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={link.label}
                      onChange={e => {
                        const newLinks = [...col.links];
                        newLinks[lIdx].label = e.target.value;
                        const updated = footer.columns.map(c => c.id === col.id ? { ...c, links: newLinks } : c);
                        updateFooter({ columns: updated });
                      }}
                      className="flex-1 bg-slate-900/60 border border-slate-700/60 rounded px-2 py-1 text-[11px] text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = col.links.filter((_, idx) => idx !== lIdx);
                        const updated = footer.columns.map(c => c.id === col.id ? { ...c, links: newLinks } : c);
                        updateFooter({ columns: updated });
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newLinks = [...col.links, { label: 'New Link', url: '#' }];
                    const updated = footer.columns.map(c => c.id === col.id ? { ...c, links: newLinks } : c);
                    updateFooter({ columns: updated });
                  }}
                  className="w-full py-1.5 text-[10px] text-blue-400 hover:text-blue-300 font-semibold border border-dashed border-blue-900/60 rounded flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Sub-Link</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add column */}
        <form onSubmit={handleAddColumn} className="pt-2 flex items-center gap-3">
          <input
            type="text"
            value={newColTitle}
            onChange={e => setNewColTitle(e.target.value)}
            placeholder="New Column Title (e.g. Regional Desks)"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
        </form>
      </div>
    </div>
  );
};
