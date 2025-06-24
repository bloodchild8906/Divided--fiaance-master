﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import React, { useState, useEffect } from 'react';
import { BulletproofPDFDownload } from './BulletproofPDFWrapper';
import UltraSafePDF from './UltraSafePDF';
import { loadInvoiceHistory, deleteInvoice, exportInvoices, importInvoices, updatePaymentStatus } from '../utils/invoiceStorage';
import { formatCurrency } from '../utils/storage';

const InvoiceHistory = ({ onLoadInvoice }) => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState(new Set());
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [partialAmount, setPartialAmount] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusInvoice, setStatusInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    const history = loadInvoiceHistory();
    setInvoices(history);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
      loadInvoices();
    }
  };

  const handleExport = () => {
    const selectedInvoicesList = invoices.filter(inv => selectedInvoices.has(inv.id));
    exportInvoices(selectedInvoicesList.length > 0 ? selectedInvoicesList : invoices);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importInvoices(file).then(result => {
        if (result.success) {
          loadInvoices();
          alert(`Successfully imported ${result.count} invoices`);
        } else {
          alert('Error importing invoices: ' + result.error);
        }
      });
    }
  };

  const handlePaymentStatusChange = (invoice, status) => {
    if (status === 'partial') {
      setSelectedInvoice(invoice);
      setShowPartialModal(true);
    } else {
      updatePaymentStatus(invoice.id, status);
      loadInvoices();
    }
  };

  const handlePartialPayment = () => {
    const amount = parseFloat(partialAmount);
    if (amount > 0 && selectedInvoice) {
      updatePaymentStatus(selectedInvoice.id, 'partial', null, amount);
      setShowPartialModal(false);
      setPartialAmount('');
      setSelectedInvoice(null);
      loadInvoices();
    }
  };

  const handleStatusChange = (invoice) => {
    setStatusInvoice(invoice);
    setShowStatusModal(true);
  };

  const handleQuickStatusUpdate = (status) => {
    if (statusInvoice) {
      if (status === 'partial') {
        setSelectedInvoice(statusInvoice);
        setShowStatusModal(false);
        setShowPartialModal(true);
      } else {
        updatePaymentStatus(statusInvoice.id, status);
        setShowStatusModal(false);
        setStatusInvoice(null);
        loadInvoices();
      }
    }
  };

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

  const toggleSelectAll = () => {
    if (selectedInvoices.size === filteredInvoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(filteredInvoices.map(inv => inv.id)));
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedInvoices);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInvoices(newSelected);
  };

  const filteredInvoices = invoices
    .filter(invoice => 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.selectedClient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortDir === 'asc' ? 
        (aValue > bValue ? 1 : -1) :
        (aValue < bValue ? 1 : -1);
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice History</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search invoices..."
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <img src="https://img.icons8.com/stickers/16/000000/export.png" alt="Export" className="w-4 h-4 mr-2" />
            Export Selected
          </button>
          <label className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer transition-colors duration-200">
            <img src="https://img.icons8.com/stickers/16/000000/import.png" alt="Import" className="w-4 h-4 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedInvoices.size === filteredInvoices.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer dark:text-gray-400"
                onClick={() => {
                  if (sortBy === 'invoiceNumber') {
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('invoiceNumber');
                    setSortDir('asc');
                  }
                }}
              >
                Invoice Number
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer dark:text-gray-400"
                onClick={() => {
                  if (sortBy === 'createdAt') {
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('createdAt');
                    setSortDir('desc');
                  }
                }}
              >
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Payment Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.has(invoice.id)}
                    onChange={() => toggleSelect(invoice.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {formatDate(invoice.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {invoice.selectedClient?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {formatCurrency(calculateInvoiceTotal(invoice), invoice.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      invoice.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : invoice.paymentStatus === 'partial'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {invoice.paymentStatus === 'paid' ? '✅ Paid' :
                       invoice.paymentStatus === 'partial' ? '🔄 Partial' : '⏳ Unpaid'}
                    </span>
                    <select
                      value={invoice.paymentStatus || 'unpaid'}
                      onChange={(e) => handlePaymentStatusChange(invoice, e.target.value)}
                      className="text-xs border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onLoadInvoice(invoice)}
                      className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 text-xs px-2 py-1 border border-primary-300 rounded hover:bg-primary-50 dark:border-primary-600 dark:hover:bg-primary-900"
                      title="Edit Invoice"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStatusChange(invoice)}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-900"
                      title="Set Payment Status"
                    >
                      Status
                    </button>
                    <BulletproofPDFDownload
                      fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                      className="text-green-600 hover:text-green-900 dark:hover:text-green-400 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50 dark:border-green-600 dark:hover:bg-green-900"
                      title="Download PDF"
                    >
                      <UltraSafePDF invoice={invoice} />
                    </BulletproofPDFDownload>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50 dark:border-red-600 dark:hover:bg-red-900"
                      title="Delete Invoice"
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

      {/* Partial Payment Modal */}
      {showPartialModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Record Partial Payment
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Invoice: {selectedInvoice?.invoiceNumber}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Total Amount: {formatCurrency(calculateInvoiceTotal(selectedInvoice || {}), selectedInvoice?.currency)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Already Paid: {formatCurrency(selectedInvoice?.totalPaid || 0, selectedInvoice?.currency)}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter payment amount"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPartialModal(false);
                    setPartialAmount('');
                    setSelectedInvoice(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePartialPayment}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Set Payment Status
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Invoice: <span className="font-semibold">{statusInvoice?.invoiceNumber}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Client: <span className="font-semibold">{statusInvoice?.selectedClient?.name}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Amount: <span className="font-semibold">{formatCurrency(calculateInvoiceTotal(statusInvoice || {}), statusInvoice?.currency)}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Current Status: <span className={`px-2 py-1 text-xs rounded-full ${
                    statusInvoice?.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : statusInvoice?.paymentStatus === 'partial'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {statusInvoice?.paymentStatus === 'paid' ? '✅ Paid' :
                     statusInvoice?.paymentStatus === 'partial' ? '🔄 Partial' : '⏳ Unpaid'}
                  </span>
                </p>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select New Status:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleQuickStatusUpdate('unpaid')}
                    className="w-full px-4 py-3 text-left border border-yellow-300 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:border-yellow-600 dark:hover:bg-yellow-900"
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">⏳</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Mark as Unpaid</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Invoice is not paid</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickStatusUpdate('partial')}
                    className="w-full px-4 py-3 text-left border border-orange-300 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-orange-600 dark:hover:bg-orange-900"
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">🔄</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Record Partial Payment</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Enter partial payment amount</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickStatusUpdate('paid')}
                    className="w-full px-4 py-3 text-left border border-green-300 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-green-600 dark:hover:bg-green-900"
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">✅</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Mark as Paid</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Invoice is fully paid</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusInvoice(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceHistory;
