'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BackupData, BusinessProfile, Client, ReusableItem, Invoice, AutoBackupConfig, AutoBackupInterval } from '../lib/types';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { 
  getStoredAutoBackupConfig, 
  saveStoredAutoBackupConfig, 
  calculateNextBackupTime, 
  executeBackupSave, 
  getDirectoryHandle, 
  saveDirectoryHandle,
  checkFolderPermission
} from '../lib/autoBackup';
import { 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2,
  FileJson,
  X,
  Clock,
  Folder,
  FolderOpen,
  Play,
  KeyRound,
  Check
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
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [importedJson, setImportedJson] = useState<BackupData | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto Backup State
  const [autoConfig, setAutoConfig] = useState<AutoBackupConfig>(() => getStoredAutoBackupConfig());
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [supportsDirectoryPicker, setSupportsDirectoryPicker] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check folder permission status
  const refreshPermissionState = useCallback(async (handle: FileSystemDirectoryHandle | null) => {
    if (!handle) {
      setPermissionState('none' as PermissionState);
      return;
    }
    const perm = await checkFolderPermission(handle, false);
    setPermissionState(perm);
  }, []);

  // Load directory handle on mount & check browser capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupportsDirectoryPicker('showDirectoryPicker' in window);
      getDirectoryHandle().then((handle) => {
        if (handle) {
          setDirHandle(handle);
          void refreshPermissionState(handle);
        }
      }).catch((err) => console.warn('Directory handle load error:', err));
    }
  }, [refreshPermissionState]);

  // Save config wrapper
  const updateAutoConfig = (newConfig: AutoBackupConfig) => {
    setAutoConfig(newConfig);
    saveStoredAutoBackupConfig(newConfig);
  };

  // Helper to generate full backup object
  const createBackupDataObject = useCallback((): BackupData => {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      businessProfile,
      clients,
      items,
      invoices,
    };
  }, [businessProfile, clients, items, invoices]);

  // Execute backup (user initiated vs background timer)
  const runAutoBackup = useCallback(async (isUserInitiated: boolean) => {
    const backupData = createBackupDataObject();
    const result = await executeBackupSave(backupData, dirHandle, isUserInitiated);

    if (!result.success) {
      setNotification({
        type: 'warning',
        message: result.errorReason || 'Auto backup paused. Folder permission required for silent exports.',
      });
      if (dirHandle) {
        void refreshPermissionState(dirHandle);
      }
      return;
    }

    const nowISO = new Date().toISOString();
    const nextISO = calculateNextBackupTime(autoConfig.interval, Date.now());

    const updated: AutoBackupConfig = {
      ...autoConfig,
      lastBackupTime: nowISO,
      nextBackupTime: nextISO,
    };

    updateAutoConfig(updated);

    if (dirHandle) {
      void refreshPermissionState(dirHandle);
    }

    const modeText = result.mode === 'file-system' ? `Saved silently to folder "${autoConfig.folderName || dirHandle?.name || 'Selected Folder'}"` : 'Downloaded to browser Downloads folder';
    setNotification({
      type: 'success',
      message: `${t('msgAutoBackupSuccess')} (${result.fileName} • ${modeText})`,
    });
  }, [autoConfig, createBackupDataObject, dirHandle, refreshPermissionState, t]);

  // Periodic Timer effect to run auto backup when due
  useEffect(() => {
    if (!autoConfig.enabled || autoConfig.interval === 'off') return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const nextTime = autoConfig.nextBackupTime ? new Date(autoConfig.nextBackupTime).getTime() : 0;
      
      if (!nextTime || now >= nextTime) {
        // Background timer trigger -> isUserInitiated = false
        void runAutoBackup(false);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(intervalId);
  }, [autoConfig, runAutoBackup]);

  // Toggle Auto Backup
  const handleToggleAutoBackup = (enabled: boolean) => {
    const nextTime = enabled ? calculateNextBackupTime(autoConfig.interval) : null;
    const updated: AutoBackupConfig = {
      ...autoConfig,
      enabled,
      nextBackupTime: nextTime,
    };
    updateAutoConfig(updated);
  };

  // Change Interval
  const handleIntervalChange = (interval: AutoBackupInterval) => {
    const isEnabled = interval !== 'off';
    const nextTime = isEnabled ? calculateNextBackupTime(interval) : null;
    const updated: AutoBackupConfig = {
      ...autoConfig,
      enabled: isEnabled,
      interval,
      nextBackupTime: nextTime,
    };
    updateAutoConfig(updated);
  };

  // Folder picker handler
  const handleSelectFolder = async () => {
    if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
      setNotification({
        type: 'error',
        message: 'Folder picker API is not supported in this browser. Standard browser downloads will be used.',
      });
      return;
    }

    try {
      const handle = await (window as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker();
      
      // Request write permission during folder selection gesture
      const perm = await checkFolderPermission(handle, true);
      setPermissionState(perm);

      setDirHandle(handle);
      await saveDirectoryHandle(handle);

      const folderName = handle.name;
      const updated: AutoBackupConfig = {
        ...autoConfig,
        folderName,
      };
      updateAutoConfig(updated);
      setNotification({
        type: 'success',
        message: `Connected backup folder: "${folderName}". Silent auto-saves enabled!`,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Directory selection failed:', err);
        setNotification({ type: 'error', message: 'Failed to select directory folder.' });
      }
    }
  };

  // Re-authorize / Grant write permission button click handler
  const handleGrantFolderPermission = async () => {
    if (!dirHandle) return;
    try {
      const perm = await checkFolderPermission(dirHandle, true);
      setPermissionState(perm);
      if (perm === 'granted') {
        setNotification({
          type: 'success',
          message: `Permission granted for folder "${dirHandle.name}". Silent background auto-saves are ready!`,
        });
      } else {
        setNotification({
          type: 'warning',
          message: 'Folder write permission was not granted.',
        });
      }
    } catch (err) {
      console.error('Error requesting permission:', err);
    }
  };

  // Manual Export JSON file
  const handleExportBackup = () => {
    const backup = createBackupDataObject();
    const today = new Date().toISOString().split('T')[0];
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
              <span>Full data control. Export, restore, or schedule silent auto-downloads for JSON backups.</span>
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-sm border text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : notification.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Grid: Manual Export & Import */}
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
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm shadow-xs transition-colors cursor-pointer"
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
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm transition-colors cursor-pointer"
          >
            <FileJson className="w-4 h-4 text-gray-900" />
            <span>{t('btnSelectBackupFile')}</span>
          </button>
        </div>
      </div>

      {/* Auto Download JSON Configuration Card */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                {t('secAutoBackup')}
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('secAutoBackupDesc')}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs font-semibold text-gray-700">
              {autoConfig.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              type="button"
              onClick={() => handleToggleAutoBackup(!autoConfig.enabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoConfig.enabled ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={autoConfig.enabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  autoConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Options Grid: Frequency & Folder Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Option: Interval Frequency */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              {t('lblBackupFrequency')}
            </label>
            <select
              value={autoConfig.interval}
              onChange={(e) => handleIntervalChange(e.target.value as AutoBackupInterval)}
              className="w-full text-xs bg-white border border-gray-300 rounded-sm px-3 py-2 text-gray-900 font-medium focus:ring-1 focus:ring-gray-900 focus:outline-none"
            >
              <option value="off">{t('optDisabled')}</option>
              <option value="30m">{t('opt30Mins')}</option>
              <option value="1h">{t('opt1Hour')}</option>
              <option value="12h">{t('opt12Hours')}</option>
              <option value="1d">{t('opt1Day')}</option>
              <option value="7d">{t('opt7Days')}</option>
            </select>
            <p className="text-[11px] text-gray-500">
              Select how frequently auto-backup JSON files should be created.
            </p>
          </div>

          {/* Option: Folder Location Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              {t('lblFolderLocation')}
            </label>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={autoConfig.folderName}
                  onChange={(e) => {
                    const updated = { ...autoConfig, folderName: e.target.value };
                    updateAutoConfig(updated);
                  }}
                  placeholder={t('phFolderLocation')}
                  className="flex-1 text-xs bg-white border border-gray-300 rounded-sm px-3 py-2 text-gray-900 font-medium focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSelectFolder}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm transition-colors cursor-pointer shrink-0"
                  title={supportsDirectoryPicker ? 'Pick folder directory handle for silent saving' : 'Enter folder path'}
                >
                  <FolderOpen className="w-4 h-4 text-emerald-600" />
                  <span>{t('btnSelectFolder')}</span>
                </button>
              </div>

              {/* Status and Permission Indicator */}
              <div className="flex flex-col gap-1.5 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-200">
                {dirHandle ? (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Target Folder: <strong>{dirHandle.name}</strong></span>
                    </span>

                    {permissionState === 'granted' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Check className="w-3 h-3" /> Silent Auto-Save Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGrantFolderPermission}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3" /> Grant Folder Permission
                      </button>
                    )}
                  </div>
                ) : autoConfig.folderName ? (
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Target path label: <strong>{autoConfig.folderName}</strong></span>
                    <button
                      type="button"
                      onClick={handleSelectFolder}
                      className="text-[10px] font-bold text-emerald-700 underline hover:text-emerald-800"
                    >
                      Connect folder for silent save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-gray-500">
                    <span>No target folder selected (Uses browser Downloads)</span>
                    {supportsDirectoryPicker && (
                      <button
                        type="button"
                        onClick={handleSelectFolder}
                        className="text-[10px] font-bold text-emerald-700 underline hover:text-emerald-800"
                      >
                        Select folder for silent save
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Auto Backup Status & Execution Toolbar */}
        <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1 font-mono text-[11px] text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{t('lblLastAutoBackup')}:</span>
                <span>
                  {autoConfig.lastBackupTime
                    ? new Date(autoConfig.lastBackupTime).toLocaleString()
                    : 'None yet'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{t('lblNextAutoBackup')}:</span>
                <span className={autoConfig.enabled ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                  {autoConfig.enabled && autoConfig.nextBackupTime
                    ? new Date(autoConfig.nextBackupTime).toLocaleString()
                    : 'Disabled'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void runAutoBackup(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-sm shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t('btnRunAutoBackupNow')}</span>
            </button>
          </div>
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
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 rounded-sm shadow-xs transition-colors cursor-pointer"
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
              <button onClick={() => setImportedJson(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
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
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-gray-900 focus:ring-gray-900"
                    />
                    <span className="font-semibold text-gray-900">Merge with existing data</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
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
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm cursor-pointer"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={isProcessing}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 rounded-sm disabled:opacity-50 cursor-pointer"
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
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm cursor-pointer"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={handleClearAll}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-sm disabled:opacity-50 cursor-pointer"
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
