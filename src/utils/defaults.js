import { loadFromLocalStorage, saveToLocalStorage } from './storage';

// Default company information
export const defaultCompanyInfo = {
  name: 'Your Company Name',
  address: '123 Business Street\nCity, State 12345\nCountry',
  phone: '+1 (234) 567-8900',
  email: 'contact@yourcompany.com',
  website: 'www.yourcompany.com',
  logo: null,
  paymentInfo: {
    bankName: 'International Bank',
    accountName: 'Your Company Ltd',
    accountNumber: '1234567890',
    sortCode: '12-34-56',
    iban: 'GB12ABCD12345612345678',
    swift: 'ABCDGB12'
  }
};

// Default theme settings
export const defaultTheme = {
  primaryColor: '#0ea5e9',
  fontFamily: 'Arial',
  fontSize: '14px'
};

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Function to fetch and cache currencies
export const fetchCurrencies = async () => {
  const cachedData = loadFromLocalStorage('currencyCache');
  
  if (cachedData && cachedData.timestamp && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    return cachedData.currencies;
  }

  try {
    // Using exchangerate-api.com for currency data
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    
    const currencies = Object.keys(data.rates).map(code => ({
      code,
      name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(code)
    }));

    // Cache the results
    saveToLocalStorage('currencyCache', {
      currencies,
      timestamp: Date.now()
    });

    return currencies;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    
    // Fallback to common currencies if API fails
    return [
      {code: 'ZAR', name: 'South African Rand'},
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'GBP', name: 'British Pound' },
      { code: 'JPY', name: 'Japanese Yen' },
      { code: 'CAD', name: 'Canadian Dollar' },
      { code: 'AUD', name: 'Australian Dollar' },
      { code: 'CHF', name: 'Swiss Franc' },
      { code: 'CNY', name: 'Chinese Yuan' }
    ];
  }
};

// Sample invoice data for preview
export const sampleInvoiceData = {
  items: [
    {
      description: 'Professional Services',
      quantity: 10,
      rate: 150,
      amount: 1500
    },
    {
      description: 'Consulting Fee',
      quantity: 5,
      rate: 200,
      amount: 1000
    }
  ],
  currency: 'USD',
  invoiceNumber: 'INV-2024-001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  terms: 'Net 30',
  notes: 'Thank you for your business!'
};