import { useState, useEffect } from 'react';
import { getCurrencyByRegion, CURRENCY_OPTIONS } from './src/currency';

export default function Settings({ isOpen, onClose, invoiceData, onUpdateInvoice }) {
  const [currency, setCurrency] = useState(invoiceData?.currency || 'ZAR');
  const [error, setError] = useState(null);

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const detectedCurrency = await getCurrencyByRegion();
        setCurrency(detectedCurrency);
        setError(null);
      } catch (error) {
        setError('Failed to detect location-based currency. Using default: ZAR');
        setCurrency('ZAR');
      }
    };
    detectCurrency();
  }, []);

  useEffect(() => {
    if (onUpdateInvoice) {
      onUpdateInvoice({ ...invoiceData, currency });
    }
    // eslint-disable-next-line
  }, [currency]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 8, minWidth: 320, padding: 24, position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer'
          }}
          aria-label="Close"
        >×</button>
        <h2>Currency Settings</h2>
        {error && 
          <div style={{ color: '#cc0000', margin: '10px 0', padding: '10px', background: '#ffe6e6' }}>
            {error}
          </div>}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{ padding: '8px', marginTop: '10px' }}
        >
          {CURRENCY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}