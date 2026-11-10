import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { FolderTree, Plus, Edit2, Trash2, Layers, Check } from 'lucide-react';
import { ProductCategory } from '../../types/index.ts';

export const CategoriesTab: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useBuilder();
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(categories.length + 1);

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isEditingId) {
      updateCategory(isEditingId, {
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        displayOrder: Number(displayOrder),
      });
      setIsEditingId(null);
    } else {
      addCategory({
        name: name.trim(),
        slug: generatedSlug,
        iconName: 'Building2',
        description: description.trim(),
        displayOrder: Number(displayOrder),
      });
    }

    setName('');
    setSlug('');
    setDescription('');
    setDisplayOrder(categories.length + 2);
  };

  const startEdit = (cat: ProductCategory) => {
    setIsEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setDisplayOrder(cat.displayOrder);
  };

  const cancelEdit = () => {
    setIsEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-blue-400" />
          <span>Product Categories Management</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Group your lending products into clear business domains (Commercial, Real Estate, Working Capital, Personal).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Categories ({categories.length})</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {categories.map(cat => {
                const productCount = products.filter(p => p.category === cat.id).length;
                return (
                  <div key={cat.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-white">{cat.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-blue-400 border border-slate-800">
                          /{cat.slug}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {productCount} {productCount === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-500 font-mono">#{cat.displayOrder}</span>
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (productCount > 0) {
                            alert(`Cannot delete this category: ${productCount} active products are currently assigned to it.`);
                            return;
                          }
                          if (window.confirm(`Delete category ${cat.name}?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add / Edit Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isEditingId ? 'Edit Category' : 'Create New Category'}
            </h3>
            {isEditingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (!isEditingId) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="e.g. Infrastructure Financing"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                placeholder="e.g. infrastructure-financing"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="Short summary for category filtering..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Display Sort Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={e => setDisplayOrder(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isEditingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditingId ? 'Update Category' : 'Create Category'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
