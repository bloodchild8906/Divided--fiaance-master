// Simple test to verify PDF generation works
const testData = {
  companyInfo: {
    name: 'Test Company',
    address: '123 Test Street\nTest City, TC 12345',
    phone: '+1 (555) 123-4567',
    email: 'test@company.com',
    website: 'www.testcompany.com'
  },
  selectedClient: {
    name: 'Test Client',
    company: 'Client Company Inc.',
    address: '456 Client Avenue\nClient City, CC 67890\nUnited States',
    email: 'client@example.com',
    phone: '+1 (555) 987-6543'
  },
  items: [
    {
      description: 'Professional Services',
      quantity: 10,
      rate: 150
    },
    {
      description: 'Consulting Fee',
      quantity: 5,
      rate: 200
    }
  ],
  currency: 'USD',
  invoiceNumber: 'INV-2024-001',
  issueDate: '2024-06-24',
  dueDate: '2024-07-24',
  terms: 'Net 30 days',
  notes: 'Thank you for your business!',
  theme: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#374151',
    fontFamily: 'Inter',
    fontSize: '11',
    display: {
      showHeader: true,
      showLogo: false,
      showInvoiceNumber: true,
      showDates: true,
      showItemDescription: true,
      showTax: true,
      showNotes: true,
      showPaymentDetails: false,
      showSignature: false
    }
  }
};

console.log('Test data prepared for PDF generation:', testData);
