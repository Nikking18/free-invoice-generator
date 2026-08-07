'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BusinessProfile, 
  Client, 
  ReusableItem, 
  Invoice, 
  BackupData 
} from '../lib/types';
import { 
  getStoredBusinessProfile, 
  saveStoredBusinessProfile, 
  clearStoredBusinessProfile, 
  DEFAULT_BUSINESS_PROFILE
} from '../lib/storage';
import { 
  getAllClients, 
  saveClient, 
  deleteClient, 
  getAllItems, 
  saveItem, 
  deleteItem, 
  seedStarterPresets,
  getAllInvoices, 
  saveInvoice, 
  deleteInvoice, 
  generateNextInvoiceNumber,
  checkAndUpdateOverdueInvoices,
  clearAllAppData 
} from '../lib/db';
import { LanguageProvider } from '../lib/i18n/LanguageContext';
import { Header, TabType } from '../components/Header';
import { PrivacyBanner, PrivacyModal } from '../components/PrivacyBanner';
import { InvoiceBuilder } from '../components/InvoiceBuilder';
import { SavedInvoices } from '../components/SavedInvoices';
import { ClientManagement } from '../components/ClientManagement';
import { ItemLibrary } from '../components/ItemLibrary';
import { BusinessSettings } from '../components/BusinessSettings';
import { BackupRestore } from '../components/BackupRestore';
import { BlogSection } from '../components/BlogSection';
import { KofiFooterSection, KofiOverlayWidget } from '../components/KofiWidgets';
import { FeedbackWidget } from '../components/FeedbackWidget';
import { Heart, ShieldCheck, Code, Github, Linkedin, Twitter } from 'lucide-react';


import { useTranslation } from '../lib/i18n/LanguageContext';

export default function Page() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(true);

  // App Data States
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    if (typeof window !== 'undefined') {
      return getStoredBusinessProfile();
    }
    return DEFAULT_BUSINESS_PROFILE;
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<ReusableItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // Initialize profile & DB
  useEffect(() => {
    let isMounted = true;
    const prof = getStoredBusinessProfile();

    async function init() {
      try {
        await checkAndUpdateOverdueInvoices();
        const [cls, itms, invs, nextNum] = await Promise.all([
          getAllClients(),
          getAllItems(),
          getAllInvoices(),
          generateNextInvoiceNumber(),
        ]);

        if (!isMounted) return;
        setClients(cls);
        setItems(itms);
        setInvoices(invs);

        const today = new Date().toISOString().split('T')[0];
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + 15);
        const defaultDueDate = dueDateObj.toISOString().split('T')[0];

        const initialInv: Invoice = {
          id: `inv-${Date.now()}`,
          invoiceNumber: nextNum,
          date: today,
          dueDate: defaultDueDate,
          paymentTerms: prof.defaultPaymentTerms || 'Net 15 Days',
          status: 'Draft',
          clientName: '',
          clientCompany: '',
          clientEmail: '',
          clientPhone: '',
          clientAddress: '',
          templateStyle: prof.defaultTemplateStyle || 'classic',
          invoiceLanguage: prof.defaultInvoiceLanguage || 'en',
          lineItems: [
            {
              id: `item-1-${Date.now()}`,
              description: 'Professional Services',
              quantity: 1,
              unitType: 'hour',
              unitPrice: 100,
              discount: 0,
              taxable: true,
            },
          ],
          invoiceDiscountType: 'flat',
          invoiceDiscountValue: 0,
          taxRate: prof.defaultTaxRate || 0,
          shippingFee: 0,
          amountPaid: 0,
          notes: prof.defaultNotes || '',
          paymentInstructions: '',
          terms: prof.defaultTerms || '',
          subtotal: 100,
          discountTotal: 0,
          taxableSubtotal: 0,
          taxTotal: 0,
          grandTotal: 100,
          balanceDue: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setCurrentInvoice(initialInv);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }

    void init();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshClientsList = useCallback(async () => {
    const cls = await getAllClients();
    setClients(cls);
  }, []);

  const refreshItemsList = useCallback(async () => {
    const itms = await getAllItems();
    setItems(itms);
  }, []);

  const refreshInvoicesList = useCallback(async () => {
    const invs = await getAllInvoices();
    setInvoices(invs);
  }, []);

  // Save Invoice
  const handleSaveInvoice = async (invoiceToSave: Invoice) => {
    await saveInvoice(invoiceToSave);
    await refreshInvoicesList();
    setCurrentInvoice(invoiceToSave);
  };

  // Create New Invoice
  const handleNewInvoiceClick = async () => {
    const nextNum = await generateNextInvoiceNumber();
    const today = new Date().toISOString().split('T')[0];

    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 15);
    const defaultDueDate = dueDateObj.toISOString().split('T')[0];

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: nextNum,
      date: today,
      dueDate: defaultDueDate,
      paymentTerms: profile.defaultPaymentTerms || 'Net 15 Days',
      status: 'Draft',
      clientName: '',
      clientCompany: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      templateStyle: profile.defaultTemplateStyle || 'classic',
      invoiceLanguage: profile.defaultInvoiceLanguage || 'en',
      lineItems: [
        {
          id: `item-1-${Date.now()}`,
          description: '',
          quantity: 1,
          unitType: 'hour',
          unitPrice: 0,
          discount: 0,
          taxable: true,
        },
      ],
      invoiceDiscountType: 'flat',
      invoiceDiscountValue: 0,
      taxRate: profile.defaultTaxRate || 0,
      shippingFee: 0,
      amountPaid: 0,
      notes: profile.defaultNotes || '',
      paymentInstructions: '',
      terms: profile.defaultTerms || '',
      subtotal: 0,
      discountTotal: 0,
      taxableSubtotal: 0,
      taxTotal: 0,
      grandTotal: 0,
      balanceDue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentInvoice(newInv);
    setActiveTab('builder');
  };

  // Open Invoice for editing
  const handleOpenInvoice = (inv: Invoice) => {
    setCurrentInvoice(inv);
    setActiveTab('builder');
  };

  // Duplicate Invoice
  const handleDuplicateInvoice = async (inv: Invoice) => {
    const dup: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: `${inv.invoiceNumber}-COPY`,
      status: 'Draft',
      amountPaid: 0,
      balanceDue: inv.grandTotal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveInvoice(dup);
    await refreshInvoicesList();
    setCurrentInvoice(dup);
    setActiveTab('builder');
  };

  // Mark invoice as paid
  const handleMarkAsPaid = async (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;

    const updated: Invoice = {
      ...inv,
      status: 'Paid',
      amountPaid: inv.grandTotal,
      balanceDue: 0,
      updatedAt: new Date().toISOString(),
    };

    await saveInvoice(updated);
    await refreshInvoicesList();
    if (currentInvoice?.id === id) {
      setCurrentInvoice(updated);
    }
  };

  // Delete Invoice
  const handleDeleteInvoice = async (id: string) => {
    await deleteInvoice(id);
    await refreshInvoicesList();
    if (currentInvoice?.id === id) {
      handleNewInvoiceClick();
    }
  };

  // Clients CRUD
  const handleSaveClient = async (c: Client) => {
    await saveClient(c);
    await refreshClientsList();
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
    await refreshClientsList();
  };

  const handleCreateInvoiceForClient = (client: Client) => {
    handleNewInvoiceClick().then(() => {
      setCurrentInvoice((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          clientId: client.id,
          clientName: client.name,
          clientCompany: client.company || '',
          clientEmail: client.email || '',
          clientPhone: client.phone || '',
          clientAddress: client.address || '',
        };
      });
      setActiveTab('builder');
    });
  };

  // Items CRUD
  const handleSaveItem = async (it: ReusableItem) => {
    await saveItem(it);
    await refreshItemsList();
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    await refreshItemsList();
  };

  const handleRestorePresets = async () => {
    await seedStarterPresets();
    await refreshItemsList();
  };

  const handleAddItemToInvoice = (item: ReusableItem) => {
    setCurrentInvoice((prev) => {
      if (!prev) return prev;
      const newLineItem = {
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        description: item.name + (item.description ? ` - ${item.description}` : ''),
        quantity: 1,
        unitType: item.unitType,
        unitPrice: item.defaultUnitPrice,
        discount: 0,
        taxable: item.taxable,
      };
      return {
        ...prev,
        lineItems: [...prev.lineItems, newLineItem],
      };
    });
    setActiveTab('builder');
  };

  // Profile Save / Clear
  const handleSaveProfile = (newProf: BusinessProfile) => {
    setProfile(newProf);
    saveStoredBusinessProfile(newProf);
  };

  const handleClearProfile = () => {
    setProfile(DEFAULT_BUSINESS_PROFILE);
    clearStoredBusinessProfile();
  };

  // Backup Import & Clear
  const handleImportBackup = async (data: BackupData, mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      await clearAllAppData();
    }

    if (data.businessProfile) {
      handleSaveProfile(data.businessProfile);
    }

    if (Array.isArray(data.clients)) {
      for (const c of data.clients) {
        await saveClient(c);
      }
    }

    if (Array.isArray(data.items)) {
      for (const it of data.items) {
        await saveItem(it);
      }
    }

    if (Array.isArray(data.invoices)) {
      for (const inv of data.invoices) {
        await saveInvoice(inv);
      }
    }

    await refreshClientsList();
    await refreshItemsList();
    await refreshInvoicesList();
  };

  const handleClearAllData = async () => {
    await clearAllAppData();
    clearStoredBusinessProfile();
    setProfile(DEFAULT_BUSINESS_PROFILE);
    setClients([]);
    setItems([]);
    setInvoices([]);
    await handleNewInvoiceClick();
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans flex flex-col">
        {/* Main Header & Tab Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={invoices.length}
        />

        {/* Main Container - Only mount current activeTab for performance */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'builder' && currentInvoice && (
            <InvoiceBuilder
              key={currentInvoice.id}
              initialInvoice={currentInvoice}
              businessProfile={profile}
              clients={clients}
              items={items}
              onSaveInvoice={handleSaveInvoice}
              onNewInvoice={handleNewInvoiceClick}
              onRefreshClients={refreshClientsList}
            />
          )}

          {activeTab === 'saved' && (
            <SavedInvoices
              invoices={invoices}
              businessProfile={profile}
              onOpenInvoice={handleOpenInvoice}
              onDuplicateInvoice={handleDuplicateInvoice}
              onMarkAsPaid={handleMarkAsPaid}
              onDeleteInvoice={handleDeleteInvoice}
              onCreateNewClick={handleNewInvoiceClick}
            />
          )}

          {activeTab === 'clients' && (
            <ClientManagement
              clients={clients}
              onSaveClient={handleSaveClient}
              onDeleteClient={handleDeleteClient}
              onCreateInvoiceForClient={handleCreateInvoiceForClient}
            />
          )}

          {activeTab === 'items' && (
            <ItemLibrary
              items={items}
              currencySymbol={profile.defaultCurrencySymbol || '$'}
              currencyCode={profile.defaultCurrency || 'USD'}
              onSaveItem={handleSaveItem}
              onDeleteItem={handleDeleteItem}
              onRestorePresets={handleRestorePresets}
              onAddItemToInvoice={handleAddItemToInvoice}
            />
          )}

          {activeTab === 'settings' && (
            <BusinessSettings
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onClearProfile={handleClearProfile}
            />
          )}

          {activeTab === 'backup' && (
            <BackupRestore
              businessProfile={profile}
              clients={clients}
              items={items}
              invoices={invoices}
              onImportBackup={handleImportBackup}
              onClearAllData={handleClearAllData}
            />
          )}
        </main>

        {/* Ko-fi Support Banner Section */}
        <KofiFooterSection />

        {/* Modern Main Footer (White & Black Theme) */}
        <footer className="no-print bg-white text-gray-800 border-t border-gray-200 py-6 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Author & Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="font-medium text-black flex items-center gap-1.5">
                {t('footerCreatedWith')} <Heart className="w-3.5 h-3.5 text-black fill-black shrink-0" /> {t('footerBy')} <strong className="font-bold text-black">Nikhil Khanpara</strong>
              </span>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <a
                  href="https://github.com/Nikking18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-black hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                >
                  <Github className="w-3.5 h-3.5 text-black" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/nikhilkhanpara/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-black hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                >
                  <Linkedin className="w-3.5 h-3.5 text-black" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://x.com/nikhilkhanpara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-black hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                >
                  <Twitter className="w-3.5 h-3.5 text-black" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            {/* Privacy Notice & Client-Side Badge */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-gray-700 hover:text-black transition-colors hover:bg-gray-100 border border-transparent hover:border-gray-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>{t('footerPrivacyNotice')}</span>
              </button>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-black text-[11px] font-mono font-semibold border border-gray-200">
                <Code className="w-3 h-3 text-black" />
                {t('footerClientSide')}
              </span>
            </div>

          </div>
        </footer>

        {/* Ko-fi Floating Widget on bottom-left */}
        <KofiOverlayWidget />

        {/* Feedback & Suggestion Widget on bottom-right */}
        <FeedbackWidget />

        {/* Privacy Policy Modal */}
        <PrivacyModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
        />
      </div>
    </LanguageProvider>
  );
}
