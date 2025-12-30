# Google Login Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information
   - Add your email as a test user
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Focus Refresh**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in the root directory
2. Add your credentials:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here
```

3. Generate a NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```
   Or use any random string generator

## Step 3: Install Dependencies

The dependencies are already installed, but if needed:
```bash
npm install next-auth
```

## Step 4: Test the Login

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click "Sign In" in the header
4. Sign in with your Google account
5. Your profile and badges will be synced to your Google account!

## Features

✅ **User-Specific Data**: Each Google user has their own:
   - Profile and username
   - Badges and achievements
   - Game history
   - Statistics

✅ **Cross-Device Sync**: Sign in on any device to access your progress

✅ **Secure**: Uses Google OAuth 2.0 for secure authentication

✅ **Simple**: One-click sign in with Google

## Production Deployment

For production, update:
1. **Authorized JavaScript origins**: Your production domain
2. **Authorized redirect URIs**: `https://yourdomain.com/api/auth/callback/google`
3. **NEXTAUTH_URL**: Your production URL

## Troubleshooting

- **"Invalid client"**: Check your Client ID and Secret
- **"Redirect URI mismatch"**: Ensure redirect URI matches exactly
- **"Access blocked"**: Add your email as a test user in OAuth consent screen


