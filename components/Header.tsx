'use client';

import React from 'react';
import { 
  FileText, 
  Receipt, 
  Users, 
  Package, 
  Building2, 
  Database, 
  Globe,
  BookOpen
} from 'lucide-react';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { AppLanguage } from '../lib/i18n/translations';

export type TabType = 'builder' | 'saved' | 'clients' | 'items' | 'settings' | 'backup' | 'blog';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  savedCount: number;
  onNewInvoiceClick?: () => void;
  onShowPrivacyModal?: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  savedCount,
}: HeaderProps) {
  const { appLanguage, setAppLanguage, t } = useTranslation();

  const navItems: { id: TabType; labelKey: string; customLabel?: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'builder', labelKey: 'tabNewInvoice', icon: FileText },
    { id: 'saved', labelKey: 'tabSavedInvoices', icon: Receipt, badge: savedCount },
    { id: 'clients', labelKey: 'tabClients', icon: Users },
    { id: 'items', labelKey: 'tabItemLibrary', icon: Package },
    { id: 'settings', labelKey: 'tabSettings', icon: Building2 },
    { id: 'backup', labelKey: 'tabBackup', icon: Database },
    { id: 'blog', labelKey: '', customLabel: 'Guides & Articles', icon: BookOpen },
  ];

  return (
    <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center rounded-sm font-bold shadow-xs shrink-0">
              <div className="w-4 h-[2px] bg-white"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-none tracking-tight uppercase">
                  {t('appName')}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium bg-gray-100 text-gray-600 border border-gray-200 rounded-sm uppercase tracking-wider">
                  {t('clientSideNotice')}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* App Interface Language Switcher */}
            <div className="flex items-center space-x-1 border border-gray-200 bg-gray-50 rounded-sm px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <select
                value={appLanguage}
                onChange={(e) => setAppLanguage(e.target.value as AppLanguage)}
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
                aria-label="Interface Language"
              >
                <option value="en">English (EN)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
                <option value="de">Deutsch (DE)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto h-11 items-center scrollbar-none border-t border-gray-100 text-xs sm:text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 h-full px-2.5 sm:px-3.5 font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-gray-900 text-gray-900 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                <span>{item.customLabel || t(item.labelKey)}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-sm ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
