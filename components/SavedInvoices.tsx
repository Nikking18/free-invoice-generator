'use client';

import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus, BusinessProfile } from '../lib/types';
import { formatCurrency, formatDate } from '../lib/calculations';
import { InvoiceTemplateRenderer } from './InvoiceTemplateRenderer';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { 
  Search, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Download, 
  CheckCircle, 
  Receipt,
  AlertCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface SavedInvoicesProps {
  invoices: Invoice[];
  businessProfile: BusinessProfile;
  onOpenInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onMarkAsPaid: (invoiceId: string) => Promise<void>;
  onDeleteInvoice: (invoiceId: string) => Promise<void>;
  onCreateNewClick: () => void;
}

export function SavedInvoices({
  invoices,
  businessProfile,
  onOpenInvoice,
  onDuplicateInvoice,
  onMarkAsPaid,
  onDeleteInvoice,
  onCreateNewClick,
}: SavedInvoicesProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [selectedPdfInvoice, setSelectedPdfInvoice] = useState<Invoice | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const currencySymbol = businessProfile.defaultCurrencySymbol || '$';
  const currencyCode = businessProfile.defaultCurrency || 'USD';

  // Direct PDF Download without modal (uses invoice's saved templateStyle)
  const handleDirectPdfExport = async (inv: Invoice) => {
    setSelectedPdfInvoice(inv);
    setIsExportingPdf(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const { downloadInvoiceAsPDF } = await import('../lib/pdf');
      await downloadInvoiceAsPDF('saved-invoice-pdf-export', `Invoice_${inv.invoiceNumber || 'Draft'}`);
    } catch (err) {
      console.error('PDF Export failed:', err);
      alert('Failed to export PDF.');
    } finally {
      setIsExportingPdf(false);
      setSelectedPdfInvoice(null);
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    let totalInvoiced = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;
    let thisMonthTotal = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    invoices.forEach((inv) => {
      const grandTotal = inv.grandTotal || 0;
      const balance = inv.balanceDue || 0;

      totalInvoiced += grandTotal;
      if (inv.status === 'Paid') {
        totalPaid += grandTotal;
      } else {
        totalOutstanding += balance;
      }

      if (inv.date) {
        const invDate = new Date(inv.date);
        if (invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear) {
          thisMonthTotal += grandTotal;
        }
      }
    });

    return {
      totalInvoiced,
      totalPaid,
      totalOutstanding,
      thisMonthTotal,
    };
  }, [invoices]);

  // Search & Status filtering
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchQuery =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.projectTitle || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || inv.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const getStatusBadgeStyle = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Sent':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-500 border-gray-300';
      case 'Draft':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>{t('metricTotalInvoiced')}</span>
            <Receipt className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg sm:text-xl font-bold font-mono text-gray-900">
            {formatCurrency(metrics.totalInvoiced, currencyCode, currencySymbol)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <span>{t('metricTotalPaid')}</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-800">
            {formatCurrency(metrics.totalPaid, currencyCode, currencySymbol)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase tracking-wider">
            <span>{t('metricOutstanding')}</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-lg sm:text-xl font-bold font-mono text-rose-800">
            {formatCurrency(metrics.totalOutstanding, currencyCode, currencySymbol)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>{t('metricThisMonth')}</span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg sm:text-xl font-bold font-mono text-gray-900">
            {formatCurrency(metrics.thisMonthTotal, currencyCode, currencySymbol)}
          </p>
        </div>
      </div>

      {/* Action Bar & Search Filters */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills Filter */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-1 md:pb-0 text-xs font-semibold">
          {['All', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors uppercase tracking-wider ${
                  isActive
                    ? 'bg-gray-900 text-white font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {status === 'All' ? t('filterAll') : status}
              </button>
            );
          })}
        </div>

        {/* Search & New Invoice */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchInvoicesPlaceholder')}
              className="pl-9 pr-4 py-2 text-xs rounded-sm border border-gray-200 bg-gray-50 text-gray-900 w-full sm:w-64 focus:outline-none focus:border-gray-900"
            />
          </div>

          <button
            onClick={onCreateNewClick}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btnNewInvoice')}</span>
          </button>
        </div>
      </div>

      {/* Invoices List Table - Responsive Overflow Container */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-12 text-center space-y-3">
          <Receipt className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-semibold text-gray-700">{t('msgNoInvoices')}</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'All'
              ? 'No invoices match your search filters.'
              : 'Create your first invoice to store it locally in browser storage.'}
          </p>
          <button
            onClick={onCreateNewClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btnNewInvoice')}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client / Project</th>
                  <th className="py-3 px-4">Date & Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      #{inv.invoiceNumber}
                      {inv.templateStyle && (
                        <span className="block text-[9px] font-sans font-normal text-gray-400 uppercase tracking-widest">
                          {inv.templateStyle}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{inv.clientName || 'No Client'}</p>
                      {inv.projectTitle && (
                        <p className="text-gray-500 text-[11px] mt-0.5 truncate">{inv.projectTitle}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="text-gray-900 font-medium">{formatDate(inv.date)}</p>
                      <p className="text-[11px] text-gray-500">Due {formatDate(inv.dueDate)}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold border rounded-sm uppercase tracking-wider ${getStatusBadgeStyle(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                      {formatCurrency(inv.grandTotal, currencyCode, currencySymbol)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      {inv.balanceDue > 0 ? (
                        <span className="text-rose-700">
                          {formatCurrency(inv.balanceDue, currencyCode, currencySymbol)}
                        </span>
                      ) : (
                        <span className="text-emerald-700">
                          {formatCurrency(0, currencyCode, currencySymbol)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onOpenInvoice(inv)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 rounded-sm hover:bg-gray-100 transition-colors"
                          title="Open & Edit Invoice"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDirectPdfExport(inv)}
                          disabled={isExportingPdf && selectedPdfInvoice?.id === inv.id}
                          className="p-1.5 text-gray-600 hover:text-gray-900 rounded-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDuplicateInvoice(inv)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 rounded-sm hover:bg-gray-100 transition-colors"
                          title="Duplicate Invoice"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => onMarkAsPaid(inv.id)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-sm transition-colors"
                            title="Mark as Paid"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteConfirmId(inv.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 rounded-sm hover:bg-rose-50 transition-colors"
                          title="Delete Invoice"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm border border-gray-200 p-6 max-w-sm w-full space-y-4 shadow-lg">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-tight">Delete Invoice?</h3>
            </div>
            <p className="text-xs text-gray-600">
              Are you sure you want to remove this invoice from local browser storage? This cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={async () => {
                  await onDeleteInvoice(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-sm"
              >
                {t('btnConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offscreen element for Saved Invoices PDF Export */}
      {selectedPdfInvoice && (
        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '800px',
            pointerEvents: 'none',
          }}
        >
          <InvoiceTemplateRenderer
            id="saved-invoice-pdf-export"
            invoice={selectedPdfInvoice}
            businessProfile={businessProfile}
            templateStyle={selectedPdfInvoice.templateStyle || businessProfile.defaultTemplateStyle || 'classic'}
          />
        </div>
      )}
    </div>
  );
}
