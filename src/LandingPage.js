import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadInvoiceHistory } from './utils/invoiceStorage';

const LandingPage = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    recentActivity: []
  });

  // Debug: Add console log to verify component is loading
  console.log('LandingPage component is rendering');

  useEffect(() => {
    const loadStats = () => {
      try {
        const invoices = loadInvoiceHistory();
        const totalRevenue = invoices.reduce((sum, invoice) => {
          return sum + (invoice.items || []).reduce((itemSum, item) =>
            itemSum + ((item.quantity || 0) * (item.rate || 0)), 0);
        }, 0);

        setStats({
          totalInvoices: invoices.length,
          totalRevenue,
          recentActivity: invoices.slice(0, 3)
        });
        console.log('Stats loaded:', { totalInvoices: invoices.length, totalRevenue });
      } catch (error) {
        console.error('Error loading stats:', error);
        // Set default stats if there's an error
        setStats({
          totalInvoices: 0,
          totalRevenue: 0,
          recentActivity: []
        });
      }
    };

    loadStats();
  }, []);

  const features = [
    {
      icon: <img src="https://img.icons8.com/stickers/100/000000/rocket.png" alt="Lightning Fast" className="w-16 h-16" />,
      title: 'Lightning Fast',
      description: 'Create professional invoices in under 2 minutes with our streamlined interface.'
    },
    {
      icon: <img src="https://img.icons8.com/stickers/100/000000/design.png" alt="Beautiful Design" className="w-16 h-16" />,
      title: 'Beautiful Design',
      description: 'Stunning, customizable templates that make your business look professional.'
    },
    {
      icon: <img src="https://img.icons8.com/stickers/100/000000/save.png" alt="Auto-Save" className="w-16 h-16" />,
      title: 'Auto-Save',
      description: 'Never lose your work with automatic saving and local storage backup.'
    },
    {
      icon: <img src="https://img.icons8.com/stickers/100/two-smartphones.png" alt="Mobile Ready" className="w-16 h-16" />,
      title: 'Mobile Ready',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile.'
    },
    {
      icon: <img src="https://img.icons8.com/stickers/100/000000/lock.png" alt="Privacy First" className="w-16 h-16" />,
      title: 'Privacy First',
      description: 'All data stored locally in your browser. Zero server storage, complete privacy guaranteed.'
    },
    {
      icon: <img src="https://img.icons8.com/stickers/100/combo-chart.png" alt="Smart Analytics" className="w-16 h-16" />,
      title: 'Smart Analytics',
      description: 'Track your invoicing performance with built-in analytics and insights.'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Invoice',
      description: 'Start fresh with a new invoice',
      icon: <img src="https://img.icons8.com/stickers/64/000000/invoice.png" alt="Invoice" className="w-12 h-12" />,
      path: '/invoices',
      color: 'from-primary-500 to-primary-600',
      hoverColor: 'hover:from-primary-600 hover:to-primary-700'
    },
    {
      title: 'Manage Clients',
      description: 'Add and organize your clients',
      icon: <img src="https://img.icons8.com/stickers/64/000000/group.png" alt="Clients" className="w-12 h-12" />,
      path: '/clients',
      color: 'from-secondary-500 to-secondary-600',
      hoverColor: 'hover:from-secondary-600 hover:to-secondary-700'
    },
    {
      title: 'View History',
      description: 'Browse your past invoices',
      icon: <img src="https://img.icons8.com/stickers/64/000000/list.png" alt="History" className="w-12 h-12" />,
      path: '/history',
      color: 'from-accent-500 to-accent-600',
      hoverColor: 'hover:from-accent-600 hover:to-accent-700'
    },
    {
      title: 'Settings',
      description: 'Customize your preferences',
      icon: <img src="https://img.icons8.com/stickers/64/000000/settings.png" alt="Settings" className="w-12 h-12" />,
      path: '/settings',
      color: 'from-secondary-600 to-secondary-700',
      hoverColor: 'hover:from-secondary-700 hover:to-secondary-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 via-secondary-200 to-secondary-300 dark:bg-gradient-dark">
      {/* Navigation */}
      <nav className="relative z-10 bg-secondary-800 bg-opacity-95 dark:bg-dark-bg-primary dark:bg-opacity-95 backdrop-blur-sm border-b border-secondary-600 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://imgur.com/qew5kzr.png"
                alt="Divided Finance Master Logo"
                className="h-8 w-8 mr-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              {/*<span className="text-2xl mr-2 hidden">💼</span>*/}
              <span className="text-xl font-bold text-white dark:text-dark-text-primary">Divided Finance Master</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-secondary-200 dark:text-dark-text-secondary hover:text-primary-300 dark:hover:text-primary-400 transition-colors">
                Dashboard
              </Link>
              <Link to="/invoices" className="text-secondary-200 dark:text-dark-text-secondary hover:text-primary-300 dark:hover:text-primary-400 transition-colors">
                Create Invoice
              </Link>
              <Link to="/clients" className="text-secondary-200 dark:text-dark-text-secondary hover:text-primary-300 dark:hover:text-primary-400 transition-colors">
                Clients
              </Link>
              <Link to="/history" className="text-secondary-200 dark:text-dark-text-secondary hover:text-primary-300 dark:hover:text-primary-400 transition-colors">
                History
              </Link>
              <Link
                to="/invoices"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo Showcase */}
            <div className="mb-12">
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500"></div>

                  {/* Main logo */}
                  <img
                    src="https://imgur.com/qew5kzr.png"
                    alt="Divided Finance Master Logo"
                    className="relative w-64 h-64 object-contain drop-shadow-2xl group-hover:scale-105 animate-logo-glow transition-all duration-500 z-10"
                    style={{ minWidth: '125px', minHeight: '125px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />

                  {/* Fallback if logo doesn't load */}
                  <div className="hidden w-64 h-64 bg-gradient-primary rounded-2xl items-center justify-center shadow-2xl group-hover:scale-105 animate-logo-glow transition-all duration-500 z-10">
                    <span className="text-8xl animate-float"><img width="125px" height="125px" src="https://imgur.com/qew5kzr.png" alt="Divided Finance Master Logo" className="h-8 w-8 mr-3" /></span>
                  </div>

                  {/* Decorative floating elements */}
                  <div className="absolute -top-6 -left-6 w-8 h-8 bg-primary-400 rounded-full opacity-30 animate-pulse"></div>
                  <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-accent-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 -left-10 w-4 h-4 bg-secondary-400 rounded-full opacity-35 animate-pulse delay-500"></div>
                  <div className="absolute top-1/4 -right-8 w-5 h-5 bg-primary-300 rounded-full opacity-30 animate-pulse delay-700"></div>
                  <div className="absolute bottom-1/4 -left-6 w-3 h-3 bg-accent-300 rounded-full opacity-25 animate-pulse delay-300"></div>
                  <div className="absolute top-3/4 -right-4 w-7 h-7 bg-secondary-300 rounded-full opacity-20 animate-pulse delay-1200"></div>

                  {/* Orbital rings */}
                  <div className="absolute inset-0 border-2 border-primary-200 dark:border-primary-800 rounded-full opacity-20 animate-spin" style={{ animationDuration: '20s' }}></div>
                  <div className="absolute inset-4 border border-accent-200 dark:border-accent-800 rounded-full opacity-15 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-secondary-800 dark:text-dark-text-primary mb-6 leading-tight">
                Divided Finance Master
                <span className="block bg-gradient-primary bg-clip-text text-transparent font-display">
                  Stunning Invoices
                </span>
                <span className="block text-4xl md:text-5xl text-secondary-700 dark:text-dark-text-secondary font-body font-normal">
                  in Minutes
                </span>
              </h1>

              <p className="text-xl md:text-2xl font-body text-secondary-700 dark:text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
                The most beautiful and intuitive invoice generator.
                <span className="font-semibold text-secondary-800 dark:text-dark-text-primary"> No sign-up required.</span>
                <span className="block mt-2">Start creating professional invoices right now.</span>
              </p>

              {/* Privacy Notice */}
              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-lg max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-primary-600 dark:text-primary-400 mr-2">🔒</span>
                  <span className="font-semibold text-primary-800 dark:text-primary-200">100% Private & Secure</span>
                </div>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  All your data is saved locally in your browser. Nothing is stored on our servers.
                  Your invoices, clients, and company information remain completely private and under your control.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/invoices"
                className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-primary rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <img src="https://img.icons8.com/stickers/32/000000/rocket.png" alt="Rocket" className="mr-2 w-6 h-6" />
                Create Your First Invoice
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-secondary-800 dark:text-dark-text-primary bg-secondary-100 dark:bg-dark-bg-secondary border-2 border-secondary-300 dark:border-secondary-700 rounded-xl hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <img src="https://img.icons8.com/stickers/32/000000/dashboard.png" alt="Dashboard" className="mr-2 w-6 h-6" />
                View Dashboard
              </Link>
            </div>

            {/* Stats */}
            {stats.totalInvoices > 0 && (
              <div className="inline-flex items-center space-x-8 px-6 py-3 bg-white dark:bg-dark-bg-secondary rounded-full shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.totalInvoices}</div>
                  <div className="text-sm text-secondary-600 dark:text-dark-text-secondary">Invoices Created</div>
                </div>
                <div className="w-px h-8 bg-secondary-200 dark:bg-secondary-700"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                    ${stats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-dark-text-secondary">Total Revenue</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 dark:text-dark-text-primary mb-4">
            Get Started in Seconds
          </h2>
          <p className="text-lg text-secondary-700 dark:text-dark-text-secondary max-w-2xl mx-auto">
            Choose what you'd like to do first. Everything is designed to be intuitive and fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`group relative p-6 bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white overflow-hidden`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-300"></div>

              <div className="relative">
                <div className="mb-4 flex justify-center">{action.icon}</div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-white text-opacity-90 text-sm">{action.description}</p>

                <div className="mt-4 inline-flex items-center text-sm font-medium">
                  Get Started
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-dark-bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-dark-text-primary mb-4">
              Why Choose Our Invoice Generator?
            </h2>
            <p className="text-lg text-secondary-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
              Built with modern technology and designed for real businesses.
              Every feature is crafted to save you time and make you look professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-primary-50 dark:bg-secondary-800 rounded-2xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 dark:hover:from-secondary-800 dark:hover:to-primary-900 transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-dark-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-dark-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      {stats.recentActivity.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-dark-text-primary mb-4">
              Your Recent Activity
            </h2>
            <p className="text-lg text-secondary-600 dark:text-dark-text-secondary">
              Keep track of your latest invoices and continue where you left off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.recentActivity.map((invoice, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-primary-100 dark:border-secondary-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <img src="https://img.icons8.com/stickers/32/000000/invoice.png" alt="Invoice" className="w-8 h-8" />
                  <span className="text-xs text-secondary-500 dark:text-dark-text-secondary">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">
                  {invoice.invoiceNumber || 'Draft Invoice'}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-dark-text-secondary mb-3">
                  {invoice.selectedClient?.name || 'No client assigned'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-accent-600 dark:text-accent-400">
                    ${(invoice.items || []).reduce((sum, item) =>
                      sum + ((item.quantity || 0) * (item.rate || 0)), 0
                    ).toLocaleString()}
                  </span>
                  <Link
                    to="/history"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-primary py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Create Your First Invoice?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who trust our invoice generator.
            Start creating professional invoices in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/invoices"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-50 transform hover:scale-105 transition-all duration-200"
            >
              <img src="https://img.icons8.com/stickers/32/000000/rocket.png" alt="Rocket" className="mr-2 w-6 h-6" />
              Start Creating Now
            </Link>

            <Link
              to="/settings"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white border-opacity-30 rounded-xl hover:bg-white hover:bg-opacity-10 transform hover:scale-105 transition-all duration-200"
            >
              <img src="https://img.icons8.com/stickers/32/000000/settings.png" alt="Settings" className="mr-2 w-6 h-6" />
              Customize Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary-900 dark:bg-dark-bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src="https://imgur.com/a/BdEcE1V"
                  alt="Divided Finance Master Logo"
                  className="h-8 w-8 mr-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
                <span className="text-2xl mr-2 hidden"><img src="https://imgur.com/qew5kzr.png" alt="Divided Finance Master Logo" className="h-8 w-8 mr-3" /></span>
                <span className="text-xl font-bold">Divided Finance Master</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Complete open source invoicing system. Beautiful, intuitive, and completely private.
                All your data stays in your browser - nothing is stored on our servers.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/bloodchild8906/Divided-Finance-Master" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Features
              </h3>
              <ul className="space-y-2">
                <li><a href="/invoices" className="text-gray-300 hover:text-white transition-colors">Invoice Creation</a></li>
                <li><a href="/clients" className="text-gray-300 hover:text-white transition-colors">Client Management</a></li>
                <li><a href="/data-management" className="text-gray-300 hover:text-white transition-colors">Data Backup</a></li>
                <li><a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li><a href="/documentation" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Divided Finance Master. Open source invoicing made with ❤️ for businesses worldwide.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Built with</span>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">React</span>
                <span className="text-gray-500">•</span>
                <span className="text-blue-400">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;