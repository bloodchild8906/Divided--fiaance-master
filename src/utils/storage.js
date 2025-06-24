import getSymbolFromCurrency from 'currency-symbol-map';

// Local Storage Functions
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Currency Formatting
export const formatCurrency = (amount, currencyCode = 'USD') => {
  const symbol = getSymbolFromCurrency(currencyCode) || '$';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Invoice Number Generation
export const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Calculation Functions
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.price;
    const taxAmount = itemTotal * (item.tax / 100);
    return sum + itemTotal + taxAmount;
  }, 0);
};

export const calculateTotal = (subtotal, globalTaxRate = 0) => {
  const globalTaxAmount = subtotal * (globalTaxRate / 100);
  return subtotal + globalTaxAmount;
};

// Date Formatting
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Data Validation
export const validateInvoiceData = (data) => {
  const errors = [];

  if (!data.companyInfo.name) {
    errors.push('Company name is required');
  }

  if (!data.selectedClient) {
    errors.push('Client must be selected');
  }

  if (!data.items.length) {
    errors.push('At least one item is required');
  }

  data.items.forEach((item, index) => {
    if (!item.description) {
      errors.push(`Item ${index + 1} description is required`);
    }
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1} quantity must be greater than 0`);
    }
    if (item.price < 0) {
      errors.push(`Item ${index + 1} price cannot be negative`);
    }
  });

  return errors;
};

// Export Data
export const exportInvoiceData = (data) => {
  const exportData = {
    ...data,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${data.invoiceNumber}-export.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Import Data
export const importInvoiceData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        // Add validation here if needed
        resolve(importedData);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};