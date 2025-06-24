import React, { useState } from 'react';

const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  helpText,
  icon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseInputClasses = `
    mt-1 block w-full rounded-lg border shadow-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600
  `;

  const getInputClasses = () => {
    let classes = baseInputClasses;
    
    if (error && touched) {
      classes += ' border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600';
    } else if (isFocused) {
      classes += ' border-primary-500 focus:border-primary-500 focus:ring-primary-500';
    } else {
      classes += ' border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600';
    }
    
    if (icon) {
      classes += ' pl-10';
    }
    
    return `${classes} ${inputClassName}`;
  };

  const baseLabelClasses = `
    block text-sm font-medium transition-colors duration-200
    ${error && touched ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
  `;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`${baseLabelClasses} ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={`h-5 w-5 ${error && touched ? 'text-red-400' : 'text-gray-400'}`}>
              {icon}
            </div>
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder={placeholder}
            className={getInputClasses()}
            {...props}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder={placeholder}
            className={getInputClasses()}
            {...props}
          />
        )}
      </div>
      
      {error && touched && (
        <div className="mt-1 flex items-center">
          <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

// Select Input Component
export const FormSelect = ({
  label,
  value,
  onChange,
  options = [],
  error,
  touched,
  required = false,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  labelClassName = '',
  selectClassName = '',
  helpText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseSelectClasses = `
    mt-1 block w-full rounded-lg border shadow-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600
  `;

  const getSelectClasses = () => {
    let classes = baseSelectClasses;
    
    if (error && touched) {
      classes += ' border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600';
    } else if (isFocused) {
      classes += ' border-primary-500 focus:border-primary-500 focus:ring-primary-500';
    } else {
      classes += ' border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600';
    }
    
    return `${classes} ${selectClassName}`;
  };

  const baseLabelClasses = `
    block text-sm font-medium transition-colors duration-200
    ${error && touched ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
  `;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`${baseLabelClasses} ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={getSelectClasses()}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && touched && (
        <div className="mt-1 flex items-center">
          <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

// Checkbox Input Component
export const FormCheckbox = ({
  label,
  checked,
  onChange,
  error,
  touched,
  disabled = false,
  className = '',
  labelClassName = '',
  helpText,
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-4 w-4 rounded border-gray-300 text-primary-600 
            focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-gray-600 dark:bg-gray-700
            ${error && touched ? 'border-red-300 focus:ring-red-500' : ''}
          `}
          {...props}
        />
        {label && (
          <label className={`
            ml-2 block text-sm transition-colors duration-200
            ${error && touched ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${labelClassName}
          `}>
            {label}
          </label>
        )}
      </div>
      
      {error && touched && (
        <div className="mt-1 flex items-center">
          <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

export default FormInput;
