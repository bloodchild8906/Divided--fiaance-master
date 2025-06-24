import React, { useState, useEffect } from 'react';
import { registerCustomFont, getFontStatus } from '../utils/fontManager';
import { useToast } from './Toast';

const FontManager = () => {
  const [fontStatus, setFontStatus] = useState({ registeredFonts: [], totalRegistered: 0 });
  const [newFont, setNewFont] = useState({ family: '', src: '', weight: 400 });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    updateFontStatus();
  }, []);

  const updateFontStatus = () => {
    setFontStatus(getFontStatus());
  };

  const handleAddFont = async () => {
    if (!newFont.family.trim() || !newFont.src.trim()) {
      toast.error('Please provide both font family name and source URL');
      return;
    }

    setIsLoading(true);
    try {
      const success = registerCustomFont(newFont.family.trim(), newFont.src.trim(), parseInt(newFont.weight));
      
      if (success) {
        toast.success(`Font "${newFont.family}" registered successfully!`);
        setNewFont({ family: '', src: '', weight: 400 });
        updateFontStatus();
      } else {
        toast.error(`Failed to register font "${newFont.family}"`);
      }
    } catch (error) {
      toast.error('Error registering font: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center">
          <img src="https://img.icons8.com/stickers/32/000000/font.png" alt="Font" className="w-8 h-8 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-white">Font Manager</h2>
            <p className="text-blue-100 text-sm">Manage custom fonts for your invoices</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Fonts Status */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Registered Fonts ({fontStatus.totalRegistered})
          </h3>
          <div className="flex flex-wrap gap-2">
            {fontStatus.availableFamilies?.map((font, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
              >
                {font}
              </span>
            ))}
          </div>
        </div>

        {/* Add Custom Font */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Add Custom Font
          </h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fontFamily" className={labelClasses}>
                Font Family Name
              </label>
              <input
                type="text"
                id="fontFamily"
                value={newFont.family}
                onChange={(e) => setNewFont({ ...newFont, family: e.target.value })}
                className={inputClasses}
                placeholder="e.g., Roboto, Open Sans"
              />
            </div>

            <div>
              <label htmlFor="fontWeight" className={labelClasses}>
                Font Weight
              </label>
              <select
                id="fontWeight"
                value={newFont.weight}
                onChange={(e) => setNewFont({ ...newFont, weight: parseInt(e.target.value) })}
                className={inputClasses}
              >
                <option value={300}>Light (300)</option>
                <option value={400}>Regular (400)</option>
                <option value={500}>Medium (500)</option>
                <option value={600}>Semi Bold (600)</option>
                <option value={700}>Bold (700)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="fontSrc" className={labelClasses}>
              Font Source URL
            </label>
            <input
              type="url"
              id="fontSrc"
              value={newFont.src}
              onChange={(e) => setNewFont({ ...newFont, src: e.target.value })}
              className={inputClasses}
              placeholder="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Provide a direct URL to a .woff2, .woff, .ttf, or .otf font file
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleAddFont}
              disabled={isLoading || !newFont.family.trim() || !newFont.src.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <img src="https://img.icons8.com/stickers/16/000000/plus.png" alt="Add" className="w-4 h-4 mr-2" />
                  Add Font
                </>
              )}
            </button>
          </div>
        </div>

        {/* Font Usage Examples */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Popular Font Sources
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Google Fonts:</strong> Use the direct .woff2 URL from Google Fonts CSS</p>
            <p><strong>Adobe Fonts:</strong> Use the web font URL from your Adobe Fonts kit</p>
            <p><strong>Custom Fonts:</strong> Upload your font files to a CDN and use the direct URL</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontManager;
