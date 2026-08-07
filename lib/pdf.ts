function oklchToRgbFallback(colorStr: string): string {
  try {
    const match = colorStr.match(/(?:oklch|oklab)\s*\(([^)]+)\)/i);
    if (!match) return 'rgb(0, 0, 0)';

    const isOklab = colorStr.toLowerCase().startsWith('oklab');
    const inner = match[1].trim();
    const slashParts = inner.split('/');
    const colorPart = slashParts[0].trim();
    const alphaPart = slashParts[1] ? slashParts[1].trim() : null;

    const rawParts = colorPart.split(/[\s,]+/).filter(Boolean);
    if (rawParts.length < 3) return 'rgb(0, 0, 0)';

    let l = parseFloat(rawParts[0]);
    if (isNaN(l)) l = 0;
    if (rawParts[0].includes('%')) l = l / 100;

    let a = 0;
    let b = 0;

    if (isOklab) {
      a = parseFloat(rawParts[1]);
      if (isNaN(a)) a = 0;
      if (rawParts[1].includes('%')) a = (a / 100) * 0.4;

      b = parseFloat(rawParts[2]);
      if (isNaN(b)) b = 0;
      if (rawParts[2].includes('%')) b = (b / 100) * 0.4;
    } else {
      let c = parseFloat(rawParts[1]);
      if (isNaN(c)) c = 0;
      if (rawParts[1].includes('%')) c = (c / 100) * 0.4;

      let h = parseFloat(rawParts[2]);
      if (isNaN(h)) h = 0;

      const hRad = (h * Math.PI) / 180;
      a = c * Math.cos(hRad);
      b = c * Math.sin(hRad);
    }

    let alpha = 1;
    if (alphaPart) {
      alpha = parseFloat(alphaPart);
      if (isNaN(alpha)) alpha = 1;
      if (alphaPart.includes('%')) alpha = alpha / 100;
    }

    // OKLAB to Linear sRGB
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;

    const rLinear = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const gLinear = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const bLinear = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    const toSRGB = (val: number) => {
      if (isNaN(val)) return 0;
      const abs = Math.abs(val);
      const s = abs <= 0.0031308 ? 12.92 * abs : 1.055 * Math.pow(abs, 1 / 2.4) - 0.055;
      const clamped = Math.min(255, Math.max(0, Math.round(s * 255)));
      return val < 0 ? 0 : clamped;
    };

    const r = toSRGB(rLinear);
    const g = toSRGB(gLinear);
    const bVal = toSRGB(bLinear);

    if (alpha < 1) {
      return `rgba(${r}, ${g}, ${bVal}, ${Number(alpha.toFixed(2))})`;
    }
    return `rgb(${r}, ${g}, ${bVal})`;
  } catch (e) {
    return 'rgb(0, 0, 0)';
  }
}

function sanitizeCssText(cssText: string): string {
  if (!cssText) return '';
  // 1. Convert color-mix(in oklab, ...) or color-mix(in srgb, ...) to valid color fallback
  let cleaned = cssText.replace(/color-mix\s*\(\s*in\s+(?:oklab|srgb|oklch)[^)]+\)/gi, 'rgba(249, 250, 251, 0.9)');
  if (!/(?:oklch|oklab)/i.test(cleaned)) return cleaned;

  // 2. Replace any oklab() or oklch() color expressions with valid rgb/rgba equivalents
  return cleaned.replace(/(?:oklch|oklab)\s*\([^)]*\)/gi, (match) => {
    return oklchToRgbFallback(match);
  });
}

function fixOklchInClonedDoc(clonedDoc: Document, clonedElement: HTMLElement) {
  try {
    clonedDoc.documentElement.classList.remove('dark');
    if (clonedDoc.body) clonedDoc.body.classList.remove('dark');
    clonedElement.classList.remove('dark');
  } catch (e) {}

  // 1. Sanitize all <style> tags inside the cloned document iframe
  const styleElements = Array.from(clonedDoc.querySelectorAll<HTMLStyleElement>('style'));
  styleElements.forEach((style) => {
    if (style.textContent && /(?:oklch|oklab)/i.test(style.textContent)) {
      style.textContent = sanitizeCssText(style.textContent);
    }
  });

  // 2. Process all <link rel="stylesheet"> tags inside the cloned document iframe
  const linkElements = Array.from(clonedDoc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
  linkElements.forEach((link) => {
    try {
      if (link.sheet) {
        let cssText = '';
        try {
          const rules = Array.from(link.sheet.cssRules || link.sheet.rules || []);
          cssText = rules.map((r) => r.cssText).join('\n');
        } catch (e) {
          // cssRules restricted
        }

        if (cssText) {
          const styleEl = clonedDoc.createElement('style');
          styleEl.textContent = sanitizeCssText(cssText);
          clonedDoc.head.appendChild(styleEl);
        }
      }
    } catch (e) {}
    // Remove link elements from clonedDoc so html2canvas only uses pre-sanitized inline styles
    link.remove();
  });

  // 3. Ensure target element container styling inside clonedDoc
  clonedElement.style.width = '800px';
  clonedElement.style.minWidth = '800px';
  clonedElement.style.maxWidth = '800px';
  clonedElement.style.boxSizing = 'border-box';
  clonedElement.style.backgroundColor = '#ffffff';

  // 4. Sanitize inline style attributes on all cloned elements
  const allElements = [clonedElement, ...Array.from(clonedElement.querySelectorAll<HTMLElement>('*'))];
  allElements.forEach((el) => {
    const inlineStyle = el.getAttribute('style');
    if (inlineStyle && /(?:oklch|oklab)/i.test(inlineStyle)) {
      el.setAttribute('style', sanitizeCssText(inlineStyle));
    }
  });
}

export async function downloadInvoiceAsPDF(elementId: string, fileName: string): Promise<void> {
  if (typeof window === 'undefined') return;

  // Prefer exact elementId, fallback to 'printable-invoice' or 'printable-invoice-export'
  let element = document.getElementById(elementId);
  if (!element) {
    element = document.getElementById('printable-invoice') || document.getElementById('printable-invoice-export');
  }

  if (!element) {
    throw new Error(`Invoice element with id "${elementId}" not found for PDF export.`);
  }

  try {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF || jsPDFModule;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      width: Math.max(800, element.offsetWidth || element.scrollWidth || 800),
      onclone: (clonedDoc, clonedElement) => {
        fixOklchInClonedDoc(clonedDoc, clonedElement);
      },
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // 8mm margin around all sides for clean A4 printing
    const margin = 8;
    const printableWidth = pdfWidth - margin * 2;
    const printableHeight = pdfHeight - margin * 2;

    const imgWidth = printableWidth;
    const imgHeight = (canvas.height * printableWidth) / canvas.width;

    if (imgHeight <= printableHeight) {
      // Single page A4 invoice
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // Multi-page A4 splitting
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= printableHeight;

      while (heightLeft > 4) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= printableHeight;
      }
    }

    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
  } catch (err: unknown) {
    const e = err as Error;
    console.error('[PDF Export Exception Detail]', {
      name: e?.name,
      message: e?.message,
      stack: e?.stack,
      rawError: err,
    });
    throw err;
  }
}
