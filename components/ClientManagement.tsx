'use client';

import React, { useState } from 'react';
import { Client } from '../lib/types';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  FilePlus, 
  Mail, 
  Phone, 
  MapPin, 
  Building,
  AlertCircle,
  X
} from 'lucide-react';

interface ClientManagementProps {
  clients: Client[];
  onSaveClient: (client: Client) => Promise<void>;
  onDeleteClient: (clientId: string) => Promise<void>;
  onCreateInvoiceForClient: (client: Client) => void;
}

export function ClientManagement({
  clients,
  onSaveClient,
  onDeleteClient,
  onCreateInvoiceForClient,
}: ClientManagementProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingClient({
      id: `client-${Date.now()}`,
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient?.name?.trim()) {
      setModalError('Client Name is required.');
      return;
    }

    if (editingClient.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editingClient.email.trim())) {
        setModalError('Please enter a valid email address (e.g. name@example.com).');
        return;
      }
    }

    const clientToSave: Client = {
      id: editingClient.id || `client-${Date.now()}`,
      name: editingClient.name.trim(),
      company: editingClient.company?.trim(),
      email: editingClient.email?.trim() || '',
      phone: editingClient.phone?.trim(),
      address: editingClient.address?.trim() || '',
      notes: editingClient.notes?.trim(),
      createdAt: editingClient.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSaveClient(clientToSave);
    setIsModalOpen(false);
    setEditingClient(null);
    setModalError(null);
  };

  const handleDelete = async (id: string) => {
    await onDeleteClient(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Search Controls */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-100 text-gray-900 rounded-sm border border-gray-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight">
              {t('tabClients')}
            </h2>
            <p className="text-xs text-gray-500">
              Manage repeat client profiles for quick invoice pre-filling.
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
              placeholder={t('phClientSearch')}
              aria-label={t('phClientSearch')}
              className="pl-9 pr-4 py-2 text-xs rounded-sm border border-gray-200 bg-gray-50 text-gray-900 w-full sm:w-64 focus:outline-none focus:border-gray-900"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btnAddClient')}</span>
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-semibold text-gray-700">{t('msgNoClients')}</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Add client contacts here to quickly autofill billing addresses and details on new invoices.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btnAddClient')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-xs flex flex-col justify-between hover:border-gray-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{client.name}</h3>
                    {client.company && (
                      <p className="text-xs text-gray-600 font-medium flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-gray-400" />
                        <span>{client.company}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(client)}
                      className="p-1.5 text-gray-500 hover:text-gray-900 rounded-sm transition-colors"
                      title={t('btnEdit')}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(client.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-600 rounded-sm transition-colors"
                      title={t('btnDelete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  {client.email && (
                    <p className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </p>
                  )}
                  {client.phone && (
                    <p className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{client.phone}</span>
                    </p>
                  )}
                  {client.address && (
                    <p className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 whitespace-pre-line text-gray-500">{client.address}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">
                  Saved {new Date(client.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onCreateInvoiceForClient(client)}
                  className="flex items-center space-x-1 text-xs font-bold text-gray-900 hover:underline"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Create Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {isModalOpen && editingClient && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm border border-gray-200 max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                {editingClient.createdAt ? 'Edit Client Profile' : 'Add New Client'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-2.5 rounded-sm bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Client Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editingClient.company || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                  placeholder="e.g. Jenkins Media Group"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingClient.email || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    placeholder="sarah@jenkins.com"
                    className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editingClient.phone || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Billing Address
                </label>
                <textarea
                  rows={2}
                  value={editingClient.address || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  placeholder="Street Address, City, State ZIP"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
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
                  Save Client
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
            <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Delete Client Profile?</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to remove this client? Saved invoices associated with this client will remain intact.
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
