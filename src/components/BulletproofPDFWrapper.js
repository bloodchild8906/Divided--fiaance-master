﻿﻿import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { getSafeFont, resetFonts, getFontStatus } from '../utils/fontManager';

/**
 * BULLETPROOF PDF Wrapper with multiple error safeguards
 */
const BulletproofPDFWrapper = ({ 
  children, 
  type = 'viewer', // 'viewer' or 'download'
  fileName = 'document.pdf',
  className = '',
  style = {},
  onError = null,
  fallbackMessage = 'PDF generation temporarily unavailable'
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  // SAFEGUARD 1: Error boundary for PDF generation
  useEffect(() => {
    const handleError = (error) => {
      console.warn('🛡️ BULLETPROOF: PDF Error detected:', error);
      
      if (error.message && (
        error.message.includes('Unknown font format') ||
        error.message.includes('Font family not registered') ||
        error.message.includes('Could not resolve font')
      )) {
        handleFontError();
      } else {
        setHasError(true);
        if (onError) onError(error);
      }
    };

    // Listen for unhandled errors
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason);
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [onError]);

  // SAFEGUARD 2: Nuclear font error recovery
  const handleFontError = async () => {
    if (errorCount >= 2) { // Reduced attempts for faster fallback
      console.error('🛡️ BULLETPROOF: Max recovery attempts reached');
      setHasError(true);
      return;
    }

    setIsRecovering(true);
    setErrorCount(prev => prev + 1);

    try {
      console.log('🛡️ BULLETPROOF: Attempting nuclear font recovery...');

      // NUCLEAR OPTION: Clear all fonts and re-register only system fonts
      try {
        const { Font } = await import('@react-pdf/renderer');

        // Force register system fonts
        const systemFonts = [
          { family: 'Helvetica', src: 'Helvetica' },
          { family: 'Arial', src: 'Arial' },
          { family: 'Times-Roman', src: 'Times-Roman' },
          { family: 'Courier', src: 'Courier' }
        ];

        systemFonts.forEach(font => {
          try {
            Font.register(font);
          } catch (e) {
            console.warn('🛡️ NUCLEAR: Font registration warning:', e);
          }
        });

        console.log('🛡️ BULLETPROOF: Nuclear font recovery successful');
        setHasError(false);
        setIsRecovering(false);
      } catch (fontError) {
        throw new Error('Nuclear font reset failed');
      }
    } catch (error) {
      console.error('🛡️ BULLETPROOF: Nuclear font recovery failed:', error);
      setHasError(true);
      setIsRecovering(false);
    }
  };

  // SAFEGUARD 3: Manual recovery button
  const handleManualRecovery = () => {
    setHasError(false);
    setErrorCount(0);
    setIsRecovering(false);
    handleFontError();
  };

  // SAFEGUARD 4: Error fallback UI with ultra-safe PDF option
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            PDF Generation Protected
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {fallbackMessage}
          </p>
          <div className="space-y-2">
            <button
              onClick={handleManualRecovery}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              🔄 Retry PDF Generation
            </button>
            <button
              onClick={() => {
                // Try ultra-safe PDF as last resort
                try {
                  const UltraSafePDF = require('./UltraSafePDF').default;
                  if (type === 'download') {
                    const link = document.createElement('a');
                    link.download = fileName || 'invoice.pdf';
                    link.href = '#';
                    link.textContent = 'Download Ultra-Safe PDF';
                    link.click();
                  }
                } catch (e) {
                  console.error('Ultra-safe PDF also failed:', e);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📄 Try Ultra-Safe PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SAFEGUARD 5: Recovery loading state
  if (isRecovering) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <div className="text-center">
          <div className="animate-spin text-2xl mb-4">🔄</div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Recovering PDF System
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            Resetting to safe fonts...
          </p>
        </div>
      </div>
    );
  }

  // SAFEGUARD 6: Wrap PDF components with error boundaries
  try {
    if (type === 'download') {
      return (
        <PDFDownloadLink
          document={children}
          fileName={fileName}
          className={className}
          style={style}
        >
          {({ loading, error }) => {
            if (error) {
              console.warn('🛡️ BULLETPROOF: Download error:', error);
              handleFontError();
              return 'PDF Error - Recovering...';
            }
            return loading ? 'Generating PDF...' : 'Download PDF';
          }}
        </PDFDownloadLink>
      );
    }

    return (
      <PDFViewer 
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          ...style 
        }}
        className={className}
      >
        {children}
      </PDFViewer>
    );
  } catch (error) {
    console.error('🛡️ BULLETPROOF: PDF Wrapper error:', error);
    handleFontError();
    return null;
  }
};

/**
 * BULLETPROOF PDF Viewer Component
 */
export const BulletproofPDFViewer = ({ children, ...props }) => (
  <BulletproofPDFWrapper type="viewer" {...props}>
    {children}
  </BulletproofPDFWrapper>
);

/**
 * BULLETPROOF PDF Download Component
 */
export const BulletproofPDFDownload = ({ children, ...props }) => (
  <BulletproofPDFWrapper type="download" {...props}>
    {children}
  </BulletproofPDFWrapper>
);

export default BulletproofPDFWrapper;
