# Deployment Guide - Restaurant Hub

This guide will walk you through the process of deploying the Restaurant Hub website to GitHub and making it live.

## 🚀 Prerequisites

Before starting, ensure you have:
- [Git](https://git-scm.com/) installed on your computer
- A [GitHub account](https://github.com/)
- Access to the [Kodara-HQ/Restaurant](https://github.com/Kodara-HQ/Restaurant) repository

## 📋 Step-by-Step Deployment

### Step 1: Initialize Git Repository (if not already done)

```bash
# Navigate to your project directory
cd /path/to/your/Restaurant

# Initialize git repository
git init

# Add remote origin
git remote add origin https://github.com/Kodara-HQ/Restaurant.git
```

### Step 2: Add All Files to Git

```bash
# Add all files to staging
git add .

# Check status
git status
```

### Step 3: Create Initial Commit

```bash
# Create your first commit
git commit -m "Initial commit: Restaurant Hub website with 4 restaurants

- Complete restaurant management system
- Responsive design with Bootstrap 5
- Shopping cart functionality
- WhatsApp integration
- Image carousels for each restaurant
- Comprehensive documentation"
```

### Step 4: Push to GitHub

```bash
# Push to main branch
git push -u origin main

# If you get an error about the branch name, try:
git push -u origin master
```

### Step 5: Verify Upload

1. Visit [https://github.com/Kodara-HQ/Restaurant](https://github.com/Kodara-HQ/Restaurant)
2. Check that all files are uploaded
3. Verify the README.md displays correctly

## 🌐 Enable GitHub Pages

### Step 1: Go to Repository Settings

1. In your GitHub repository, click on **Settings** tab
2. Scroll down to **Pages** section in the left sidebar

### Step 2: Configure GitHub Pages

1. **Source**: Select "Deploy from a branch"
2. **Branch**: Select "main" (or "master")
3. **Folder**: Select "/ (root)"
4. Click **Save**

### Step 3: Wait for Deployment

- GitHub will build and deploy your site
- This usually takes 2-5 minutes
- You'll see a green checkmark when deployment is complete

### Step 4: Access Your Live Site

Your site will be available at:
`https://kodara-hq.github.io/Restaurant/`

## 🔄 Updating the Website

### For Future Updates

```bash
# Make your changes to files

# Add changes
git add .

# Commit changes
git commit -m "Update: [describe your changes]"

# Push to GitHub
git push origin main
```

GitHub Pages will automatically rebuild and deploy your site with the updates.

## 🛠️ Troubleshooting

### Common Issues

#### 1. **Permission Denied Error**
```bash
# Check if you have access to the repository
# Ensure you're logged in with the correct GitHub account
git config --global user.name "Your GitHub Username"
git config --global user.email "your-email@example.com"
```

#### 2. **Branch Name Issues**
```bash
# Check current branch
git branch

# If you're on 'master' instead of 'main'
git branch -M main
git push -u origin main
```

#### 3. **Large File Issues**
```bash
# If you have large image files, consider optimizing them
# Use tools like TinyPNG or ImageOptim
# Ensure images are under 100MB total
```

#### 4. **GitHub Pages Not Working**
- Check repository settings
- Ensure the repository is public
- Wait for deployment to complete
- Check for any build errors in the Actions tab

## 📱 Testing Your Deployment

### Local Testing
```bash
# Test locally before pushing
python -m http.server 8000
# Then visit http://localhost:8000
```

### Post-Deployment Testing
1. **Desktop**: Test on different screen sizes
2. **Mobile**: Test on mobile devices
3. **Cross-browser**: Test on Chrome, Firefox, Safari, Edge
4. **Functionality**: Test cart, navigation, and all features

## 🎯 Best Practices

### Code Organization
- Keep file names descriptive and consistent
- Use proper HTML semantics
- Optimize images for web
- Test responsive design thoroughly

### Git Workflow
- Write clear commit messages
- Push regularly to avoid conflicts
- Use branches for major features
- Keep the main branch stable

### Performance
- Optimize image sizes
- Minimize CSS and JavaScript
- Use CDN for external libraries
- Enable browser caching

## 🔗 Useful Links

- [GitHub Pages Documentation](https://pages.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Search GitHub documentation
3. Check repository issues
4. Contact the development team

---

**Happy Deploying! 🚀**

Your Restaurant Hub website will be live and accessible to customers worldwide once deployed to GitHub Pages.
