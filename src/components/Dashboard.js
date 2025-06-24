import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadInvoiceHistory, updatePaymentStatus } from '../utils/invoiceStorage';
import { formatCurrency } from '../utils/storage';
import { CardSkeleton } from './Loading';
import { exportData } from '../utils/dataBackup';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    partialInvoices: 0,
    overdueInvoices: 0,
    averageInvoiceValue: 0,
    totalPaid: 0,
    totalUnpaid: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const history = loadInvoiceHistory();
      setInvoices(history);
      calculateStats(history);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (invoiceHistory) => {
    const totalInvoices = invoiceHistory.length;
    const totalRevenue = invoiceHistory.reduce((sum, invoice) => {
      return sum + calculateInvoiceTotal(invoice);
    }, 0);

    const paidInvoices = invoiceHistory.filter(inv => inv.paymentStatus === 'paid').length;
    const partialInvoices = invoiceHistory.filter(inv => inv.paymentStatus === 'partial').length;
    const pendingInvoices = invoiceHistory.filter(inv => !inv.paymentStatus || inv.paymentStatus === 'unpaid').length;

    const overdueInvoices = invoiceHistory.filter(inv => {
      const dueDate = new Date(inv.dueDate);
      const today = new Date();
      return dueDate < today && inv.paymentStatus !== 'paid';
    }).length;

    // Calculate total paid and unpaid amounts
    let totalPaid = 0;
    let totalUnpaid = 0;

    invoiceHistory.forEach(invoice => {
      const invoiceTotal = calculateInvoiceTotal(invoice);

      if (invoice.paymentStatus === 'paid') {
        totalPaid += invoiceTotal;
      } else if (invoice.paymentStatus === 'partial') {
        const paidAmount = invoice.totalPaid || 0;
        totalPaid += paidAmount;
        totalUnpaid += (invoiceTotal - paidAmount);
      } else {
        totalUnpaid += invoiceTotal;
      }
    });

    const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    setStats({
      totalInvoices,
      totalRevenue,
      pendingInvoices,
      paidInvoices,
      partialInvoices,
      overdueInvoices,
      averageInvoiceValue,
      totalPaid,
      totalUnpaid
    });
  };

  const calculateInvoiceTotal = (invoice) => {
    if (!invoice.items || !Array.isArray(invoice.items)) return 0;

    const subtotal = invoice.items.reduce((sum, item) => {
      return sum + ((Number(item.quantity) || 0) * (Number(item.rate) || 0));
    }, 0);

    // Apply discounts
    let discountAmount = 0;
    if (invoice.discount) {
      if (invoice.discount.clientDiscount > 0) {
        discountAmount += subtotal * (invoice.discount.clientDiscount / 100);
      }
      if (invoice.discount.type === 'percentage' && invoice.discount.value > 0) {
        discountAmount += subtotal * (invoice.discount.value / 100);
      } else if (invoice.discount.type === 'fixed' && invoice.discount.value > 0) {
        discountAmount += invoice.discount.value;
      }
    }

    const discountedSubtotal = subtotal - discountAmount;
    const tax = invoice.theme?.display?.showTax !== false ? discountedSubtotal * 0.1 : 0;

    return discountedSubtotal + tax;
  };

  const getRecentInvoices = () => {
    return invoices
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">
                {trend === 'up' ? '↗️' : '↘️'}
              </span>
              {trendValue}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Overview of your invoice activity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Welcome back! Here's an overview of your invoice activity.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={() => {
                const result = exportData();
                if (result.success) {
                  alert('✅ Backup downloaded successfully!');
                } else {
                  alert('❌ Failed to create backup: ' + result.message);
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <img src="https://img.icons8.com/stickers/24/000000/save.png" alt="Backup" className="w-5 h-5 mr-2" />
              Backup Data
            </button>
            <Link
              to="/invoices"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <img src="https://img.icons8.com/stickers/24/000000/plus.png" alt="Add" className="w-5 h-5 mr-2" />
              Create Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices}
          icon={<img src="https://img.icons8.com/stickers/48/000000/invoice.png" alt="Invoices" className="w-8 h-8" />}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Paid"
          value={stats.paidInvoices}
          icon={<img src="https://img.icons8.com/stickers/48/000000/checkmark.png" alt="Paid" className="w-8 h-8" />}
          color="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Partial"
          value={stats.partialInvoices}
          icon={<img src="https://img.icons8.com/stickers/100/donate.png" alt="Partial" className="w-8 h-8" />}
          color="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          title="Unpaid"
          value={stats.pendingInvoices}
          icon={<img src="https://img.icons8.com/stickers/100/buy-with-card.png" alt="Unpaid" className="w-8 h-8" />}
          color="text-yellow-600 dark:text-yellow-400"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueInvoices}
          icon={<img src="https://img.icons8.com/stickers/100/pay-date.png" alt="Overdue" className="w-8 h-8" />}
          color="text-red-600 dark:text-red-400"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">💰 Total Paid</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(stats.totalPaid)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">📋 Total Unpaid</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(stats.totalUnpaid)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">📊 Average Invoice</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(stats.averageInvoiceValue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">✅ Payment Rate</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.totalInvoices > 0 ? Math.round((stats.paidInvoices / stats.totalInvoices) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h3>
            <Link
              to="/history"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {getRecentInvoices().length === 0 ? (
              <div className="text-center py-8">
                <img src="https://img.icons8.com/stickers/64/000000/invoice.png" alt="No invoices" className="w-16 h-16 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No invoices yet</p>
                <Link
                  to="/invoices"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                >
                  Create your first invoice
                </Link>
              </div>
            ) : (
              getRecentInvoices().map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.invoiceNumber || 'Draft'}
                      </p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : invoice.paymentStatus === 'partial'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {invoice.paymentStatus === 'paid' ? '✅ Paid' :
                         invoice.paymentStatus === 'partial' ? '🔄 Partial' : '⏳ Unpaid'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {invoice.selectedClient?.name || 'No client'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateInvoiceTotal(invoice), invoice.currency)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/invoices"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <img src="https://img.icons8.com/stickers/48/000000/invoice.png" alt="Invoice" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New Invoice</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new invoice</p>
            </div>
          </Link>
          <Link
            to="/clients"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <img src="https://img.icons8.com/stickers/48/000000/group.png" alt="Clients" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Manage Clients</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add or edit clients</p>
            </div>
          </Link>
          <Link
            to="/history"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <img src="https://img.icons8.com/stickers/48/000000/list.png" alt="History" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">View History</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Browse past invoices</p>
            </div>
          </Link>
          <Link
            to="/data-management"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <img src="https://img.icons8.com/stickers/48/000000/save.png" alt="Data Backup" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Data Backup</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Export and manage data</p>
            </div>
          </Link>
          <Link
            to="/settings"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <img src="https://img.icons8.com/stickers/48/000000/settings.png" alt="Settings" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Settings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure preferences</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
