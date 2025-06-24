import './utils/fonts';
import React, { useState, useEffect } from 'react';
import InvoiceForm from './components/InvoiceForm';
import Settings from './components/Settings';
import InvoiceHistory from './components/InvoiceHistory';
import Navigation from './components/Navigation';
import Loading from './components/Loading';
import { ToastProvider, useToast } from './components/Toast';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/storage';
import { defaultCompanyInfo, defaultTheme, fetchCurrencies } from './utils/defaults';
import { loadInvoiceHistory, saveInvoiceToHistory } from './utils/invoiceStorage';
import { loadClients } from './utils/clientStorage';
import { initializeClientSync, syncClients } from './utils/clientSync';
import { registerAllFonts } from './utils/fontManager';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './LandingPage';
import Dashboard from './components/Dashboard';
import DataManagement from './components/DataManagement';
import Clients from './Clients';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import HelpPage from './pages/HelpPage';
import DocumentationPage from './pages/DocumentationPage';

// Main App Component with Toast Integration
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    companyInfo: defaultCompanyInfo,
    selectedClient: null,
    clientList: [],
    items: [],
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    terms: '',
    notes: '',
    currency: 'USD',
    theme: defaultTheme,
    discount: { type: 'none', value: 0, clientDiscount: 0 }
  });
  const toast = useToast();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load saved data from localStorage
        const savedData = loadFromLocalStorage('invoiceData');

        // Initialize fonts for PDF generation (basic fonts are auto-initialized)
        registerAllFonts().catch(error => {
          console.warn('Advanced font initialization failed, using basic fonts:', error);
        });

        // Initialize client synchronization
        const unifiedClients = initializeClientSync();

        if (savedData) {
          setInvoiceData(prevData => ({
            ...prevData,
            ...savedData,
            clientList: unifiedClients // Always use unified clients
          }));
        } else {
          setInvoiceData(prevData => ({
            ...prevData,
            clientList: unifiedClients
          }));
        }

        // Load available currencies
        const currencies = await fetchCurrencies();
        if (currencies) {
          setInvoiceData(prevData => ({
            ...prevData,
            availableCurrencies: currencies
          }));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleUpdateInvoice = (updates) => {
    setInvoiceData(prevData => {
      // If clientList is being updated, sync with unified storage
      if (updates.clientList) {
        syncClients();
      }

      const newData = { ...prevData, ...updates };
      saveToLocalStorage('invoiceData', newData);
      return newData;
    });
  };

  const handleSaveInvoice = () => {
    try {
      // Save current invoice to history
      const savedInvoice = saveInvoiceToHistory({
        ...invoiceData,
        savedAt: new Date().toISOString()
      });

      if (savedInvoice) {
        // Reset form or prepare for new invoice
        setInvoiceData(prevData => ({
          ...prevData,
          items: [],
          invoiceNumber: '',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: '',
          notes: ''
        }));

        // Show success toast notification
        toast.success('Invoice saved successfully!');
      } else {
        toast.error('Failed to save invoice. Please try again.');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Error saving invoice. Please try again.');
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading Invoice Generator..." />;
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ErrorBoundary>
        <Routes>
          {/* Landing page without navigation */}
          <Route path="/" element={<LandingPage />} />

          {/* All other routes with navigation and layout */}
          <Route path="/*" element={
            <div className="min-h-screen bg-gradient-to-b from-secondary-200 to-secondary-400 dark:bg-gradient-dark flex flex-col">
              <Navigation />

              <main className="flex-1 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/invoices" element={
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden">
                      <div className="p-6">
                        <div className="space-y-6">
                          <InvoiceForm
                            invoiceData={invoiceData}
                            onUpdateInvoice={handleUpdateInvoice}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={handleSaveInvoice}
                              className="px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                            >
                              <img src="https://img.icons8.com/stickers/24/000000/save.png" alt="Save" className="w-5 h-5 mr-2" />
                              Save Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  } />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/history" element={<InvoiceHistoryPage />} />
                  <Route path="/data-management" element={<DataManagement />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/documentation" element={<DocumentationPage />} />
                  <Route path="/settings" element={
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden p-6">
                      <div className="mb-6">
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-2">Settings</h1>
                        <p className="text-secondary-600 dark:text-dark-text-secondary">Configure your invoice preferences and company information.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => setShowSettings(true)}
                          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                          <img src="https://img.icons8.com/stickers/24/000000/settings.png" alt="Settings" className="w-5 h-5 mr-2" />
                          Open Settings
                        </button>
                        <a
                          href="/data-management"
                          className="inline-flex items-center justify-center px-6 py-3 border border-secondary-300 dark:border-secondary-600 text-base font-medium rounded-md text-secondary-700 dark:text-dark-text-primary bg-white dark:bg-dark-bg-secondary hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                        >
                          <img src="https://img.icons8.com/stickers/24/000000/save.png" alt="Data" className="w-5 h-5 mr-2" />
                          Data Management
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
              </main>

              <footer className="bg-white dark:bg-dark-bg-secondary shadow-inner mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-secondary-500 dark:text-dark-text-secondary">
                      © {new Date().getFullYear()} Divided Finance Master. Open source invoicing system.
                    </p>
                    <div className="flex space-x-6">
                      <a href="/terms" className="text-secondary-400 hover:text-secondary-500 dark:hover:text-dark-text-primary transition-colors duration-200">
                        Terms
                      </a>
                      <a href="/privacy" className="text-secondary-400 hover:text-secondary-500 dark:hover:text-dark-text-primary transition-colors duration-200">
                        Privacy
                      </a>
                      <a href="/help" className="text-secondary-400 hover:text-secondary-500 dark:hover:text-dark-text-primary transition-colors duration-200">
                        Help
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          } />
        </Routes>

        {/* Settings Modal */}
        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          invoiceData={invoiceData}
          onUpdateInvoice={handleUpdateInvoice}
        />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

// Main App Component with Toast Provider
export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}