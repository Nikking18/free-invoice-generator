/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useMemo } from 'react';
import { Invoice, BusinessProfile } from '../../lib/types';
import { formatCurrency, formatDate, calculateLineItemTotal, calculateInvoiceTotals } from '../../lib/calculations';
import { getSanitizedClientName } from '../../lib/utils';
import { INVOICE_LABELS } from '../../lib/i18n/translations';

interface TemplateProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  id?: string;
}

export function ModernTemplate({ invoice, businessProfile, id }: TemplateProps) {
  const currencySymbol = businessProfile.defaultCurrencySymbol || '$';
  const currencyCode = businessProfile.defaultCurrency || 'USD';
  const clientName = getSanitizedClientName(invoice.clientName);

  const lang = invoice.invoiceLanguage || businessProfile.defaultInvoiceLanguage || 'en';
  const labels = INVOICE_LABELS[lang] || INVOICE_LABELS.en;

  const totals = useMemo(() => {
    return calculateInvoiceTotals(
      invoice.lineItems,
      invoice.invoiceDiscountType,
      invoice.invoiceDiscountValue,
      invoice.taxRate,
      invoice.shippingFee,
      invoice.amountPaid
    );
  }, [
    invoice.lineItems,
    invoice.invoiceDiscountType,
    invoice.invoiceDiscountValue,
    invoice.taxRate,
    invoice.shippingFee,
    invoice.amountPaid,
  ]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Sent':
        return 'bg-gray-100 text-gray-900 border-gray-300';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-500 border-gray-300';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <div
      id={id}
      className="bg-white p-8 sm:p-10 text-gray-900 font-sans text-xs w-full max-w-[800px] min-h-[1060px] mx-auto border-2 border-gray-900 shadow-sm flex flex-col justify-between"
      style={{ boxSizing: 'border-box' }}
    >
      <div>
        {/* Header */}
        <div className="flex flex-row justify-between items-start gap-6 pb-8 border-b border-gray-200">
          {/* Left Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif italic text-gray-900 tracking-tight">
                {labels.title}
              </h1>
              <span
                className={`inline-block px-2.5 py-0.5 text-[10px] font-bold border rounded-sm uppercase tracking-widest ${getStatusBadgeStyle(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-500 tracking-tight">
              #{invoice.invoiceNumber || 'INV-0000'}
            </p>
          </div>

          {/* Right Sender */}
          <div className="text-right space-y-1 max-w-[240px]">
            {businessProfile.logoBase64 ? (
              <div className="ml-auto mb-2 max-h-14 max-w-[160px] overflow-hidden">
                <img
                  src={businessProfile.logoBase64}
                  alt="Business Logo"
                  className="max-h-14 object-contain ml-auto"
                />
              </div>
            ) : (
              <p className="font-bold text-xs text-gray-900 uppercase tracking-wide">
                {businessProfile.name || 'YOUR BUSINESS NAME'}
              </p>
            )}

            <div className="text-xs text-gray-500 space-y-0.5 leading-relaxed">
              {businessProfile.name && <p className="font-semibold text-gray-800">{businessProfile.name}</p>}
              {businessProfile.ownerName && <p>Attn: {businessProfile.ownerName}</p>}
              {businessProfile.address && <p className="whitespace-pre-line">{businessProfile.address}</p>}
              {businessProfile.email && <p>{businessProfile.email}</p>}
              {businessProfile.phone && <p>{businessProfile.phone}</p>}
              {businessProfile.taxId && <p>Tax ID: {businessProfile.taxId}</p>}
            </div>
          </div>
        </div>

        {/* Bill To & Dates Grid */}
        <div className="grid grid-cols-2 gap-8 py-8 border-b border-gray-200 text-xs">
          {/* Bill To */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">
              {labels.billTo}
            </p>
            <div className="space-y-0.5 text-gray-700">
              {clientName ? (
                <p className="font-bold text-sm text-gray-900">{clientName}</p>
              ) : (
                <p className="font-medium text-xs text-gray-400 italic">{labels.noClient}</p>
              )}
              {invoice.clientCompany && (
                <p className="font-medium text-gray-800">{invoice.clientCompany}</p>
              )}
              {invoice.clientAddress && (
                <p className="whitespace-pre-line text-gray-500">
                  {invoice.clientAddress}
                </p>
              )}
              {invoice.clientEmail && <p>Email: {invoice.clientEmail}</p>}
              {invoice.clientPhone && <p>Tel: {invoice.clientPhone}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="text-right space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                {labels.dateIssued}
              </p>
              <p className="text-xs font-medium text-gray-900">{formatDate(invoice.date)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                {labels.dateDue}
              </p>
              <p className="text-xs font-bold text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
            {invoice.paymentTerms && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                  {labels.terms}
                </p>
                <p className="text-xs text-gray-600">{invoice.paymentTerms}</p>
              </div>
            )}
            {(invoice.projectTitle || invoice.poNumber) && (
              <div className="pt-2 border-t border-gray-100">
                {invoice.projectTitle && (
                  <p className="font-medium text-gray-800">{invoice.projectTitle}</p>
                )}
                {invoice.poNumber && (
                  <p className="text-gray-500 font-mono text-[11px]">{labels.poNumber}: {invoice.poNumber}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 text-gray-900 uppercase text-[10px] tracking-widest font-bold">
                <th className="py-2.5 px-2">{labels.description}</th>
                <th className="py-2.5 px-2 text-center">{labels.qty}</th>
                <th className="py-2.5 px-2 text-right">{labels.price}</th>
                <th className="py-2.5 px-2 text-right">{labels.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400 italic">
                    {labels.noItems}
                  </td>
                </tr>
              ) : (
                invoice.lineItems.map((item, idx) => {
                  const lineTotal = calculateLineItemTotal(item);
                  return (
                    <tr key={item.id || idx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      <td className="py-3 px-2 pr-4">
                        <p className="font-semibold text-gray-900">{item.description || 'Item'}</p>
                      </td>
                      <td className="py-3 px-2 text-center text-gray-500">
                        {item.quantity} <span className="text-[10px] text-gray-400 uppercase">{item.unitType}</span>
                      </td>
                      <td className="py-3 px-2 text-right text-gray-500 font-mono">
                        {formatCurrency(item.unitPrice, currencyCode, currencySymbol)}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-gray-900 font-mono">
                        {formatCurrency(lineTotal, currencyCode, currencySymbol)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Totals & Notes */}
      <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div className="grid grid-cols-12 gap-8 pt-6 border-t border-gray-200 text-xs">
          <div className="col-span-7 space-y-4">
            {invoice.notes && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                  {labels.notes}
                </p>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed text-xs">
                  {invoice.notes}
                </p>
              </div>
            )}

            {invoice.paymentInstructions && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                  {labels.paymentInstructions}
                </p>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed text-xs">
                  {invoice.paymentInstructions}
                </p>
              </div>
            )}

            {invoice.terms && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                  {labels.termsConditions}
                </p>
                <p className="text-gray-500 text-[11px] whitespace-pre-line leading-relaxed">
                  {invoice.terms}
                </p>
              </div>
            )}
          </div>

          <div className="col-span-5 space-y-2 font-sans pt-1">
            <div className="flex justify-between text-gray-500 text-xs">
              <span>{labels.subtotal}</span>
              <span className="font-mono font-medium text-gray-900">
                {formatCurrency(totals.subtotal, currencyCode, currencySymbol)}
              </span>
            </div>

            {totals.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700 text-xs">
                <span>{labels.discount}</span>
                <span className="font-mono font-medium">
                  -{formatCurrency(totals.discountTotal, currencyCode, currencySymbol)}
                </span>
              </div>
            )}

            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-gray-500 text-xs">
                <span>{labels.tax} ({invoice.taxRate}%)</span>
                <span className="font-mono font-medium text-gray-900">
                  {formatCurrency(totals.taxTotal, currencyCode, currencySymbol)}
                </span>
              </div>
            )}

            {invoice.shippingFee > 0 && (
              <div className="flex justify-between text-gray-500 text-xs">
                <span>{labels.shipping}</span>
                <span className="font-mono font-medium text-gray-900">
                  {formatCurrency(invoice.shippingFee, currencyCode, currencySymbol)}
                </span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-gray-900 flex justify-between font-bold text-base text-gray-900">
              <span>{labels.total}</span>
              <span className="font-mono">
                {formatCurrency(totals.grandTotal, currencyCode, currencySymbol)}
              </span>
            </div>

            {invoice.amountPaid > 0 && (
              <div className="flex justify-between text-gray-600 text-xs font-medium pt-1">
                <span>{labels.amountPaid}</span>
                <span className="font-mono">
                  -{formatCurrency(invoice.amountPaid, currencyCode, currencySymbol)}
                </span>
              </div>
            )}

            {invoice.amountPaid > 0 && (
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                <span>{labels.balanceDue}</span>
                <span className="font-mono text-base text-gray-900">
                  {formatCurrency(totals.balanceDue, currencyCode, currencySymbol)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400 tracking-wider uppercase">
          {labels.generatedNotice}
        </div>
      </div>
    </div>
  );
}
