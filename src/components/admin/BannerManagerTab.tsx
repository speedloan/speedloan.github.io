import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Flag, Plus, Edit2, Trash2, CheckCircle, XCircle, Sliders, Smartphone, Monitor, UploadCloud } from 'lucide-react';
import { Banner } from '../../types/index.ts';

const presetBanners = [
  {
    name: 'Corporate Skyscraper Dusk',
    desktop: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    mobile: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=720&q=80',
  },
  {
    name: 'Digital Global Financial Network',
    desktop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    mobile: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=720&q=80',
  },
  {
    name: 'Executive Boardroom & Capital Markets',
    desktop: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80',
    mobile: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=720&q=80',
  }
];

export const BannerManagerTab: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBannerActive } = useBuilder();
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    badgeText: 'INSTITUTIONAL LENDING',
    desktopImage: presetBanners[0].desktop,
    mobileImage: presetBanners[0].mobile,
    ctaText: 'Explore Loan Products',
    ctaLink: '#products',
    secondaryCtaText: 'Repayment Calculator',
    secondaryCtaLink: '#calculator',
    overlayOpacity: 0.75,
    isActive: true,
    displayOrder: banners.length + 1,
  });

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: 'Accelerate Your Enterprise Balance Sheet',
      subtitle: 'Tailored institutional credit facilities up to $10M with rapid 48-hour approvals.',
      badgeText: 'CAPITAL ACCELERATION',
      desktopImage: presetBanners[0].desktop,
      mobileImage: presetBanners[0].mobile,
      ctaText: 'Apply For Business Line',
      ctaLink: '#apply',
      secondaryCtaText: 'View Rates',
      secondaryCtaLink: '#products',
      overlayOpacity: 0.72,
      isActive: true,
      displayOrder: banners.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setFormData({ ...b });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.desktopImage?.trim()) return;

    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
    } else {
      addBanner(formData as Omit<Banner, 'id'>);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Flag className="w-5 h-5 text-blue-400" />
            <span>Banner &amp; Hero Carousel Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage high-impact desktop and mobile hero banners, promotional carousels, and conversion call-to-actions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Hero Banner</span>
        </button>
      </div>

      {/* Banner Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.map(banner => (
          <div key={banner.id} className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
            {/* Banner Preview Frame */}
            <div className="relative h-48 bg-slate-950 overflow-hidden">
              <img
                src={banner.desktopImage}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 bg-slate-950 transition-opacity" 
                style={{ opacity: banner.overlayOpacity }} 
              />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                {banner.badgeText && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                    {banner.badgeText}
                  </span>
                )}
                <h3 className="text-base font-bold text-white line-clamp-1">{banner.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{banner.subtitle}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-blue-600 text-white">
                    {banner.ctaText}
                  </span>
                  {banner.secondaryCtaText && (
                    <span className="px-2.5 py-1 text-[10px] font-medium rounded border border-white/40 text-white">
                      {banner.secondaryCtaText}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-sm">
                  Order #{banner.displayOrder}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  banner.isActive ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
                }`}>
                  {banner.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Banner Details & Actions */}
            <div className="p-4 bg-slate-900 flex-1 flex flex-col justify-between space-y-3">
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate text-slate-300">Desktop: {banner.desktopImage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate text-slate-300">Mobile: {banner.mobileImage || 'Auto-scales'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleBannerActive(banner.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                    banner.isActive ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {banner.isActive ? 'Disable Banner' : 'Activate Banner'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(banner)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this banner?')) {
                        deleteBanner(banner.id);
                      }
                    }}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-white">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingBanner ? 'Edit Banner Configuration' : 'Create New Hero Banner'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Sub-headline / Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ''}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Pill / Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={formData.badgeText || ''}
                  onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="e.g. Q4 CAPITAL INCENTIVES"
                />
              </div>

              {/* Desktop & Mobile Image URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Desktop Image *
                    </label>
                    <label className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
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
                              if (res) setFormData(prev => ({ ...prev, desktopImage: res }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.desktopImage || ''}
                    onChange={e => setFormData({ ...formData, desktopImage: e.target.value })}
                    placeholder="https://... or click Upload above"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  {formData.desktopImage && (
                    <div className="mt-1 h-16 w-full rounded overflow-hidden border border-slate-800 bg-slate-950">
                      <img src={formData.desktopImage} alt="Desktop Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Mobile Image (Optional)
                    </label>
                    <label className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
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
                              if (res) setFormData(prev => ({ ...prev, mobileImage: res }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.mobileImage || ''}
                    onChange={e => setFormData({ ...formData, mobileImage: e.target.value })}
                    placeholder="https://... or click Upload above"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  {formData.mobileImage && (
                    <div className="mt-1 h-16 w-full rounded overflow-hidden border border-slate-800 bg-slate-950">
                      <img src={formData.mobileImage} alt="Mobile Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Image Presets:</span>
                <div className="grid grid-cols-3 gap-2">
                  {presetBanners.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, desktopImage: p.desktop, mobileImage: p.mobile })}
                      className="p-1.5 rounded border border-slate-700 text-left bg-slate-950 hover:border-blue-500 text-[10px] text-slate-300"
                    >
                      <img src={p.desktop} alt={p.name} className="h-10 w-full object-cover rounded mb-1" />
                      <span className="line-clamp-1">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Call to Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={formData.ctaText || ''}
                    onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white mb-2"
                  />
                  <input
                    type="text"
                    value={formData.ctaLink || ''}
                    onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300"
                    placeholder="#products"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={formData.secondaryCtaText || ''}
                    onChange={e => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white mb-2"
                  />
                  <input
                    type="text"
                    value={formData.secondaryCtaLink || ''}
                    onChange={e => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300"
                    placeholder="#calculator"
                  />
                </div>
              </div>

              {/* Opacity slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Darkening Overlay Opacity: {Math.round((formData.overlayOpacity ?? 0.7) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.95"
                  step="0.05"
                  value={formData.overlayOpacity ?? 0.75}
                  onChange={e => setFormData({ ...formData, overlayOpacity: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-md cursor-pointer"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
