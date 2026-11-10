import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Compass, Plus, Trash2, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { HeaderStyle, NavLinkItem } from '../../types/index.ts';

const headerStyles: { id: HeaderStyle; name: string; desc: string }[] = [
  { id: 'corporate', name: 'Corporate TopBar (Standard)', desc: 'Includes institutional contact strip, logo, nav links and prominent Apply CTA.' },
  { id: 'floating', name: 'Modern Floating Glass', desc: 'Floating rounded pill header with backdrop blur and sleek borders.' },
  { id: 'classic', name: 'Classic Clean Full-Width', desc: 'Standard solid background with clean navigation hierarchy.' },
  { id: 'minimal', name: 'Minimalist Clean', desc: 'Ultra streamlined navigation focused on primary action.' },
];

export const HeaderTab: React.FC = () => {
  const { header, updateHeader } = useBuilder();
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const newLink: NavLinkItem = {
      id: 'link-' + Date.now(),
      label: newLabel.trim(),
      url: newUrl.trim() || '#',
    };
    updateHeader({ navLinks: [...header.navLinks, newLink] });
    setNewLabel('');
    setNewUrl('');
  };

  const handleRemoveLink = (id: string) => {
    updateHeader({ navLinks: header.navLinks.filter(l => l.id !== id) });
  };

  const handleMoveLink = (index: number, dir: 'up' | 'down') => {
    const list = [...header.navLinks];
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    updateHeader({ navLinks: list });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-400" />
          <span>Header &amp; Navigation Management</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure top header layouts, announcements, navigation links, and primary action buttons.
        </p>
      </div>

      {/* Header Style Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Header Architecture &amp; Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {headerStyles.map(st => {
            const isSelected = header.headerStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => updateHeader({ headerStyle: st.id })}
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

      {/* Announcement Bar & Sticky Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Top Banner &amp; Header Behavior</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-white">Sticky Header</p>
              <p className="text-[11px] text-slate-400">Header pins to top on scroll</p>
            </div>
            <input
              type="checkbox"
              checked={header.isSticky}
              onChange={e => updateHeader({ isSticky: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-white">Show Announcement Ribbon</p>
              <p className="text-[11px] text-slate-400">Promotional notification strip</p>
            </div>
            <input
              type="checkbox"
              checked={header.showAnnouncement}
              onChange={e => updateHeader({ showAnnouncement: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>
        </div>

        {header.showAnnouncement && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Announcement Text</label>
              <input
                type="text"
                value={header.announcementText}
                onChange={e => updateHeader({ announcementText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="Special rate announcement..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Click Link (Target)</label>
              <input
                type="text"
                value={header.announcementLink}
                onChange={e => updateHeader({ announcementLink: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="#products"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links Editor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Navigation Menu Links</h3>
          <span className="text-xs text-slate-400">{header.navLinks.length} items configured</span>
        </div>

        {/* Links list */}
        <div className="space-y-2">
          {header.navLinks.map((link, idx) => (
            <div key={link.id} className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="w-5 text-xs text-slate-500 font-mono text-center">{idx + 1}</span>
              <input
                type="text"
                value={link.label}
                onChange={e => {
                  const updated = header.navLinks.map(l => l.id === link.id ? { ...l, label: e.target.value } : l);
                  updateHeader({ navLinks: updated });
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                placeholder="Menu Label"
              />
              <input
                type="text"
                value={link.url}
                onChange={e => {
                  const updated = header.navLinks.map(l => l.id === link.id ? { ...l, url: e.target.value } : l);
                  updateHeader({ navLinks: updated });
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                placeholder="Target URL (e.g. #products)"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveLink(idx, 'up')}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === header.navLinks.length - 1}
                  onClick={() => handleMoveLink(idx, 'down')}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add link form */}
        <form onSubmit={handleAddLink} className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="New Link Label (e.g. Careers)"
            className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="Target URL (e.g. #careers)"
            className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </form>

        {/* CTA Button Settings */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Header CTA Button Text</label>
            <input
              type="text"
              value={header.ctaButtonText}
              onChange={e => updateHeader({ ctaButtonText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Header CTA Button Link</label>
            <input
              type="text"
              value={header.ctaButtonLink}
              onChange={e => updateHeader({ ctaButtonLink: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
