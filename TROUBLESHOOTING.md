# Google Login Troubleshooting Guide

## Step 1: Create .env.local File

Create a file named `.env.local` in the root directory with:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Step 2: Verify Google Console Settings

1. Go to https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", make sure you have:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Under "Authorized JavaScript origins", make sure you have:
   ```
   http://localhost:3000
   ```
5. **IMPORTANT**: Click "SAVE" after making changes

## Step 3: Restart Dev Server

After creating/updating `.env.local`, you MUST restart the dev server:

1. Stop the current server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 4: Check Browser Console

Open browser DevTools (F12) and check the Console tab for any errors.

## Common Errors:

### Error: "Invalid client"
- Check that Client ID and Secret are correct in `.env.local`
- Make sure there are no extra spaces or quotes

### Error: "Redirect URI mismatch"
- Verify the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Make sure you clicked SAVE in Google Console

### Error: "Access blocked"
- Go to OAuth consent screen in Google Console
- Add your email as a test user
- Make sure the app is in "Testing" mode (not "In production")

### Error: "NEXTAUTH_SECRET is missing"
- Make sure `.env.local` has the NEXTAUTH_SECRET line
- Restart the dev server after adding it

## Test Steps:

1. Go to http://localhost:3000
2. Click "Sign In" in header
3. Click "Continue with Google"
4. You should be redirected to Google sign-in page
5. After signing in, you should be redirected back to the app


