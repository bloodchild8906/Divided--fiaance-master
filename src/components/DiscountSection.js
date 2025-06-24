import React, { useState } from 'react';

const DiscountSection = ({ discount = { type: 'none', value: 0, clientDiscount: 0 }, onUpdateDiscount, selectedClient }) => {
  const [isExpanded, setIsExpanded] = useState(discount.type !== 'none');

  const handleDiscountChange = (field, value) => {
    const updatedDiscount = {
      ...discount,
      [field]: value
    };
    onUpdateDiscount(updatedDiscount);
  };

  const getClientDiscount = () => {
    if (selectedClient?.defaultDiscount) {
      return selectedClient.defaultDiscount;
    }
    return 0;
  };

  const clientDiscount = getClientDiscount();

  return (
    <div className="bg-gradient-to-br from-white to-secondary-50 dark:from-dark-bg-secondary dark:to-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://img.icons8.com/stickers/32/000000/discount.png" alt="Discount" className="w-8 h-8 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-white">Discounts</h2>
              <p className="text-green-100 text-sm">Apply discounts to your invoice</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-green-100 transition-colors duration-200"
          >
            <svg 
              className={`w-6 h-6 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Client Discount */}
          {clientDiscount > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <div className="flex items-center">
                <img src="https://img.icons8.com/stickers/24/000000/user.png" alt="Client" className="w-6 h-6 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Client Discount Available
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    {selectedClient?.name} has a {clientDiscount}% default discount
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={discount.clientDiscount === clientDiscount}
                    onChange={(e) => handleDiscountChange('clientDiscount', e.target.checked ? clientDiscount : 0)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-blue-700 dark:text-blue-300">
                    Apply {clientDiscount}% client discount
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Manual Discount */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Discount Type
              </label>
              <select
                value={discount.type}
                onChange={(e) => handleDiscountChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="none">No Additional Discount</option>
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount Discount</option>
              </select>
            </div>

            {discount.type !== 'none' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Value
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={discount.type === 'percentage' ? 100 : undefined}
                    step={discount.type === 'percentage' ? 1 : 0.01}
                    value={discount.value}
                    onChange={(e) => handleDiscountChange('value', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder={discount.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                  />
                  {discount.type === 'percentage' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Discount Summary */}
          {(discount.clientDiscount > 0 || (discount.type !== 'none' && discount.value > 0)) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Summary
              </h3>
              <div className="space-y-1 text-sm">
                {discount.clientDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Client Discount:</span>
                    <span className="text-gray-900 dark:text-white">{discount.clientDiscount}%</span>
                  </div>
                )}
                {discount.type !== 'none' && discount.value > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Additional Discount:</span>
                    <span className="text-gray-900 dark:text-white">
                      {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value.toFixed(2)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
