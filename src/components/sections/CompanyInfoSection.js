import React from 'react';

const CompanyInfoSection = ({ companyInfo, onUpdateInvoice }) => {
  const handleChange = (field, value) => {
    const updatedInfo = { ...companyInfo };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedInfo[parent] = {
        ...updatedInfo[parent],
        [child]: value
      };
    } else {
      updatedInfo[field] = value;
    }
    
    onUpdateInvoice(updatedInfo);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-dark-bg-secondary dark:border-gray-600 dark:text-dark-text-primary";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-dark-text-secondary";
  const sectionClasses = "mb-6 bg-white dark:bg-dark-bg-secondary p-4 rounded-lg shadow-sm";
  const sectionTitleClasses = "text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4";

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className={sectionClasses}>
        <h3 className={sectionTitleClasses}>Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="companyName" className={labelClasses}>Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyInfo.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClasses}>Email</label>
            <input
              type="email"
              id="email"
              value={companyInfo.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClasses}>Phone</label>
            <input
              type="tel"
              id="phone"
              value={companyInfo.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="website" className={labelClasses}>Website</label>
            <input
              type="url"
              id="website"
              value={companyInfo.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className={sectionClasses}>
        <h3 className={sectionTitleClasses}>Address</h3>
        <div>
          <label htmlFor="address" className={labelClasses}>Full Address</label>
          <textarea
            id="address"
            rows={3}
            value={companyInfo.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className={sectionClasses}>
        <h3 className={sectionTitleClasses}>Payment Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bankName" className={labelClasses}>Bank Name</label>
            <input
              type="text"
              id="bankName"
              value={companyInfo.paymentInfo?.bankName || ''}
              onChange={(e) => handleChange('paymentInfo.bankName', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="accountName" className={labelClasses}>Account Name</label>
            <input
              type="text"
              id="accountName"
              value={companyInfo.paymentInfo?.accountName || ''}
              onChange={(e) => handleChange('paymentInfo.accountName', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="accountNumber" className={labelClasses}>Account Number</label>
            <input
              type="text"
              id="accountNumber"
              value={companyInfo.paymentInfo?.accountNumber || ''}
              onChange={(e) => handleChange('paymentInfo.accountNumber', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="sortCode" className={labelClasses}>Sort Code</label>
            <input
              type="text"
              id="sortCode"
              value={companyInfo.paymentInfo?.sortCode || ''}
              onChange={(e) => handleChange('paymentInfo.sortCode', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="iban" className={labelClasses}>IBAN</label>
            <input
              type="text"
              id="iban"
              value={companyInfo.paymentInfo?.iban || ''}
              onChange={(e) => handleChange('paymentInfo.iban', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="swift" className={labelClasses}>SWIFT/BIC</label>
            <input
              type="text"
              id="swift"
              value={companyInfo.paymentInfo?.swift || ''}
              onChange={(e) => handleChange('paymentInfo.swift', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className={sectionClasses}>
        <h3 className={sectionTitleClasses}>Company Logo</h3>
        <div className="flex items-center space-x-4">
          {companyInfo.logo && (
            <div className="w-20 h-20">
              <img
                src={companyInfo.logo}
                alt="Company logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <label className="relative cursor-pointer bg-white dark:bg-dark-bg-secondary rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-dark-text-primary bg-white dark:bg-dark-bg-secondary hover:bg-gray-50 dark:hover:bg-gray-700">
                {companyInfo.logo ? 'Change Logo' : 'Upload Logo'}
              </span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </label>
            {!companyInfo.logo && (
              <button
                type="button"
                onClick={() => handleChange('logo', '/images/logo.png')}
                className="ml-2 text-sm text-primary-600 hover:text-primary-500"
              >
                Use Default Logo
              </button>
            )}
            {companyInfo.logo && (
              <button
                type="button"
                onClick={() => handleChange('logo', null)}
                className="ml-2 text-sm text-red-600 hover:text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoSection;