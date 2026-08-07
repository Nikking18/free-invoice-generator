'use client';

import React from 'react';
import { ShieldCheck, HardDrive, AlertTriangle, X, Lock } from 'lucide-react';
import { useTranslation } from '../lib/i18n/LanguageContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-xs p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200 rounded-sm max-w-lg w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1 rounded-sm hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 border-b border-gray-100 pb-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-sm border border-emerald-200 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-tight text-gray-900">
              {t('privacyModalTitle')}
            </h3>
            <p className="text-xs text-gray-500">{t('privacyModalSubtitle')}</p>
          </div>
        </div>

        {/* Highlighted Banner Notice */}
        <div className="bg-gray-900 text-white rounded-sm p-3.5 space-y-1.5 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"></div>
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">{t('privacyModalBannerHeader')}</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {t('privacyModalBannerSub')}
          </p>
        </div>

        <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
          <div className="p-3 bg-gray-50 rounded-sm border border-gray-200 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-gray-900 text-xs">
              <HardDrive className="w-4 h-4 text-gray-700 shrink-0" />
              <span>{t('privacyModalStorageTitle')}</span>
            </div>
            <p className="text-gray-600 text-[11px]">
              {t('privacyModalStorageDesc')}
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-sm border border-emerald-200 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-emerald-900 text-xs">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{t('privacyModalZeroNetworkTitle')}</span>
            </div>
            <p className="text-emerald-800 text-[11px]">
              {t('privacyModalZeroNetworkDesc')}
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-sm border border-amber-200 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{t('privacyModalScopeTitle')}</span>
            </div>
            <p className="text-amber-800 text-[11px]">
              {t('privacyModalScopeDesc')}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors cursor-pointer"
          >
            {t('privacyModalBtnUnderstand')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrivacyBanner() {
  return null;
}
