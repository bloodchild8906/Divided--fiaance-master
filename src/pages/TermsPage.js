﻿import React from 'react';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-secondary-200 to-secondary-400 dark:bg-gradient-dark">
      <div className="bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-dark-text-primary mb-4">
              Terms and Conditions
            </h1>
            <p className="text-secondary-600 dark:text-dark-text-secondary">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-secondary dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                By accessing and using Divided Finance Master ("the Application"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                2. Description of Service
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                Divided Finance Master is a free, open-source invoice generation application that operates entirely within your web browser. The application allows you to:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li>Create and customize professional invoices</li>
                <li>Manage client information</li>
                <li>Track invoice history and analytics</li>
                <li>Export invoices to PDF format</li>
                <li>Store data locally in your browser</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                3. Privacy and Data Storage
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                <strong>Local Storage Only:</strong> All your data is stored locally in your browser's storage. We do not collect, store, or transmit any of your personal or business information to external servers.
              </p>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                <strong>No User Accounts:</strong> The application does not require user registration or account creation. No personal information is collected during usage.
              </p>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                <strong>Data Responsibility:</strong> You are solely responsible for backing up your data. We recommend regularly exporting your data using the built-in export feature.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                4. Open Source License
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                This application is released under the MIT License. You are free to use, modify, and distribute the software in accordance with the license terms. The source code is available on GitHub.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                5. Disclaimer of Warranties
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                The application is provided "as is" without any representations or warranties, express or implied. We make no representations or warranties in relation to this application or the information and materials provided.
              </p>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                We do not warrant that:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li>The application will be constantly available or available at all</li>
                <li>The information on this application is complete, true, accurate, or non-misleading</li>
                <li>The application will meet your specific requirements</li>
                <li>The application will be uninterrupted, timely, secure, or error-free</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                In no event shall the developers or contributors be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence, or other tort, arising out of or in connection with the use of the application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                7. User Responsibilities
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                You agree to use the application responsibly and in accordance with applicable laws. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 dark:text-dark-text-secondary mb-4">
                <li>Ensuring the accuracy of information entered into invoices</li>
                <li>Complying with local tax and business regulations</li>
                <li>Backing up your data regularly</li>
                <li>Using the application for lawful purposes only</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                8. Modifications to Terms
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the application after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                9. Governing Law
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where the application is hosted, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-dark-text-primary mb-4">
                10. Contact Information
              </h2>
              <p className="text-secondary-700 dark:text-dark-text-secondary mb-4">
                For questions about these Terms and Conditions, please visit our Help Center or create an issue on our GitHub repository.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-secondary-200 dark:border-secondary-700">
            <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-2xl mr-3">ℹ️</div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-1">
                    Open Source & Transparent
                  </h3>
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    This application is completely open source. You can review the code, contribute improvements, or host your own version. 
                    All data processing happens locally in your browser for maximum privacy.
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

export default TermsPage;
