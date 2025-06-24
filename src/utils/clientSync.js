// Client synchronization utilities
import { loadClients, saveClients } from './clientStorage';
import { loadFromLocalStorage, saveToLocalStorage } from './storage';

/**
 * Synchronize clients between invoice data and unified client storage
 */
export const syncClients = () => {
  try {
    // Get clients from unified storage
    const unifiedClients = loadClients();
    
    // Get invoice data
    const invoiceData = loadFromLocalStorage('invoiceData') || {};
    
    // Update invoice data with unified clients
    const updatedInvoiceData = {
      ...invoiceData,
      clientList: unifiedClients
    };
    
    // Save updated invoice data
    saveToLocalStorage('invoiceData', updatedInvoiceData);
    
    return unifiedClients;
  } catch (error) {
    console.error('Error syncing clients:', error);
    return [];
  }
};

/**
 * Ensure a client exists in unified storage
 */
export const ensureClientInStorage = (client) => {
  try {
    const clients = loadClients();
    const existingClient = clients.find(c => c.id === client.id);
    
    if (!existingClient) {
      // Add client to unified storage
      const updatedClients = [...clients, {
        ...client,
        createdAt: client.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
      
      saveClients(updatedClients);
      syncClients(); // Sync with invoice data
      
      return updatedClients;
    }
    
    return clients;
  } catch (error) {
    console.error('Error ensuring client in storage:', error);
    return loadClients();
  }
};

/**
 * Update client in all locations
 */
export const updateClientEverywhere = (clientId, updates) => {
  try {
    const clients = loadClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }
    
    // Update client in unified storage
    const updatedClient = {
      ...clients[clientIndex],
      ...updates,
      id: clientId,
      updatedAt: new Date().toISOString()
    };
    
    const updatedClients = [...clients];
    updatedClients[clientIndex] = updatedClient;
    
    saveClients(updatedClients);
    
    // Sync with invoice data
    syncClients();
    
    // Update any existing invoices with this client
    updateInvoicesWithClient(updatedClient);
    
    return updatedClient;
  } catch (error) {
    console.error('Error updating client everywhere:', error);
    throw error;
  }
};

/**
 * Remove client from all locations
 */
export const removeClientEverywhere = (clientId) => {
  try {
    const clients = loadClients();
    const updatedClients = clients.filter(c => c.id !== clientId);
    
    saveClients(updatedClients);
    
    // Sync with invoice data
    syncClients();
    
    // Update invoice history to remove client references
    updateInvoiceHistoryRemoveClient(clientId);
    
    return updatedClients;
  } catch (error) {
    console.error('Error removing client everywhere:', error);
    throw error;
  }
};

/**
 * Update invoices that reference a specific client
 */
const updateInvoicesWithClient = (updatedClient) => {
  try {
    const invoiceHistory = loadFromLocalStorage('invoiceHistory') || [];
    let hasUpdates = false;
    
    const updatedHistory = invoiceHistory.map(invoice => {
      if (invoice.selectedClient && invoice.selectedClient.id === updatedClient.id) {
        hasUpdates = true;
        return {
          ...invoice,
          selectedClient: updatedClient
        };
      }
      return invoice;
    });
    
    if (hasUpdates) {
      saveToLocalStorage('invoiceHistory', updatedHistory);
    }
  } catch (error) {
    console.error('Error updating invoices with client:', error);
  }
};

/**
 * Remove client references from invoice history
 */
const updateInvoiceHistoryRemoveClient = (clientId) => {
  try {
    const invoiceHistory = loadFromLocalStorage('invoiceHistory') || [];
    let hasUpdates = false;
    
    const updatedHistory = invoiceHistory.map(invoice => {
      if (invoice.selectedClient && invoice.selectedClient.id === clientId) {
        hasUpdates = true;
        return {
          ...invoice,
          selectedClient: null
        };
      }
      return invoice;
    });
    
    if (hasUpdates) {
      saveToLocalStorage('invoiceHistory', updatedHistory);
    }
  } catch (error) {
    console.error('Error removing client from invoice history:', error);
  }
};

/**
 * Get client usage statistics
 */
export const getClientUsageStats = (clientId) => {
  try {
    const invoiceHistory = loadFromLocalStorage('invoiceHistory') || [];
    
    const clientInvoices = invoiceHistory.filter(
      invoice => invoice.selectedClient && invoice.selectedClient.id === clientId
    );
    
    const totalRevenue = clientInvoices.reduce((sum, invoice) => {
      return sum + (invoice.items || []).reduce((itemSum, item) => 
        itemSum + ((item.quantity || 0) * (item.rate || 0)), 0);
    }, 0);
    
    return {
      invoiceCount: clientInvoices.length,
      totalRevenue,
      lastInvoiceDate: clientInvoices.length > 0 
        ? clientInvoices[clientInvoices.length - 1].createdAt 
        : null,
      canDelete: clientInvoices.length === 0
    };
  } catch (error) {
    console.error('Error getting client usage stats:', error);
    return {
      invoiceCount: 0,
      totalRevenue: 0,
      lastInvoiceDate: null,
      canDelete: true
    };
  }
};

/**
 * Initialize client synchronization
 */
export const initializeClientSync = () => {
  try {
    // Perform initial sync
    const clients = syncClients();
    
    // Set up periodic sync (every 30 seconds)
    const syncInterval = setInterval(() => {
      syncClients();
    }, 30000);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(syncInterval);
      syncClients(); // Final sync
    });
    
    return clients;
  } catch (error) {
    console.error('Error initializing client sync:', error);
    return [];
  }
};

/**
 * Force a manual sync
 */
export const forceClientSync = () => {
  return syncClients();
};
