﻿﻿﻿﻿﻿﻿﻿﻿import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: <img src="https://img.icons8.com/stickers/24/000000/home.png" alt="Home" className="w-5 h-5" /> },
    { name: 'Dashboard', href: '/dashboard', icon: <img src="https://img.icons8.com/stickers/24/000000/dashboard.png" alt="Dashboard" className="w-5 h-5" /> },
    { name: 'Create Invoice', href: '/invoices', icon: <img src="https://img.icons8.com/stickers/24/000000/invoice.png" alt="Invoice" className="w-5 h-5" /> },
    { name: 'Clients', href: '/clients', icon: <img src="https://img.icons8.com/stickers/24/000000/group.png" alt="Clients" className="w-5 h-5" /> },
    { name: 'History', href: '/history', icon: <img src="https://img.icons8.com/stickers/24/000000/list.png" alt="History" className="w-5 h-5" /> },
    { name: 'Data Backup', href: '/data-management', icon: <img src="https://img.icons8.com/stickers/24/000000/save.png" alt="Data Backup" className="w-5 h-5" /> },
    { name: 'Help', href: '/help', icon: <img src="https://img.icons8.com/stickers/24/000000/help.png" alt="Help" className="w-5 h-5" /> },
    { name: 'Settings', href: '/settings', icon: <img src="https://img.icons8.com/stickers/24/000000/settings.png" alt="Settings" className="w-5 h-5" /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-dark-bg-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/images/logo.png"
                  alt="Divided Finance Master Logo"
                  className="h-8 w-8"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
                <span className="text-2xl hidden">💼</span>
                <span className="text-xl font-heading font-bold text-secondary-900 dark:text-dark-text-primary">
                  Divided Finance Master
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-primary-100 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
