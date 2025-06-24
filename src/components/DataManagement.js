﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import React, { useState, useRef } from 'react';
import { exportData, importData, clearAllData, getDataStats } from '../utils/dataBackup';
import { useToast } from './Toast';
import { formatCurrency } from '../utils/storage';
import ConfirmDialog, { DeleteConfirmDialog } from './ConfirmDialog';
import Loading from './Loading';

const DataManagement = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(getDataStats());
  const [showClearDialog, setShowClearDialog] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const refreshStats = () => {
    setStats(getDataStats());
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const result = exportData();
      
      if (result.success) {
        toast.success(`✅ ${result.message}`);
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await importData(file);
      
      if (result.success) {
        toast.success(`✅ ${result.message}`);
        refreshStats();
        // Refresh the page to load new data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`);
      console.error('Import error:', error);
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleClearData = async () => {
    try {
      setLoading(true);
      const result = clearAllData();
      
      if (result.success) {
        toast.success(`✅ ${result.message}`);
        refreshStats();
        // Refresh the page to reflect cleared data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      toast.error('Failed to clear data');
      console.error('Clear data error:', error);
    } finally {
      setLoading(false);
      setShowClearDialog(false);
    }
  };

  if (loading) {
    return <Loading text="Processing data..." />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-b from-secondary-200 to-secondary-400 dark:bg-gradient-dark">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-dark-text-primary mb-2">
          Data Management
        </h2>
        <p className="text-secondary-600 dark:text-dark-text-secondary">
          Backup, restore, and manage your invoice data. All operations are performed locally in your browser.
        </p>
      </div>

      {/* Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <img src="https://img.icons8.com/stickers/48/000000/invoice.png" alt="Invoices" className="w-12 h-12 mr-4" />
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.invoiceCount}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Invoices
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <img src="https://img.icons8.com/stickers/48/000000/group.png" alt="Clients" className="w-12 h-12 mr-4" />
            <div>
              <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                {stats.clientCount}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Clients
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <img src="https://img.icons8.com/stickers/48/000000/money.png" alt="Revenue" className="w-12 h-12 mr-4" />
            <div>
              <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Total Revenue
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <img src="https://img.icons8.com/stickers/48/000000/save.png" alt="Data Size" className="w-12 h-12 mr-4" />
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {(stats.dataSize / 1024).toFixed(1)}KB
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Data Size
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Export Data */}
        <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <img src="https://img.icons8.com/stickers/64/000000/export.png" alt="Export" className="w-16 h-16 mr-4" />
            <div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-dark-text-primary">
                Export Data
              </h3>
              <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Download a backup of all your data
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-secondary-600 dark:text-dark-text-secondary mb-2">
              This will create a JSON file containing:
            </p>
            <ul className="text-sm text-secondary-600 dark:text-dark-text-secondary space-y-1">
              <li>• All invoices and their data</li>
              <li>• Client information</li>
              <li>• Company settings</li>
              <li>• Application preferences</li>
            </ul>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50"
          >
            <img src="https://img.icons8.com/stickers/24/000000/export.png" alt="Export" className="w-5 h-5 mr-2" />
            Export All Data
          </button>
        </div>

        {/* Import Data */}
        <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <img src="https://img.icons8.com/stickers/64/000000/import.png" alt="Import" className="w-16 h-16 mr-4" />
            <div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-dark-text-primary">
                Import Data
              </h3>
              <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Restore data from a backup file
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-secondary-600 dark:text-dark-text-secondary mb-2">
              ⚠️ Important notes:
            </p>
            <ul className="text-sm text-secondary-600 dark:text-dark-text-secondary space-y-1">
              <li>• This will replace your current data</li>
              <li>• A backup will be created before import</li>
              <li>• Only JSON files are supported</li>
              <li>• The page will refresh after import</li>
            </ul>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            onClick={handleImportClick}
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors duration-200 disabled:opacity-50"
          >
            <img src="https://img.icons8.com/stickers/24/000000/import.png" alt="Import" className="w-5 h-5 mr-2" />
            Import Data
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="text-4xl mr-4">⚠️</div>
          <div>
            <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
              Danger Zone
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300">
              Irreversible actions that will permanently delete your data
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-red-700 dark:text-red-300 mb-2">
            Clear all data will permanently delete:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li>• All invoices and invoice history</li>
            <li>• All client information</li>
            <li>• Company settings and preferences</li>
            <li>• All application data</li>
          </ul>
        </div>

        <button
          onClick={() => setShowClearDialog(true)}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50"
        >
          <span className="mr-2">🗑️</span>
          Clear All Data
        </button>
      </div>

      {/* Clear Data Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearData}
        itemName="all application data"
        loading={loading}
      />
    </div>
  );
};

export default DataManagement;
