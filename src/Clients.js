﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import React, { useState, useEffect } from 'react';
import {
  loadClients,
  addClient,
  updateClient,
  deleteClient,
  searchClients,
  validateClientData,
  exportClientsData,
  importClientsData,
  updateClientBalances
} from './utils/clientStorage';
import { loadInvoiceHistory } from './utils/invoiceStorage';
import { formatCurrency } from './utils/storage';
import { useToast } from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import ErrorBoundary from './ErrorBoundary';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: '',
    defaultDiscount: 0
  });
  const toast = useToast();

  // Load clients on component mount and update balances
  useEffect(() => {
    const loadedClients = loadClients();
    const invoices = loadInvoiceHistory();

    // Update client balances based on current invoices
    const updatedClients = updateClientBalances(invoices);

    setClients(updatedClients);
    setFilteredClients(updatedClients);
  }, []);

  // Filter clients when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = searchClients(searchTerm);
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  // Handle adding new client
  const handleAddClient = async (e) => {
    e.preventDefault();

    const errors = validateClientData(newClient);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      const addedClient = addClient(newClient);
      const updatedClients = loadClients();
      setClients(updatedClients);
      setNewClient({ name: '', email: '', phone: '', address: '', company: '', notes: '', defaultDiscount: 0 });
      setIsAddingClient(false);
      toast.success('Client added successfully!');
    } catch (error) {
      toast.error('Failed to add client');
    }
  };

  // Handle editing client
  const handleEditClient = async (e) => {
    e.preventDefault();

    const errors = validateClientData(editingClient);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      updateClient(editingClient.id, editingClient);
      const updatedClients = loadClients();
      setClients(updatedClients);
      setEditingClient(null);
      toast.success('Client updated successfully!');
    } catch (error) {
      toast.error('Failed to update client');
    }
  };

  // Handle deleting client
  const handleDeleteClient = async (clientId) => {
    try {
      deleteClient(clientId);
      const updatedClients = loadClients();
      setClients(updatedClients);
      setDeleteConfirm(null);
      toast.success('Client deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  // Handle export
  const handleExport = () => {
    try {
      exportClientsData();
      toast.success('Clients exported successfully!');
    } catch (error) {
      toast.error('Failed to export clients');
    }
  };

  const inputClasses = "mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-secondary-700 dark:text-dark-text-secondary";

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-secondary-200 to-secondary-400 dark:bg-gradient-dark">
        <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-dark-text-primary">Client Management</h1>
                <p className="text-secondary-600 dark:text-dark-text-secondary mt-2">
                  Manage your clients and their information. Changes sync across all invoices.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm text-sm font-medium text-secondary-700 dark:text-dark-text-primary bg-white dark:bg-dark-bg-secondary hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                >
                  📤 Export
                </button>
                <button
                  onClick={() => setIsAddingClient(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                >
                  ➕ Add Client
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className={`${inputClasses} pl-10`}
                  placeholder="Search clients by name, email, phone, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Client List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredClients.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-dark-text-primary mb-2">
                    {searchTerm ? 'No clients found' : 'No clients yet'}
                  </h3>
                  <p className="text-secondary-600 dark:text-dark-text-secondary">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first client to get started'}
                  </p>
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-text-primary">
                        {client.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingClient(client)}
                          className="text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                          title="Edit client"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(client)}
                          className="text-secondary-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete client"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-secondary-600 dark:text-dark-text-secondary">
                      {client.email && (
                        <div className="flex items-center">
                          <span className="mr-2">📧</span>
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center">
                          <span className="mr-2">📞</span>
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.company && (
                        <div className="flex items-center">
                          <span className="mr-2">🏢</span>
                          <span>{client.company}</span>
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center">
                          <span className="mr-2">📍</span>
                          <span>{client.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                      <div className="space-y-2">
                        {/* Unpaid Balance */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                            💰 Unpaid Balance:
                          </span>
                          <span className={`font-semibold ${
                            (client.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(client.balance || 0, 'USD')}
                          </span>
                        </div>

                        {/* Total Payments */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                            ✅ Total Payments:
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(client.totalPayments || 0, 'USD')}
                          </span>
                        </div>

                        {/* Total Revenue */}
                        <div className="flex justify-between items-center pt-2 border-t border-secondary-100 dark:border-secondary-600">
                          <span className="text-sm font-medium text-secondary-700 dark:text-dark-text-secondary">
                            📊 Total Revenue:
                          </span>
                          <span className="font-bold text-primary-600">
                            {formatCurrency((client.balance || 0) + (client.totalPayments || 0), 'USD')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Client Modal */}
        {isAddingClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-dark-text-primary">Add New Client</h2>
                  <button
                    onClick={() => setIsAddingClient(false)}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddClient} className="space-y-4">
                  <div>
                    <label className={labelClasses}>Client Name *</label>
                    <input
                      type="text"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter client name"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Email</label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Phone</label>
                    <input
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Company</label>
                    <input
                      type="text"
                      value={newClient.company}
                      onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Address</label>
                    <textarea
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Notes</label>
                    <textarea
                      value={newClient.notes}
                      onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter any notes"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Default Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={newClient.defaultDiscount}
                      onChange={(e) => setNewClient({ ...newClient, defaultDiscount: parseFloat(e.target.value) || 0 })}
                      className={inputClasses}
                      placeholder="0"
                    />
                    <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                      Default discount percentage for this client's invoices
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingClient(false)}
                      className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm font-medium text-secondary-700 dark:text-dark-text-primary hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                    >
                      Add Client
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Client Modal */}
        {editingClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-dark-text-primary">Edit Client</h2>
                  <button
                    onClick={() => setEditingClient(null)}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleEditClient} className="space-y-4">
                  <div>
                    <label className={labelClasses}>Client Name *</label>
                    <input
                      type="text"
                      value={editingClient.name}
                      onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter client name"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Email</label>
                    <input
                      type="email"
                      value={editingClient.email || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Phone</label>
                    <input
                      type="tel"
                      value={editingClient.phone || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Company</label>
                    <input
                      type="text"
                      value={editingClient.company || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Address</label>
                    <textarea
                      value={editingClient.address || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Notes</label>
                    <textarea
                      value={editingClient.notes || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                      className={inputClasses}
                      placeholder="Enter any notes"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Default Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={editingClient.defaultDiscount || 0}
                      onChange={(e) => setEditingClient({ ...editingClient, defaultDiscount: parseFloat(e.target.value) || 0 })}
                      className={inputClasses}
                      placeholder="0"
                    />
                    <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                      Default discount percentage for this client's invoices
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingClient(null)}
                      className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm font-medium text-secondary-700 dark:text-dark-text-primary hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                    >
                      Update Client
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <ConfirmDialog
            isOpen={true}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={() => handleDeleteClient(deleteConfirm.id)}
            title="Delete Client"
            message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
            confirmText="Delete"
            confirmButtonClass="bg-red-600 hover:bg-red-700"
          />
        )}
      </div>
    </ErrorBoundary>
  );
}