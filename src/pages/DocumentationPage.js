﻿﻿﻿import React, { useState } from 'react';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'creating-invoices', title: 'Creating Invoices', icon: '📄' },
    { id: 'managing-clients', title: 'Managing Clients', icon: '👥' },
    { id: 'data-management', title: 'Data Management', icon: '💾' },
    { id: 'customization', title: 'Customization', icon: '🎨' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
    { id: 'api-reference', title: 'Technical Reference', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
              🚀 Getting Started
            </h2>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Welcome to Divided Finance Master
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  Divided Finance Master is a complete open-source invoicing system that runs entirely in your browser. 
                  No sign-up required, no data sent to servers - everything stays private and under your control.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  First Steps
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li>Navigate to the "Create Invoice" page</li>
                  <li>Fill in your company information (this will be saved for future invoices)</li>
                  <li>Add your first client using the client management system</li>
                  <li>Create your first invoice by adding items and setting prices</li>
                  <li>Export to PDF or save for later</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Key Features Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">Privacy First</h4>
                    <p className="text-sm text-primary-700 dark:text-primary-300">All data stored locally in your browser</p>
                  </div>
                  <div className="bg-accent-50 dark:bg-accent-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-accent-800 dark:text-accent-200 mb-2">Professional PDFs</h4>
                    <p className="text-sm text-accent-700 dark:text-accent-300">Generate beautiful, professional invoices</p>
                  </div>
                  <div className="bg-secondary-50 dark:bg-secondary-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Client Management</h4>
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">Organize and manage your customers</p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">Analytics Dashboard</h4>
                    <p className="text-sm text-primary-700 dark:text-primary-300">Track your business performance</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'creating-invoices':
        return (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
              📄 Creating Invoices
            </h2>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Invoice Form Overview
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  The invoice creation form is divided into several sections for easy organization:
                </p>
                <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li><strong>Company Information:</strong> Your business details and logo</li>
                  <li><strong>Client Selection:</strong> Choose from your saved clients or add new ones</li>
                  <li><strong>Invoice Details:</strong> Invoice number, dates, and terms</li>
                  <li><strong>Line Items:</strong> Products or services with quantities and rates</li>
                  <li><strong>Totals:</strong> Automatic calculation of subtotals, taxes, and totals</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Adding Line Items
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li>Click "Add Item" to create a new line item</li>
                  <li>Enter a description of the product or service</li>
                  <li>Set the quantity and rate (price per unit)</li>
                  <li>The total for each line will be calculated automatically</li>
                  <li>Use the remove button to delete unwanted items</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Invoice Numbers
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  Invoice numbers are automatically generated but can be customized. Best practices:
                </p>
                <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li>Use a consistent numbering system (e.g., INV-2024-001)</li>
                  <li>Include the year for easy organization</li>
                  <li>Keep numbers sequential for accounting purposes</li>
                  <li>Avoid duplicating invoice numbers</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Exporting and Saving
                </h3>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Export Options</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                    <li><strong>PDF Export:</strong> Generate a professional PDF for sending to clients</li>
                    <li><strong>Save Draft:</strong> Save incomplete invoices to finish later</li>
                    <li><strong>Auto-save:</strong> Changes are automatically saved as you type</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        );

      case 'managing-clients':
        return (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
              👥 Managing Clients
            </h2>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Adding New Clients
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li>Navigate to the "Clients" page</li>
                  <li>Click "Add New Client"</li>
                  <li>Fill in the client information form</li>
                  <li>Save the client for future use</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Client Information Fields
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">Required Fields</h4>
                    <ul className="list-disc list-inside space-y-1 text-secondary-700 dark:text-dark-text-secondary">
                      <li>Client Name</li>
                      <li>Email Address</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">Optional Fields</h4>
                    <ul className="list-disc list-inside space-y-1 text-secondary-700 dark:text-dark-text-secondary">
                      <li>Phone Number</li>
                      <li>Address</li>
                      <li>Company Name</li>
                      <li>Notes</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Editing and Deleting Clients
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  From the clients list, you can:
                </p>
                <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li>Click the edit button to modify client information</li>
                  <li>Use the delete button to remove clients (this won't affect existing invoices)</li>
                  <li>Search and filter clients using the search bar</li>
                  <li>View client history and statistics</li>
                </ul>
              </section>
            </div>
          </div>
        );

      case 'data-management':
        return (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
              💾 Data Management
            </h2>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Understanding Local Storage
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  All your data is stored locally in your browser using localStorage. This means:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Advantages</h4>
                    <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                      <li>Complete privacy</li>
                      <li>No internet required</li>
                      <li>Fast performance</li>
                      <li>No server costs</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Considerations</h4>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>Data is device-specific</li>
                      <li>Clearing browser data removes everything</li>
                      <li>Regular backups recommended</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Backup and Export
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  Regular backups are essential for data security:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li>Go to Settings → Data Management</li>
                  <li>Click "Export All Data"</li>
                  <li>Save the downloaded JSON file in a secure location</li>
                  <li>Consider cloud storage for additional security</li>
                  <li>Create backups before major browser updates</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Import and Restore
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  To restore data from a backup:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li>Go to Settings → Data Management</li>
                  <li>Click "Import Data"</li>
                  <li>Select your backup JSON file</li>
                  <li>Confirm the import (this will replace current data)</li>
                  <li>The page will refresh with your restored data</li>
                </ol>
              </section>
            </div>
          </div>
        );

      case 'customization':
        return (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
              🎨 Customization
            </h2>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Theme Customization
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  Customize the appearance to match your brand:
                </p>
                <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-dark-text-secondary">
                  <li>Choose from predefined color schemes</li>
                  <li>Upload your company logo</li>
                  <li>Customize invoice templates</li>
                  <li>Set default currency and language</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Company Branding
                </h3>
                <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">Logo Guidelines</h4>
                  <ul className="list-disc list-inside space-y-1 text-primary-700 dark:text-primary-300">
                    <li>Recommended size: 250x250 pixels or larger</li>
                    <li>Supported formats: PNG, JPG, SVG</li>
                    <li>Square or rectangular logos work best</li>
                    <li>High resolution for crisp PDF output</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
              🔧 Troubleshooting
            </h2>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Common Issues
                </h3>
                <div className="space-y-4">
                  <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">
                      Data disappeared after browser update
                    </h4>
                    <p className="text-secondary-700 dark:text-dark-text-secondary mb-2">
                      <strong>Solution:</strong> Check if you have a recent backup file and import it. 
                      For future protection, export your data regularly.
                    </p>
                  </div>
                  
                  <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">
                      PDF export not working
                    </h4>
                    <p className="text-secondary-700 dark:text-dark-text-secondary mb-2">
                      <strong>Solution:</strong> Ensure your browser allows downloads and pop-ups. 
                      Try refreshing the page and attempting the export again.
                    </p>
                  </div>
                  
                  <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">
                      Logo not displaying
                    </h4>
                    <p className="text-secondary-700 dark:text-dark-text-secondary mb-2">
                      <strong>Solution:</strong> Check that your logo file is in a supported format (PNG, JPG, SVG) 
                      and under 5MB in size.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'api-reference':
        return (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
              ⚙️ Technical Reference
            </h2>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Data Structure
                </h3>
                <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                  Understanding how data is stored can help with troubleshooting and custom integrations:
                </p>
                <div className="bg-secondary-50 dark:bg-secondary-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">localStorage Keys</h4>
                  <ul className="list-disc list-inside space-y-1 text-secondary-700 dark:text-secondary-300">
                    <li><code>invoiceHistory</code> - Array of all saved invoices</li>
                    <li><code>clientList</code> - Array of client information</li>
                    <li><code>companyInfo</code> - Company details and settings</li>
                    <li><code>theme</code> - Current theme preferences</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-3">
                  Browser Compatibility
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Supported Browsers</h4>
                    <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                      <li>Chrome 80+</li>
                      <li>Firefox 75+</li>
                      <li>Safari 13+</li>
                      <li>Edge 80+</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>JavaScript enabled</li>
                      <li>localStorage support</li>
                      <li>Modern CSS support</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      default:
        return <div>Select a section to view documentation.</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-secondary-200 to-secondary-400 dark:bg-gradient-dark">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-dark-text-primary mb-4">
          📚 Documentation
        </h1>
        <p className="text-lg text-secondary-600 dark:text-dark-text-secondary">
          Complete guide to using Divided Finance Master effectively.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center ${
                    activeSection === section.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-secondary-600 dark:text-dark-text-secondary hover:bg-secondary-50 dark:hover:bg-secondary-800'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
