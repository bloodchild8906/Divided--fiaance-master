// Font initialization component
import React, { useEffect, useState } from 'react';
import { registerAllFonts, getFontStatus } from '../utils/fontManager';

const FontInitializer = ({ children, onFontsReady }) => {
  const [fontsReady, setFontsReady] = useState(false);
  const [fontStatus, setFontStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeFonts = async () => {
      try {
        console.log('🔤 Initializing fonts for PDF generation...');
        
        // Register all fonts with fallback system
        const result = await registerAllFonts();
        
        // Get font status
        const status = getFontStatus();
        setFontStatus(status);
        
        console.log(`✅ Font initialization complete: ${result.successful}/${result.total} fonts registered`);
        console.log('📋 Available font families:', status.availableFamilies);
        
        setFontsReady(true);
        
        // Notify parent component
        if (onFontsReady) {
          onFontsReady(status);
        }
        
      } catch (error) {
        console.error('❌ Font initialization failed:', error);
        setError(error.message);
        
        // Still set fonts as ready to allow fallback to system fonts
        setFontsReady(true);
        
        if (onFontsReady) {
          onFontsReady({ error: error.message });
        }
      }
    };

    initializeFonts();
  }, [onFontsReady]);

  // Show loading state while fonts are being initialized
  if (!fontsReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-dark-text-secondary">
            Loading professional fonts...
          </p>
          <p className="text-sm text-secondary-500 dark:text-dark-text-secondary mt-2">
            This ensures your PDFs look perfect
          </p>
        </div>
      </div>
    );
  }

  // Show error state if fonts failed to load but continue with fallbacks
  if (error) {
    return (
      <div className="mb-4">
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 dark:text-yellow-400 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Font Loading Warning
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Some fonts couldn't be loaded. Using system fonts as fallback.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Fonts are ready, render children
  return (
    <div>
      {fontStatus && fontStatus.totalRegistered > 0 && (
        <div className="mb-4">
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="text-green-600 dark:text-green-400 mr-2">✅</div>
              <p className="text-sm text-green-800 dark:text-green-200">
                Professional fonts loaded ({fontStatus.totalRegistered} fonts available)
              </p>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default FontInitializer;
