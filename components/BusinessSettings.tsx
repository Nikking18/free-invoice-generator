/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef } from 'react';
import { BusinessProfile, CURRENCIES, PAYMENT_TERMS_OPTIONS, PdfTemplateStyle, InvoiceLanguage } from '../lib/types';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { 
  Building2, 
  Upload, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  ShieldCheck,
  AlertCircle,
  Layout,
  Globe
} from 'lucide-react';

interface BusinessSettingsProps {
  profile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  onClearProfile: () => void;
}

export function BusinessSettings({ profile, onSaveProfile, onClearProfile }: BusinessSettingsProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [prevProfile, setPrevProfile] = useState<BusinessProfile>(profile);
  const [notification, setNotification] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (prevProfile !== profile) {
    setPrevProfile(profile);
    setFormData(profile);
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, logoBase64: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleCurrencyChange = (code: string) => {
    const curr = CURRENCIES.find((c) => c.code === code);
    setFormData((prev) => ({
      ...prev,
      defaultCurrency: code,
      defaultCurrencySymbol: curr ? curr.symbol : '$',
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setNotification('Error: Please enter a valid email address (e.g. hello@company.com).');
        return;
      }
    }
    onSaveProfile(formData);
    setNotification(t('msgSaveSuccess'));
    setTimeout(() => setNotification(null), 4000);
  };

  const handleClear = () => {
    onClearProfile();
    setShowClearConfirm(false);
    setNotification('Business settings reset to defaults.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Info */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-100 text-gray-900 rounded-sm border border-gray-200">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
              {t('tabSettings')}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved locally in browser storage.</span>
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`p-3 rounded-sm border text-xs flex items-center justify-between ${
          notification.startsWith('Error') 
            ? 'bg-rose-50 text-rose-900 border-rose-300' 
            : 'bg-emerald-50 text-emerald-900 border-emerald-300'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Identity & Logo */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">
            1. Business Information & Branding
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Uploader */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Business Logo
              </label>

              <div className="border border-dashed border-gray-300 rounded-sm p-4 text-center bg-gray-50 flex flex-col items-center justify-center min-h-[140px]">
                {formData.logoBase64 ? (
                  <div className="space-y-3 w-full">
                    <img
                      src={formData.logoBase64}
                      alt="Logo preview"
                      className="max-h-20 object-contain mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoBase64: '' })}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-sm hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Logo</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-[11px] text-gray-500 font-medium">PNG or JPG up to 2MB</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
                    >
                      Upload Logo Image
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Inputs */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Business / Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Acme Creative Studio LLC"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Owner / Contact Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="hello@acme.example"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.acme.example"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Tax ID / VAT Number
                </label>
                <input
                  type="text"
                  value={formData.taxId || ''}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="XX-XXXXXXX"
                  className="w-full font-mono rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Business Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="100 Market St, Suite 400&#10;San Francisco, CA 94105"
                  className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Default Invoice Settings */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">
            2. Default Invoice Defaults & Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Default Currency
              </label>
              <select
                value={formData.defaultCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                <Layout className="w-3 h-3 text-gray-500" />
                <span>{t('lblTemplateStyle')}</span>
              </label>
              <select
                value={formData.defaultTemplateStyle || 'modern'}
                onChange={(e) => setFormData({ ...formData, defaultTemplateStyle: e.target.value as PdfTemplateStyle })}
                className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900 font-medium"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3 text-gray-500" />
                <span>Default PDF Language</span>
              </label>
              <select
                value={formData.defaultInvoiceLanguage || 'en'}
                onChange={(e) => setFormData({ ...formData, defaultInvoiceLanguage: e.target.value as InvoiceLanguage })}
                className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900 font-medium"
              >
                <option value="en">English (EN)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
                <option value="de">Deutsch (DE)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={formData.defaultTaxRate}
                onChange={(e) => setFormData({ ...formData, defaultTaxRate: parseFloat(e.target.value) || 0 })}
                className="w-full font-mono rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Default Payment Terms
              </label>
              <select
                value={formData.defaultPaymentTerms}
                onChange={(e) => setFormData({ ...formData, defaultPaymentTerms: e.target.value })}
                className="w-full sm:w-1/2 rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
              >
                {PAYMENT_TERMS_OPTIONS.map((term) => (
                  <option key={term.label} value={term.label}>
                    {term.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Default Notes & Remarks
              </label>
              <textarea
                rows={3}
                value={formData.defaultNotes}
                onChange={(e) => setFormData({ ...formData, defaultNotes: e.target.value })}
                placeholder="Thank you for your business!"
                className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Default Terms & Conditions
              </label>
              <textarea
                rows={3}
                value={formData.defaultTerms}
                onChange={(e) => setFormData({ ...formData, defaultTerms: e.target.value })}
                placeholder="Payment due within agreed terms."
                className="w-full rounded-sm border border-gray-200 bg-white text-gray-900 p-2.5 focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Settings</span>
          </button>

          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{t('btnSaveSettings')}</span>
          </button>
        </div>
      </form>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm border border-gray-200 p-6 max-w-sm w-full space-y-4 shadow-lg">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-tight">Reset Business Settings?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              This will restore all default business profile settings to original values.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-sm"
              >
                {t('btnConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
