﻿﻿﻿// Unified client management system
import { saveToLocalStorage, loadFromLocalStorage } from './storage';

const CLIENTS_KEY = 'clientList';

// Load clients from localStorage
export const loadClients = () => {
  const clients = loadFromLocalStorage(CLIENTS_KEY) || [];
  
  // Also check for legacy 'clients' key and migrate if needed
  const legacyClients = loadFromLocalStorage('clients') || [];
  if (legacyClients.length > 0 && clients.length === 0) {
    // Migrate legacy clients to new format
    const migratedClients = legacyClients.map(client => ({
      id: client.id || Date.now() + Math.random(),
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      company: client.company || '',
      notes: client.notes || '',
      balance: client.balance || 0,
      createdAt: client.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    saveClients(migratedClients);
    // Remove legacy key
    localStorage.removeItem('clients');
    return migratedClients;
  }
  
  return clients;
};

// Save clients to localStorage
export const saveClients = (clients) => {
  saveToLocalStorage(CLIENTS_KEY, clients);
};

// Add a new client
export const addClient = (clientData) => {
  const clients = loadClients();
  const newClient = {
    id: Date.now() + Math.random(), // Ensure unique ID
    name: clientData.name || '',
    email: clientData.email || '',
    phone: clientData.phone || '',
    address: clientData.address || '',
    company: clientData.company || '',
    notes: clientData.notes || '',
    balance: 0, // Balance of unpaid invoices (calculated automatically)
    totalPayments: 0, // Total amount of payments received
    defaultDiscount: clientData.defaultDiscount || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedClients = [...clients, newClient];
  saveClients(updatedClients);
  return newClient;
};

// Update an existing client
export const updateClient = (clientId, updates) => {
  const clients = loadClients();
  const clientIndex = clients.findIndex(client => client.id === clientId);
  
  if (clientIndex === -1) {
    throw new Error('Client not found');
  }
  
  const updatedClient = {
    ...clients[clientIndex],
    ...updates,
    id: clientId, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  const updatedClients = [...clients];
  updatedClients[clientIndex] = updatedClient;
  
  saveClients(updatedClients);
  return updatedClient;
};

// Delete a client
export const deleteClient = (clientId) => {
  const clients = loadClients();
  const updatedClients = clients.filter(client => client.id !== clientId);
  saveClients(updatedClients);
  return updatedClients;
};

// Get a client by ID
export const getClientById = (clientId) => {
  const clients = loadClients();
  return clients.find(client => client.id === clientId) || null;
};

// Search clients
export const searchClients = (searchTerm) => {
  const clients = loadClients();
  const term = searchTerm.toLowerCase().trim();
  
  if (!term) return clients;
  
  return clients.filter(client => 
    client.name.toLowerCase().includes(term) ||
    client.email.toLowerCase().includes(term) ||
    client.phone.toLowerCase().includes(term) ||
    client.company.toLowerCase().includes(term)
  );
};

// Calculate client balance from invoices
export const calculateClientBalance = (clientId, invoices) => {
  if (!invoices || !Array.isArray(invoices)) return { balance: 0, totalPayments: 0 };

  const clientInvoices = invoices.filter(invoice =>
    invoice.selectedClient && invoice.selectedClient.id === clientId
  );

  let unpaidBalance = 0;
  let totalPayments = 0;

  clientInvoices.forEach(invoice => {
    const invoiceTotal = calculateInvoiceTotal(invoice);

    if (invoice.paymentStatus === 'paid') {
      totalPayments += invoiceTotal;
    } else {
      unpaidBalance += invoiceTotal;
    }
  });

  return {
    balance: unpaidBalance,
    totalPayments: totalPayments
  };
};

// Helper function to calculate invoice total
const calculateInvoiceTotal = (invoice) => {
  if (!invoice.items || !Array.isArray(invoice.items)) return 0;

  const subtotal = invoice.items.reduce((sum, item) => {
    return sum + ((Number(item.quantity) || 0) * (Number(item.rate) || 0));
  }, 0);

  // Apply discounts
  let discountAmount = 0;
  if (invoice.discount) {
    if (invoice.discount.clientDiscount > 0) {
      discountAmount += subtotal * (invoice.discount.clientDiscount / 100);
    }
    if (invoice.discount.type === 'percentage' && invoice.discount.value > 0) {
      discountAmount += subtotal * (invoice.discount.value / 100);
    } else if (invoice.discount.type === 'fixed' && invoice.discount.value > 0) {
      discountAmount += invoice.discount.value;
    }
  }

  const discountedSubtotal = subtotal - discountAmount;
  const tax = invoice.theme?.display?.showTax !== false ? discountedSubtotal * 0.1 : 0;

  return discountedSubtotal + tax;
};

// Update client balances based on current invoices
export const updateClientBalances = (invoices) => {
  const clients = loadClients();

  const updatedClients = clients.map(client => {
    const balanceData = calculateClientBalance(client.id, invoices);
    return {
      ...client,
      balance: balanceData.balance,
      totalPayments: balanceData.totalPayments,
      updatedAt: new Date().toISOString()
    };
  });

  saveClients(updatedClients);
  return updatedClients;
};

// Get client statistics
export const getClientStats = () => {
  const clients = loadClients();

  return {
    totalClients: clients.length,
    totalBalance: clients.reduce((sum, client) => sum + (client.balance || 0), 0),
    totalPayments: clients.reduce((sum, client) => sum + (client.totalPayments || 0), 0),
    recentClients: clients
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  };
};

// Validate client data
export const validateClientData = (clientData) => {
  const errors = [];
  
  if (!clientData.name || !clientData.name.trim()) {
    errors.push('Client name is required');
  }
  
  if (clientData.email && !isValidEmail(clientData.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (clientData.phone && !isValidPhone(clientData.phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  return errors;
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Export all clients data for backup
export const exportClientsData = () => {
  const clients = loadClients();
  const exportData = {
    clients,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    type: 'clients_backup'
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `clients-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return exportData;
};

// Import clients data from backup
export const importClientsData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importData = JSON.parse(event.target.result);
        
        if (importData.type === 'clients_backup' && importData.clients) {
          // Validate and import clients
          const validClients = importData.clients.filter(client => 
            client.name && typeof client.name === 'string'
          );
          
          if (validClients.length > 0) {
            saveClients(validClients);
            resolve({
              success: true,
              imported: validClients.length,
              message: `Successfully imported ${validClients.length} clients`
            });
          } else {
            reject(new Error('No valid clients found in backup file'));
          }
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse backup file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
