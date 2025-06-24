import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import FontInitializer from './FontInitializer';
import { sampleInvoiceData } from '../utils/defaults';

const InvoicePreview = ({ companyInfo, theme }) => {
  // Combine sample data with current settings
  const previewData = {
    ...sampleInvoiceData,
    companyInfo,
    theme
  };

  return (
    <div className="w-full h-[600px] bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm overflow-hidden">
      <div className="h-full">
        <FontInitializer>
          <PDFViewer
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'transparent'
            }}
          >
            <InvoicePDF invoice={previewData} />
          </PDFViewer>
        </FontInitializer>
      </div>
    </div>
  );
};

export default InvoicePreview;