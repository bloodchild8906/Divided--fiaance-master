﻿﻿﻿﻿﻿﻿import React, { useState } from 'react';

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create my first invoice?",
      answer: "Navigate to the 'Create Invoice' page, fill in your company information, add a client, and add invoice items. The system will automatically calculate totals and generate a professional invoice."
    },
    {
      question: "Where is my data stored?",
      answer: "All your data is stored locally in your browser's localStorage. Nothing is sent to external servers. This ensures complete privacy and means your data is always under your control."
    },
    {
      question: "How do I backup my data?",
      answer: "Go to Settings > Data Management and click 'Export All Data'. This will download a JSON file containing all your invoices, clients, and settings. Store this file safely as your backup."
    },
    {
      question: "Can I use this on multiple devices?",
      answer: "Since data is stored locally, each device will have its own data. To sync between devices, export your data from one device and import it on another using the Data Management features."
    },
    {
      question: "How do I add my company logo?",
      answer: "In the invoice form, look for the company information section. There's an option to upload your logo. The logo will be displayed on all your invoices."
    },
    {
      question: "What happens if I clear my browser data?",
      answer: "Clearing browser data will delete all your invoices and settings. Always export your data regularly as a backup before clearing browser data."
    },
    {
      question: "Can I customize the invoice design?",
      answer: "Yes! The app includes theme customization options. You can change colors, fonts, and layout elements to match your brand."
    },
    {
      question: "How do I export invoices to PDF?",
      answer: "Each invoice has an 'Export to PDF' button. Click it to generate and download a professional PDF version of your invoice."
    },
    {
      question: "Is there a limit to how many invoices I can create?",
      answer: "The only limit is your browser's storage capacity, which is typically several megabytes. You can create thousands of invoices without issues."
    },
    {
      question: "How do I manage my clients?",
      answer: "Go to the 'Clients' page to add, edit, or delete client information. You can then select clients when creating invoices."
    }
  ];

  const quickActions = [
    {
      title: "Create Invoice",
      description: "Start creating your first invoice",
      icon: "📄",
      link: "/invoices"
    },
    {
      title: "Manage Clients",
      description: "Add and organize your clients",
      icon: "👥",
      link: "/clients"
    },
    {
      title: "Data Backup",
      description: "Export and backup your data",
      icon: "💾",
      link: "/settings"
    },
    {
      title: "View Documentation",
      description: "Detailed user guide",
      icon: "📚",
      link: "/documentation"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-secondary-200 to-secondary-400 dark:bg-gradient-dark">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-dark-text-primary mb-4">
          Help Center
        </h1>
        <p className="text-lg text-secondary-600 dark:text-dark-text-secondary">
          Find answers to common questions and learn how to get the most out of Divided Finance Master.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <a
            key={index}
            href={action.link}
            className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary-100 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600"
          >
            <div className="text-4xl mb-4">{action.icon}</div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">
              {action.title}
            </h3>
            <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
              {action.description}
            </p>
          </a>
        ))}
      </div>

      {/* Getting Started */}
      <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
            🚀 Getting Started
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">
                Set Up Company Info
              </h3>
              <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Add your business details, logo, and contact information in the invoice form.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">
                Add Clients
              </h3>
              <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Go to the Clients page to add your customer information for easy selection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-text-primary mb-2">
                Create Invoices
              </h3>
              <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                Start creating professional invoices with automatic calculations and PDF export.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
            ❓ Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors duration-200"
                >
                  <span className="font-medium text-secondary-900 dark:text-dark-text-primary">
                    {faq.question}
                  </span>
                  <span className="text-primary-600 dark:text-primary-400 text-xl">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-secondary-700 dark:text-dark-text-secondary">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-text-primary mb-6">
            ✨ Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="text-2xl mr-4">🔒</div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-1">
                  Privacy First
                </h3>
                <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                  All data stored locally in your browser. No servers, no tracking, complete privacy.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-2xl mr-4">📱</div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-1">
                  Mobile Responsive
                </h3>
                <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                  Works perfectly on desktop, tablet, and mobile devices.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-2xl mr-4">🎨</div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-1">
                  Customizable Design
                </h3>
                <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                  Customize colors, themes, and branding to match your business.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-2xl mr-4">📊</div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-1">
                  Analytics Dashboard
                </h3>
                <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                  Track your invoicing performance with built-in analytics.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-2xl mr-4">💾</div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-1">
                  Data Backup
                </h3>
                <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                  Export and import your data for backup and migration.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-2xl mr-4">🔓</div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-text-primary mb-1">
                  Open Source
                </h3>
                <p className="text-sm text-secondary-600 dark:text-dark-text-secondary">
                  Complete transparency with open source code on GitHub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-3xl mr-4">💡</div>
          <div>
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mb-2">
              Need More Help?
            </h3>
            <p className="text-primary-700 dark:text-primary-300 mb-4">
              Can't find what you're looking for? Check out our detailed documentation or visit our GitHub repository.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/documentation"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
              >
                📚 View Documentation
              </a>
              <a
                href="https://github.com/bloodchild8906/Divided-Finance-Master"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors duration-200"
              >
                🐙 GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
