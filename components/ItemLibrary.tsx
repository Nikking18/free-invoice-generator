'use client';

import React, { useState } from 'react';
import { ReusableItem, UNIT_TYPES } from '../lib/types';
import { formatCurrency } from '../lib/calculations';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { 
  Package, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle,
  X
} from 'lucide-react';

interface ItemLibraryProps {
  items: ReusableItem[];
  currencySymbol: string;
  currencyCode: string;
  onSaveItem: (item: ReusableItem) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onRestorePresets?: () => Promise<void>;
  onAddItemToInvoice?: (item: ReusableItem) => void;
}

export function ItemLibrary({
  items,
  currencySymbol,
  currencyCode,
  onSaveItem,
  onDeleteItem,
  onRestorePresets,
  onAddItemToInvoice,
}: ItemLibraryProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ReusableItem> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem({
      id: `item-${Date.now()}`,
      name: '',
      description: '',
      unitType: 'hour',
      defaultUnitPrice: 0,
      taxable: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ReusableItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name?.trim()) return;

    const itemToSave: ReusableItem = {
      id: editingItem.id || `item-${Date.now()}`,
      name: editingItem.name.trim(),
      description: editingItem.description?.trim() || '',
      unitType: editingItem.unitType || 'hour',
      defaultUnitPrice: Math.max(0, editingItem.defaultUnitPrice || 0),
      taxable: editingItem.taxable ?? true,
      createdAt: editingItem.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSaveItem(itemToSave);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    await onDeleteItem(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Search Controls */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-100 text-gray-900 rounded-sm border border-gray-200">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight">
              {t('tabItemLibrary')}
            </h2>
            <p className="text-xs text-gray-500">
              Save reusable services and products for 1-click insertion into invoices.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('phItemSearch')}
              className="pl-9 pr-4 py-2 text-xs rounded-sm border border-gray-200 bg-gray-50 text-gray-900 w-full sm:w-64 focus:outline-none focus:border-gray-900"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Saved Item</span>
          </button>
        </div>
      </div>

      {/* Items Table - Responsive horizontal scroll container */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-semibold text-gray-700">{t('msgNoItems')}</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Save standard rates and services here to pick them from dropdowns when building invoices.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Saved Item</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Item & Description</th>
                  <th className="py-3 px-4">Unit Type</th>
                  <th className="py-3 px-4 text-right">Default Unit Price</th>
                  <th className="py-3 px-4 text-center">Tax Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      {item.description && (
                        <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono capitalize">
                      {item.unitType}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                      {formatCurrency(item.defaultUnitPrice, currencyCode, currencySymbol)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${
                          item.taxable
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        {item.taxable ? 'Taxable' : 'Non-Taxable'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {onAddItemToInvoice && (
                          <button
                            onClick={() => onAddItemToInvoice(item)}
                            className="px-2.5 py-1 text-[11px] font-bold text-gray-900 hover:bg-gray-100 rounded-sm transition-colors border border-gray-200 mr-2"
                            title="Add to active invoice draft"
                          >
                            + Add to Invoice
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 rounded-sm transition-colors"
                          title={t('btnEdit')}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 rounded-sm transition-colors"
                          title={t('btnDelete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm border border-gray-200 max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                {editingItem.createdAt ? 'Edit Reusable Item' : 'Add Reusable Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Item / Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Web Design Consultation"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Detailed work breakdown or specifications"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Unit Type
                  </label>
                  <select
                    value={editingItem.unitType || 'hour'}
                    onChange={(e) => setEditingItem({ ...editingItem, unitType: e.target.value })}
                    className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                  >
                    {UNIT_TYPES.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Default Price ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={editingItem.defaultUnitPrice || 0}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, defaultUnitPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full font-mono rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900 text-right"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.taxable ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, taxable: e.target.checked })}
                    className="rounded-sm border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="font-semibold text-gray-800">Taxable Item by Default</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm"
                >
                  {t('btnCancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm border border-gray-200 p-6 max-w-sm w-full space-y-4 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Delete Item Preset?</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to remove this item from your library?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-sm"
              >
                {t('btnConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
