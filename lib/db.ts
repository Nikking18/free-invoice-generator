import { Client, ReusableItem, Invoice } from './types';

const DB_NAME = 'FreeInvoiceGeneratorDB';
const DB_VERSION = 1;

const STORES = {
  CLIENTS: 'clients',
  ITEMS: 'items',
  INVOICES: 'invoices',
};

const STARTER_PRESETS: Omit<ReusableItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Consulting & Strategy',
    description: 'Expert advisory, project discovery, and strategic guidance.',
    unitType: 'hour',
    defaultUnitPrice: 125,
    taxable: false,
  },
  {
    name: 'Design & Creative Work',
    description: 'Custom UI/UX design, brand assets, or graphic creation.',
    unitType: 'hour',
    defaultUnitPrice: 95,
    taxable: false,
  },
  {
    name: 'Service Call & Inspection',
    description: 'On-site diagnostic assessment and evaluation fee.',
    unitType: 'service',
    defaultUnitPrice: 150,
    taxable: true,
  },
  {
    name: 'General Skilled Labor',
    description: 'Implementation, execution, and hands-on site work.',
    unitType: 'hour',
    defaultUnitPrice: 65,
    taxable: false,
  },
  {
    name: 'Delivery & Handling Fee',
    description: 'Standard equipment transport, logistics, and material delivery.',
    unitType: 'flat',
    defaultUnitPrice: 45,
    taxable: true,
  },
];

// LocalStorage Fallback Keys if IndexedDB is blocked
const LS_FALLBACK_KEYS = {
  CLIENTS: 'fig_fallback_clients',
  ITEMS: 'fig_fallback_items',
  INVOICES: 'fig_fallback_invoices',
};

function isIndexedDBAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      reject(new Error('IndexedDB not supported or blocked'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
        db.createObjectStore(STORES.CLIENTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.ITEMS)) {
        db.createObjectStore(STORES.ITEMS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.INVOICES)) {
        const invoiceStore = db.createObjectStore(STORES.INVOICES, { keyPath: 'id' });
        invoiceStore.createIndex('invoiceNumber', 'invoiceNumber', { unique: false });
        invoiceStore.createIndex('status', 'status', { unique: false });
      }
    };
  });
}

// Generic Fallback Helpers
function getLsItems<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLsItems<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('LocalStorage fallback error:', err);
  }
}

/* ================= CLIENTS CRUD ================= */

export async function getAllClients(): Promise<Client[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CLIENTS, 'readonly');
      const store = tx.objectStore(STORES.CLIENTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Using LocalStorage fallback for Clients:', err);
    return getLsItems<Client>(LS_FALLBACK_KEYS.CLIENTS);
  }
}

export async function saveClient(client: Client): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CLIENTS, 'readwrite');
      const store = tx.objectStore(STORES.CLIENTS);
      const req = store.put(client);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('LocalStorage fallback for saveClient:', err);
    const clients = getLsItems<Client>(LS_FALLBACK_KEYS.CLIENTS);
    const index = clients.findIndex(c => c.id === client.id);
    if (index >= 0) clients[index] = client;
    else clients.push(client);
    setLsItems(LS_FALLBACK_KEYS.CLIENTS, clients);
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CLIENTS, 'readwrite');
      const store = tx.objectStore(STORES.CLIENTS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('LocalStorage fallback for deleteClient:', err);
    const clients = getLsItems<Client>(LS_FALLBACK_KEYS.CLIENTS).filter(c => c.id !== id);
    setLsItems(LS_FALLBACK_KEYS.CLIENTS, clients);
  }
}

/* ================= REUSABLE ITEMS CRUD ================= */

export async function getAllItems(): Promise<ReusableItem[]> {
  try {
    const db = await openDatabase();
    const items: ReusableItem[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ITEMS, 'readonly');
      const store = tx.objectStore(STORES.ITEMS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (items.length === 0) {
      // Seed starter presets if empty
      await seedStarterPresets();
      return getAllItems();
    }
    return items;
  } catch (err) {
    console.warn('Using LocalStorage fallback for Items:', err);
    let items = getLsItems<ReusableItem>(LS_FALLBACK_KEYS.ITEMS);
    if (items.length === 0) {
      const now = new Date().toISOString();
      items = STARTER_PRESETS.map((p, idx) => ({
        ...p,
        id: `preset-${idx + 1}`,
        createdAt: now,
        updatedAt: now,
      }));
      setLsItems(LS_FALLBACK_KEYS.ITEMS, items);
    }
    return items;
  }
}

export async function seedStarterPresets(): Promise<void> {
  const now = new Date().toISOString();
  const presets: ReusableItem[] = STARTER_PRESETS.map((p, idx) => ({
    ...p,
    id: `item-preset-${idx + 1}-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  }));

  for (const preset of presets) {
    await saveItem(preset);
  }
}

export async function saveItem(item: ReusableItem): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ITEMS, 'readwrite');
      const store = tx.objectStore(STORES.ITEMS);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('LocalStorage fallback for saveItem:', err);
    const items = getLsItems<ReusableItem>(LS_FALLBACK_KEYS.ITEMS);
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) items[index] = item;
    else items.push(item);
    setLsItems(LS_FALLBACK_KEYS.ITEMS, items);
  }
}

export async function deleteItem(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ITEMS, 'readwrite');
      const store = tx.objectStore(STORES.ITEMS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('LocalStorage fallback for deleteItem:', err);
    const items = getLsItems<ReusableItem>(LS_FALLBACK_KEYS.ITEMS).filter(i => i.id !== id);
    setLsItems(LS_FALLBACK_KEYS.ITEMS, items);
  }
}

/* ================= INVOICES CRUD ================= */

export async function getAllInvoices(): Promise<Invoice[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.INVOICES, 'readonly');
      const store = tx.objectStore(STORES.INVOICES);
      const req = store.getAll();
      req.onsuccess = () => {
        const results: Invoice[] = req.result || [];
        // Sort by updatedAt descending
        results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Using LocalStorage fallback for Invoices:', err);
    const invoices = getLsItems<Invoice>(LS_FALLBACK_KEYS.INVOICES);
    invoices.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return invoices;
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.INVOICES, 'readonly');
      const store = tx.objectStore(STORES.INVOICES);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('LocalStorage fallback for getInvoiceById:', err);
    const invoices = getLsItems<Invoice>(LS_FALLBACK_KEYS.INVOICES);
    return invoices.find(inv => inv.id === id) || null;
  }
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.INVOICES, 'readwrite');
      const store = tx.objectStore(STORES.INVOICES);
      const req = store.put(invoice);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('LocalStorage fallback for saveInvoice:', err);
    const invoices = getLsItems<Invoice>(LS_FALLBACK_KEYS.INVOICES);
    const index = invoices.findIndex(i => i.id === invoice.id);
    if (index >= 0) invoices[index] = invoice;
    else invoices.push(invoice);
    setLsItems(LS_FALLBACK_KEYS.INVOICES, invoices);
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.INVOICES, 'readwrite');
      const store = tx.objectStore(STORES.INVOICES);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('LocalStorage fallback for deleteInvoice:', err);
    const invoices = getLsItems<Invoice>(LS_FALLBACK_KEYS.INVOICES).filter(i => i.id !== id);
    setLsItems(LS_FALLBACK_KEYS.INVOICES, invoices);
  }
}

/* Helper to generate next incremented invoice number like INV-0001 */
export async function generateNextInvoiceNumber(): Promise<string> {
  const invoices = await getAllInvoices();
  let maxNum = 0;

  for (const inv of invoices) {
    const match = inv.invoiceNumber.match(/INV-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `INV-${String(nextNum).padStart(4, '0')}`;
}

/* Helper to auto-update Sent invoices past their due date to Overdue */
export async function checkAndUpdateOverdueInvoices(): Promise<void> {
  try {
    const invoices = await getAllInvoices();
    const today = new Date().toISOString().split('T')[0];
    let updated = false;

    for (const inv of invoices) {
      if ((inv.status === 'Sent' || inv.status === 'Draft') && inv.dueDate && inv.dueDate < today && inv.balanceDue > 0) {
        inv.status = 'Overdue';
        inv.updatedAt = new Date().toISOString();
        await saveInvoice(inv);
        updated = true;
      }
    }
  } catch (err) {
    console.error('Error checking overdue invoices:', err);
  }
}

/* Clear all IndexedDB and LocalStorage app data */
export async function clearAllAppData(): Promise<void> {
  try {
    if (isIndexedDBAvailable()) {
      const db = await openDatabase();
      const tx = db.transaction([STORES.CLIENTS, STORES.ITEMS, STORES.INVOICES], 'readwrite');
      tx.objectStore(STORES.CLIENTS).clear();
      tx.objectStore(STORES.ITEMS).clear();
      tx.objectStore(STORES.INVOICES).clear();
    }
  } catch (err) {
    console.error('Failed clearing IndexedDB:', err);
  }

  // Clear fallback local storage keys
  try {
    localStorage.removeItem(LS_FALLBACK_KEYS.CLIENTS);
    localStorage.removeItem(LS_FALLBACK_KEYS.ITEMS);
    localStorage.removeItem(LS_FALLBACK_KEYS.INVOICES);
  } catch (err) {
    console.error('Failed clearing fallback localStorage:', err);
  }
}
