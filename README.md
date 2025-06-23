# Divided Finance Master

Divided Finance Master is a fully offline, open-source invoicing and quotation app built with React and Tailwind CSS. It supports multi-currency, local storage persistence, PDF export, theming, and client management.

## 🌍 Features

- International currency support with symbols
- Theme editor (background, text, accent colors)
- Client management modal
- Multi-page PDF export
- LocalStorage persistence (no server or backend needed)
- Import/Export invoices as JSON
- Dark mode by default
- GitHub Pages deployment ready

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Install & Run

```bash
npm install
npm start
```

To build for production:

```bash
npm run build
```

### Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Add the following to `package.json`:

```json
"homepage": "https://<your-username>.github.io/divided-finance-master"
```

3. Add the GitHub Actions workflow under `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './build'
      - uses: actions/deploy-pages@v4
```

## 🛡️ Privacy

All data is stored locally in your browser using `localStorage`. Nothing is tracked or sent to any server.

## 📝 License

MIT
