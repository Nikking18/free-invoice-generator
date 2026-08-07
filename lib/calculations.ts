import { LineItem, DiscountType, CURRENCIES } from './types';

export interface InvoiceCalculations {
  subtotal: number;
  discountTotal: number;
  taxableSubtotal: number;
  taxTotal: number;
  grandTotal: number;
  balanceDue: number;
}

export function calculateLineItemTotal(item: LineItem): number {
  const qty = Math.max(0, item.quantity || 0);
  const price = Math.max(0, item.unitPrice || 0);
  const discount = Math.max(0, item.discount || 0);
  return Math.max(0, Math.round((qty * price - discount) * 100) / 100);
}

export function calculateInvoiceTotals(
  lineItems: LineItem[],
  invoiceDiscountType: DiscountType,
  invoiceDiscountValue: number,
  taxRate: number,
  shippingFee: number,
  amountPaid: number,
  status?: string
): InvoiceCalculations {
  const safeItems = lineItems || [];
  
  // 1. Calculate line item subtotal and raw taxable subtotal
  let subtotal = 0;
  let rawTaxableSubtotal = 0;

  safeItems.forEach(item => {
    const lineTotal = calculateLineItemTotal(item);
    subtotal += lineTotal;
    if (item.taxable === true || String(item.taxable) === 'true') {
      rawTaxableSubtotal += lineTotal;
    }
  });

  subtotal = Math.round(subtotal * 100) / 100;
  rawTaxableSubtotal = Math.round(rawTaxableSubtotal * 100) / 100;

  // 2. Invoice Level Discount
  const safeDiscountVal = Math.max(0, invoiceDiscountValue || 0);
  let discountTotal = 0;

  if (invoiceDiscountType === 'percent') {
    discountTotal = (subtotal * safeDiscountVal) / 100;
  } else {
    discountTotal = safeDiscountVal;
  }
  discountTotal = Math.min(subtotal, Math.max(0, discountTotal));
  discountTotal = Math.round(discountTotal * 100) / 100;

  // 3. Taxable Subtotal (Apply proportional discount if subtotal > 0)
  let taxableSubtotal = rawTaxableSubtotal;
  if (subtotal > 0 && discountTotal > 0) {
    const discountRatio = discountTotal / subtotal;
    taxableSubtotal = rawTaxableSubtotal * (1 - discountRatio);
  }
  taxableSubtotal = Math.max(0, Math.round(taxableSubtotal * 100) / 100);

  // 4. Tax Total
  const safeTaxRate = Math.max(0, taxRate || 0);
  const taxTotal = Math.round(((taxableSubtotal * safeTaxRate) / 100) * 100) / 100;

  // 5. Grand Total & Balance Due
  const safeShipping = Math.max(0, shippingFee || 0);
  const grandTotal = Math.max(0, Math.round((subtotal - discountTotal + taxTotal + safeShipping) * 100) / 100);

  let effectiveAmountPaid = Math.max(0, amountPaid || 0);
  if (status === 'Paid') {
    effectiveAmountPaid = grandTotal;
  }

  const balanceDue = Math.max(0, Math.round((grandTotal - effectiveAmountPaid) * 100) / 100);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    taxableSubtotal: Math.round(taxableSubtotal * 100) / 100,
    taxTotal: Math.round(taxTotal * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    balanceDue: Math.round(balanceDue * 100) / 100,
  };
}

export function formatCurrency(amount: number, currencyCode = 'USD', symbol = '$'): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  
  try {
    const matchedCurr = CURRENCIES.find(c => c.code === currencyCode);
    const locale = matchedCurr?.locale || 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(safeAmount);
  } catch {
    return `${symbol}${safeAmount.toFixed(2)}`;
  }
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
