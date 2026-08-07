'use client';

import React, { useState, useRef } from 'react';
import { BackupData, BusinessProfile, Client, ReusableItem, Invoice } from '../lib/types';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2,
  FileJson,
  X
} from 'lucide-react';

interface BackupRestoreProps {
  businessProfile: BusinessProfile;
  clients: Client[];
  items: ReusableItem[];
  invoices: Invoice[];
  onImportBackup: (data: BackupData, mode: 'merge' | 'replace') => Promise<void>;
  onClearAllData: () => Promise<void>;
}

export function BackupRestore({
  businessProfile,
  clients,
  items,
  invoices,
  onImportBackup,
  onClearAllData,
}: BackupRestoreProps) {
  const { t } = useTranslation();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [importedJson, setImportedJson] = useState<BackupData | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export JSON file
  const handleExportBackup = () => {
    const today = new Date().toISOString().split('T')[0];
    const backup: BackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      businessProfile,
      clients,
      items,
      invoices,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-generator-backup-${today}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotification({ type: 'success', message: 'Backup JSON downloaded successfully!' });
  };

  // Import JSON File Select Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw) as BackupData;

        if (
          !parsed || 
          typeof parsed !== 'object' || 
          (!Array.isArray(parsed.invoices) && !Array.isArray(parsed.clients) && !Array.isArray(parsed.items) && !parsed.businessProfile)
        ) {
          throw new Error('Invalid JSON format or missing invoice generator data arrays.');
        }

        setImportedJson(parsed);
      } catch {
        setNotification({ type: 'error', message: 'Invalid or corrupt backup JSON file. Please ensure it was exported from this application.' });
      }
    };
    reader.readAsText(file);
  };

  // Confirm Import
  const handleConfirmImport = async () => {
    if (!importedJson) return;
    setIsProcessing(true);

    try {
      await onImportBackup(importedJson, importMode);
      setNotification({
        type: 'success',
        message: `Successfully imported backup data (${importMode === 'merge' ? 'merged with existing' : 'replaced all data'}).`,
      });
      setImportedJson(null);
    } catch (err) {
      console.error('Import error:', err);
      setNotification({ type: 'error', message: 'Failed to import backup file.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Clear All Data
  const handleClearAll = async () => {
    setIsProcessing(true);
    try {
      await onClearAllData();
      setShowClearConfirm(false);
      setNotification({ type: 'success', message: 'All local application data has been wiped.' });
    } catch (err) {
      console.error('Clear data error:', err);
      setNotification({ type: 'error', message: 'Failed to wipe local data.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Info */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-100 text-gray-900 rounded-sm border border-gray-200">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
              {t('tabBackup')}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full data control. Export or restore JSON backups anytime.</span>
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-sm border text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {/* Grid: Export, Import, Wipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-gray-900" />
              <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                1. Export Data Backup
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Download your complete invoice history, client directory, item library, and business settings as a single portable JSON file.
            </p>

            <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 text-xs font-mono space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Invoices:</span>
                <span className="font-bold text-gray-900">{invoices.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Clients:</span>
                <span className="font-bold text-gray-900">{clients.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Item Library:</span>
                <span className="font-bold text-gray-900">{items.length}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportBackup}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('btnDownloadBackup')}</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-gray-900" />
              <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                2. Import & Restore JSON
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Restore a previously exported backup file to restore invoices and client profiles on this device.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm transition-colors"
          >
            <FileJson className="w-4 h-4 text-gray-900" />
            <span>{t('btnSelectBackupFile')}</span>
          </button>
        </div>
      </div>

      {/* Wipe Data Section */}
      <div className="bg-rose-50 border border-rose-200 rounded-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-tight">Danger Zone: Clear Local Data</h3>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed">
          Wipe all invoices, saved clients, reusable items, and business profile settings stored in this browser&apos;s IndexedDB and LocalStorage.
        </p>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 rounded-sm shadow-xs transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('btnClearAllData')}</span>
        </button>
      </div>

      {/* Import Modal */}
      {importedJson && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm border border-gray-200 p-6 max-w-md w-full space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Confirm Data Import</h3>
              <button onClick={() => setImportedJson(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-gray-600">Found backup file exported on:</p>
              <p className="font-mono font-bold text-gray-900">{new Date(importedJson.exportedAt).toLocaleString()}</p>
              
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1 font-mono text-[11px]">
                <p>• Invoices: {importedJson.invoices?.length || 0}</p>
                <p>• Clients: {importedJson.clients?.length || 0}</p>
                <p>• Items: {importedJson.items?.length || 0}</p>
                <p>• Profile: {importedJson.businessProfile?.name || 'Default'}</p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  Import Strategy
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-gray-900 focus:ring-gray-900"
                    />
                    <span className="font-semibold text-gray-900">Merge with existing data</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-rose-600 focus:ring-rose-600"
                    />
                    <span className="font-semibold text-rose-700">Overwrite & replace all data</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setImportedJson(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={isProcessing}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm disabled:opacity-50"
              >
                {isProcessing ? 'Importing...' : 'Confirm Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wipe Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm border border-gray-200 p-6 max-w-sm w-full space-y-4 shadow-lg">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-tight">Wipe All Local Data?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure? This will delete all saved invoices, client profiles, item presets, and settings stored in this browser.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={handleClearAll}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-sm disabled:opacity-50"
              >
                {isProcessing ? 'Wiping...' : 'Wipe Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
