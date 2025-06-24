import React, { useState, useEffect } from 'react';
import {
  loadClients,
  addClient,
  validateClientData
} from '../../utils/clientStorage';
import {
  updateClientEverywhere,
  removeClientEverywhere,
  ensureClientInStorage,
  forceClientSync
} from '../../utils/clientSync';
import { useToast } from '../Toast';

const ClientSection = ({ selectedClient, clientList, onUpdateInvoice }) => {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [unifiedClients, setUnifiedClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: ''
  });
  const toast = useToast();

  // Load unified clients on mount and sync
  useEffect(() => {
    const clients = forceClientSync(); // Force sync to ensure consistency
    setUnifiedClients(clients);

    // Ensure any invoice clients are in unified storage
    if (clientList && clientList.length > 0) {
      clientList.forEach(invoiceClient => {
        ensureClientInStorage(invoiceClient);
      });
      // Reload after ensuring all clients are in storage
      const updatedClients = loadClients();
      setUnifiedClients(updatedClients);
    }
  }, [clientList]);

  const handleSelectClient = (client) => {
    onUpdateInvoice({ selectedClient: client });
  };

  const handleAddClient = async () => {
    const errors = validateClientData(newClient);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      const addedClient = addClient(newClient);
      const updatedClients = loadClients();
      setUnifiedClients(updatedClients);

      // Update invoice data
      onUpdateInvoice({
        clientList: updatedClients,
        selectedClient: addedClient
      });

      setNewClient({ name: '', email: '', phone: '', address: '', company: '', notes: '' });
      setIsAddingClient(false);
      toast.success('Client added successfully!');
    } catch (error) {
      toast.error('Failed to add client');
    }
  };

  const handleEditClient = async () => {
    const errors = validateClientData(editingClient);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      const updatedClient = updateClientEverywhere(editingClient.id, editingClient);
      const updatedClients = loadClients();
      setUnifiedClients(updatedClients);

      // Update invoice data
      onUpdateInvoice({
        clientList: updatedClients,
        selectedClient: selectedClient?.id === editingClient.id ? updatedClient : selectedClient
      });

      setEditingClient(null);
      toast.success('Client updated successfully!');
    } catch (error) {
      toast.error('Failed to update client');
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      deleteClient(clientId);
      const updatedClients = loadClients();
      setUnifiedClients(updatedClients);

      // Update invoice data
      onUpdateInvoice({
        clientList: updatedClients,
        selectedClient: selectedClient?.id === clientId ? null : selectedClient
      });

      toast.success('Client deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  const filteredClients = unifiedClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="bg-gradient-to-br from-white to-secondary-50 dark:from-dark-bg-secondary dark:to-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://img.icons8.com/stickers/32/000000/group.png" alt="Clients" className="w-8 h-8 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-white">Client Information</h2>
              <p className="text-primary-100 text-sm">Select an existing client or add a new one</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingClient(true)}
            className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg shadow-sm text-sm font-medium text-white border border-white border-opacity-30 hover:border-opacity-50 transition-all duration-200"
          >
            <img src="https://img.icons8.com/stickers/24/000000/plus.png" alt="Add" className="w-5 h-5 mr-2" />
            Add New Client
          </button>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-dark-bg-secondary">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img src="https://img.icons8.com/stickers/24/000000/search.png" alt="Search" className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-700 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-300 transition-all duration-200"
              placeholder="Search clients by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Client List */}
        {!isAddingClient && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`relative rounded-xl border-2 ${
                  selectedClient?.id === client.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 shadow-lg ring-2 ring-primary-200 dark:ring-primary-800'
                    : 'border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800 hover:border-primary-300 hover:shadow-md'
                } p-6 cursor-pointer transition-all duration-300 transform hover:scale-105`}
                onClick={() => handleSelectClient(client)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <img src="https://img.icons8.com/stickers/32/000000/user.png" alt="Client" className="w-8 h-8 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{client.name}</h3>
                      {client.company && (
                        <p className="text-sm text-secondary-600 dark:text-secondary-300">{client.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingClient(client);
                      }}
                      className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-800 dark:hover:text-primary-300 transition-all duration-200"
                      title="Edit client"
                    >
                      <img src="https://img.icons8.com/stickers/16/000000/edit.png" alt="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client.id);
                      }}
                      className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-800 dark:hover:text-red-300 transition-all duration-200"
                      title="Delete client"
                    >
                      <img src="https://img.icons8.com/stickers/16/000000/trash.png" alt="Delete" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {client.email && (
                    <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-300">
                      <img src="https://img.icons8.com/stickers/16/000000/email.png" alt="Email" className="w-4 h-4 mr-2" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-300">
                      <img src="https://img.icons8.com/stickers/16/000000/phone.png" alt="Phone" className="w-4 h-4 mr-2" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start text-sm text-secondary-600 dark:text-secondary-300">
                      <img src="https://img.icons8.com/stickers/16/000000/marker.png" alt="Address" className="w-4 h-4 mr-2 mt-0.5" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}
                </div>

                {selectedClient?.id === client.id && (
                  <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
                        <img src="https://img.icons8.com/stickers/16/000000/checkmark.png" alt="Selected" className="w-4 h-4 mr-2" />
                        Selected Client
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Client Form */}
        {isAddingClient && (
          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-700 dark:to-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-600 shadow-inner">
            <div className="flex items-center mb-6">
              <img src="https://img.icons8.com/stickers/32/000000/plus.png" alt="Add Client" className="w-8 h-8 mr-3" />
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">Add New Client</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="clientName" className={labelClasses}>Client Name</label>
                <input
                  type="text"
                  id="clientName"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label htmlFor="clientEmail" className={labelClasses}>Email</label>
                <input
                  type="email"
                  id="clientEmail"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter client email"
                />
              </div>
              <div>
                <label htmlFor="clientPhone" className={labelClasses}>Phone</label>
                <input
                  type="tel"
                  id="clientPhone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter client phone"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="clientAddress" className={labelClasses}>Address</label>
                <textarea
                  id="clientAddress"
                  rows={3}
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter client address"
                />
              </div>
              <div>
                <label htmlFor="clientCompany" className={labelClasses}>Company</label>
                <input
                  type="text"
                  id="clientCompany"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter company name"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="clientNotes" className={labelClasses}>Notes</label>
                <textarea
                  id="clientNotes"
                  rows={2}
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter any notes"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingClient(false)}
                className="inline-flex items-center px-6 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-all duration-200"
              >
                <img src="https://img.icons8.com/stickers/16/000000/cancel.png" alt="Cancel" className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddClient}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              >
                <img src="https://img.icons8.com/stickers/16/000000/save.png" alt="Save" className="w-4 h-4 mr-2" />
                Save Client
              </button>
            </div>
          </div>
        )}

        {/* Edit Client Modal */}
        {editingClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Client</h2>
                  <button
                    onClick={() => setEditingClient(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
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

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingClient(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleEditClient}
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                    >
                      Update Client
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSection;