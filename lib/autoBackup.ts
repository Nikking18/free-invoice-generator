import { AutoBackupConfig, AutoBackupInterval, BackupData } from './types';

const AUTO_BACKUP_KEY = 'fig_auto_backup_config';
const DB_NAME = 'fig_autobackup_db';
const STORE_NAME = 'handles';
const HANDLE_KEY = 'backup_dir_handle';

export const DEFAULT_AUTO_BACKUP_CONFIG: AutoBackupConfig = {
  enabled: false,
  interval: '1d',
  folderName: '',
  lastBackupTime: null,
  nextBackupTime: null,
};

export function getIntervalMs(interval: AutoBackupInterval): number {
  switch (interval) {
    case '30m':
      return 30 * 60 * 1000;
    case '1h':
      return 60 * 60 * 1000;
    case '12h':
      return 12 * 60 * 60 * 1000;
    case '1d':
      return 24 * 60 * 60 * 1000;
    case '7d':
      return 7 * 24 * 60 * 60 * 1000;
    case 'off':
    default:
      return 0;
  }
}

export function calculateNextBackupTime(interval: AutoBackupInterval, fromTimestamp: number = Date.now()): string | null {
  const ms = getIntervalMs(interval);
  if (ms <= 0) return null;
  return new Date(fromTimestamp + ms).toISOString();
}

export function getStoredAutoBackupConfig(): AutoBackupConfig {
  if (typeof window === 'undefined') return DEFAULT_AUTO_BACKUP_CONFIG;
  try {
    const raw = localStorage.getItem(AUTO_BACKUP_KEY);
    if (!raw) return DEFAULT_AUTO_BACKUP_CONFIG;
    return { ...DEFAULT_AUTO_BACKUP_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to parse auto backup config:', err);
    return DEFAULT_AUTO_BACKUP_CONFIG;
  }
}

export function saveStoredAutoBackupConfig(config: AutoBackupConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save auto backup config:', err);
  }
}

// IndexedDB Helper to persist FileSystemDirectoryHandle across reloads
function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  try {
    const db = await openIdb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(handle, HANDLE_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save folder handle to IndexedDB:', err);
  }
}

export async function getDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const db = await openIdb();
    return await new Promise<FileSystemDirectoryHandle | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(HANDLE_KEY);
      req.onsuccess = () => resolve((req.result as FileSystemDirectoryHandle) || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not retrieve folder handle from IndexedDB:', err);
    return null;
  }
}

export async function executeBackupSave(
  backupData: BackupData,
  folderHandle?: FileSystemDirectoryHandle | null
): Promise<{ success: boolean; mode: 'file-system' | 'download'; fileName: string }> {
  const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `invoice-generator-backup-${timestampStr}.json`;
  const jsonContent = JSON.stringify(backupData, null, 2);

  // Attempt File System Access API write if folderHandle is provided
  if (folderHandle && 'createWritable' in FileSystemDirectoryHandle.prototype) {
    try {
      // Verify or request write permission
      let perm = await (folderHandle as unknown as { queryPermission: (opts: { mode: string }) => Promise<string> }).queryPermission({ mode: 'readwrite' });
      if (perm !== 'granted') {
        perm = await (folderHandle as unknown as { requestPermission: (opts: { mode: string }) => Promise<string> }).requestPermission({ mode: 'readwrite' });
      }

      if (perm === 'granted') {
        const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(jsonContent);
        await writable.close();
        return { success: true, mode: 'file-system', fileName };
      }
    } catch (err) {
      console.warn('File System Access write failed, falling back to standard browser download:', err);
    }
  }

  // Fallback to standard browser file download
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { success: true, mode: 'download', fileName };
}
