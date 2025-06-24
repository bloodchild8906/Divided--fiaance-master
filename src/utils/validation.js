﻿import React from 'react';

// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
};

export const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

export const validateInvoiceNumber = (invoiceNumber) => {
  return validateRequired(invoiceNumber) && invoiceNumber.length >= 3;
};

// Company info validation
export const validateCompanyInfo = (companyInfo) => {
  const errors = {};

  if (!validateRequired(companyInfo.name)) {
    errors.name = 'Company name is required';
  }

  if (!validateRequired(companyInfo.address)) {
    errors.address = 'Company address is required';
  }

  if (companyInfo.email && !validateEmail(companyInfo.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (companyInfo.phone && !validatePhone(companyInfo.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Client validation
export const validateClient = (client) => {
  const errors = {};

  if (!validateRequired(client.name)) {
    errors.name = 'Client name is required';
  }

  if (!validateRequired(client.email)) {
    errors.email = 'Client email is required';
  } else if (!validateEmail(client.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (client.phone && !validatePhone(client.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Invoice item validation
export const validateInvoiceItem = (item) => {
  const errors = {};

  if (!validateRequired(item.description)) {
    errors.description = 'Item description is required';
  }

  if (!validateNumber(item.quantity, 0.01)) {
    errors.quantity = 'Quantity must be a positive number';
  }

  if (!validateNumber(item.rate, 0)) {
    errors.rate = 'Rate must be a non-negative number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Invoice validation
export const validateInvoice = (invoice) => {
  const errors = {};

  // Basic invoice info
  if (!validateInvoiceNumber(invoice.invoiceNumber)) {
    errors.invoiceNumber = 'Invoice number is required (minimum 3 characters)';
  }

  if (!validateDate(invoice.issueDate)) {
    errors.issueDate = 'Please enter a valid issue date';
  }

  if (!validateDate(invoice.dueDate)) {
    errors.dueDate = 'Please enter a valid due date';
  } else if (new Date(invoice.dueDate) < new Date(invoice.issueDate)) {
    errors.dueDate = 'Due date must be after issue date';
  }

  // Company info validation
  const companyValidation = validateCompanyInfo(invoice.companyInfo || {});
  if (!companyValidation.isValid) {
    errors.companyInfo = companyValidation.errors;
  }

  // Client validation
  if (!invoice.selectedClient) {
    errors.selectedClient = 'Please select a client';
  } else {
    const clientValidation = validateClient(invoice.selectedClient);
    if (!clientValidation.isValid) {
      errors.selectedClient = clientValidation.errors;
    }
  }

  // Items validation
  if (!invoice.items || invoice.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    const itemErrors = [];
    invoice.items.forEach((item, index) => {
      const itemValidation = validateInvoiceItem(item);
      if (!itemValidation.isValid) {
        itemErrors[index] = itemValidation.errors;
      }
    });
    if (itemErrors.some(error => error)) {
      errors.items = itemErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form field validation helper
export const getFieldError = (errors, fieldPath) => {
  const pathArray = fieldPath.split('.');
  let current = errors;
  
  for (const key of pathArray) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  
  return typeof current === 'string' ? current : null;
};

// Validation state hook helper
export const useValidation = (initialData, validationFunction) => {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validate = React.useCallback((dataToValidate = data) => {
    const validation = validationFunction(dataToValidate);
    setErrors(validation.errors);
    return validation.isValid;
  }, [data, validationFunction]);

  const updateField = React.useCallback((field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  const updateNestedField = React.useCallback((path, value) => {
    const pathArray = path.split('.');
    setData(prev => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (!(key in current) || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      
      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });
    
    setTouched(prev => ({
      ...prev,
      [path]: true
    }));
  }, []);

  const markFieldTouched = React.useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  const isFieldTouched = React.useCallback((field) => {
    return touched[field] || false;
  }, [touched]);

  const getFieldError = React.useCallback((field) => {
    if (!isFieldTouched(field)) return null;
    
    const pathArray = field.split('.');
    let current = errors;
    
    for (const key of pathArray) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    
    return typeof current === 'string' ? current : null;
  }, [errors, isFieldTouched]);

  const reset = React.useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    validate,
    updateField,
    updateNestedField,
    markFieldTouched,
    isFieldTouched,
    getFieldError,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};
