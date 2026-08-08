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

export const ClassicTemplate = memo(function ClassicTemplate({ invoice, businessProfile, id }: TemplateProps) {
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
      className="bg-white p-8 sm:p-10 text-gray-900 font-serif text-xs w-full max-w-[800px] min-h-[1060px] mx-auto border-2 border-gray-900 shadow-sm flex flex-col justify-between"
      style={{ boxSizing: 'border-box' }}
    >
      <div>
        {/* Header Letterhead */}
        <div className="border-b-2 border-gray-900 pb-6 flex flex-row justify-between items-start gap-6">
          <div>
            {businessProfile.logoBase64 ? (
              <img
                src={businessProfile.logoBase64}
                alt="Business Logo"
                className="max-h-16 object-contain mb-2"
              />
            ) : (
              <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider font-serif">
                {businessProfile.name || 'YOUR BUSINESS NAME'}
              </h1>
            )}

            <div className="text-[11px] text-gray-700 font-sans space-y-0.5 mt-1 leading-normal">
              {businessProfile.name && <p className="font-bold">{businessProfile.name}</p>}
              {businessProfile.ownerName && <p>Attn: {businessProfile.ownerName}</p>}
              {businessProfile.address && <p className="whitespace-pre-line">{businessProfile.address}</p>}
              {businessProfile.email && <p>{businessProfile.email}</p>}
              {businessProfile.phone && <p>{businessProfile.phone}</p>}
              {businessProfile.taxId && <p>Tax ID: {businessProfile.taxId}</p>}
            </div>
          </div>

          <div className="text-right font-sans">
            <h2 className="text-3xl font-black text-gray-900 tracking-widest font-serif">
              {labels.title}
            </h2>
            <p className="text-sm font-mono font-bold text-gray-700 mt-1">
              #{invoice.invoiceNumber || 'INV-0000'}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase border border-gray-800 bg-gray-100 text-gray-900">
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-gray-800 font-sans text-xs">
          {/* Bill To Box */}
          <div className="border border-gray-800 p-3.5 bg-gray-50">
            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1.5 border-b border-gray-200 pb-1">
              {labels.billTo}
            </p>
            <div className="space-y-0.5 text-gray-800">
              {clientName ? (
                <p className="font-bold text-sm text-gray-900">{clientName}</p>
              ) : (
                <p className="font-medium text-xs text-gray-600 italic">{labels.noClient}</p>
              )}
              {invoice.clientCompany && <p className="font-semibold">{invoice.clientCompany}</p>}
              {invoice.clientAddress && (
                <p className="whitespace-pre-line text-gray-600 text-[11px]">{invoice.clientAddress}</p>
              )}
              {invoice.clientEmail && <p className="text-[11px]">{invoice.clientEmail}</p>}
              {invoice.clientPhone && <p className="text-[11px]">{invoice.clientPhone}</p>}
              {invoice.clientTaxId && <p className="text-[11px]">{labels.clientTaxId}: {invoice.clientTaxId}</p>}
            </div>
          </div>

          {/* Dates Metadata */}
          <div className="border border-gray-800 p-3.5 bg-gray-50 space-y-2">
            <div className="flex justify-between items-baseline gap-2 border-b border-gray-200 pb-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 min-w-0">{labels.dateIssued}:</span>
              <span className="font-semibold text-gray-900 whitespace-nowrap shrink-0 ml-auto">{formatDate(invoice.date)}</span>
            </div>
            <div className="flex justify-between items-baseline gap-2 border-b border-gray-200 pb-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 min-w-0">{labels.dateDue}:</span>
              <span className="font-bold text-gray-900 whitespace-nowrap shrink-0 ml-auto">{formatDate(invoice.dueDate)}</span>
            </div>
            {invoice.paymentTerms && (
              <div className="flex justify-between items-baseline gap-2 border-b border-gray-200 pb-1">
                <span className="text-[10px] uppercase font-bold text-gray-500 min-w-0">{labels.terms}:</span>
                <span className="text-gray-700 whitespace-nowrap shrink-0 ml-auto">{invoice.paymentTerms}</span>
              </div>
            )}
            {invoice.poNumber && (
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 min-w-0">{labels.poNumber}:</span>
                <span className="font-mono text-gray-900 whitespace-nowrap shrink-0 ml-auto">{invoice.poNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 font-sans">
          <table className="w-full text-left text-xs border border-gray-800 border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-800 text-gray-900 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5 px-3 border-r border-gray-300">{labels.description}</th>
                <th className="py-2.5 px-3 text-center border-r border-gray-300">{labels.qty}</th>
                <th className="py-2.5 px-3 text-right border-r border-gray-300">{labels.price}</th>
                <th className="py-2.5 px-3 text-right">{labels.amount}</th>
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
                      <td className="py-2.5 px-3 font-semibold text-gray-900">
                        {item.description || 'Item'}
                      </td>
                      <td className="py-2.5 px-3 text-center text-gray-600 font-mono text-[11px]">
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

      {/* Summary Totals & Notes */}
      <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div className="grid grid-cols-12 gap-6 pt-4 border-t border-gray-800 text-xs font-serif">
          {/* Notes */}
          <div className="col-span-7 space-y-3 font-sans">
            {invoice.notes && (
              <div className="border border-gray-300 p-3 bg-gray-50">
                <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">
                  {labels.notes}
                </p>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-[11px]">
                  {invoice.notes}
                </p>
              </div>
            )}

            {invoice.paymentInstructions && (
              <div className="border border-gray-300 p-3 bg-gray-50">
                <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">
                  {labels.paymentInstructions}
                </p>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-[11px]">
                  {invoice.paymentInstructions}
                </p>
              </div>
            )}

            {invoice.terms && (
              <div className="border border-gray-300 p-3 bg-gray-50">
                <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">
                  {labels.termsConditions}
                </p>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-[11px]">
                  {invoice.terms}
                </p>
              </div>
            )}
          </div>

          {/* Totals Summary */}
          <div className="col-span-5 border border-gray-800 p-4 bg-gray-50 space-y-2 font-sans text-xs">
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
              <div className="pt-2 border-t border-gray-400 flex justify-between font-bold text-sm text-gray-900">
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
