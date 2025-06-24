﻿﻿﻿﻿﻿﻿import React from 'react';
import { Page, Document, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { getCurrencySymbol } from '../utils/currency';

// NUCLEAR SAFEGUARD: Register only Helvetica (most reliable system font)
try {
  // Only use Helvetica - the most universally supported font
  Font.register({ family: 'Helvetica', src: 'Helvetica' });
  console.log('🛡️ NUCLEAR: Helvetica registered successfully');
} catch (error) {
  console.warn('🛡️ NUCLEAR: Font registration warning (using browser defaults):', error);
}

const NuclearSafePDF = ({ invoice }) => {
  // NUCLEAR SAFEGUARD: Extract data with null checks
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

  // NUCLEAR SAFEGUARD: Only use Helvetica - the most reliable font
  const NUCLEAR_FONT = 'Helvetica';

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

  // NUCLEAR SAFEGUARD: Ultra-safe styles with only Helvetica, no fontWeight
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: NUCLEAR_FONT,
      fontSize: 11,
      color: '#374151',
      lineHeight: 1.4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    logo: {
      width: 150,
      height: 50,
      objectFit: 'contain',
    },
    companyInfo: {
      flex: 1,
      marginLeft: 20,
      fontFamily: NUCLEAR_FONT,
    },
    title: {
      fontSize: 28,
      fontFamily: NUCLEAR_FONT,
      marginBottom: 20,
      color: '#2E3B44',
      letterSpacing: 1,
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
      fontFamily: NUCLEAR_FONT,
    },
    colHeader: {
      backgroundColor: '#0ea5e9',
      color: 'white',
      fontFamily: NUCLEAR_FONT,
    },
    text: {
      fontSize: 11,
      fontFamily: NUCLEAR_FONT,
      lineHeight: 1.3,
    },
    bold: {
      fontSize: 12,
      fontFamily: NUCLEAR_FONT,
    },
    heading: {
      fontSize: 14,
      fontFamily: NUCLEAR_FONT,
      color: '#2E3B44',
      marginBottom: 8,
    },
    rightAlign: {
      textAlign: 'right',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      fontFamily: NUCLEAR_FONT,
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
      fontFamily: NUCLEAR_FONT,
      color: '#0ea5e9',
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    clientInfo: {
      width: '60%',
      minWidth: 300,
    },
    clientName: {
      fontSize: 16,
      fontFamily: NUCLEAR_FONT,
      color: '#1f2937',
      marginBottom: 4,
    },
    clientCompany: {
      fontSize: 14,
      fontFamily: NUCLEAR_FONT,
      color: '#4b5563',
      marginBottom: 8,
    },
    addressBlock: {
      marginBottom: 10,
      paddingLeft: 0,
    },
    addressLine: {
      fontSize: 12,
      fontFamily: NUCLEAR_FONT,
      color: '#374151',
      lineHeight: 1.4,
      marginBottom: 2,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 15,
    },
    contactItem: {
      fontSize: 11,
      fontFamily: NUCLEAR_FONT,
      color: '#6b7280',
      marginRight: 15,
    },
  });

  // NUCLEAR SAFEGUARD: Safe text rendering with null checks
  const safeText = (text, fallback = '') => {
    return (text && typeof text === 'string' && text.trim()) ? text.trim() : fallback;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {display.showHeader !== false && (
          <View style={styles.header}>
            {display.showLogo !== false && companyInfo?.logo && (
              <Image src={companyInfo.logo} style={styles.logo} />
            )}
            <View style={styles.companyInfo}>
              {safeText(companyInfo?.name) && (
                <Text style={styles.bold}>{safeText(companyInfo.name)}</Text>
              )}
              {safeText(companyInfo?.address) && (
                <Text>{safeText(companyInfo.address)}</Text>
              )}
              {safeText(companyInfo?.phone) && (
                <Text>{safeText(companyInfo.phone)}</Text>
              )}
              {safeText(companyInfo?.email) && (
                <Text>{safeText(companyInfo.email)}</Text>
              )}
              {safeText(companyInfo?.website) && (
                <Text>{safeText(companyInfo.website)}</Text>
              )}
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
                <Text style={styles.bold}>Invoice Number:</Text>
                <Text>{safeText(invoiceNumber, 'Draft')}</Text>
              </View>
            </View>
          )}
          {display.showDates !== false && (
            <View style={styles.grid}>
              <View style={styles.col}>
                <Text style={styles.bold}>Issue Date:</Text>
                <Text>{safeText(issueDate, new Date().toLocaleDateString())}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.bold}>Due Date:</Text>
                <Text>{safeText(dueDate, 'Upon receipt')}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Client Info */}
        {selectedClient && Object.keys(selectedClient).length > 0 && (
          <View style={styles.clientSection}>
            <Text style={styles.sectionHeader}>Bill To:</Text>
            <View style={styles.clientInfo}>
              {safeText(selectedClient?.name) && (
                <Text style={styles.clientName}>{safeText(selectedClient.name)}</Text>
              )}
              {safeText(selectedClient?.company) && (
                <Text style={styles.clientCompany}>{safeText(selectedClient.company)}</Text>
              )}
              {safeText(selectedClient?.address) && (
                <View style={styles.addressBlock}>
                  {selectedClient.address.split('\n')
                    .filter(line => line && line.trim())
                    .map((line, index) => (
                      <Text key={index} style={styles.addressLine}>{line.trim()}</Text>
                    ))}
                </View>
              )}
              <View style={styles.contactInfo}>
                {safeText(selectedClient?.email) && (
                  <Text style={styles.contactItem}>Email: {safeText(selectedClient.email)}</Text>
                )}
                {safeText(selectedClient?.phone) && (
                  <Text style={styles.contactItem}>Phone: {safeText(selectedClient.phone)}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Items */}
        <View style={styles.section}>
          <View style={[styles.grid, styles.colHeader]}>
            {display.showItemDescription !== false && (
              <Text style={[styles.col, styles.bold]}>Description</Text>
            )}
            <Text style={[{ flex: 0.5 }, styles.bold, styles.rightAlign]}>Qty</Text>
            <Text style={[{ flex: 0.5 }, styles.bold, styles.rightAlign]}>Rate</Text>
            <Text style={[{ flex: 0.5 }, styles.bold, styles.rightAlign]}>Amount</Text>
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
            <View style={[styles.grid, styles.bold]}>
              <Text style={styles.col}>Total:</Text>
              <Text style={styles.rightAlign}>
                {currencySymbol} {total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Notes */}
        {display.showNotes !== false && (safeText(terms) || safeText(notes)) && (
          <View style={styles.section}>
            {safeText(terms) && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.bold}>Terms:</Text>
                <Text>{safeText(terms)}</Text>
              </View>
            )}
            {safeText(notes) && (
              <View>
                <Text style={styles.bold}>Notes:</Text>
                <Text>{safeText(notes)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Payment Info */}
        {display.showPaymentDetails !== false && companyInfo?.paymentInfo && (
          <View style={styles.footer}>
            <Text style={styles.bold}>Payment Details:</Text>
            {safeText(companyInfo.paymentInfo?.bankName) && (
              <Text>Bank: {safeText(companyInfo.paymentInfo.bankName)}</Text>
            )}
            {safeText(companyInfo.paymentInfo?.accountName) && (
              <Text>Account Name: {safeText(companyInfo.paymentInfo.accountName)}</Text>
            )}
            {safeText(companyInfo.paymentInfo?.accountNumber) && (
              <Text>Account Number: {safeText(companyInfo.paymentInfo.accountNumber)}</Text>
            )}
            {safeText(companyInfo.paymentInfo?.sortCode) && (
              <Text>Sort Code: {safeText(companyInfo.paymentInfo.sortCode)}</Text>
            )}
            {safeText(companyInfo.paymentInfo?.iban) && (
              <Text>IBAN: {safeText(companyInfo.paymentInfo.iban)}</Text>
            )}
            {safeText(companyInfo.paymentInfo?.swift) && (
              <Text>SWIFT/BIC: {safeText(companyInfo.paymentInfo.swift)}</Text>
            )}
          </View>
        )}

        {/* Signature Line */}
        {display.showSignature && (
          <View style={[styles.section, { marginTop: 50 }]}>
            <View style={[styles.grid, { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 }]}>
              <Text>Authorized Signature</Text>
              <Text style={styles.rightAlign}>Date</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default NuclearSafePDF;
