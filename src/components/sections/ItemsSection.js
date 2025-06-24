import React from 'react';
import { getCurrencySymbol } from '../../utils/currency';

const ItemsSection = ({ items = [], currency, onUpdateInvoice }) => {
  const addItem = () => {
    onUpdateInvoice([
      ...items,
      { description: '', quantity: 1, rate: '', amount: 0 }
    ]);
  };

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdateInvoice(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    const item = { ...newItems[index] };
    
    // For rate and quantity, store the raw input value
    item[field] = value;
    
    // Calculate amount based on numeric values
    if (field === 'quantity' || field === 'rate') {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      item.amount = quantity * rate;
    }
    
    newItems[index] = item;
    onUpdateInvoice(newItems);
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300";
  const inputClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200";

  const currencySymbol = getCurrencySymbol(currency);

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = Number(item?.quantity) || 0;
      const rate = Number(item?.rate) || 0;
      return sum + (quantity * rate);
    }, 0);
  };

  return (
    <div>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Items</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add the items or services you're invoicing for.</p>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className={`${tableHeaderClasses} w-2/5`}>Description</th>
              <th scope="col" className={`${tableHeaderClasses} w-1/6`}>Quantity</th>
              <th scope="col" className={`${tableHeaderClasses} w-1/4`}>Rate ({currencySymbol})</th>
              <th scope="col" className={`${tableHeaderClasses} w-1/6`}>Amount</th>
              <th scope="col" className="relative px-6 py-3 w-[60px]">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td className={tableCellClasses}>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className={inputClasses}
                    placeholder="Item description"
                  />
                </td>
                <td className={tableCellClasses}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className={inputClasses}
                  />
                </td>
                <td className={tableCellClasses}>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{currencySymbol}</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', e.target.value)}
                      className={`${inputClasses} pl-8 pr-4 text-right font-mono tracking-wider`}
                      style={{ minWidth: '120px' }}
                      placeholder="0.00"
                    />
                  </div>
                </td>
                <td className={tableCellClasses}>
                  <div className="text-right font-mono">
                    {currencySymbol} {((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}
                  </div>
                </td>
                <td className={tableCellClasses}>
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <td colSpan="3" className={`${tableCellClasses} text-right font-medium`}>Total:</td>
              <td className={`${tableCellClasses} font-bold text-right font-mono`}>
                {currencySymbol} {calculateTotal().toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ItemsSection;
const newItem = {
  description: '',
  quantity: 0,
  rate: 0,
  amount: 0
};