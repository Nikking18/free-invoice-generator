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

export const MinimalTemplate = memo(function MinimalTemplate({ invoice, businessProfile, id }: TemplateProps) {
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
        {/* Minimal Header */}
        <div className="flex flex-row justify-between items-start pb-8 border-b border-gray-200 gap-6">
          <div className="space-y-1">
            {businessProfile.logoBase64 ? (
              <img
                src={businessProfile.logoBase64}
                alt="Business Logo"
                className="max-h-14 object-contain mb-2"
              />
            ) : (
              <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                {businessProfile.name || 'YOUR BUSINESS NAME'}
              </h1>
            )}
            {businessProfile.name && <p className="font-semibold text-gray-900">{businessProfile.name}</p>}
            {businessProfile.address && <p className="text-gray-600 whitespace-pre-line text-[11px]">{businessProfile.address}</p>}
            {businessProfile.email && <p className="text-gray-600 text-[11px]">{businessProfile.email}</p>}
            {businessProfile.phone && <p className="text-gray-600 text-[11px]">{businessProfile.phone}</p>}
            {businessProfile.taxId && <p className="text-gray-500 text-[10px]">Tax ID / GST: {businessProfile.taxId}</p>}
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-light uppercase tracking-widest text-gray-900">
              {labels.title}
            </h2>
            <p className="text-sm font-mono font-bold text-gray-900 mt-1">
              #{invoice.invoiceNumber || 'INV-0000'}
            </p>
            <div className="mt-2">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-800 bg-gray-100 rounded-sm">
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Client & Metadata Grid */}
        <div className="grid grid-cols-2 gap-8 py-6 border-b border-gray-200 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">
              {labels.billTo}
            </p>
            <div className="space-y-0.5">
              {clientName ? (
                <p className="font-bold text-sm text-gray-900">{clientName}</p>
              ) : (
                <p className="text-gray-600 italic font-medium text-xs">{labels.noClient}</p>
              )}
              {invoice.clientCompany && <p className="font-medium text-gray-700">{invoice.clientCompany}</p>}
              {invoice.clientAddress && (
                <p className="whitespace-pre-line text-gray-600 text-[11px]">{invoice.clientAddress}</p>
              )}
              {invoice.clientEmail && <p className="text-gray-600 text-[11px]">{invoice.clientEmail}</p>}
              {invoice.clientPhone && <p className="text-gray-600 text-[11px]">{invoice.clientPhone}</p>}
              {invoice.clientTaxId && <p className="text-gray-600 text-[11px]">{labels.clientTaxId}: {invoice.clientTaxId}</p>}
            </div>
          </div>

          <div className="space-y-2 text-right">
            <div className="flex justify-between sm:justify-end sm:gap-6 border-b border-gray-100 pb-1 items-baseline">
              <span className="text-[10px] uppercase font-bold text-gray-400 min-w-0">{labels.dateIssued}:</span>
              <span className="font-semibold text-gray-900 whitespace-nowrap shrink-0 ml-auto">{formatDate(invoice.date)}</span>
            </div>
            <div className="flex justify-between sm:justify-end sm:gap-6 border-b border-gray-100 pb-1 items-baseline">
              <span className="text-[10px] uppercase font-bold text-gray-400 min-w-0">{labels.dateDue}:</span>
              <span className="font-bold text-gray-900 whitespace-nowrap shrink-0 ml-auto">{formatDate(invoice.dueDate)}</span>
            </div>
            {invoice.paymentTerms && (
              <div className="flex justify-between sm:justify-end sm:gap-6 border-b border-gray-100 pb-1 items-baseline">
                <span className="text-[10px] uppercase font-bold text-gray-400 min-w-0">{labels.terms}:</span>
                <span className="text-gray-700 whitespace-nowrap shrink-0 ml-auto">{invoice.paymentTerms}</span>
              </div>
            )}
            {invoice.poNumber && (
              <div className="flex justify-between sm:justify-end sm:gap-6 items-baseline">
                <span className="text-[10px] uppercase font-bold text-gray-400 min-w-0">{labels.poNumber}:</span>
                <span className="font-mono text-gray-900 whitespace-nowrap shrink-0 ml-auto">{invoice.poNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Minimal Itemized Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 text-gray-900 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 pr-4">{labels.description}</th>
                <th className="py-3 px-3 text-center">{labels.qty}</th>
                <th className="py-3 px-3 text-right">{labels.price}</th>
                <th className="py-3 pl-4 text-right">{labels.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                    {labels.noItems}
                  </td>
                </tr>
              ) : (
                invoice.lineItems.map((item, idx) => {
                  const lineTotal = calculateLineItemTotal(item);
                  return (
                    <tr key={item.id || idx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      <td className="py-3 pr-4 font-medium text-gray-900">
                        {item.description || 'Item'}
                      </td>
                      <td className="py-3 px-3 text-center text-gray-600 font-mono text-[11px]">
                        {item.quantity} {item.unitType}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-600 font-mono">
                        {formatCurrency(item.unitPrice, currencyCode, currencySymbol)}
                      </td>
                      <td className="py-3 pl-4 text-right font-bold text-gray-900 font-mono">
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

      {/* Summary Totals & Footer */}
      <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div className="grid grid-cols-12 gap-8 pt-4 border-t-2 border-gray-900 text-xs">
          {/* Notes & Terms */}
          <div className="col-span-7 space-y-3">
            {invoice.notes && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                  {labels.notes}
                </p>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-[11px]">
                  {invoice.notes}
                </p>
              </div>
            )}

            {invoice.paymentInstructions && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                  {labels.paymentInstructions}
                </p>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-[11px]">
                  {invoice.paymentInstructions}
                </p>
              </div>
            )}

            {invoice.terms && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">
                  {labels.termsConditions}
                </p>
                <p className="text-gray-500 text-[10px] leading-relaxed">{invoice.terms}</p>
              </div>
            )}
          </div>

          {/* Totals Summary */}
          <div className="col-span-5 space-y-2 text-xs">
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
