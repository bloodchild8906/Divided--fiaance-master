# 🚀 Deployment Guide

This guide explains how to deploy Divided Finance Master to GitHub Pages using GitHub Actions.

## Automatic Deployment Setup

### Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **GitHub Pages Enabled**: Enable GitHub Pages in repository settings
3. **Workflow Permissions**: Ensure GitHub Actions has write permissions

### Setup Steps

#### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**

#### 2. Configure Repository Settings

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**

#### 3. Verify Configuration Files

The repository includes these pre-configured files:

**`.github/workflows/deploy.yml`** - GitHub Actions workflow
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main, master ]
# ... (workflow configuration)
```

**`package.json`** - Homepage configuration
```json
{
  "homepage": "https://bloodchild8906.github.io/Divided-Finance-Master",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Deployment Process

#### Automatic Deployment

1. **Push to main/master branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **GitHub Actions automatically**:
   - ✅ Checks out the code
   - ✅ Sets up Node.js 18
   - ✅ Installs dependencies
   - ✅ Builds the application
   - ✅ Deploys to GitHub Pages

3. **Access your live site**:
   - URL: https://bloodchild8906.github.io/Divided-Finance-Master
   - Usually available within 2-5 minutes

#### Manual Deployment

If you prefer manual deployment:

```bash
# Install gh-pages if not already installed
npm install --save-dev gh-pages

# Deploy manually
npm run deploy
```

## Monitoring Deployment

### Check Deployment Status

1. Go to **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Monitor the build and deployment progress

### Troubleshooting

#### Common Issues

1. **Build Fails**:
   - Check the Actions log for error details
   - Ensure all dependencies are properly listed in package.json
   - Verify Node.js version compatibility

2. **Deployment Fails**:
   - Check GitHub Pages settings
   - Verify workflow permissions
   - Ensure the repository is public or you have GitHub Pro

3. **Site Not Loading**:
   - Wait 5-10 minutes for DNS propagation
   - Check if the homepage URL in package.json is correct
   - Verify the build folder contains the correct files

#### Debug Steps

1. **Check Build Locally**:
   ```bash
   npm run build
   # Verify build folder is created successfully
   ```

2. **Test Production Build**:
   ```bash
   npm install -g serve
   serve -s build
   # Test at http://localhost:3000
   ```

3. **Check GitHub Actions Logs**:
   - Go to Actions tab
   - Click on failed workflow
   - Expand each step to see detailed logs

## Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file**:
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. **Configure DNS**:
   - Add CNAME record pointing to `bloodchild8906.github.io`

3. **Update package.json**:
   ```json
   "homepage": "https://yourdomain.com"
   ```

## Environment Variables

For production builds, you can set environment variables in the workflow:

```yaml
- name: Build application
  run: npm run build
  env:
    REACT_APP_VERSION: ${{ github.sha }}
    PUBLIC_URL: /Divided-Finance-Master
```

## Security Considerations

1. **No Secrets Required**: This is a client-side application with no backend
2. **Local Storage Only**: All data is stored in the user's browser
3. **No API Keys**: No external services requiring authentication
4. **HTTPS**: GitHub Pages provides HTTPS by default

## Performance Optimization

The build process includes:

- ✅ **Code Splitting**: Automatic code splitting for optimal loading
- ✅ **Minification**: JavaScript and CSS minification
- ✅ **Compression**: Gzip compression for smaller file sizes
- ✅ **Caching**: Proper cache headers for static assets

## Maintenance

### Regular Updates

1. **Dependencies**: Keep dependencies updated
   ```bash
   npm audit
   npm update
   ```

2. **Security**: Monitor for security vulnerabilities
   ```bash
   npm audit fix
   ```

3. **Performance**: Monitor build times and bundle sizes

### Backup Strategy

Since this uses local storage:
- Users should regularly export their data using the backup feature
- Consider adding backup reminders in the UI
- Document the backup/restore process for users

---

**Need Help?** 
- Check the [Issues](https://github.com/bloodchild8906/Divided-Finance-Master/issues) page
- Review GitHub Actions documentation
- Contact the maintainers
