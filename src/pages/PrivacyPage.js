﻿import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-secondary-200 to-secondary-400 dark:bg-gradient-dark">
      <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-dark-text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-secondary-600 dark:text-dark-text-secondary">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">🔒</div>
              <div>
                <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200">
                  100% Private & Secure
                </h2>
                <p className="text-primary-700 dark:text-primary-300">
                  Your data never leaves your browser. Zero server storage, complete privacy guaranteed.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-secondary dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                1. Our Privacy Commitment
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                Divided Finance Master is built with privacy as the foundation. We believe your business data should remain private and under your complete control. This privacy policy explains how we achieve this commitment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                2. Data Storage - Local Only
              </h2>
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  ✅ What We Do
                </h3>
                <ul className="list-disc pl-6 text-green-700 dark:text-green-300">
                  <li>Store all data locally in your browser's localStorage</li>
                  <li>Process all data client-side in your browser</li>
                  <li>Generate PDFs locally without server interaction</li>
                  <li>Provide export/import features for your data control</li>
                </ul>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  ❌ What We DON'T Do
                </h3>
                <ul className="list-disc pl-6 text-red-700 dark:text-red-300">
                  <li>Send your data to any external servers</li>
                  <li>Store your information in databases</li>
                  <li>Track your usage or behavior</li>
                  <li>Require user accounts or personal information</li>
                  <li>Use cookies for tracking purposes</li>
                  <li>Share data with third parties</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                3. Information We Process Locally
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                The following information is processed and stored locally in your browser:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li><strong>Company Information:</strong> Your business details, logo, and contact information</li>
                <li><strong>Client Data:</strong> Client names, addresses, and contact details you enter</li>
                <li><strong>Invoice Data:</strong> Invoice items, amounts, dates, and payment terms</li>
                <li><strong>Application Settings:</strong> Theme preferences, currency settings, and customizations</li>
                <li><strong>Usage Preferences:</strong> Dark mode settings and other UI preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                4. No User Accounts Required
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                Divided Finance Master operates without user accounts, which means:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li>No email addresses or personal information required</li>
                <li>No passwords or authentication systems</li>
                <li>No user profiles or account management</li>
                <li>No login tracking or session monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                5. Technical Implementation
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                Our privacy-first approach is implemented through:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li><strong>Client-Side Processing:</strong> All calculations and data processing happen in your browser</li>
                <li><strong>Local Storage API:</strong> Data is stored using browser's built-in localStorage</li>
                <li><strong>No Network Requests:</strong> No data transmission to external servers</li>
                <li><strong>Static Hosting:</strong> The application is served as static files</li>
                <li><strong>Open Source:</strong> Complete transparency with publicly available code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                6. Data Control and Portability
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                You have complete control over your data:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li><strong>Export:</strong> Download all your data in JSON format anytime</li>
                <li><strong>Import:</strong> Restore data from backup files</li>
                <li><strong>Delete:</strong> Clear all data with one click</li>
                <li><strong>Backup:</strong> Create regular backups for data security</li>
                <li><strong>Migration:</strong> Move data between devices using export/import</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                7. Browser Storage Limitations
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                Important considerations about local storage:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li>Data is tied to your specific browser and device</li>
                <li>Clearing browser data will remove your invoices</li>
                <li>Private/incognito browsing may not persist data</li>
                <li>Browser updates rarely affect localStorage, but backups are recommended</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                8. Third-Party Services
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                The application may be hosted on third-party platforms (like GitHub Pages), but:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li>Hosting providers only serve static files</li>
                <li>No dynamic server-side processing occurs</li>
                <li>Standard web server logs may record page visits (not data)</li>
                <li>No analytics or tracking scripts are included</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                9. Security Measures
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                While we don't store your data, we implement security best practices:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li>HTTPS encryption for application delivery</li>
                <li>No external script dependencies that could compromise privacy</li>
                <li>Regular security updates to dependencies</li>
                <li>Open source code for security auditing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                10. Changes to Privacy Policy
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                Any changes to this privacy policy will be posted on this page. Given our privacy-first architecture, changes are unlikely to affect data handling practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                11. Questions and Transparency
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                For questions about our privacy practices:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li>Review our open source code on GitHub</li>
                <li>Check our Help Center for technical details</li>
                <li>Create an issue on GitHub for specific questions</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-secondary-200 dark:border-secondary-700">
            <div className="bg-accent-50 dark:bg-accent-900 rounded-lg p-6">
              <div className="flex items-center">
                <div className="text-3xl mr-4">🛡️</div>
                <div>
                  <h3 className="text-xl font-semibold text-accent-800 dark:text-accent-200 mb-2">
                    Privacy by Design
                  </h3>
                  <p className="text-accent-700 dark:text-accent-300">
                    Privacy isn't an afterthought—it's built into the core architecture of Divided Finance Master. 
                    Your business data stays where it belongs: with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
