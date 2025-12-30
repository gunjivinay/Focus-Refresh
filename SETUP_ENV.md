# Quick Setup - Copy This Exactly

## Create `.env.local` file in root directory

Copy and paste this EXACTLY (no extra spaces):

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Important Checklist:

✅ File is named exactly `.env.local` (with the dot at the start)
✅ File is in the root directory (same folder as package.json)
✅ No quotes around the values
✅ No extra spaces
✅ Restart dev server after creating file (stop with Ctrl+C, then `npm run dev`)

## Google Console Checklist:

✅ Go to: https://console.cloud.google.com/apis/credentials
✅ Click your OAuth 2.0 Client ID
✅ Under "Authorized redirect URIs" add:
   `http://localhost:3000/api/auth/callback/google`
✅ Under "Authorized JavaScript origins" add:
   `http://localhost:3000`
✅ Click SAVE button

## Test:

1. Restart dev server: `npm run dev`
2. Go to: http://localhost:3000
3. Click "Sign In"
4. Click "Continue with Google"


