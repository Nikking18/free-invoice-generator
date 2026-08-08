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

export function BoldTemplate({ invoice, businessProfile, id }: TemplateProps) {
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
      className="bg-white p-0 text-gray-900 font-sans text-xs w-full max-w-[800px] min-h-[1060px] mx-auto border-2 border-gray-900 shadow-md flex flex-col justify-between overflow-hidden"
      style={{ boxSizing: 'border-box' }}
    >
      <div>
        {/* Top Dark Header Banner */}
        <div className="bg-gray-900 text-white p-8 sm:p-10 flex flex-row justify-between items-start gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-widest text-white">
              {labels.title}
            </h1>
            <p className="text-xs font-mono text-gray-300">
              #{invoice.invoiceNumber || 'INV-0000'}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-400 text-gray-950 rounded-xs">
                {invoice.status}
              </span>
            </div>
          </div>

          <div className="text-right space-y-1 max-w-[240px]">
            {businessProfile.logoBase64 ? (
              <div className="ml-auto mb-2 max-h-16 max-w-[180px] overflow-hidden bg-white/10 p-1.5 rounded-sm">
                <img
                  src={businessProfile.logoBase64}
                  alt="Business Logo"
                  className="max-h-14 object-contain ml-auto"
                />
              </div>
            ) : (
              <p className="font-black text-sm text-white uppercase tracking-wider">
                {businessProfile.name || 'YOUR BUSINESS NAME'}
              </p>
            )}

            <div className="text-[11px] text-gray-300 space-y-0.5 leading-tight">
              {businessProfile.name && <p className="font-bold text-white">{businessProfile.name}</p>}
              {businessProfile.ownerName && <p>Attn: {businessProfile.ownerName}</p>}
              {businessProfile.address && <p className="whitespace-pre-line">{businessProfile.address}</p>}
              {businessProfile.email && <p>{businessProfile.email}</p>}
              {businessProfile.phone && <p>{businessProfile.phone}</p>}
              {businessProfile.taxId && <p>Tax ID: {businessProfile.taxId}</p>}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-8 sm:p-10 space-y-6">
          {/* Bill To & Dates Accent Container */}
          <div className="bg-gray-50 border-l-4 border-gray-900 p-5 grid grid-cols-2 gap-6 rounded-r-sm">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                {labels.billTo}
              </p>
              <div className="space-y-0.5 text-gray-800 text-xs">
                {clientName ? (
                  <p className="font-black text-sm text-gray-900">{clientName}</p>
                ) : (
                  <p className="font-medium text-xs text-gray-400 italic">{labels.noClient}</p>
                )}
                {invoice.clientCompany && <p className="font-bold">{invoice.clientCompany}</p>}
                {invoice.clientAddress && (
                  <p className="whitespace-pre-line text-gray-600">{invoice.clientAddress}</p>
                )}
                {invoice.clientEmail && <p>Email: {invoice.clientEmail}</p>}
                {invoice.clientPhone && <p>Tel: {invoice.clientPhone}</p>}
              </div>
            </div>

            <div className="text-right space-y-2 text-xs">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                  {labels.dateIssued}
                </p>
                <p className="font-bold text-gray-900">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                  {labels.dateDue}
                </p>
                <p className="font-black text-gray-900 text-sm">{formatDate(invoice.dueDate)}</p>
              </div>
              {invoice.paymentTerms && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                    {labels.terms}
                  </p>
                  <p className="text-gray-700 font-medium">{invoice.paymentTerms}</p>
                </div>
              )}
              {invoice.poNumber && (
                <p className="text-gray-700 font-mono text-[11px] pt-1">
                  <strong>{labels.poNumber}:</strong> {invoice.poNumber}
                </p>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="pt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white uppercase text-[10px] tracking-widest font-black">
                  <th className="py-3 px-3">{labels.description}</th>
                  <th className="py-3 px-3 text-center">{labels.qty}</th>
                  <th className="py-3 px-3 text-right">{labels.price}</th>
                  <th className="py-3 px-3 text-right">{labels.amount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-b-2 border-gray-900">
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
                      <tr key={item.id || idx} className="even:bg-gray-50/80" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                        <td className="py-3 px-3 font-bold text-gray-900">
                          {item.description || 'Item'}
                        </td>
                        <td className="py-3 px-3 text-center text-gray-700 font-bold">
                          {item.quantity} <span className="text-[9px] uppercase font-mono">{item.unitType}</span>
                        </td>
                        <td className="py-3 px-3 text-right text-gray-700 font-mono font-medium">
                          {formatCurrency(item.unitPrice, currencyCode, currencySymbol)}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-gray-900 font-mono">
                          {formatCurrency(lineTotal, currencyCode, currencySymbol)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes */}
          <div className="grid grid-cols-12 gap-6 pt-2 text-xs" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <div className="col-span-7 space-y-4">
              {invoice.notes && (
                <div className="border-l-4 border-gray-900 pl-3 py-1">
                  <p className="font-black text-[10px] uppercase tracking-wider text-gray-900 mb-1">
                    {labels.notes}
                  </p>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-xs">
                    {invoice.notes}
                  </p>
                </div>
              )}

              {invoice.paymentInstructions && (
                <div className="border-l-4 border-gray-900 pl-3 py-1">
                  <p className="font-black text-[10px] uppercase tracking-wider text-gray-900 mb-1">
                    {labels.paymentInstructions}
                  </p>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-xs">
                    {invoice.paymentInstructions}
                  </p>
                </div>
              )}

              {invoice.terms && (
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    {labels.termsConditions}
                  </p>
                  <p className="text-gray-500 text-[11px] leading-relaxed">{invoice.terms}</p>
                </div>
              )}
            </div>

            {/* Dark Accent Summary Card */}
            <div className="col-span-5 bg-gray-900 text-white p-5 rounded-sm shadow-md space-y-2 font-sans">
              <div className="flex justify-between text-gray-300 text-xs font-medium">
                <span>{labels.subtotal}</span>
                <span className="font-mono text-white font-bold">
                  {formatCurrency(totals.subtotal, currencyCode, currencySymbol)}
                </span>
              </div>

              {totals.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-400 text-xs font-medium">
                  <span>{labels.discount}</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(totals.discountTotal, currencyCode, currencySymbol)}
                  </span>
                </div>
              )}

              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-gray-300 text-xs font-medium">
                  <span>{labels.tax} ({invoice.taxRate}%)</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(totals.taxTotal, currencyCode, currencySymbol)}
                  </span>
                </div>
              )}

              {invoice.shippingFee > 0 && (
                <div className="flex justify-between text-gray-300 text-xs font-medium">
                  <span>{labels.shipping}</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(invoice.shippingFee, currencyCode, currencySymbol)}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-700 flex justify-between font-black text-base text-white">
                <span>{labels.total}</span>
                <span className="font-mono text-amber-400">
                  {formatCurrency(totals.grandTotal, currencyCode, currencySymbol)}
                </span>
              </div>

              {invoice.amountPaid > 0 && (
                <div className="flex justify-between text-gray-400 text-xs pt-1">
                  <span>{labels.amountPaid}</span>
                  <span className="font-mono text-white">
                    -{formatCurrency(invoice.amountPaid, currencyCode, currencySymbol)}
                  </span>
                </div>
              )}

              {invoice.amountPaid > 0 && (
                <div className="pt-2 border-t border-gray-800 flex justify-between font-black text-sm text-white">
                  <span>{labels.balanceDue}</span>
                  <span className="font-mono text-amber-400">
                    {formatCurrency(totals.balanceDue, currencyCode, currencySymbol)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-100 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          {labels.generatedNotice}
        </div>
      </div>
    </div>
  );
}
