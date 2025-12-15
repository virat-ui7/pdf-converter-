# Environment Variables Setup Guide

Complete step-by-step guide for setting up all environment variables.

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the values below
3. Never commit `.env.local` to git (it's in `.gitignore`)

---

## Required Variables (MVP)

### 1. Supabase Configuration

**Where to get:**
1. Go to https://supabase.com
2. Create account and new project
3. Go to Settings → API
4. Copy values

**Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Next Steps:**
- Run `supabase/schema.sql` in Supabase SQL Editor
- Verify tables are created

---

### 2. NextAuth.js Configuration

**NEXTAUTH_SECRET:**
Generate a secure random string:

**Option 1: Using OpenSSL**
```bash
openssl rand -base64 32
```

**Option 2: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

**Option 3: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Variables:**
```env
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**For Production:**
- Use different secret for production
- Set `NEXTAUTH_URL` to your production domain (e.g., `https://fileconverter.com`)

---

## Optional Variables (Can Skip for MVP)

### 3. Google OAuth

**Setup Steps:**
1. Go to https://console.cloud.google.com
2. Create new project (or select existing)
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret

**Variables:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

**Note:** Can skip for MVP, add later in Block 2

---

### 4. GitHub OAuth

**Setup Steps:**
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: "File Converter"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy Client ID
6. Generate Client Secret (click "Generate a new client secret")

**Variables:**
```env
GITHUB_CLIENT_ID=Iv1.abcdefghijklmnop
GITHUB_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz1234567890
```

**Note:** Can skip for MVP, add later in Block 2

---

## Future Variables (Will be added later)

### 5. PhonePe Payment (Block 4)

**Setup Steps:**
1. Go to https://developer.phonepe.com/
2. Create merchant account
3. Get API credentials

**Variables:**
```env
PHONEPE_API_KEY=your-api-key
PHONEPE_MERCHANT_ID=your-merchant-id
PHONEPE_SALT_KEY=your-salt-key
PHONEPE_SALT_INDEX=1
```

---

### 6. Card Payment Processing (Block 4)

**Options:**
- Razorpay International
- PayU
- Direct card processing

**Variables:**
```env
CARD_PAYMENT_SECRET_KEY=your-secret-key
CARD_PAYMENT_PUBLIC_KEY=your-public-key
```

---

### 7. Mailgun Email Service (Block 9)

**Setup Steps:**
1. Go to https://app.mailgun.com
2. Sign up for account
3. Verify domain
4. Get API key from Settings → API Keys

**Variables:**
```env
MAILGUN_API_KEY=your-api-key
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL=noreply@yourdomain.com
```

---

### 8. Redis (Block 5)

**Options:**
- **Upstash** (Recommended - Serverless): https://upstash.com
- **Railway**: https://railway.app
- **Self-hosted**: Install Redis locally

**Variables:**
```env
REDIS_URL=redis://default:password@host:port
REDIS_PASSWORD=your-password
```

---

## Environment-Specific Configuration

### Development (.env.local)
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
```

### Production (Vercel Environment Variables)
```env
NODE_ENV=production
NEXTAUTH_URL=https://fileconverter.com
```

---

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use different secrets** for development and production
3. **Rotate secrets regularly** - Especially if compromised
4. **Use Vercel Secrets** for production environment variables
5. **Don't share secrets** in screenshots or documentation
6. **Use strong secrets** - At least 32 characters for NEXTAUTH_SECRET

---

## Verification Checklist

After setting up `.env.local`:

- [ ] All required variables are filled
- [ ] No placeholder values remain (e.g., "your-xxx-here")
- [ ] Supabase connection works (test at `/test-db`)
- [ ] NextAuth works (test at `/api/auth/signin`)
- [ ] No errors in console when running `npm run dev`
- [ ] Build succeeds: `npm run build`

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env.local` exists
- Verify variable names are correct (case-sensitive)
- Restart dev server after adding variables

### Error: "NEXTAUTH_SECRET is missing"
- Generate secret using methods above
- Add to `.env.local`
- Restart dev server

### OAuth not working
- Check redirect URIs match exactly
- Verify client ID and secret are correct
- Check OAuth app is not disabled

### Build fails in CI/CD
- Add all required variables to GitHub Secrets
- Add all required variables to Vercel Environment Variables
- Verify variable names match exactly

---

## Quick Reference

| Variable | Required | When Needed | Where to Get |
|----------|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Block 1 | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Block 1 | Supabase Dashboard |
| `NEXTAUTH_SECRET` | ✅ Yes | Block 1 | Generate with OpenSSL |
| `NEXTAUTH_URL` | ✅ Yes | Block 1 | Your domain |
| `GOOGLE_CLIENT_ID` | ⚠️ Optional | Block 2 | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | ⚠️ Optional | Block 2 | Google Cloud Console |
| `GITHUB_CLIENT_ID` | ⚠️ Optional | Block 2 | GitHub Settings |
| `GITHUB_CLIENT_SECRET` | ⚠️ Optional | Block 2 | GitHub Settings |
| `PHONEPE_API_KEY` | ⏳ Later | Block 4 | PhonePe Developer Portal |
| `MAILGUN_API_KEY` | ⏳ Later | Block 9 | Mailgun Dashboard |
| `REDIS_URL` | ⏳ Later | Block 5 | Upstash/Railway |

---

**Last Updated:** December 2025  
**For questions:** See README.md or PRoD-IMPLEMENTATION-ANALYSIS.md

