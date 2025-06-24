// Data backup and restore utilities
import { loadInvoiceHistory } from './invoiceStorage';
import { loadFromLocalStorage, saveToLocalStorage } from './storage';

/**
 * Export all application data to a JSON file
 */
export const exportData = () => {
  try {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      appName: 'Divided Finance Master',
      data: {
        invoices: loadInvoiceHistory(),
        companyInfo: loadFromLocalStorage('companyInfo'),
        clients: loadFromLocalStorage('clientList') || [],
        settings: {
          theme: loadFromLocalStorage('theme'),
          currency: loadFromLocalStorage('currency'),
          language: loadFromLocalStorage('language'),
        },
        preferences: {
          darkMode: loadFromLocalStorage('darkMode'),
          autoSave: loadFromLocalStorage('autoSave'),
          notifications: loadFromLocalStorage('notifications'),
        }
      }
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `divided-finance-master-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'Data exported successfully!',
      filename: link.download
    };
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      message: 'Failed to export data. Please try again.',
      error: error.message
    };
  }
};

/**
 * Import data from a JSON file
 */
export const importData = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error('Please select a valid JSON file'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Validate data structure
        if (!validateImportData(importedData)) {
          reject(new Error('Invalid backup file format'));
          return;
        }

        // Create backup of current data before importing
        const currentBackup = {
          timestamp: new Date().toISOString(),
          data: {
            invoices: loadInvoiceHistory(),
            companyInfo: loadFromLocalStorage('companyInfo'),
            clients: loadFromLocalStorage('clientList') || [],
          }
        };
        
        saveToLocalStorage('lastBackupBeforeImport', currentBackup);

        // Import the data
        const result = restoreData(importedData);
        resolve(result);
        
      } catch (error) {
        console.error('Import error:', error);
        reject(new Error('Failed to parse backup file. Please check the file format.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Validate imported data structure
 */
const validateImportData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!data.data || typeof data.data !== 'object') return false;
  if (!data.appName || data.appName !== 'Divided Finance Master') {
    // Allow import from older versions or similar apps
    console.warn('Importing data from different app or version');
  }
  return true;
};

/**
 * Restore data to localStorage
 */
const restoreData = (importedData) => {
  try {
    const { data } = importedData;
    let importedCount = 0;

    // Import invoices
    if (data.invoices && Array.isArray(data.invoices)) {
      saveToLocalStorage('invoiceHistory', data.invoices);
      importedCount += data.invoices.length;
    }

    // Import company info
    if (data.companyInfo) {
      saveToLocalStorage('companyInfo', data.companyInfo);
    }

    // Import clients
    if (data.clients && Array.isArray(data.clients)) {
      saveToLocalStorage('clientList', data.clients);
    }

    // Import settings
    if (data.settings) {
      if (data.settings.theme) saveToLocalStorage('theme', data.settings.theme);
      if (data.settings.currency) saveToLocalStorage('currency', data.settings.currency);
      if (data.settings.language) saveToLocalStorage('language', data.settings.language);
    }

    // Import preferences
    if (data.preferences) {
      if (data.preferences.darkMode !== undefined) saveToLocalStorage('darkMode', data.preferences.darkMode);
      if (data.preferences.autoSave !== undefined) saveToLocalStorage('autoSave', data.preferences.autoSave);
      if (data.preferences.notifications !== undefined) saveToLocalStorage('notifications', data.preferences.notifications);
    }

    return {
      success: true,
      message: `Data imported successfully! ${importedCount} invoices restored.`,
      importedCount,
      importDate: importedData.exportDate
    };
  } catch (error) {
    console.error('Restore error:', error);
    return {
      success: false,
      message: 'Failed to restore data. Please try again.',
      error: error.message
    };
  }
};

/**
 * Clear all application data
 */
export const clearAllData = () => {
  try {
    // Create final backup before clearing
    const finalBackup = {
      timestamp: new Date().toISOString(),
      data: {
        invoices: loadInvoiceHistory(),
        companyInfo: loadFromLocalStorage('companyInfo'),
        clients: loadFromLocalStorage('clientList') || [],
      }
    };
    
    saveToLocalStorage('lastBackupBeforeClear', finalBackup);

    // Clear all data
    const keysToRemove = [
      'invoiceHistory',
      'companyInfo',
      'clientList',
      'theme',
      'currency',
      'language',
      'darkMode',
      'autoSave',
      'notifications'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    return {
      success: true,
      message: 'All data cleared successfully. A backup was created before clearing.'
    };
  } catch (error) {
    console.error('Clear data error:', error);
    return {
      success: false,
      message: 'Failed to clear data. Please try again.',
      error: error.message
    };
  }
};

/**
 * Get data statistics
 */
export const getDataStats = () => {
  try {
    const invoices = loadInvoiceHistory();
    const clients = loadFromLocalStorage('clientList') || [];
    const companyInfo = loadFromLocalStorage('companyInfo');
    
    const totalRevenue = invoices.reduce((sum, invoice) => {
      return sum + (invoice.items || []).reduce((itemSum, item) => 
        itemSum + ((item.quantity || 0) * (item.rate || 0)), 0);
    }, 0);

    return {
      invoiceCount: invoices.length,
      clientCount: clients.length,
      totalRevenue,
      hasCompanyInfo: !!companyInfo,
      lastInvoiceDate: invoices.length > 0 ? invoices[invoices.length - 1].createdAt : null,
      dataSize: JSON.stringify({
        invoices,
        clients,
        companyInfo
      }).length
    };
  } catch (error) {
    console.error('Stats error:', error);
    return {
      invoiceCount: 0,
      clientCount: 0,
      totalRevenue: 0,
      hasCompanyInfo: false,
      lastInvoiceDate: null,
      dataSize: 0
    };
  }
};
