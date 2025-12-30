# 🚀 GitHub & Vercel Deployment Guide

## ⚠️ SECURITY CHECKLIST - DO THIS FIRST!

### Before Pushing to GitHub:

1. **✅ Verify .env.local is NOT in repository**
   ```bash
   git status
   # Should NOT show .env.local
   ```

2. **✅ Verify no secrets in code**
   - Check all .md files don't have real credentials
   - Check no API keys in code
   - Check no secrets in comments

3. **✅ Test with placeholder env vars**
   - Make sure app works with placeholder values
   - Verify documentation uses placeholders

4. **✅ Review .gitignore**
   ```bash
   cat .gitignore
   # Should include .env*
   ```

---

## 📤 Step 1: Push to GitHub

### Create GitHub Repository:

1. Go to [github.com](https://github.com) and create new repository
2. Name it: `focus-refresh` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license
4. Copy the repository URL

### Push Your Code:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Check what you're adding (IMPORTANT!)
git status
# Verify .env.local is NOT listed

# Commit
git commit -m "Initial commit: Focus Refresh - 50+ mini-games"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/focus-refresh.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Verify Push:

1. Go to your GitHub repository
2. Check that `.env.local` is **NOT** visible
3. Check that no secrets are in any files

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
   - Sign in with GitHub
   - Click "Add New Project"

2. **Import Repository**
   - Select your `focus-refresh` repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Set Environment Variables** (CRITICAL!)
   - Click "Environment Variables"
   - Add these variables:
     ```
     GOOGLE_CLIENT_ID=your_actual_client_id
     GOOGLE_CLIENT_SECRET=your_actual_client_secret
     NEXTAUTH_URL=https://your-project.vercel.app
     NEXTAUTH_SECRET=your_generated_secret
     ```
   - **Generate NEXTAUTH_SECRET:**
     ```bash
     openssl rand -base64 32
     ```
   - Click "Save" for each variable

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at: `https://your-project.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Your account)
# - Link to existing project? No
# - Project name? focus-refresh
# - Directory? ./
# - Override settings? No

# Set environment variables
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET

# Deploy to production
vercel --prod
```

---

## 🔧 Step 3: Update Google OAuth Settings

### Add Production URLs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click your OAuth 2.0 Client ID
3. Under "Authorized JavaScript origins", add:
   ```
   https://your-project.vercel.app
   ```
4. Under "Authorized redirect URIs", add:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
5. **Click SAVE** (important!)

---

## ✅ Step 4: Verify Deployment

1. **Visit your live URL:**
   ```
   https://your-project.vercel.app
   ```

2. **Test Sign-In:**
   - Click "Sign In"
   - Should redirect to Google
   - After sign-in, should redirect back

3. **Test Features:**
   - Play a game
   - Check profile
   - Verify data saves

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- ✅ Every push to `main` = Auto-deploy to production
- ✅ Every PR = Preview deployment
- ✅ Zero configuration needed!

---

## 🔒 Security Reminders

### ✅ DO:
- Keep `.env.local` local only
- Use Vercel environment variables for production
- Generate new NEXTAUTH_SECRET for production
- Use HTTPS (automatic on Vercel)
- Review Google OAuth settings

### ❌ DON'T:
- Commit `.env.local` to GitHub
- Share secrets in documentation
- Use development secrets in production
- Expose API keys in code

---

## 🐛 Troubleshooting

### Build Fails:
- Check environment variables are set in Vercel
- Check build logs in Vercel dashboard
- Verify `npm run build` works locally

### Sign-In Doesn't Work:
- Verify Google OAuth URLs are correct
- Check environment variables in Vercel
- Verify NEXTAUTH_URL matches your domain

### Data Not Saving:
- Check browser console for errors
- Verify localStorage is enabled
- Check storage quota

---

## 📝 Next Steps

1. ✅ Test all features on production
2. ✅ Share your URL on LinkedIn
3. ✅ Monitor Vercel analytics
4. ✅ Collect user feedback

**Your app is now live! 🎉**

