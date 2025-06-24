import React, { useState, useEffect } from 'react';
import { defaultFonts, fontSizes, displayOptions, loadCustomFonts, addCustomFont, removeCustomFont } from '../../utils/theme';

const ThemeSection = ({ theme = {}, onUpdateInvoice }) => {
  const [customFontForm, setCustomFontForm] = useState({ name: '', url: '' });
  const [customFonts, setCustomFonts] = useState([]);
  const [showFontForm, setShowFontForm] = useState(false);
  const [customCSS, setCustomCSS] = useState(theme.customCSS || '');

  useEffect(() => {
    setCustomFonts(loadCustomFonts());
  }, []);

  const handleThemeChange = (key, value) => {
    onUpdateInvoice({
      ...theme,
      [key]: value,
      display: {
        ...theme.display,
        ...(key === 'display' ? value : {})
      }
    });
  };

  const handleCustomFontAdd = () => {
    if (customFontForm.name && customFontForm.url) {
      addCustomFont(customFontForm.name, customFontForm.url);
      setCustomFonts(loadCustomFonts());
      setCustomFontForm({ name: '', url: '' });
      setShowFontForm(false);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const sectionClasses = "space-y-4 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700";

  return (
    <div className="space-y-6">
      {/* Color Theme */}
      <div className={sectionClasses}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Colors</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Primary Color</label>
            <div className="mt-1 flex items-center">
              <input
                type="color"
                value={theme.primaryColor || '#0ea5e9'}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                className="h-8 w-8 rounded-md border border-gray-300"
              />
              <input
                type="text"
                value={theme.primaryColor || '#0ea5e9'}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                className={`${inputClasses} ml-2`}
              />
            </div>
          </div>
          <div>
            <label className={labelClasses}>Secondary Color</label>
            <div className="mt-1 flex items-center">
              <input
                type="color"
                value={theme.secondaryColor || '#64748b'}
                onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                className="h-8 w-8 rounded-md border border-gray-300"
              />
              <input
                type="text"
                value={theme.secondaryColor || '#64748b'}
                onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                className={`${inputClasses} ml-2`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className={sectionClasses}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Typography</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Font Family</label>
            <select
              value={theme.fontFamily || 'Helvetica'}
              onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
              className={inputClasses}
            >
              {defaultFonts.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
              {customFonts.map(font => (
                <option key={font.name} value={font.name}>{font.name} (Custom)</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Font Size</label>
            <select
              value={theme.fontSize || 'medium'}
              onChange={(e) => handleThemeChange('fontSize', e.target.value)}
              className={inputClasses}
            >
              {Object.entries(fontSizes).map(([key, value]) => (
                <option key={key} value={value}>{key} ({value})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Custom Font */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowFontForm(!showFontForm)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            {showFontForm ? 'Cancel' : 'Add Custom Font'}
          </button>

          {showFontForm && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Font Name</label>
                  <input
                    type="text"
                    value={customFontForm.name}
                    onChange={(e) => setCustomFontForm({ ...customFontForm, name: e.target.value })}
                    className={inputClasses}
                    placeholder="e.g., My Custom Font"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Font URL (Google Fonts or CSS)</label>
                  <input
                    type="text"
                    value={customFontForm.url}
                    onChange={(e) => setCustomFontForm({ ...customFontForm, url: e.target.value })}
                    className={inputClasses}
                    placeholder="https://fonts.googleapis.com/css2?family=..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCustomFontAdd}
                  disabled={!customFontForm.name || !customFontForm.url}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Font
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Display Options */}
      <div className={sectionClasses}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Display Options</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(displayOptions).map(([key, { label, default: defaultValue }]) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={theme.display?.[key] ?? defaultValue}
                onChange={(e) => handleThemeChange('display', {
                  ...theme.display,
                  [key]: e.target.checked
                })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor={key} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <div className={sectionClasses}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Custom CSS</h3>
        <div>
          <label className={labelClasses}>
            Add custom CSS styles (will be applied to the PDF)
          </label>
          <textarea
            value={customCSS}
            onChange={(e) => {
              setCustomCSS(e.target.value);
              handleThemeChange('customCSS', e.target.value);
            }}
            rows={6}
            className={`${inputClasses} font-mono`}
            placeholder=".invoice-title { font-weight: bold; } /* Add your custom styles here */"
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSection;