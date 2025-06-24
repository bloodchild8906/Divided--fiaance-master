export const defaultFonts = [
  { name: 'Helvetica', value: 'Helvetica' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Courier New', value: 'Courier New' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' }
];

export const fontSizes = {
  small: '12px',
  medium: '14px',
  large: '16px',
  'x-large': '18px'
};

export const displayOptions = {
  showLogo: { label: 'Company Logo', default: true },
  showHeader: { label: 'Invoice Header', default: true },
  showFooter: { label: 'Invoice Footer', default: true },
  showPaymentDetails: { label: 'Payment Details', default: true },
  showNotes: { label: 'Notes Section', default: true },
  showTax: { label: 'Tax Calculation', default: true },
  showSignature: { label: 'Signature Line', default: false },
  showDates: { label: 'Issue & Due Dates', default: true },
  showInvoiceNumber: { label: 'Invoice Number', default: true },
  showItemDescription: { label: 'Item Descriptions', default: true }
};

// Store custom fonts in localStorage
const CUSTOM_FONTS_KEY = 'custom_fonts';

export const loadCustomFonts = () => {
  try {
    const stored = localStorage.getItem(CUSTOM_FONTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom fonts:', error);
    return [];
  }
};

export const saveCustomFonts = (fonts) => {
  try {
    localStorage.setItem(CUSTOM_FONTS_KEY, JSON.stringify(fonts));
  } catch (error) {
    console.error('Error saving custom fonts:', error);
  }
};

export const addCustomFont = (name, url) => {
  const customFonts = loadCustomFonts();
  customFonts.push({ name, url });
  saveCustomFonts(customFonts);
  
  // Add font to document
  const link = document.createElement('link');
  link.href = url;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

export const removeCustomFont = (name) => {
  const customFonts = loadCustomFonts();
  const updatedFonts = customFonts.filter(font => font.name !== name);
  saveCustomFonts(updatedFonts);
};
