import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  PackageCheck,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Sliders,
  DollarSign,
  Layers,
  X,
  Sparkles,
  FileText,
  Upload,
  Image as ImageIcon,
  AlignLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Product, ProductParagraph } from '../../types/index.ts';

const sampleImages = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
];

export const ProductManagerTab: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductActive,
    settings,
    openProductDetail
  } = useBuilder();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: categories[0]?.id || '',
    image: sampleImages[0],
    imageDescription: 'Product promotional banner representation',
    shortDescription: '',
    detailedDescription: '',
    paragraphs: [],
    features: ['Instant digital sanction letter', 'Flexible repayment structures', 'Zero early foreclosure penalty'],
    eligibilityCriteria: ['Operational corporate track record', 'Minimum annual turnover verified', 'Compliant CIBIL bureau rating'],
    requiredDocuments: ['Audited balance sheets (2 years)', 'Corporate bank statements', 'Registration certificates'],
    loanAmount: '₹10,00,000 to ₹1,00,00,000',
    minAmount: 1000000,
    maxAmount: 10000000,
    interestRate: '8.50% - 11.75% p.a.',
    minRate: 8.5,
    tenure: '12 to 84 Months',
    processingFee: '1.0% flat',
    applyButtonText: 'Apply For This Loan',
    displayOrder: 1,
    isActive: true,
    isFeatured: false,
  });

  const [featureInput, setFeatureInput] = useState('');
  const [eligibilityInput, setEligibilityInput] = useState('');
  const [documentInput, setDocumentInput] = useState('');

  // Handle local device image file upload
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

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?.id || '',
      image: sampleImages[Math.floor(Math.random() * sampleImages.length)],
      imageDescription: 'Product promotional banner illustration',
      shortDescription: '',
      detailedDescription: '',
      paragraphs: [
        {
          id: 'p-' + Date.now(),
          heading: 'Overview & Strategic Facility Purpose',
          text: 'Describe the key strategic advantages, drawdown velocity, and repayment structuring for this new product launch...',
          imageUrl: '',
          imageDescription: ''
        }
      ],
      features: ['Tiered drawdown schedules', 'Dedicated underwriting team', 'Competitive variable APR'],
      eligibilityCriteria: ['Verified operating business or professional practice', 'Positive debt-service coverage ratio'],
      requiredDocuments: ['Tax returns (ITR) for last 2 fiscal cycles', '6 months business bank statements', 'GST returns and KYC proof'],
      loanAmount: '₹10,00,000 to ₹2,50,00,000',
      minAmount: 1000000,
      maxAmount: 25000000,
      interestRate: '8.75% - 12.00% p.a.',
      minRate: 8.75,
      tenure: '12 to 60 Months',
      processingFee: '1.0% flat',
      applyButtonText: 'Apply Now',
      displayOrder: products.length + 1,
      isActive: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({ ...prod, paragraphs: prod.paragraphs || [] });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData as Omit<Product, 'id'>);
    }
    setIsModalOpen(false);
  };

  // Paragraph actions
  const addParagraph = () => {
    const newP: ProductParagraph = {
      id: 'p-' + Date.now(),
      heading: 'New Content Section',
      text: '',
      imageUrl: '',
      imageDescription: ''
    };
    setFormData(prev => ({ ...prev, paragraphs: [...(prev.paragraphs || []), newP] }));
  };

  const updateParagraph = (id: string, updates: Partial<ProductParagraph>) => {
    setFormData(prev => ({
      ...prev,
      paragraphs: (prev.paragraphs || []).map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const removeParagraph = (id: string) => {
    setFormData(prev => ({
      ...prev,
      paragraphs: (prev.paragraphs || []).filter(p => p.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-400" />
            <span>Financial Product Management (CRUD &amp; Photos)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Launch new financial products with custom photos from device or URL, multiple paragraphs, and image descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Loan Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by product name or description..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategoryFilter}
            onChange={e => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Product &amp; Image</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Sanction Limit ({settings.currencySymbol})</th>
                <th className="py-3 px-4">Interest Rate</th>
                <th className="py-3 px-4">Paragraphs</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No financial products found matching query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => {
                  const cat = categories.find(c => c.id === prod.category);
                  return (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.imageDescription || prod.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0 shadow-sm"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate max-w-xs">{prod.name}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">{prod.shortDescription}</p>
                            {prod.imageDescription && (
                              <p className="text-[10px] text-blue-400 truncate max-w-xs italic">
                                Alt: {prod.imageDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-[11px]">
                          {cat?.name || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {prod.loanAmount}
                      </td>
                      <td className="py-3.5 px-4 text-amber-400 font-mono font-medium">
                        {prod.interestRate}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {(prod.paragraphs || []).length} sections
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProductActive(prod.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            prod.isActive
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900/50'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-800/60 hover:bg-rose-900/50'
                          }`}
                        >
                          {prod.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openProductDetail(prod.id)}
                            title="Quick View Modal"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            title="Edit Product & Photos"
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            title="Delete Product"
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-white">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-blue-400" />
                  <span>{editingProduct ? 'Edit Financial Product & Photos' : 'Launch New Financial Product'}</span>
                </h3>
                <p className="text-xs text-slate-400">Upload device pictures, add rich paragraphs, and set INR loan limits.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Commercial Capex & Machinery Loan"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Product Category *
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Product Image & Device Upload */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Primary Product Image (Device File Upload or URL) *</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold">Changeable from device</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-24 h-20 rounded-lg object-cover border border-slate-700 shadow shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-20 rounded-lg bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs shrink-0">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.image || ''}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        placeholder="Paste image URL..."
                      />
                      <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, base64 => setFormData({ ...formData, image: base64 }))}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Image Description */}
                    <div>
                      <input
                        type="text"
                        value={formData.imageDescription || ''}
                        onChange={e => setFormData({ ...formData, imageDescription: e.target.value })}
                        placeholder="Image Description / Caption (e.g. Modern commercial factory expansion machinery)"
                        className="w-full bg-slate-900/80 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-2 overflow-x-auto pt-1">
                  <span className="text-[10px] text-slate-400 shrink-0">Presets:</span>
                  {sampleImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Sample"
                      onClick={() => setFormData({ ...formData, image: img })}
                      className={`w-10 h-8 rounded object-cover cursor-pointer border ${formData.image === img ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-slate-700'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Short Summary (Catalog Card View) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription || ''}
                  onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Brief 1-2 sentence overview for catalog cards..."
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Prospectus / Primary Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formData.detailedDescription || ''}
                  onChange={e => setFormData({ ...formData, detailedDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Full product terms, corporate objectives, loan amortization..."
                />
              </div>

              {/* Custom Paragraphs Builder ("নতুন প্যারাগ্রাফ এড করতে পারি সেখানে ছবি নতুন করে দিতে পারি। ছবির ডেসক্রিপশন দিতে পারি") */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Additional Custom Paragraphs &amp; Section Photos ({(formData.paragraphs || []).length})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={addParagraph}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Paragraph</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(formData.paragraphs || []).map((para, pIdx) => (
                    <div key={para.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400">Paragraph Section #{pIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeParagraph(para.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={para.heading || ''}
                        onChange={e => updateParagraph(para.id, { heading: e.target.value })}
                        placeholder="Paragraph Heading (e.g. Flexible Collateral Appraisal)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                      />

                      <textarea
                        rows={3}
                        value={para.text}
                        onChange={e => updateParagraph(para.id, { text: e.target.value })}
                        placeholder="Write detailed paragraph content..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 leading-relaxed"
                      />

                      {/* Paragraph Photo Upload & Description */}
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px] font-semibold text-slate-300">Section Photo (Optional)</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={para.imageUrl || ''}
                            onChange={e => updateParagraph(para.id, { imageUrl: e.target.value })}
                            placeholder="Image URL or upload from device..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                          <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1 border border-slate-700">
                            <Upload className="w-3 h-3 text-blue-400" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, base64 => updateParagraph(para.id, { imageUrl: base64 }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={para.imageDescription || ''}
                          onChange={e => updateParagraph(para.id, { imageDescription: e.target.value })}
                          placeholder="Image Description / Caption for this paragraph's picture"
                          className="w-full bg-slate-950/70 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Metrics in INR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Loan Amount ({settings.currencySymbol})
                  </label>
                  <input
                    type="text"
                    value={formData.loanAmount || ''}
                    onChange={e => setFormData({ ...formData, loanAmount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-medium"
                    placeholder="₹10,00,000 to ₹5,00,00,000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Interest Rate</label>
                  <input
                    type="text"
                    value={formData.interestRate || ''}
                    onChange={e => setFormData({ ...formData, interestRate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-medium text-amber-400"
                    placeholder="8.50% - 11.50% p.a."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tenure Period</label>
                  <input
                    type="text"
                    value={formData.tenure || ''}
                    onChange={e => setFormData({ ...formData, tenure: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                    placeholder="24 to 120 Months"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Processing Fee</label>
                  <input
                    type="text"
                    value={formData.processingFee || ''}
                    onChange={e => setFormData({ ...formData, processingFee: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                    placeholder="1.0% flat"
                  />
                </div>
              </div>

              {/* Features List */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Key Product Features ({formData.features?.length || 0})
                </label>
                <div className="space-y-1.5 mb-2">
                  {formData.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                      <span>• {feat}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, features: formData.features?.filter((_, i) => i !== idx) })}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    placeholder="Add a new feature bullet..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!featureInput.trim()) return;
                      setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
                      setFeatureInput('');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Apply Button Text</label>
                  <input
                    type="text"
                    value={formData.applyButtonText || ''}
                    onChange={e => setFormData({ ...formData, applyButtonText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive ?? true}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span>Active / Published</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured ?? false}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>Featured Card</span>
                  </label>
                </div>
              </div>

              {/* Form Footer */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-900/40 cursor-pointer"
                >
                  {editingProduct ? 'Save Product & Photo Changes' : 'Launch Financial Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
