'use client';

import React from 'react';
import { ShieldCheck, HardDrive, AlertTriangle, X, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
              Data Privacy & Local Storage Policy
            </h3>
            <p className="text-xs text-gray-500">100% Private, Zero Cloud Footprint</p>
          </div>
        </div>

        {/* Highlighted Banner Notice */}
        <div className="bg-gray-900 text-white rounded-sm p-3.5 space-y-1.5 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"></div>
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">ALL DATA STORED LOCALLY</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            100% Client-Side • No external APIs • Stored in browser IndexedDB/LocalStorage
          </p>
        </div>

        <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
          <div className="p-3 bg-gray-50 rounded-sm border border-gray-200 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-gray-900 text-xs">
              <HardDrive className="w-4 h-4 text-gray-700 shrink-0" />
              <span>IndexedDB & LocalStorage Engine</span>
            </div>
            <p className="text-gray-600 text-[11px]">
              All client profiles, line items, saved invoices, business preferences, and logos are stored strictly inside your browser&apos;s local IndexedDB and LocalStorage.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-sm border border-emerald-200 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-emerald-900 text-xs">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Zero Network Data Collection</span>
            </div>
            <p className="text-emerald-800 text-[11px]">
              This application sends zero network requests containing your invoice or financial data. No registration, login, or tracking cookies exist.
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-sm border border-amber-200 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Device & Browser Scope</span>
            </div>
            <p className="text-amber-800 text-[11px]">
              Because data is saved locally inside this specific browser, clearing site storage or switching browser profiles will hide saved invoices. Use the Backup tab to export JSON backups regularly.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrivacyBanner() {
  return null;
}
