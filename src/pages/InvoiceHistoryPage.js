﻿﻿﻿﻿﻿﻿import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadInvoiceHistory, deleteInvoice, exportInvoices, updatePaymentStatus } from '../utils/invoiceStorage';
import { formatCurrency } from '../utils/storage';
import { useToast } from '../components/Toast';
import Loading, { TableSkeleton } from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import InvoicePreviewModal from '../components/InvoicePreviewModal';

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const history = loadInvoiceHistory();
      setInvoices(history);
    } catch (error) {
      toast.error('Failed to load invoice history');
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      const success = deleteInvoice(invoiceId);
      if (success) {
        setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
        toast.success('Invoice deleted successfully');
      } else {
        toast.error('Failed to delete invoice');
      }
    } catch (error) {
      toast.error('Error deleting invoice');
      console.error('Error deleting invoice:', error);
    }
    setShowDeleteDialog(false);
    setInvoiceToDelete(null);
  };

  const handleBulkDelete = async () => {
    try {
      for (const invoiceId of selectedInvoices) {
        deleteInvoice(invoiceId);
      }
      setInvoices(prev => prev.filter(inv => !selectedInvoices.includes(inv.id)));
      setSelectedInvoices([]);
      toast.success(`${selectedInvoices.length} invoices deleted successfully`);
    } catch (error) {
      toast.error('Error deleting invoices');
      console.error('Error deleting invoices:', error);
    }
  };

  const handleExport = () => {
    try {
      const invoicesToExport = selectedInvoices.length > 0
        ? invoices.filter(inv => selectedInvoices.includes(inv.id))
        : invoices;

      exportInvoices(invoicesToExport);
      toast.success(`Exported ${invoicesToExport.length} invoices`);
    } catch (error) {
      toast.error('Error exporting invoices');
      console.error('Error exporting invoices:', error);
    }
  };

  const handlePaymentStatusChange = async (invoiceId, newStatus) => {
    try {
      const success = updatePaymentStatus(invoiceId, newStatus);
      if (success) {
        setInvoices(prev => prev.map(inv =>
          inv.id === invoiceId
            ? {
                ...inv,
                paymentStatus: newStatus,
                paymentDate: newStatus === 'paid' ? new Date().toISOString() : null
              }
            : inv
        ));
        toast.success(`Invoice marked as ${newStatus}`);
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      toast.error('Error updating payment status');
      console.error('Error updating payment status:', error);
    }
  };

  const handlePreviewInvoice = (invoice) => {
    setPreviewInvoice(invoice);
    setShowPreviewModal(true);
  };

  const calculateTotal = (items = []) => {
    return items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.rate || 0)), 0);
  };

  const filteredAndSortedInvoices = invoices
    .filter(invoice => {
      const searchLower = searchTerm.toLowerCase();
      return (
        invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
        invoice.selectedClient?.name?.toLowerCase().includes(searchLower) ||
        invoice.companyInfo?.name?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'total') {
        aValue = calculateTotal(a.items);
        bValue = calculateTotal(b.items);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredAndSortedInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredAndSortedInvoices.map(inv => inv.id));
    }
  };

  const toggleSelectInvoice = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice History</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage and view your invoice history</p>
        </div>
        <TableSkeleton rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice History</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {invoices.length} total invoices
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              📤 Export
            </button>
            <Link
              to="/invoices"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              ➕ New Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="createdAt">Date Created</option>
            <option value="invoiceNumber">Invoice Number</option>
            <option value="total">Total Amount</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-200">
              {selectedInvoices.length} invoice(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedInvoices([])}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Table */}
      {filteredAndSortedInvoices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first invoice'}
          </p>
          <Link
            to="/invoices"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Invoice
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredAndSortedInvoices.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={() => toggleSelectInvoice(invoice.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.invoiceNumber || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {invoice.selectedClient?.name || 'No client'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(calculateTotal(invoice.items), invoice.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {invoice.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                      <button
                        onClick={() => handlePaymentStatusChange(
                          invoice.id,
                          invoice.paymentStatus === 'paid' ? 'unpaid' : 'paid'
                        )}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title={`Mark as ${invoice.paymentStatus === 'paid' ? 'unpaid' : 'paid'}`}
                      >
                        Toggle
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewInvoice(invoice)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Preview
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setInvoiceToDelete(invoice.id);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => handleDeleteInvoice(invoiceToDelete)}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />

      {/* Preview Modal */}
      <InvoicePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        invoice={previewInvoice}
      />
    </div>
  );
};

export default InvoiceHistoryPage;
