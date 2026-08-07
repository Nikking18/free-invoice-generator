'use client';

import React from 'react';
import { Invoice, BusinessProfile, PdfTemplateStyle } from '../lib/types';
import { InvoiceTemplateRenderer } from './InvoiceTemplateRenderer';

interface InvoicePreviewProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  templateStyle?: PdfTemplateStyle;
  id?: string;
}

export function InvoicePreview({
  invoice,
  businessProfile,
  templateStyle,
  id = 'printable-invoice',
}: InvoicePreviewProps) {
  return (
    <InvoiceTemplateRenderer
      invoice={invoice}
      businessProfile={businessProfile}
      templateStyle={templateStyle || invoice.templateStyle}
      id={id}
    />
  );
}
