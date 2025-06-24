import React, { useState } from 'react';
import ClientSection from './sections/ClientSection';
import ItemsSection from './sections/ItemsSection';
import DiscountSection from './DiscountSection';
import InvoicePreviewModal from './InvoicePreviewModal';
import { BulletproofPDFDownload } from './BulletproofPDFWrapper';
import UltraSafePDF from './UltraSafePDF';

const InvoiceForm = ({ invoiceData, onUpdateInvoice }) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleChange = (field, value) => {
    onUpdateInvoice({
      ...invoiceData,
      [field]: value
    });
  };

  const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const sectionClasses = "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Section */}
      <div className="w-full space-y-8">
          {/* Invoice Header */}
          <div className={sectionClasses}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice Details</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the basic invoice information below.</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative group">
                  <label htmlFor="invoiceNumber" className={labelClasses}>Invoice Number</label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                    className={inputClasses}
                    placeholder="INV-001"
                  />
                  <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Enter a unique invoice number
                  </div>
                </div>
                <div>
                  <label htmlFor="currency" className={labelClasses}>Currency</label>
                  <input
                    type="text"
                    id="currency"
                    value={invoiceData.currency}
                    disabled
                    className={`${inputClasses} bg-gray-50 dark:bg-gray-600 cursor-not-allowed`}
                  />
                </div>
                <div>
                  <label htmlFor="issueDate" className={labelClasses}>Issue Date</label>
                  <input
                    type="date"
                    id="issueDate"
                    value={invoiceData.issueDate}
                    onChange={(e) => handleChange('issueDate', e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className={labelClasses}>Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={invoiceData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Section */}
          <div className={sectionClasses}>
            <ClientSection
              selectedClient={invoiceData.selectedClient}
              clientList={invoiceData.clientList}
              onUpdateInvoice={(newData) => {
                onUpdateInvoice({
                  ...invoiceData,
                  ...newData
                });
              }}
            />
          </div>

          {/* Items Section */}
          <div className={sectionClasses}>
            <ItemsSection
              items={invoiceData.items}
              currency={invoiceData.currency}
              onUpdateInvoice={(newItems) => {
                onUpdateInvoice({
                  ...invoiceData,
                  items: newItems
                });
              }}
            />
          </div>

          {/* Discount Section */}
          <div className={sectionClasses}>
            <DiscountSection
              discount={invoiceData.discount}
              selectedClient={invoiceData.selectedClient}
              onUpdateDiscount={(discount) => {
                onUpdateInvoice({
                  ...invoiceData,
                  discount
                });
              }}
            />
          </div>

          {/* Terms and Notes */}
          <div className={sectionClasses}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Information</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add any terms, conditions, or notes to your invoice.</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="terms" className={labelClasses}>Terms & Conditions</label>
                <textarea
                  id="terms"
                  rows={3}
                  value={invoiceData.terms}
                  onChange={(e) => handleChange('terms', e.target.value)}
                  className={inputClasses}
                  placeholder="Enter your payment terms and conditions"
                />
              </div>
              <div>
                <label htmlFor="notes" className={labelClasses}>Notes</label>
                <textarea
                  id="notes"
                  rows={3}
                  value={invoiceData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className={inputClasses}
                  placeholder="Add any additional notes or information"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <BulletproofPDFDownload
              fileName={`invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              fallbackMessage="PDF download temporarily unavailable. Please try again."
            >
              <UltraSafePDF invoice={invoiceData} />
            </BulletproofPDFDownload>
          </div>
        </div>

        {/* Preview Modal */}
        <InvoicePreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          invoice={invoiceData}
        />
    </div>
  );
};

export default InvoiceForm;