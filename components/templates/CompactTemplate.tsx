/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useMemo, memo } from 'react';
import { Invoice, BusinessProfile } from '../../lib/types';
import { formatCurrency, formatDate, calculateLineItemTotal, calculateInvoiceTotals } from '../../lib/calculations';
import { getSanitizedClientName } from '../../lib/utils';
import { INVOICE_LABELS } from '../../lib/i18n/translations';

interface TemplateProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  id?: string;
}

export const CompactTemplate = memo(function CompactTemplate({ invoice, businessProfile, id }: TemplateProps) {
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

  return (
    <div
      id={id}
      className="bg-white p-8 sm:p-10 text-gray-900 font-sans text-xs w-full max-w-[800px] min-h-[1060px] mx-auto border-2 border-gray-900 shadow-sm flex flex-col justify-between"
      style={{ boxSizing: 'border-box' }}
    >
      <div>
        {/* Top Header Section */}
        <div className="flex flex-row justify-between items-start pb-5 border-b border-gray-300 gap-6">
          <div className="flex items-center space-x-3">
            {businessProfile.logoBase64 ? (
              <img
                src={businessProfile.logoBase64}
                alt="Business Logo"
                className="max-h-14 object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center font-bold text-base rounded-sm shrink-0">
                {(businessProfile.name || 'I')[0]}
              </div>
            )}
            <div>
              <h1 className="text-base font-bold text-gray-900 uppercase tracking-tight leading-tight">
                {businessProfile.name || 'YOUR BUSINESS NAME'}
              </h1>
              {businessProfile.email && (
                <p className="text-[11px] text-gray-600 mt-0.5">{businessProfile.email}</p>
              )}
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900 leading-tight">
              {labels.title}
            </h2>
            <p className="text-xs font-mono font-bold text-gray-700 mt-0.5">
              #{invoice.invoiceNumber || 'INV-0000'}
            </p>
            <div className="mt-1.5">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase border border-gray-300 bg-gray-100 text-gray-800 rounded-xs">
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Structured 3-Box Info Section - Zero Overlap */}
        <div className="grid grid-cols-12 gap-4 py-5 border-b border-gray-300 text-xs">
          {/* Seller (From) Box - Col 4 */}
          <div className="col-span-4 border border-gray-200 p-3.5 bg-gray-50 rounded-xs space-y-1">
            <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-1.5 border-b border-gray-200 pb-1">
              From:
            </p>
            <p className="font-bold text-gray-900 text-xs">{businessProfile.name || 'Seller'}</p>
            {businessProfile.ownerName && <p className="text-[11px] text-gray-700">Attn: {businessProfile.ownerName}</p>}
            {businessProfile.address && (
              <p className="text-gray-600 whitespace-pre-line text-[11px] leading-relaxed">{businessProfile.address}</p>
            )}
            {businessProfile.phone && <p className="text-gray-600 text-[11px]">{businessProfile.phone}</p>}
            {businessProfile.taxId && <p className="text-gray-500 text-[10px] pt-0.5">Tax ID: {businessProfile.taxId}</p>}
          </div>

          {/* Client (Bill To) Box - Col 4 */}
          <div className="col-span-4 border border-gray-200 p-3.5 bg-gray-50 rounded-xs space-y-1">
            <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-1.5 border-b border-gray-200 pb-1">
              {labels.billTo}:
            </p>
            {clientName ? (
              <p className="font-bold text-gray-900 text-xs">{clientName}</p>
            ) : (
              <p className="text-gray-400 italic text-xs">{labels.noClient}</p>
            )}
            {invoice.clientCompany && <p className="font-semibold text-gray-800 text-[11px]">{invoice.clientCompany}</p>}
            {invoice.clientAddress && (
              <p className="text-gray-600 whitespace-pre-line text-[11px] leading-relaxed">{invoice.clientAddress}</p>
            )}
            {invoice.clientEmail && <p className="text-gray-600 text-[11px] break-all">{invoice.clientEmail}</p>}
            {invoice.clientPhone && <p className="text-gray-600 text-[11px]">{invoice.clientPhone}</p>}
          </div>

          {/* Invoice Details Metadata Box - Col 4 */}
          <div className="col-span-4 border border-gray-200 p-3.5 bg-gray-50 rounded-xs space-y-2">
            <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider border-b border-gray-200 pb-1">
              Details:
            </p>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-baseline gap-1.5 border-b border-gray-200 pb-1">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 leading-tight min-w-0">{labels.dateIssued}:</span>
                <span className="font-semibold text-gray-900 text-right whitespace-nowrap shrink-0 ml-auto">{formatDate(invoice.date)}</span>
              </div>
              <div className="flex justify-between items-baseline gap-1.5 border-b border-gray-200 pb-1">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 leading-tight min-w-0">{labels.dateDue}:</span>
                <span className="font-bold text-gray-900 text-right whitespace-nowrap shrink-0 ml-auto">{formatDate(invoice.dueDate)}</span>
              </div>
              {invoice.paymentTerms && (
                <div className="flex justify-between items-baseline gap-1.5 border-b border-gray-200 pb-1">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 leading-tight min-w-0">{labels.terms}:</span>
                  <span className="text-gray-700 text-right whitespace-nowrap shrink-0 ml-auto">{invoice.paymentTerms}</span>
                </div>
              )}
              {invoice.poNumber && (
                <div className="flex justify-between items-baseline gap-1.5">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 leading-tight min-w-0">{labels.poNumber}:</span>
                  <span className="font-mono font-semibold text-gray-900 text-right whitespace-nowrap shrink-0 ml-auto">{invoice.poNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-5">
          <table className="w-full text-left text-xs border border-gray-300 border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-gray-900 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5 px-3 border-r border-gray-300">{labels.description}</th>
                <th className="py-2.5 px-2 text-center border-r border-gray-300 w-20">{labels.qty}</th>
                <th className="py-2.5 px-3 text-right border-r border-gray-300 w-28">{labels.price}</th>
                <th className="py-2.5 px-3 text-right w-28">{labels.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
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
                    <tr key={item.id || idx} className="divide-x divide-gray-200" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      <td className="py-2.5 px-3 font-medium text-gray-900">
                        {item.description || 'Item'}
                      </td>
                      <td className="py-2.5 px-2 text-center text-gray-600 font-mono text-[11px]">
                        {item.quantity} {item.unitType}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-600 font-mono">
                        {formatCurrency(item.unitPrice, currencyCode, currencySymbol)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900 font-mono">
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

      {/* Footer & Totals */}
      <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div className="grid grid-cols-12 gap-5 pt-4 border-t border-gray-300 text-xs">
          {/* Notes */}
          <div className="col-span-7 space-y-3">
            {invoice.notes && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xs">
                <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">{labels.notes}</p>
                <p className="text-gray-700 whitespace-pre-line text-[11px] leading-relaxed">{invoice.notes}</p>
              </div>
            )}
            {invoice.paymentInstructions && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xs">
                <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">{labels.paymentInstructions}</p>
                <p className="text-gray-700 whitespace-pre-line text-[11px] leading-relaxed">{invoice.paymentInstructions}</p>
              </div>
            )}
            {invoice.terms && (
              <p className="text-gray-500 text-[10px] leading-relaxed">{invoice.terms}</p>
            )}
          </div>

          {/* Totals Summary Box */}
          <div className="col-span-5 border border-gray-300 p-4 bg-gray-50 rounded-xs space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>{labels.subtotal}:</span>
              <span className="font-mono">{formatCurrency(totals.subtotal, currencyCode, currencySymbol)}</span>
            </div>

            {totals.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>{labels.discount}:</span>
                <span className="font-mono">-{formatCurrency(totals.discountTotal, currencyCode, currencySymbol)}</span>
              </div>
            )}

            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>{labels.tax} ({invoice.taxRate}%):</span>
                <span className="font-mono">{formatCurrency(totals.taxTotal, currencyCode, currencySymbol)}</span>
              </div>
            )}

            {invoice.shippingFee > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>{labels.shipping}:</span>
                <span className="font-mono">{formatCurrency(invoice.shippingFee, currencyCode, currencySymbol)}</span>
              </div>
            )}

            <div className="pt-2 border-t-2 border-gray-900 flex justify-between font-bold text-sm text-gray-900">
              <span>{labels.total}:</span>
              <span className="font-mono">{formatCurrency(totals.grandTotal, currencyCode, currencySymbol)}</span>
            </div>

            {invoice.amountPaid > 0 && (
              <div className="flex justify-between text-gray-600 text-[11px]">
                <span>{labels.amountPaid}:</span>
                <span className="font-mono">-{formatCurrency(invoice.amountPaid, currencyCode, currencySymbol)}</span>
              </div>
            )}

            {invoice.amountPaid > 0 && (
              <div className="pt-2 border-t border-gray-300 flex justify-between font-bold text-sm text-gray-900">
                <span>{labels.balanceDue}:</span>
                <span className="font-mono">{formatCurrency(totals.balanceDue, currencyCode, currencySymbol)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
