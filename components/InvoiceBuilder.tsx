'use client';

import React, { useState, useMemo } from 'react';
import { 
  Invoice, 
  Client, 
  ReusableItem, 
  BusinessProfile, 
  LineItem, 
  InvoiceStatus,
  PdfTemplateStyle,
  InvoiceLanguage,
  UNIT_TYPES,
  PAYMENT_TERMS_OPTIONS
} from '../lib/types';
import { InvoicePreview } from './InvoicePreview';
import { InvoiceTemplateRenderer } from './InvoiceTemplateRenderer';
import { calculateInvoiceTotals, calculateLineItemTotal, formatCurrency } from '../lib/calculations';
import { saveClient } from '../lib/db';
import { getSanitizedClientName } from '../lib/utils';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  CheckCircle, 
  Save, 
  Sparkles,
  RotateCcw,
  UserPlus,
  AlertCircle,
  Layout,
  Globe
} from 'lucide-react';

interface InvoiceBuilderProps {
  initialInvoice: Invoice;
  businessProfile: BusinessProfile;
  clients: Client[];
  items: ReusableItem[];
  onSaveInvoice: (invoice: Invoice) => Promise<void>;
  onNewInvoice: () => void;
  onRefreshClients: () => void;
  onChangeInvoice?: (invoice: Invoice) => void;
}

export function InvoiceBuilder({
  initialInvoice,
  businessProfile,
  clients,
  items,
  onSaveInvoice,
  onNewInvoice,
  onRefreshClients,
  onChangeInvoice,
}: InvoiceBuilderProps) {
  const { t } = useTranslation();

  const [invoice, setInvoice] = useState<Invoice>(() => {
    return {
      ...initialInvoice,
      templateStyle: initialInvoice.templateStyle || businessProfile.defaultTemplateStyle || 'classic',
      invoiceLanguage: initialInvoice.invoiceLanguage || businessProfile.defaultInvoiceLanguage || 'en',
    };
  });
  const [prevInitialInvoice, setPrevInitialInvoice] = useState<Invoice>(initialInvoice);
  const [saveManualClient, setSaveManualClient] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialInvoice.clientId || '');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const currencySymbol = businessProfile.defaultCurrencySymbol || '$';
  const currencyCode = businessProfile.defaultCurrency || 'USD';

  // Adjust state when initialInvoice prop changes
  if (prevInitialInvoice !== initialInvoice) {
    setPrevInitialInvoice(initialInvoice);
    setInvoice({
      ...initialInvoice,
      templateStyle: initialInvoice.templateStyle || businessProfile.defaultTemplateStyle || 'classic',
      invoiceLanguage: initialInvoice.invoiceLanguage || businessProfile.defaultInvoiceLanguage || 'en',
    });
    setSelectedClientId(initialInvoice.clientId || '');
  }

  // Memoize invoice totals
  const computedTotals = useMemo(() => {
    return calculateInvoiceTotals(
      invoice.lineItems,
      invoice.invoiceDiscountType,
      invoice.invoiceDiscountValue,
      invoice.taxRate,
      invoice.shippingFee,
      invoice.amountPaid,
      invoice.status
    );
  }, [
    invoice.lineItems,
    invoice.invoiceDiscountType,
    invoice.invoiceDiscountValue,
    invoice.taxRate,
    invoice.shippingFee,
    invoice.amountPaid,
    invoice.status,
  ]);

  // Handle style change
  const handleStyleChange = (style: PdfTemplateStyle) => {
    const updated = { ...invoice, templateStyle: style };
    setInvoice(updated);
    if (onChangeInvoice) onChangeInvoice(updated);
  };

  // Handle invoice output language change
  const handleInvoiceLanguageChange = (lang: InvoiceLanguage) => {
    const updated = { ...invoice, invoiceLanguage: lang };
    setInvoice(updated);
    if (onChangeInvoice) onChangeInvoice(updated);
  };

  // Recalculate due date if payment terms change
  const handlePaymentTermsChange = (terms: string) => {
    const termObj = PAYMENT_TERMS_OPTIONS.find(t => t.label === terms);
    let newDueDate = invoice.dueDate;

    if (termObj && termObj.days >= 0) {
      const baseDate = new Date(invoice.date || new Date().toISOString().split('T')[0]);
      baseDate.setDate(baseDate.getDate() + termObj.days);
      newDueDate = baseDate.toISOString().split('T')[0];
    }

    setInvoice(prev => ({
      ...prev,
      paymentTerms: terms,
      dueDate: newDueDate,
    }));
  };

  // Client dropdown selection
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    if (!clientId) {
      setInvoice(prev => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientCompany: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
      }));
      return;
    }

    const client = clients.find(c => c.id === clientId);
    if (client) {
      setInvoice(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        clientCompany: client.company || '',
        clientEmail: client.email || '',
        clientPhone: client.phone || '',
        clientAddress: client.address || '',
      }));
    }
  };

  // Line item handlers
  const handleLineItemChange = (index: number, field: keyof LineItem, value: unknown) => {
    setInvoice(prev => {
      const updatedItems = [...prev.lineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      return { ...prev, lineItems: updatedItems };
    });
  };

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      description: '',
      quantity: 1,
      unitType: 'hour',
      unitPrice: 0,
      discount: 0,
      taxable: true,
    };
    setInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));
  };

  const handleAddPresetItem = (presetId: string) => {
    if (!presetId) return;
    const item = items.find(i => i.id === presetId);
    if (!item) return;

    const newItem: LineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      description: `${item.name}${item.description ? ` - ${item.description}` : ''}`,
      quantity: 1,
      unitType: item.unitType || 'item',
      unitPrice: item.defaultUnitPrice || 0,
      discount: 0,
      taxable: item.taxable ?? true,
    };

    setInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));

    setSelectedPresetId('');
  };

  const handleDuplicateLineItem = (index: number) => {
    const itemToDup = invoice.lineItems[index];
    if (!itemToDup) return;

    const uniqueTag = `${new Date().getTime()}-${index}`;
    const dupItem: LineItem = {
      ...itemToDup,
      id: `item-dup-${uniqueTag}`,
      description: `${itemToDup.description} (Copy)`,
    };

    setInvoice(prev => {
      const updated = [...prev.lineItems];
      updated.splice(index + 1, 0, dupItem);
      return { ...prev, lineItems: updated };
    });
  };

  const handleRemoveLineItem = (index: number) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  };

  // Validation before saving
  const validateInvoice = (): boolean => {
    const errors: string[] = [];

    if (!invoice.invoiceNumber.trim()) {
      errors.push('Invoice number is required.');
    }
    if (!invoice.date) {
      errors.push('Invoice date is required.');
    }
    const sanitizedClient = getSanitizedClientName(invoice.clientName);
    if (!sanitizedClient) {
      errors.push('Client name is required.');
    }
    if (invoice.lineItems.length === 0) {
      errors.push('At least one line item is required.');
    }

    invoice.lineItems.forEach((item, idx) => {
      if (!item.description.trim()) {
        errors.push(`Line item #${idx + 1} needs a description.`);
      }
      if (item.quantity < 0 || isNaN(item.quantity)) {
        errors.push(`Line item #${idx + 1} quantity must be ≥ 0.`);
      }
      if (item.unitPrice < 0 || isNaN(item.unitPrice)) {
        errors.push(`Line item #${idx + 1} unit price must be ≥ 0.`);
      }
    });

    if (invoice.taxRate < 0) errors.push('Tax rate must be ≥ 0.');
    if (invoice.shippingFee < 0) errors.push('Shipping fee must be ≥ 0.');
    if (invoice.amountPaid < 0) errors.push('Amount paid must be ≥ 0.');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Save handler
  const handleSave = async () => {
    if (!validateInvoice()) {
      setNotification({ type: 'error', message: 'Please fix validation errors before saving.' });
      return;
    }

    setIsSaving(true);
    setNotification(null);

    try {
      if (saveManualClient && !selectedClientId && invoice.clientName.trim()) {
        const newClient: Client = {
          id: `client-${Date.now()}`,
          name: invoice.clientName,
          company: invoice.clientCompany,
          email: invoice.clientEmail || '',
          phone: invoice.clientPhone,
          address: invoice.clientAddress,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveClient(newClient);
        onRefreshClients();
        setSaveManualClient(false);
      }

      const updatedInvoice: Invoice = {
        ...invoice,
        subtotal: computedTotals.subtotal,
        discountTotal: computedTotals.discountTotal,
        taxableSubtotal: computedTotals.taxableSubtotal,
        taxTotal: computedTotals.taxTotal,
        grandTotal: computedTotals.grandTotal,
        balanceDue: computedTotals.balanceDue,
        updatedAt: new Date().toISOString(),
      };

      await onSaveInvoice(updatedInvoice);
      setInvoice(updatedInvoice);
      setNotification({ type: 'success', message: t('msgSaveSuccess') });
    } catch (err) {
      console.error('Save invoice error:', err);
      setNotification({ type: 'error', message: 'Failed to save invoice.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Mark as Paid
  const handleMarkAsPaid = async () => {
    const totals = calculateInvoiceTotals(
      invoice.lineItems,
      invoice.invoiceDiscountType,
      invoice.invoiceDiscountValue,
      invoice.taxRate,
      invoice.shippingFee,
      0,
      'Paid'
    );

    const updated: Invoice = {
      ...invoice,
      status: 'Paid' as InvoiceStatus,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      taxableSubtotal: totals.taxableSubtotal,
      taxTotal: totals.taxTotal,
      grandTotal: totals.grandTotal,
      amountPaid: totals.grandTotal,
      balanceDue: 0,
      updatedAt: new Date().toISOString(),
    };
    setInvoice(updated);
    await onSaveInvoice(updated);
    setNotification({ type: 'success', message: 'Invoice marked as Paid!' });
  };

  // Duplicate Invoice
  const handleDuplicateInvoice = async () => {
    const totals = calculateInvoiceTotals(
      invoice.lineItems,
      invoice.invoiceDiscountType,
      invoice.invoiceDiscountValue,
      invoice.taxRate,
      invoice.shippingFee,
      0,
      'Draft'
    );

    const dupNum = invoice.invoiceNumber.endsWith('-COPY') 
      ? `${invoice.invoiceNumber.replace('-COPY', '')}-COPY-${Math.floor(Math.random() * 100)}` 
      : `${invoice.invoiceNumber}-COPY`;

    const dup: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: dupNum,
      status: 'Draft',
      amountPaid: 0,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      taxableSubtotal: totals.taxableSubtotal,
      taxTotal: totals.taxTotal,
      grandTotal: totals.grandTotal,
      balanceDue: totals.grandTotal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSaveInvoice(dup);
      setInvoice(dup);
      setNotification({ type: 'success', message: `Duplicated invoice draft #${dup.invoiceNumber}!` });
    } catch (err) {
      console.error('Duplicate invoice error:', err);
      setNotification({ type: 'error', message: 'Failed to save duplicated invoice.' });
    }
  };

  // Direct PDF Download without popup (uses active templateStyle)
  const handleDirectPdfExport = async () => {
    if (!validateInvoice()) {
      setNotification({ type: 'error', message: 'Please fix validation errors before downloading PDF.' });
      return;
    }

    setIsDownloadingPdf(true);
    setNotification(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Dynamic import of pdf engine for performance
      const { downloadInvoiceAsPDF } = await import('../lib/pdf');
      await downloadInvoiceAsPDF('printable-invoice-export', `Invoice_${invoice.invoiceNumber || 'Draft'}`);
      setNotification({ type: 'success', message: t('msgPdfSuccess') });
    } catch (err) {
      console.error('PDF export failed:', err);
      setNotification({ type: 'error', message: 'Failed to export PDF. Please check your document and try again.' });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Action Bar - Responsive Toolbar */}
      <div className="no-print bg-white border border-gray-200 rounded-sm p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <span>{t('tabNewInvoice')}</span>
            <span className="text-xs font-mono font-normal text-gray-500">
              #{invoice.invoiceNumber || 'INV-0001'}
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewInvoice}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-sm transition-colors"
            title="Start new invoice"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('btnReset')}</span>
          </button>

          <button
            onClick={handleDuplicateInvoice}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-sm transition-colors"
            title="Duplicate invoice"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{t('btnDuplicate')}</span>
          </button>

          {invoice.status !== 'Paid' && (
            <button
              onClick={handleMarkAsPaid}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-sm transition-colors border border-emerald-300"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('btnMarkPaid')}</span>
            </button>
          )}

          <button
            onClick={handleDirectPdfExport}
            disabled={isDownloadingPdf}
            className="flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-gray-900" />
            <span>{isDownloadingPdf ? t('btnGeneratingPdf') : t('btnDownloadPdf')}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? t('btnSaving') : t('btnSaveInvoice')}</span>
          </button>
        </div>
      </div>

      {/* Notifications & Validation Alerts */}
      {notification && (
        <div
          className={`no-print p-3 rounded-sm border text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="no-print p-3.5 rounded-sm bg-rose-50 border border-rose-300 text-xs text-rose-900 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-[11px]">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Please fix the following validation items:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Grid: Form Editor (Left) & Live Preview + Style Selector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form Panel (Col 6) */}
        <div className="no-print lg:col-span-6 space-y-6">
          {/* Section 1: Client Selector */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <span>{t('secClientInfo')}</span>
              </h3>
              {clients.length > 0 && (
                <span className="text-[11px] text-gray-500 font-mono">{clients.length} saved</span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                {t('lblSelectClient')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full text-xs rounded-sm border border-gray-200 bg-gray-50 text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
              >
                <option value="">-- Enter Client Details Manually --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblClientName')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={invoice.clientName}
                  onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblCompany')}
                </label>
                <input
                  type="text"
                  value={invoice.clientCompany || ''}
                  onChange={(e) => setInvoice({ ...invoice, clientCompany: e.target.value })}
                  placeholder="e.g. Freelance Marketing"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblEmail')}
                </label>
                <input
                  type="email"
                  value={invoice.clientEmail || ''}
                  onChange={(e) => setInvoice({ ...invoice, clientEmail: e.target.value })}
                  placeholder="sarah@jenkins.com"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblPhone')}
                </label>
                <input
                  type="text"
                  value={invoice.clientPhone || ''}
                  onChange={(e) => setInvoice({ ...invoice, clientPhone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblAddress')}
                </label>
                <textarea
                  rows={2}
                  value={invoice.clientAddress || ''}
                  onChange={(e) => setInvoice({ ...invoice, clientAddress: e.target.value })}
                  placeholder="450 Pine Ave&#10;Seattle, WA 98101"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>

            {!selectedClientId && invoice.clientName.trim() && (
              <label className="flex items-center space-x-2 text-xs text-gray-700 pt-1">
                <input
                  type="checkbox"
                  checked={saveManualClient}
                  onChange={(e) => setSaveManualClient(e.target.checked)}
                  className="rounded-sm border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="flex items-center gap-1 font-medium">
                  <UserPlus className="w-3.5 h-3.5 text-gray-900" />
                  Save this client to client library
                </span>
              </label>
            )}
          </div>

          {/* Section 2: Invoice Metadata & Output Language */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">
              {t('secInvoiceDetails')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblInvoiceNumber')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                  placeholder="INV-0001"
                  className="w-full font-mono rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblStatus')}
                </label>
                <select
                  value={invoice.status}
                  onChange={(e) => setInvoice({ ...invoice, status: e.target.value as InvoiceStatus })}
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblInvoiceDate')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblPaymentTerms')}
                </label>
                <select
                  value={invoice.paymentTerms}
                  onChange={(e) => handlePaymentTermsChange(e.target.value)}
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                >
                  {PAYMENT_TERMS_OPTIONS.map((term) => (
                    <option key={term.label} value={term.label}>
                      {term.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblDueDate')}
                </label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              {/* Invoice Output Language Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-gray-500" />
                  <span>{t('lblInvoiceLanguage')}</span>
                </label>
                <select
                  value={invoice.invoiceLanguage || 'en'}
                  onChange={(e) => handleInvoiceLanguageChange(e.target.value as InvoiceLanguage)}
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 font-medium focus:outline-none focus:border-gray-900"
                >
                  <option value="en">English (EN)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="de">Deutsch (DE)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblPoNumber')}
                </label>
                <input
                  type="text"
                  value={invoice.poNumber || ''}
                  onChange={(e) => setInvoice({ ...invoice, poNumber: e.target.value })}
                  placeholder="PO-99182"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblProjectTitle')}
                </label>
                <input
                  type="text"
                  value={invoice.projectTitle || ''}
                  onChange={(e) => setInvoice({ ...invoice, projectTitle: e.target.value })}
                  placeholder="e.g. Website Redesign Q3"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Line Items */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <span>{t('secLineItems')}</span>
              </h3>

              {items.length > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-500 text-[11px] hidden sm:inline uppercase font-bold tracking-wider">Preset:</span>
                  <select
                    value={selectedPresetId}
                    onChange={(e) => handleAddPresetItem(e.target.value)}
                    className="rounded-sm border border-gray-200 bg-gray-50 text-gray-900 p-1.5 text-xs"
                  >
                    <option value="">{t('btnAddItem')}</option>
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} ({formatCurrency(it.defaultUnitPrice, currencyCode, currencySymbol)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Item Rows - Responsive Overflow */}
            <div className="space-y-4 overflow-x-auto">
              {invoice.lineItems.length === 0 && (
                <div className="p-4 rounded-sm bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>At least one line item is required. Click &quot;+ Add Custom Item&quot; or choose from library.</span>
                </div>
              )}
              {invoice.lineItems.map((item, idx) => {
                const lineTotal = calculateLineItemTotal(item);

                return (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-sm border border-gray-200 bg-gray-50 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                      <span>Item #{idx + 1}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleDuplicateLineItem(idx)}
                          className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                          title="Duplicate line item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                          title="Remove line item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                        placeholder="Description of work, service, or product"
                        className="w-full text-xs font-medium rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs min-w-[280px]">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{t('lblQuantity')}</label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-1.5 text-center font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{t('lblUnitType')}</label>
                        <select
                          value={item.unitType}
                          onChange={(e) => handleLineItemChange(idx, 'unitType', e.target.value)}
                          className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-1.5"
                        >
                          {UNIT_TYPES.map((u) => (
                            <option key={u.value} value={u.value}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{t('lblUnitPrice')} ({currencySymbol})</label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-1.5 text-right font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{t('lblDiscount')} ({currencySymbol})</label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.discount}
                          onChange={(e) => handleLineItemChange(idx, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-1.5 text-right font-mono"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1 flex flex-col justify-end">
                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleLineItemChange(idx, 'taxable', !item.taxable)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              item.taxable
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                            title={item.taxable ? 'Item is taxable (click to change)' : 'Item is non-taxable (click to change)'}
                          >
                            {item.taxable ? '✓ Taxable' : 'Non-Taxable'}
                          </button>
                          <span className="font-bold font-mono text-gray-900">
                            {formatCurrency(lineTotal, currencyCode, currencySymbol)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddLineItem}
              className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-gray-900 rounded-sm text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-gray-900 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('btnAddCustomItem')}</span>
            </button>
          </div>

          {/* Section 4: Adjustments & Payment Totals */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">
              {t('secAdjustments')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    {t('lblInvoiceDiscount')}
                  </label>
                  <div className="inline-flex rounded-sm">
                    <button
                      type="button"
                      onClick={() => setInvoice({ ...invoice, invoiceDiscountType: 'flat' })}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        invoice.invoiceDiscountType === 'flat'
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {currencySymbol} Flat
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvoice({ ...invoice, invoiceDiscountType: 'percent' })}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        invoice.invoiceDiscountType === 'percent'
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      % Percent
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={invoice.invoiceDiscountValue}
                  onChange={(e) => setInvoice({ ...invoice, invoiceDiscountValue: parseFloat(e.target.value) || 0 })}
                  placeholder={invoice.invoiceDiscountType === 'flat' ? '0.00' : '0 %'}
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 font-mono focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblTaxRate')}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={invoice.taxRate}
                  onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })}
                  placeholder="8.25"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 font-mono focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblShippingFee')} ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={invoice.shippingFee}
                  onChange={(e) => setInvoice({ ...invoice, shippingFee: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 font-mono focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblAmountPaid')} ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={invoice.amountPaid}
                  onChange={(e) => setInvoice({ ...invoice, amountPaid: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 font-mono focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Notes & Terms */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">
              {t('secNotesTerms')}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblNotes')}
                </label>
                <textarea
                  rows={2}
                  value={invoice.notes}
                  onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                  placeholder="Thank you for your business!"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblPaymentInstructions')}
                </label>
                <textarea
                  rows={2}
                  value={invoice.paymentInstructions}
                  onChange={(e) => setInvoice({ ...invoice, paymentInstructions: e.target.value })}
                  placeholder="Pay via Zelle or Bank Wire..."
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('lblTerms')}
                </label>
                <textarea
                  rows={2}
                  value={invoice.terms}
                  onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
                  placeholder="Payment due within agreed terms."
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2 focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & IN-BUILDER STYLE SELECTOR Panel (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Top Preview Controls & Style Switcher */}
          <div className="no-print bg-white border border-gray-200 rounded-sm p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gray-900" />
                <span>{t('secLivePreview')}</span>
              </span>
              <span className="text-[10px] font-mono font-normal text-gray-500">Real-Time</span>
            </div>

            {/* In-Builder Template Style Selector */}
            <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-1.5 text-xs">
                <Layout className="w-3.5 h-3.5 text-gray-600" />
                <span className="font-bold uppercase text-[11px] text-gray-700">{t('lblTemplateStyle')}:</span>
              </div>

              {/* Classic / Minimal / Compact Options */}
              <div className="inline-flex rounded-sm border border-gray-200 p-0.5 bg-gray-50 w-full sm:w-auto">
                {(['classic', 'minimal', 'compact'] as PdfTemplateStyle[]).map((style) => {
                  const isActive = (invoice.templateStyle || 'classic') === style;
                  const label = style === 'classic' ? 'Classic (Default)' : style === 'minimal' ? 'Minimal' : 'Compact';
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleStyleChange(style)}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-all ${
                        isActive
                          ? 'bg-gray-900 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Live Preview Container */}
          <div className="sticky top-20">
            <InvoicePreview invoice={invoice} businessProfile={businessProfile} />
          </div>
        </div>
      </div>

      {/* Offscreen element for PDF rendering */}
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
          id="printable-invoice-export"
          invoice={invoice}
          businessProfile={businessProfile}
          templateStyle={invoice.templateStyle || 'classic'}
        />
      </div>
    </div>
  );
}
