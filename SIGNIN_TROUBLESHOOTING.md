# Sign-In Troubleshooting Guide

## Quick Fixes Applied

✅ Simplified sign-in flow to use NextAuth's built-in redirect
✅ Added `trustHost: true` for better URL handling
✅ Removed manual redirect logic

## Step-by-Step Fix

### 1. Verify Google Console Configuration

Go to: https://console.cloud.google.com/apis/credentials

**Click your OAuth 2.0 Client ID**

**Authorized redirect URIs** must include:
```
http://localhost:3001/api/auth/callback/google
```

**Authorized JavaScript origins** must include:
```
http://localhost:3001
```

**CRITICAL**: Click **SAVE** after making changes!

### 2. Verify .env.local File

Your `.env.local` should have:
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

**Important**:
- No quotes around values
- No extra spaces
- Port must match (3001)

### 3. Restart Dev Server

**MUST DO THIS** after any .env.local changes:

1. Stop server: `Ctrl+C`
2. Start server: `npm run dev`
3. Verify it's running on port 3001

### 4. Clear Browser Cache

- Use **Incognito/Private mode**, OR
- Clear browser cache and cookies for localhost

### 5. Test Sign-In

1. Go to: `http://localhost:3001/auth/signin`
2. Click "Continue with Google"
3. You should be redirected to Google
4. After clicking "Continue" on Google, you should be redirected back

## Common Errors & Solutions

### Error: "redirect_uri_mismatch"
**Solution**: 
- Verify redirect URI in Google Console matches EXACTLY: `http://localhost:3001/api/auth/callback/google`
- Make sure you clicked SAVE in Google Console
- Wait 1-2 minutes for changes to propagate

### Error: "Access blocked"
**Solution**:
- Go to: https://console.cloud.google.com/apis/credentials/consent
- Add your email (`vinaykumar709395@gmail.com`) as a test user
- Make sure app is in "Testing" mode

### Error: "Invalid client"
**Solution**:
- Check Client ID and Secret in `.env.local` are correct
- No extra spaces or quotes
- Restart dev server after changes

### Sign-in button does nothing
**Solution**:
- Check browser console (F12) for errors
- Check terminal for `[NextAuth]` debug logs
- Make sure dev server is running on port 3001

### Stuck on Google consent screen
**Solution**:
- Clear browser cache
- Try incognito mode
- Check terminal for errors
- Verify redirect URI is correct in Google Console

## Debug Steps

1. **Check Terminal Logs**:
   Look for:
   - `[NextAuth] Sign-in attempt:` - Shows sign-in started
   - `[NextAuth] Redirect callback:` - Shows redirect URL
   - Any error messages

2. **Check Browser Console** (F12):
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Test Authentication Status**:
   Visit: `http://localhost:3001/test-auth`
   This shows your current authentication status

## Still Not Working?

1. **Verify Port Match**:
   - `.env.local` has: `NEXTAUTH_URL=http://localhost:3001`
   - Google Console has: `http://localhost:3001/api/auth/callback/google`
   - Dev server is running on port 3001

2. **Check All Environment Variables**:
   ```bash
   # In terminal, verify:
   cat .env.local
   ```

3. **Restart Everything**:
   - Stop dev server
   - Clear browser cache
   - Restart dev server
   - Try again in incognito mode

4. **Check NextAuth Logs**:
   The terminal should show detailed logs when you try to sign in.
   Share these logs if you need more help.


