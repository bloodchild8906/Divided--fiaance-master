﻿﻿﻿﻿﻿﻿﻿﻿import { updateClientBalances } from './clientStorage';

const INVOICE_HISTORY_KEY = 'invoice_history';

export const saveInvoiceToHistory = (invoice) => {
  try {
    const history = loadInvoiceHistory();
    const timestamp = new Date().toISOString();
    const invoiceWithMetadata = {
      ...invoice,
      id: `INV-${timestamp}`,
      createdAt: timestamp,
      status: 'created',
      paymentStatus: 'unpaid',
      paymentDate: null,
      discount: invoice.discount || { type: 'none', value: 0, clientDiscount: 0 }
    };

    history.unshift(invoiceWithMetadata);
    localStorage.setItem(INVOICE_HISTORY_KEY, JSON.stringify(history));

    // Update client balances after saving invoice
    updateClientBalancesFromInvoices(history);

    return invoiceWithMetadata;
  } catch (error) {
    console.error('Error saving invoice:', error);
    return null;
  }
};

export const loadInvoiceHistory = () => {
  try {
    const history = localStorage.getItem(INVOICE_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading invoice history:', error);
    return [];
  }
};

export const deleteInvoice = (invoiceId) => {
  try {
    const history = loadInvoiceHistory();
    const updatedHistory = history.filter(inv => inv.id !== invoiceId);
    localStorage.setItem(INVOICE_HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
};

export const exportInvoices = (invoices) => {
  const data = JSON.stringify(invoices, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoices-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importInvoices = async (file) => {
  try {
    const text = await file.text();
    const importedInvoices = JSON.parse(text);
    const history = loadInvoiceHistory();

    // Add new invoices to history, avoiding duplicates
    const updatedHistory = [
      ...history,
      ...importedInvoices.filter(imported =>
        !history.some(existing => existing.id === imported.id)
      )
    ];

    localStorage.setItem(INVOICE_HISTORY_KEY, JSON.stringify(updatedHistory));
    return { success: true, count: importedInvoices.length };
  } catch (error) {
    console.error('Error importing invoices:', error);
    return { success: false, error: error.message };
  }
};

// Update payment status of an invoice with partial payment support
export const updatePaymentStatus = (invoiceId, paymentStatus, paymentDate = null, partialAmount = null) => {
  try {
    const history = loadInvoiceHistory();
    const updatedHistory = history.map(invoice => {
      if (invoice.id === invoiceId) {
        const updatedInvoice = {
          ...invoice,
          paymentStatus,
          paymentDate: (paymentStatus === 'paid' || paymentStatus === 'partial') ? (paymentDate || new Date().toISOString()) : null,
          updatedAt: new Date().toISOString()
        };

        // Handle partial payments
        if (paymentStatus === 'partial' && partialAmount !== null) {
          updatedInvoice.partialPayments = updatedInvoice.partialPayments || [];
          updatedInvoice.partialPayments.push({
            amount: partialAmount,
            date: paymentDate || new Date().toISOString(),
            id: Date.now()
          });
          updatedInvoice.totalPaid = updatedInvoice.partialPayments.reduce((sum, payment) => sum + payment.amount, 0);
        } else if (paymentStatus === 'paid') {
          // Mark as fully paid
          updatedInvoice.totalPaid = calculateInvoiceTotal(invoice);
        } else if (paymentStatus === 'unpaid') {
          // Reset payment data
          updatedInvoice.partialPayments = [];
          updatedInvoice.totalPaid = 0;
        }

        return updatedInvoice;
      }
      return invoice;
    });

    localStorage.setItem(INVOICE_HISTORY_KEY, JSON.stringify(updatedHistory));

    // Update client balances after payment status change
    updateClientBalancesFromInvoices(updatedHistory);

    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    return false;
  }
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

// Update invoice with discount information
export const updateInvoiceDiscount = (invoiceId, discount) => {
  try {
    const history = loadInvoiceHistory();
    const updatedHistory = history.map(invoice => {
      if (invoice.id === invoiceId) {
        return {
          ...invoice,
          discount,
          updatedAt: new Date().toISOString()
        };
      }
      return invoice;
    });

    localStorage.setItem(INVOICE_HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error updating invoice discount:', error);
    return false;
  }
};

// Get invoice by ID
export const getInvoiceById = (invoiceId) => {
  try {
    const history = loadInvoiceHistory();
    return history.find(invoice => invoice.id === invoiceId) || null;
  } catch (error) {
    console.error('Error getting invoice:', error);
    return null;
  }
};

// Edit an existing invoice
export const editInvoice = (invoiceId, updatedInvoiceData) => {
  try {
    const history = loadInvoiceHistory();
    const updatedHistory = history.map(invoice => {
      if (invoice.id === invoiceId) {
        return {
          ...invoice,
          ...updatedInvoiceData,
          updatedAt: new Date().toISOString()
        };
      }
      return invoice;
    });

    localStorage.setItem(INVOICE_HISTORY_KEY, JSON.stringify(updatedHistory));

    // Update client balances after editing invoice
    updateClientBalancesFromInvoices(updatedHistory);

    return { success: true, invoice: updatedHistory.find(inv => inv.id === invoiceId) };
  } catch (error) {
    console.error('Error editing invoice:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to update client balances from invoices
const updateClientBalancesFromInvoices = (invoices) => {
  try {
    updateClientBalances(invoices);
  } catch (error) {
    console.error('Error updating client balances:', error);
  }
};
