import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  Edit3,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Layers,
  Palette,
  Maximize2,
  Sparkles,
  CheckCircle,
  Sliders,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlignLeft,
  Star
} from 'lucide-react';
import { VisualSection } from '../../types/index.ts';

export const VisualEditorTab: React.FC = () => {
  const { 
    visualSections, 
    updateVisualSection, 
    moveSection, 
    toggleSectionVisibility,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    theme,
    branding,
    setActiveView
  } = useBuilder();

  const sortedSections = [...visualSections].sort((a, b) => a.order - b.order);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sortedSections[0]?.id || '');

  const activeSection = visualSections.find(s => s.id === selectedSectionId) || sortedSections[0];

  // File upload for section images
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddParagraph = () => {
    if (!activeSection) return;
    const existing = activeSection.paragraphs || [];
    updateVisualSection(activeSection.id, {
      paragraphs: [...existing, 'New custom descriptive paragraph text for this section...']
    });
  };

  const handleUpdateParagraph = (index: number, val: string) => {
    if (!activeSection) return;
    const existing = [...(activeSection.paragraphs || [])];
    existing[index] = val;
    updateVisualSection(activeSection.id, { paragraphs: existing });
  };

  const handleRemoveParagraph = (index: number) => {
    if (!activeSection) return;
    const existing = (activeSection.paragraphs || []).filter((_, i) => i !== index);
    updateVisualSection(activeSection.id, { paragraphs: existing });
  };

  const handleAddNewStory = () => {
    addTestimonial({
      name: 'New Corporate Client',
      title: 'Managing Director, Industrial Ventures',
      facility: '₹2.50 Crore Structured Capex Facility',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
      quote: 'Exceptional transparency and rapid disbursement. Blue Wien delivered structured financing exactly when our manufacturing expansion needed it most.',
      rating: 5,
      isActive: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-400" />
            <span>Visual Website Editor &amp; Layout Architect</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visually arrange website sections, upload custom photos from your device, add multiple paragraphs, and adjust order.
          </p>
        </div>

        <button
          onClick={() => setActiveView('public')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/40 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full Public Preview</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Section Order & Visibility List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Page Sections ({sortedSections.length})</span>
              <span className="text-[10px] text-slate-500">Order &amp; Toggle</span>
            </div>

            <div className="space-y-2 pt-1">
              {sortedSections.map((sec, idx) => {
                const isSelected = sec.id === activeSection?.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-sm ring-1 ring-blue-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 text-[11px] font-mono text-slate-500 text-center">{idx + 1}</span>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${sec.isVisible ? 'text-white' : 'text-slate-500 line-through'}`}>
                          {sec.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{sec.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(sec.id, 'up')}
                        title="Move Up"
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 rounded"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sortedSections.length - 1}
                        onClick={() => moveSection(sec.id, 'down')}
                        title="Move Down"
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 rounded"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSectionVisibility(sec.id)}
                        title={sec.isVisible ? 'Hide Section' : 'Show Section'}
                        className={`p-1 rounded ${sec.isVisible ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'}`}
                      >
                        {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Section Parameter Customizer */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Section Editor</span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeSection?.name}</h3>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={activeSection?.isVisible ?? true}
                onChange={() => activeSection && toggleSectionVisibility(activeSection.id)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span>Section Visible</span>
            </label>
          </div>

          {activeSection && (
            <div className="space-y-6">
              {/* Eyebrow / Badge */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Section Pill Badge / Eyebrow Text
                </label>
                <input
                  type="text"
                  value={activeSection.badge || ''}
                  onChange={e => updateVisualSection(activeSection.id, { badge: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="e.g. FINANCIAL ACCELERATION"
                />
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Section Headline *
                </label>
                <input
                  type="text"
                  value={activeSection.title}
                  onChange={e => updateVisualSection(activeSection.id, { title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Section Subheading / Primary Overview
                </label>
                <textarea
                  rows={2}
                  value={activeSection.subtitle}
                  onChange={e => updateVisualSection(activeSection.id, { subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Section Image Uploader ("প্রত্যেকটা ছবি যাতে আমি চেঞ্জ করতে পারি") */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Section Feature Photo (Device Upload or URL)</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold">Changeable from device</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {activeSection.imageUrl ? (
                    <img
                      src={activeSection.imageUrl}
                      alt="Section Preview"
                      className="w-24 h-20 rounded-lg object-cover border border-slate-700 shadow shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-20 rounded-lg bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs shrink-0">
                      No Photo
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={activeSection.imageUrl || ''}
                        onChange={e => updateVisualSection(activeSection.id, { imageUrl: e.target.value })}
                        placeholder="Paste image URL..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, base64 => updateVisualSection(activeSection.id, { imageUrl: base64 }))}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      value={activeSection.imageDescription || ''}
                      onChange={e => updateVisualSection(activeSection.id, { imageDescription: e.target.value })}
                      placeholder="Image Description / Alt text (e.g. Modern financial architecture)"
                      className="w-full bg-slate-900/80 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Paragraphs Builder ("নতুন প্যারাগ্রাফ এড করতে পারি") */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft className="w-4 h-4 text-amber-400" />
                    <span>Custom Content Paragraphs ({(activeSection.paragraphs || []).length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddParagraph}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(activeSection.paragraphs || []).map((pText, pIdx) => (
                    <div key={pIdx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-400">Paragraph #{pIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveParagraph(pIdx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={pText}
                        onChange={e => handleUpdateParagraph(pIdx, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Testimonials / Client Stories Editor */}
              {activeSection.type === 'testimonials' && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>Client Success Stories Cards ({testimonials.length})</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Add, edit, or remove each client story, review quote, company name, and sanctioned loan amount in Indian Rupees (₹).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddNewStory}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow self-start sm:self-auto cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Client Story</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {testimonials.map((story, sIdx) => (
                      <div key={story.id || sIdx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-900/60 text-blue-300 font-bold text-[11px] flex items-center justify-center">
                              {sIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">{story.name || 'Untitled Client'}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                              <span>Display on Website</span>
                              <input
                                type="checkbox"
                                checked={story.isActive}
                                onChange={e => updateTestimonial(story.id, { isActive: e.target.checked })}
                                className="w-3.5 h-3.5 accent-blue-600 rounded"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => deleteTestimonial(story.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                              title="Delete Story"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Client Photo / Avatar (Device Upload or URL) */}
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                              <span>ক্লায়েন্টের ছবি / Client Photo (Upload or URL)</span>
                            </label>
                            {story.avatarUrl && (
                              <button
                                type="button"
                                onClick={() => updateTestimonial(story.id, { avatarUrl: '' })}
                                className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                              >
                                Remove Photo
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {story.avatarUrl ? (
                              <img
                                src={story.avatarUrl}
                                alt={story.name || 'Client'}
                                className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/50 shadow-md shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                                {story.name ? story.name.substring(0, 2).toUpperCase() : 'Photo'}
                              </div>
                            )}

                            <div className="flex-1 space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={story.avatarUrl || ''}
                                  onChange={e => updateTestimonial(story.id, { avatarUrl: e.target.value })}
                                  placeholder="Paste image URL (https://...)"
                                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                                />
                                <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 shadow">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload Device</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleFileUpload(e, base64 => updateTestimonial(story.id, { avatarUrl: base64 }))}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                              <p className="text-[10px] text-slate-400">
                                ডিভাইস থেকে ক্লায়েন্টের পাসপোর্ট/পোর্ট্রেট ফটো আপলোড করুন অথবা যেকোনো ছবির লিঙ্ক দিন।
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Client Full Name</label>
                            <input
                              type="text"
                              value={story.name}
                              onChange={e => updateTestimonial(story.id, { name: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              placeholder="e.g. Julian Sterling"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company &amp; Designation</label>
                            <input
                              type="text"
                              value={story.title}
                              onChange={e => updateTestimonial(story.id, { title: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              placeholder="e.g. Managing Director, Sterling Logistics Global"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sanctioned Loan Facility (in ₹)</label>
                            <input
                              type="text"
                              value={story.facility}
                              onChange={e => updateTestimonial(story.id, { facility: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono"
                              placeholder="e.g. ₹4.50 Crore Commercial Capex Facility"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Star Rating (1 - 5 Stars)</label>
                            <select
                              value={story.rating}
                              onChange={e => updateTestimonial(story.id, { rating: Number(e.target.value) })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            >
                              <option value={5}>★★★★★ (5 Stars)</option>
                              <option value={4}>★★★★☆ (4 Stars)</option>
                              <option value={3}>★★★☆☆ (3 Stars)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Review Quote / Testimonial Feedback</label>
                          <textarea
                            rows={3}
                            value={story.quote}
                            onChange={e => updateTestimonial(story.id, { quote: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                            placeholder="Write client testimonial review here..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Background Color & Padding Spacing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Section Background Theme</label>
                  <select
                    value={activeSection.backgroundColor}
                    onChange={e => updateVisualSection(activeSection.id, { backgroundColor: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="default">Default Neutral (#f8fafc / White)</option>
                    <option value="navy">Navy Corporate Contrast (#09152b)</option>
                    <option value="light">Soft Slate Tint (#f1f5f9)</option>
                    <option value="primary">Royal Blue Gradient (#1d4ed8)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Vertical Section Spacing</label>
                  <select
                    value={activeSection.paddingY}
                    onChange={e => updateVisualSection(activeSection.id, { paddingY: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="compact">Compact (py-12)</option>
                    <option value="normal">Standard (py-20)</option>
                    <option value="relaxed">Relaxed / Spacious (py-28)</option>
                  </select>
                </div>
              </div>

              {/* Button Customization if applicable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">CTA Button Label</label>
                  <input
                    type="text"
                    value={activeSection.buttonText || ''}
                    onChange={e => updateVisualSection(activeSection.id, { buttonText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="e.g. Learn More"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">CTA Button Destination URL</label>
                  <input
                    type="text"
                    value={activeSection.buttonLink || ''}
                    onChange={e => updateVisualSection(activeSection.id, { buttonLink: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="e.g. #products"
                  />
                </div>
              </div>

              {/* Instant Mini Live Preview Card */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Live Section Card Render
                </span>
                <div className={`p-6 rounded-xl border border-slate-700/60 transition-all ${
                  activeSection.backgroundColor === 'navy' 
                    ? 'bg-[#09152b] text-white' 
                    : activeSection.backgroundColor === 'primary' 
                    ? 'bg-blue-700 text-white'
                    : 'bg-white text-slate-900'
                }`}>
                  {activeSection.badge && (
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                      activeSection.backgroundColor === 'navy' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activeSection.badge}
                    </span>
                  )}
                  <h4 className="text-lg font-bold tracking-tight">{activeSection.title}</h4>
                  <p className={`text-xs mt-1 max-w-lg ${activeSection.backgroundColor === 'navy' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {activeSection.subtitle}
                  </p>
                  {activeSection.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={activeSection.imageUrl}
                        alt={activeSection.imageDescription || 'Section graphic'}
                        className="w-full max-h-48 object-cover rounded-lg border border-slate-200/50 shadow"
                      />
                      {activeSection.imageDescription && (
                        <p className="text-[10px] text-slate-400 italic mt-1">📸 {activeSection.imageDescription}</p>
                      )}
                    </div>
                  )}
                  {activeSection.paragraphs && activeSection.paragraphs.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {activeSection.paragraphs.map((p, i) => (
                        <p key={i} className="text-xs text-slate-600">{p}</p>
                      ))}
                    </div>
                  )}
                  {activeSection.buttonText && (
                    <button
                      type="button"
                      className="mt-4 px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow"
                    >
                      {activeSection.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
