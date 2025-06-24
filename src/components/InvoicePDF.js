import React from 'react';
import { Page, Document, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { getCurrencySymbol } from '../utils/currency';



const InvoicePDF = ({ invoice = {} }) => {

  // Destructure invoice data with default values
  const {
    companyInfo = {},
    selectedClient = {},
    items = [],
    invoiceNumber = '',
    issueDate = '',
    dueDate = '',
    terms = '',
    notes = '',
    currency = 'USD',
    theme = {},
    discount = { type: 'none', value: 0, clientDiscount: 0 }
  } = invoice;

  const currencySymbol = getCurrencySymbol(currency);
  const display = theme.display || {};

  // Calculate totals
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.rate) || 0)), 0);
  };

  const calculateDiscounts = (subtotal) => {
    let totalDiscount = 0;

    // Client discount
    if (discount.clientDiscount > 0) {
      totalDiscount += subtotal * (discount.clientDiscount / 100);
    }

    // Additional discount
    if (discount.type === 'percentage' && discount.value > 0) {
      totalDiscount += subtotal * (discount.value / 100);
    } else if (discount.type === 'fixed' && discount.value > 0) {
      totalDiscount += discount.value;
    }

    return totalDiscount;
  };

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscounts(subtotal);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = display.showTax ? discountedSubtotal * 0.1 : 0; // 10% tax rate if enabled
  const total = discountedSubtotal + tax;

  // NUCLEAR SAFEGUARD: Only use hardcoded system fonts, no external loading
  const getFont = (requestedFont, fallback = 'Helvetica') => {
    // SAFEGUARD: Hardcoded system font mapping - no external fonts allowed
    const NUCLEAR_FONT_MAP = {
      'Inter': 'Helvetica',
      'Roboto': 'Helvetica',
      'Open Sans': 'Arial',
      'Source Sans Pro': 'Arial',
      'Lato': 'Arial',
      'Montserrat': 'Arial',
      'Playfair Display': 'Times-Roman',
      'Merriweather': 'Times-Roman',
      'Georgia': 'Times-Roman',
      'Courier New': 'Courier',
      'Monaco': 'Courier',
      'Consolas': 'Courier',
      'Helvetica': 'Helvetica',
      'Arial': 'Arial',
      'Times-Roman': 'Times-Roman',
      'Courier': 'Courier'
    };

    // NUCLEAR SAFEGUARD: Always return system font
    return NUCLEAR_FONT_MAP[requestedFont] || fallback || 'Helvetica';
  };

  // Create styles based on theme with safe fonts
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: getFont(theme?.fontFamily || 'Inter'),
      fontSize: parseInt(theme?.fontSize) || 11,
      color: theme?.secondaryColor || '#374151',
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
    },
    title: {
      fontSize: 28,
      fontWeight: 700,
      fontFamily: getFont('Playfair Display', 'Helvetica'),
      marginBottom: 20,
      color: theme?.primaryColor || '#2E3B44',
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
    },
    colHeader: {
      backgroundColor: theme?.primaryColor || '#0ea5e9',
      color: 'white',
    },
    text: {
      fontSize: parseInt(theme?.fontSize) || 11,
      fontFamily: getFont('Source Sans Pro', 'Arial'),
      lineHeight: 1.3,
    },
    bold: {
      fontWeight: 600,
      fontFamily: getFont('Inter', 'Helvetica'),
    },
    heading: {
      fontSize: 14,
      fontWeight: 600,
      fontFamily: getFont('Inter', 'Helvetica'),
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
    },
    // Client section styles
    clientSection: {
      marginBottom: 25,
      padding: 15,
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme?.primaryColor || '#0ea5e9',
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: 600,
      fontFamily: getFont('Inter', 'Helvetica'),
      color: theme?.primaryColor || '#0ea5e9',
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    clientInfo: {
      width: '60%', // Make client block wider
      minWidth: 300,
    },
    clientName: {
      fontSize: 16,
      fontWeight: 600,
      fontFamily: getFont('Inter', 'Helvetica'),
      color: '#1f2937',
      marginBottom: 4,
    },
    clientCompany: {
      fontSize: 14,
      fontFamily: getFont('Inter', 'Helvetica'),
      color: '#4b5563',
      marginBottom: 8,
      fontStyle: 'italic',
    },
    addressBlock: {
      marginBottom: 10,
      paddingLeft: 0,
    },
    addressLine: {
      fontSize: 12,
      fontFamily: getFont('Source Sans Pro', 'Arial'),
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
      fontFamily: getFont('Source Sans Pro', 'Arial'),
      color: '#6b7280',
      marginRight: 15,
    },
    // Add any custom CSS provided by the user
    ...(theme.customCSS ? eval(`(${theme.customCSS})`) : {})
  });



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
              {companyInfo?.name && companyInfo.name.trim() && (
                <Text style={styles.bold}>{companyInfo.name.trim()}</Text>
              )}
              {companyInfo?.address && companyInfo.address.trim() && (
                <Text>{companyInfo.address.trim()}</Text>
              )}
              {companyInfo?.phone && companyInfo.phone.trim() && (
                <Text>{companyInfo.phone.trim()}</Text>
              )}
              {companyInfo?.email && companyInfo.email.trim() && (
                <Text>{companyInfo.email.trim()}</Text>
              )}
              {companyInfo?.website && companyInfo.website.trim() && (
                <Text>{companyInfo.website.trim()}</Text>
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
                <Text>{(invoiceNumber && invoiceNumber.trim()) || 'Draft'}</Text>
              </View>
            </View>
          )}
          {display.showDates !== false && (
            <View style={styles.grid}>
              <View style={styles.col}>
                <Text style={styles.bold}>Issue Date:</Text>
                <Text>{(issueDate && issueDate.trim()) || new Date().toLocaleDateString()}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.bold}>Due Date:</Text>
                <Text>{(dueDate && dueDate.trim()) || 'Upon receipt'}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Client Info */}
        {selectedClient && Object.keys(selectedClient).length > 0 && (
          <View style={styles.clientSection}>
            <Text style={styles.sectionHeader}>Bill To:</Text>
            <View style={styles.clientInfo}>
              {selectedClient.name && selectedClient.name.trim() && (
                <Text style={styles.clientName}>{selectedClient.name.trim()}</Text>
              )}
              {selectedClient.company && selectedClient.company.trim() && (
                <Text style={styles.clientCompany}>{selectedClient.company.trim()}</Text>
              )}
              {selectedClient.address && selectedClient.address.trim() && (
                <View style={styles.addressBlock}>
                  {selectedClient.address.trim().split('\n')
                    .filter(line => line.trim())
                    .map((line, index) => (
                      <Text key={index} style={styles.addressLine}>{line.trim()}</Text>
                    ))}
                </View>
              )}
              <View style={styles.contactInfo}>
                {selectedClient.email && selectedClient.email.trim() && (
                  <Text style={styles.contactItem}>Email: {selectedClient.email.trim()}</Text>
                )}
                {selectedClient.phone && selectedClient.phone.trim() && (
                  <Text style={styles.contactItem}>Phone: {selectedClient.phone.trim()}</Text>
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
                  {(item.description && item.description.trim()) || 'Item'}
                </Text>
              )}
              <Text style={[{ flex: 0.5 }, styles.rightAlign]}>
                {item.quantity || '0'}
              </Text>
              <Text style={[{ flex: 0.5 }, styles.rightAlign]}>
                {currencySymbol} {(Number(item.rate) || 0).toFixed(2)}
              </Text>
              <Text style={[{ flex: 0.5 }, styles.rightAlign]}>
                {currencySymbol} {((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}
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
                {discount.clientDiscount > 0 && (
                  <View style={styles.grid}>
                    <Text style={styles.col}>Client Discount ({discount.clientDiscount}%):</Text>
                    <Text style={styles.rightAlign}>
                      -{currencySymbol} {(subtotal * (discount.clientDiscount / 100)).toFixed(2)}
                    </Text>
                  </View>
                )}
                {discount.type === 'percentage' && discount.value > 0 && (
                  <View style={styles.grid}>
                    <Text style={styles.col}>Discount ({discount.value}%):</Text>
                    <Text style={styles.rightAlign}>
                      -{currencySymbol} {(subtotal * (discount.value / 100)).toFixed(2)}
                    </Text>
                  </View>
                )}
                {discount.type === 'fixed' && discount.value > 0 && (
                  <View style={styles.grid}>
                    <Text style={styles.col}>Discount:</Text>
                    <Text style={styles.rightAlign}>
                      -{currencySymbol} {discount.value.toFixed(2)}
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
        {display.showNotes !== false && ((terms && terms.trim()) || (notes && notes.trim())) && (
          <View style={styles.section}>
            {terms && terms.trim() && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.bold}>Terms:</Text>
                <Text>{terms.trim()}</Text>
              </View>
            )}
            {notes && notes.trim() && (
              <View>
                <Text style={styles.bold}>Notes:</Text>
                <Text>{notes.trim()}</Text>
              </View>
            )}
          </View>
        )}

        {/* Payment Info */}
        {display.showPaymentDetails !== false && companyInfo?.paymentInfo && (
          <View style={styles.footer}>
            <Text style={styles.bold}>Payment Details:</Text>
            {companyInfo.paymentInfo.bankName && companyInfo.paymentInfo.bankName.trim() && (
              <Text>Bank: {companyInfo.paymentInfo.bankName.trim()}</Text>
            )}
            {companyInfo.paymentInfo.accountName && companyInfo.paymentInfo.accountName.trim() && (
              <Text>Account Name: {companyInfo.paymentInfo.accountName.trim()}</Text>
            )}
            {companyInfo.paymentInfo.accountNumber && companyInfo.paymentInfo.accountNumber.trim() && (
              <Text>Account Number: {companyInfo.paymentInfo.accountNumber.trim()}</Text>
            )}
            {companyInfo.paymentInfo.sortCode && companyInfo.paymentInfo.sortCode.trim() && (
              <Text>Sort Code: {companyInfo.paymentInfo.sortCode.trim()}</Text>
            )}
            {companyInfo.paymentInfo.iban && companyInfo.paymentInfo.iban.trim() && (
              <Text>IBAN: {companyInfo.paymentInfo.iban.trim()}</Text>
            )}
            {companyInfo.paymentInfo.swift && companyInfo.paymentInfo.swift.trim() && (
              <Text>SWIFT/BIC: {companyInfo.paymentInfo.swift.trim()}</Text>
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

export default InvoicePDF;