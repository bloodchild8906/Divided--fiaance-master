# 💼 Divided Finance Master

> **Complete Open Source Invoicing System**
> Beautiful, intuitive, and completely private invoice generator with all data stored locally in your browser.

![Divided Finance Master](./public/images/logo.png)

## 📊 Status & Monitoring

[![🚀 Deploy to GitHub Pages](https://github.com/bloodchild8906/Divided-Finance-Master/actions/workflows/deploy.yml/badge.svg)](https://github.com/bloodchild8906/Divided-Finance-Master/actions/workflows/deploy.yml)
[![🔍 Code Quality & Security Check](https://github.com/bloodchild8906/Divided-Finance-Master/actions/workflows/quality-check.yml/badge.svg)](https://github.com/bloodchild8906/Divided-Finance-Master/actions/workflows/quality-check.yml)
[![🏥 Health Check & Monitoring](https://github.com/bloodchild8906/Divided-Finance-Master/actions/workflows/health-check.yml/badge.svg)](https://github.com/bloodchild8906/Divided-Finance-Master/actions/workflows/health-check.yml)

### 🎯 Quick Status
- **🌐 Live Site**: [https://bloodchild8906.github.io/Divided-Finance-Master](https://bloodchild8906.github.io/Divided-Finance-Master)
- **📊 Build Status**: Automated deployment with GitHub Actions
- **🔒 Security**: Regular vulnerability scans and dependency updates
- **🏥 Health**: Continuous monitoring every 6 hours
- **📈 Quality**: Automated code quality and performance checks

## 🌟 Features

### 🧾 **Complete Invoicing System**
- 🚀 **Lightning Fast** - Create professional invoices in under 2 minutes
- 🎨 **Beautiful Design** - Stunning, customizable templates with sophisticated color palette
- 💾 **Auto-Save** - Never lose your work with automatic saving
- 📱 **Mobile Ready** - Works perfectly on all devices
- 🔒 **Privacy First** - All data stored locally in your browser - zero server storage
- 🎯 **No Sign-up Required** - Start creating invoices immediately
- 🌙 **Dark Mode Support** - Beautiful dark theme included
- 💰 **Multiple Currencies** - Support for global currencies

### 💰 **Advanced Payment Tracking**
- **Three Payment States**: Unpaid, Partial, Paid
- **Partial Payment Support**: Record multiple partial payments per invoice
- **Automatic Balance Calculation**: Real-time client balance updates
- **Payment History**: Track all payments with dates and amounts
- **Status Management**: Dedicated status button with beautiful modal interface

### 📊 **Smart Analytics & Dashboard**
- **Financial Overview**: Total paid/unpaid amounts with payment rates
- **Invoice Statistics**: Total, paid, partial, unpaid, and overdue invoices
- **Recent Invoices**: Payment status indicators with visual badges
- **Client Balance Tracking**: Automatic unpaid balance and total payments calculation

### 🔒 **Ultra-Safe PDF Generation**
- **Bulletproof PDF System**: Zero font dependencies, uses browser defaults only
- **Error-Protected Generation**: Automatic recovery from font-related errors
- **Professional Layouts**: Clean, professional invoice designs
- **Modal Preview**: Preview invoices before downloading

### 💾 **Complete Data Management**
- **Local Storage**: All data saved in browser (no external database)
- **Complete Backup System**: Export/import all application data as JSON
- **Data Validation**: Ensures backup file integrity
- **Auto-Backup**: Automatic backups before major operations

### 👥 **Advanced Client Management**
- **Client Database**: Organize and manage your clients
- **Balance Tracking**: Automatic unpaid balance and total payments
- **Default Discounts**: Client-specific discount percentages
- **Edit from Anywhere**: Add/edit clients from invoice page or clients page

## Live Demo

Access the live demo [here](https://bloodchild8906.github.io/Divided-Finance-Master)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
git clone https://github.com/bloodchild8906/Divided-Finance-Master.git
cd Divided-Finance-Master

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Build for production:
```bash
npm run build
# or
yarn build
```

## 🚀 Deployment

### Automatic Deployment (GitHub Pages)

This repository is configured with **GitHub Actions** for automatic deployment to GitHub Pages:

1. **Push to main/master branch** - Automatically triggers deployment
2. **GitHub Actions workflow** - Builds and deploys the application
3. **Live at**: https://bloodchild8906.github.io/Divided-Finance-Master

The deployment workflow:
- ✅ Installs Node.js 18
- ✅ Installs dependencies with `npm ci`
- ✅ Builds the application with `npm run build`
- ✅ Deploys to GitHub Pages automatically

### Manual Deployment

You can also deploy manually using:

```bash
npm run deploy
```

This will build the application and deploy it to the `gh-pages` branch.

### Environment Configuration

The application is configured for GitHub Pages with:
- **Homepage**: Set to your GitHub Pages URL
- **Public URL**: Configured for the repository path
- **Build optimization**: Production-ready builds

## 📖 Usage Guide

### Getting Started

1. **Company Setup**
   - Go to Settings → Company Info to set up your business details
   - Click "Use Default Logo" to use the included logo
   - Add payment information and contact details

2. **Client Management**
   - Navigate to Clients to add your customers
   - Set default discount percentages for clients
   - View automatic balance calculations (unpaid vs total payments)

3. **Creating Invoices**
   - Use the Invoice form to create professional invoices
   - Add items with quantities, rates, and descriptions
   - Apply client-specific or invoice-specific discounts
   - Preview invoices with the modal preview system

### Payment Management

4. **Payment Status Tracking**
   - **Unpaid**: Default state for new invoices
   - **Partial**: Click "Status" button to enter partial payment amounts
   - **Paid**: Mark invoice as fully paid
   - View payment status in dashboard and invoice history

5. **Invoice History**
   - **Edit**: Modify any invoice fields with automatic balance updates
   - **Status**: Use the dedicated status button for payment management
   - **PDF**: Download bulletproof PDFs with error protection
   - **Delete**: Remove invoices with confirmation

### Data Management

6. **Backup & Export**
   - **Export**: Click "Backup Data" on dashboard to download complete backup
   - **Import**: Restore from backup files with data validation
   - **Auto-backup**: System creates automatic backups before major changes

7. **Theme Customization**
   - Change primary colors with the sophisticated color palette
   - Customize fonts and layout elements
   - Switch between light and dark themes

## Tech Stack

- React
- Tailwind CSS
- @react-pdf/renderer
- react-color
- react-toastify
- currency-symbol-map

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Team
- Tailwind CSS Team
- All contributors and supporters

## Support

For support, email your-email@example.com or open an issue in the repository.
