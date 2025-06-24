import React, { useState, useEffect } from 'react';
import CompanyInfoSection from './sections/CompanyInfoSection';
import ThemeSection from './sections/ThemeSection';
import { currencySymbols, getCurrencyByRegion, searchCurrencies, addCustomCurrency, loadCustomCurrencies, removeCustomCurrency } from '../utils/currency';

const Settings = ({ isOpen, onClose, invoiceData, onUpdateInvoice }) => {
  const [activeTab, setActiveTab] = useState('company');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customCurrency, setCustomCurrency] = useState({ code: '', symbol: '', name: '' });

  const tabs = [
    { id: 'company', label: 'Company Info' },
    { id: 'theme', label: 'Theme' },
    { id: 'currency', label: 'Currency' },
  ];

  const handleCurrencyChange = (currency) => {
    onUpdateInvoice({
      ...invoiceData,
      currency,
    });
  };

  const handleAddCustomCurrency = () => {
    if (customCurrency.code && customCurrency.symbol) {
      addCustomCurrency(
        customCurrency.code.toUpperCase(),
        customCurrency.symbol,
        customCurrency.name || customCurrency.code
      );
      setCustomCurrency({ code: '', symbol: '', name: '' });
      setShowCustomForm(false);
    }
  };

  const filteredCurrencies = Object.entries(currencySymbols)
    .filter(([code]) => code.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(([code, symbol]) => ({
      code,
      symbol,
      name: getCurrencyByRegion(code)?.name || '',
      isCustom: false,
    }));

  useEffect(() => {
    loadCustomCurrencies();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://img.icons8.com/stickers/32/000000/settings.png" alt="Settings" className="w-8 h-8 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 8rem)' }}>
          {activeTab === 'company' && (
            <CompanyInfoSection
              companyInfo={invoiceData.companyInfo}
              onUpdateInvoice={(newCompanyInfo) => {
                onUpdateInvoice({
                  ...invoiceData,
                  companyInfo: newCompanyInfo,
                });
              }}
            />
          )}
          {activeTab === 'theme' && (
            <ThemeSection
              theme={invoiceData.theme}
              onUpdateInvoice={(newTheme) => {
                onUpdateInvoice({
                  ...invoiceData,
                  theme: newTheme,
                });
              }}
            />
          )}
          {activeTab === 'currency' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Currency
                </label>
                <div className="mt-2">
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Search currencies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <img src="https://img.icons8.com/stickers/20/000000/search.png" alt="Search" className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Custom Currency Button */}
              <button
                onClick={() => setShowCustomForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <img src="https://img.icons8.com/stickers/16/000000/plus.png" alt="Add" className="w-4 h-4 mr-2" />
                Add Custom Currency
              </button>

              {/* Custom Currency Form */}
              {showCustomForm && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Add Custom Currency</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency Code</label>
                      <input
                        type="text"
                        maxLength="5"
                        placeholder="e.g., XXX"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        value={customCurrency.code}
                        onChange={(e) => setCustomCurrency({ ...customCurrency, code: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Symbol</label>
                      <input
                        type="text"
                        maxLength="4"
                        placeholder="e.g., ¤"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        value={customCurrency.symbol}
                        onChange={(e) => setCustomCurrency({ ...customCurrency, symbol: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., Custom Currency"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        value={customCurrency.name}
                        onChange={(e) => setCustomCurrency({ ...customCurrency, name: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowCustomForm(false)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddCustomCurrency}
                        disabled={!customCurrency.code || !customCurrency.symbol}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Currency
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Currency Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 mt-4 max-h-96 overflow-y-auto">
                {filteredCurrencies.map(({ code, symbol, name, isCustom }) => (
                  <button
                    key={code}
                    onClick={() => handleCurrencyChange(code)}
                    className={`group relative flex items-center justify-between px-3 py-2 text-sm rounded-lg border
                      ${invoiceData.currency === code
                        ? 'border-primary-500 text-primary-700 bg-primary-50 dark:bg-primary-900 dark:text-primary-300'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{code}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{name}</span>
                    </div>
                    <span className="text-lg">{symbol}</span>
                    {isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomCurrency(code);
                        }}
                        className="absolute top-0 right-0 -mt-2 -mr-2 hidden group-hover:block bg-red-500 text-white rounded-full p-1"
                        title="Remove custom currency"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;