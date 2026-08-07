'use client';

import React, { memo } from 'react';
import { Invoice, BusinessProfile, PdfTemplateStyle } from '../lib/types';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CompactTemplate } from './templates/CompactTemplate';

export type { PdfTemplateStyle };

interface InvoiceTemplateRendererProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  templateStyle?: PdfTemplateStyle;
  id?: string;
}

export const InvoiceTemplateRenderer = memo(function InvoiceTemplateRenderer({
  invoice,
  businessProfile,
  templateStyle,
  id = 'printable-invoice',
}: InvoiceTemplateRendererProps) {
  const activeStyle: PdfTemplateStyle = 
    templateStyle || 
    invoice.templateStyle || 
    businessProfile.defaultTemplateStyle || 
    'classic';

  switch (activeStyle) {
    case 'minimal':
      return <MinimalTemplate invoice={invoice} businessProfile={businessProfile} id={id} />;
    case 'compact':
      return <CompactTemplate invoice={invoice} businessProfile={businessProfile} id={id} />;
    case 'classic':
    default:
      return <ClassicTemplate invoice={invoice} businessProfile={businessProfile} id={id} />;
  }
});
