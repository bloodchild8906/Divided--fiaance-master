﻿﻿﻿﻿﻿﻿import React from 'react';
import { Page, Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getCurrencySymbol } from '../utils/currency';

/**
 * ULTRA-SAFE PDF Component - No font specifications at all
 * Uses browser defaults only to prevent any font-related errors
 */
const UltraSafePDF = ({ invoice }) => {
  // ULTRA SAFEGUARD: Extract data with comprehensive null checks
  const {
    selectedClient = {},
    items = [],
    invoiceNumber = '',
    issueDate = '',
    dueDate = '',
    terms = '',
    notes = '',
    theme = {},
    companyInfo = {},
    discount = {}
  } = invoice || {};

  const display = theme?.display || {};
  const currencySymbol = getCurrencySymbol(theme?.currency || 'USD');

  // Calculate totals with safeguards
  const subtotal = (items || []).reduce((sum, item) => {
    return sum + ((Number(item?.quantity) || 0) * (Number(item?.rate) || 0));
  }, 0);

  let discountAmount = 0;
  if (discount?.clientDiscount > 0) {
    discountAmount += subtotal * ((discount.clientDiscount || 0) / 100);
  }
  if (discount?.type === 'percentage' && (discount?.value || 0) > 0) {
    discountAmount += subtotal * ((discount.value || 0) / 100);
  } else if (discount?.type === 'fixed' && (discount?.value || 0) > 0) {
    discountAmount += (discount.value || 0);
  }

  const discountedSubtotal = subtotal - discountAmount;
  const tax = display?.showTax !== false ? discountedSubtotal * 0.1 : 0;
  const total = discountedSubtotal + tax;

  // ULTRA SAFEGUARD: Minimal styles with NO font specifications
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      color: '#374151',
      lineHeight: 1.4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      marginBottom: 20,
      color: '#2E3B44',
    },
    section: {
      marginBottom: 20,
    },
    grid: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 5,
      paddingTop: 5,
    },
    col: {
      flex: 1,
    },
    colHeader: {
      backgroundColor: '#0ea5e9',
      color: 'white',
      padding: 5,
    },
    rightAlign: {
      textAlign: 'right',
    },
    clientSection: {
      marginBottom: 25,
      padding: 15,
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#0ea5e9',
    },
    sectionHeader: {
      fontSize: 14,
      color: '#0ea5e9',
      marginBottom: 10,
    },
    clientName: {
      fontSize: 16,
      color: '#1f2937',
      marginBottom: 4,
    },
    addressLine: {
      fontSize: 12,
      color: '#374151',
      lineHeight: 1.4,
      marginBottom: 2,
    },
    contactItem: {
      fontSize: 11,
      color: '#6b7280',
      marginRight: 15,
    },
  });

  // ULTRA SAFEGUARD: Safe text rendering with null checks
  const safeText = (text, fallback = null) => {
    if (text && typeof text === 'string' && text.trim()) {
      return text.trim();
    }
    return fallback;
  };

  // Helper to check if text exists for conditional rendering
  const hasText = (text) => {
    return text && typeof text === 'string' && text.trim();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {display.showHeader !== false && (
          <View style={styles.header}>
            <View>
              <Text>{safeText(companyInfo?.name, 'Divided Finance Master')}</Text>
              {hasText(companyInfo?.address) && <Text>{safeText(companyInfo.address)}</Text>}
              {hasText(companyInfo?.phone) && <Text>{safeText(companyInfo.phone)}</Text>}
              {hasText(companyInfo?.email) && <Text>{safeText(companyInfo.email)}</Text>}
            </View>
          </View>
        )}

        {/* Invoice Title */}
        <Text style={styles.title}>INVOICE</Text>

        {/* Invoice Details */}
        <View style={styles.section}>
          {display.showInvoiceNumber !== false && (
            <View style={styles.grid}>
              <View style={styles.col}>
                <Text>Invoice Number: {safeText(invoiceNumber, 'Draft')}</Text>
              </View>
            </View>
          )}
          {display.showDates !== false && (
            <View style={styles.grid}>
              <View style={styles.col}>
                <Text>Issue Date: {safeText(issueDate, new Date().toLocaleDateString())}</Text>
              </View>
              <View style={styles.col}>
                <Text>Due Date: {safeText(dueDate, 'Upon receipt')}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Client Info */}
        {selectedClient && Object.keys(selectedClient).length > 0 && (
          <View style={styles.clientSection}>
            <Text style={styles.sectionHeader}>BILL TO:</Text>
            {hasText(selectedClient?.name) && (
              <Text style={styles.clientName}>{safeText(selectedClient.name)}</Text>
            )}
            {hasText(selectedClient?.company) && (
              <Text>{safeText(selectedClient.company)}</Text>
            )}
            {hasText(selectedClient?.address) && (
              <View>
                {selectedClient.address.split('\n')
                  .filter(line => line && line.trim())
                  .map((line, index) => (
                    <Text key={index} style={styles.addressLine}>{line.trim()}</Text>
                  ))}
              </View>
            )}
            {hasText(selectedClient?.email) && (
              <Text style={styles.contactItem}>Email: {safeText(selectedClient.email)}</Text>
            )}
            {hasText(selectedClient?.phone) && (
              <Text style={styles.contactItem}>Phone: {safeText(selectedClient.phone)}</Text>
            )}
          </View>
        )}

        {/* Items */}
        <View style={styles.section}>
          <View style={[styles.grid, styles.colHeader]}>
            {display.showItemDescription !== false && (
              <Text style={styles.col}>Description</Text>
            )}
            <Text style={[{ flex: 0.5 }, styles.rightAlign]}>Qty</Text>
            <Text style={[{ flex: 0.5 }, styles.rightAlign]}>Rate</Text>
            <Text style={[{ flex: 0.5 }, styles.rightAlign]}>Amount</Text>
          </View>
          {items && items.length > 0 && items.map((item, index) => (
            <View key={index} style={styles.grid}>
              {display.showItemDescription !== false && (
                <Text style={styles.col}>
                  {safeText(item?.description, 'Item')}
                </Text>
              )}
              <Text style={[{ flex: 0.5 }, styles.rightAlign]}>
                {item?.quantity || '0'}
              </Text>
              <Text style={[{ flex: 0.5 }, styles.rightAlign]}>
                {currencySymbol} {(Number(item?.rate) || 0).toFixed(2)}
              </Text>
              <Text style={[{ flex: 0.5 }, styles.rightAlign]}>
                {currencySymbol} {((Number(item?.quantity) || 0) * (Number(item?.rate) || 0)).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={[styles.section, { alignItems: 'flex-end' }]}>
          <View style={{ width: '50%' }}>
            <View style={styles.grid}>
              <Text style={styles.col}>Subtotal:</Text>
              <Text style={styles.rightAlign}>
                {currencySymbol} {subtotal.toFixed(2)}
              </Text>
            </View>
            {discountAmount > 0 && (
              <>
                {(discount?.clientDiscount || 0) > 0 && (
                  <View style={styles.grid}>
                    <Text style={styles.col}>Client Discount ({discount.clientDiscount}%):</Text>
                    <Text style={styles.rightAlign}>
                      -{currencySymbol} {(subtotal * ((discount.clientDiscount || 0) / 100)).toFixed(2)}
                    </Text>
                  </View>
                )}
                {discount?.type === 'percentage' && (discount?.value || 0) > 0 && (
                  <View style={styles.grid}>
                    <Text style={styles.col}>Discount ({discount.value}%):</Text>
                    <Text style={styles.rightAlign}>
                      -{currencySymbol} {(subtotal * ((discount.value || 0) / 100)).toFixed(2)}
                    </Text>
                  </View>
                )}
                {discount?.type === 'fixed' && (discount?.value || 0) > 0 && (
                  <View style={styles.grid}>
                    <Text style={styles.col}>Discount:</Text>
                    <Text style={styles.rightAlign}>
                      -{currencySymbol} {(discount.value || 0).toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.grid}>
                  <Text style={styles.col}>Discounted Subtotal:</Text>
                  <Text style={styles.rightAlign}>
                    {currencySymbol} {discountedSubtotal.toFixed(2)}
                  </Text>
                </View>
              </>
            )}
            {display.showTax !== false && (
              <View style={styles.grid}>
                <Text style={styles.col}>Tax (10%):</Text>
                <Text style={styles.rightAlign}>
                  {currencySymbol} {tax.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.grid}>
              <Text style={styles.col}>TOTAL:</Text>
              <Text style={styles.rightAlign}>
                {currencySymbol} {total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Notes */}
        {display.showNotes !== false && (hasText(terms) || hasText(notes)) && (
          <View style={styles.section}>
            {hasText(terms) && (
              <View style={{ marginBottom: 10 }}>
                <Text>Terms: {safeText(terms)}</Text>
              </View>
            )}
            {hasText(notes) && (
              <View>
                <Text>Notes: {safeText(notes)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Payment Info */}
        {display.showPaymentDetails !== false && companyInfo?.paymentInfo && (
          <View style={styles.section}>
            <Text>Payment Details:</Text>
            {hasText(companyInfo.paymentInfo?.bankName) && (
              <Text>Bank: {safeText(companyInfo.paymentInfo.bankName)}</Text>
            )}
            {hasText(companyInfo.paymentInfo?.accountName) && (
              <Text>Account Name: {safeText(companyInfo.paymentInfo.accountName)}</Text>
            )}
            {hasText(companyInfo.paymentInfo?.accountNumber) && (
              <Text>Account Number: {safeText(companyInfo.paymentInfo.accountNumber)}</Text>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default UltraSafePDF;
