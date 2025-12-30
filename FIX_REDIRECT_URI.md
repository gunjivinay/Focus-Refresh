# Fix Redirect URI Mismatch Error

## The Problem
Your app is running on port **3001**, but Google Console is configured for port **3000**.

## Solution: Update Google Console

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID (the one with your Client ID)

### Step 2: Add Port 3001 Redirect URI
Under **"Authorized redirect URIs"**, you should have:
```
http://localhost:3000/api/auth/callback/google
```

**ADD THIS LINE** (keep the 3000 one too, or replace it):
```
http://localhost:3001/api/auth/callback/google
```

### Step 3: Add Port 3001 JavaScript Origin
Under **"Authorized JavaScript origins"**, you should have:
```
http://localhost:3000
```

**ADD THIS LINE** (keep the 3000 one too, or replace it):
```
http://localhost:3001
```

### Step 4: SAVE
**CRITICAL**: Click the **SAVE** button at the bottom!

### Step 5: Restart Dev Server
1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Make sure it's running on port 3001

### Step 6: Try Sign In Again
Go to http://localhost:3001/auth/signin and try signing in.

---

## Alternative: Use Port 3000 Instead

If you prefer to use port 3000:

1. **Update `.env.local`**:
   Change line 3 from:
   ```
   NEXTAUTH_URL=http://localhost:3001
   ```
   To:
   ```
   NEXTAUTH_URL=http://localhost:3000
   ```

2. **Restart dev server**

3. **Access app on**: http://localhost:3000

---

## Verify It's Fixed

After updating Google Console:
- Wait 1-2 minutes for changes to propagate
- Clear browser cache or use incognito mode
- Try signing in again

The redirect URI must match EXACTLY, including:
- ✅ http (not https)
- ✅ localhost (not 127.0.0.1)
- ✅ Port number (3001)
- ✅ Path: /api/auth/callback/google


