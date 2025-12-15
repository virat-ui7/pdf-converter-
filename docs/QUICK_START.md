# Quick Start Guide

Get FileConverter up and running in 10 minutes.

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account created
- [ ] Redis server running (or use Upstash free tier)

## Step 1: Install Dependencies (2 min)

```bash
npm install
```

## Step 2: Set Up Environment Variables (3 min)

1. Copy `.env.example` to `.env.local`
2. Get Supabase credentials:
   - Go to Supabase Dashboard → Settings → API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

3. Generate NextAuth secret:
   ```bash
   npm run generate-secret
   ```
   Copy output to `NEXTAUTH_SECRET`

4. Set `NEXTAUTH_URL=http://localhost:3000`

## Step 3: Set Up Database (2 min)

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Paste and execute
4. Verify 7 tables created

## Step 4: Create Storage Buckets (1 min)

1. Go to Supabase Dashboard → Storage
2. Create bucket: `uploads` (public)
3. Create bucket: `converted` (public)

## Step 5: Start Development Server (1 min)

Terminal 1 - Next.js:
```bash
npm run dev
```

Terminal 2 - Queue Worker:
```bash
npm run worker
```

## Step 6: Test (1 min)

1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Create test account
4. Go to `/convert`
5. Upload a test file (JPG or PNG)
6. Convert to another format
7. Check dashboard

## Optional: Set Up Email (Mailgun)

1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Verify domain (or use sandbox)
3. Get API key
4. Add to `.env.local`:
   ```env
   MAILGUN_API_KEY=your_key
   MAILGUN_DOMAIN=your_domain
   ```

## Optional: Set Up OAuth

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect: `http://localhost:3000/api/auth/callback/google`
4. Add to `.env.local`

### GitHub OAuth
1. Go to GitHub Settings → Developer settings
2. Create OAuth App
3. Add callback: `http://localhost:3000/api/auth/callback/github`
4. Add to `.env.local`

## Troubleshooting

**Port 3000 already in use?**
```bash
# Use different port
PORT=3001 npm run dev
```

**Redis connection error?**
- Install Redis: `brew install redis` (Mac) or download for Windows
- Start Redis: `redis-server`
- Or use Upstash (free tier)

**LibreOffice not found?**
- Install LibreOffice
- Verify: `libreoffice --version`
- Add to PATH if needed

## Next Steps

- Read [Full README](../README.md)
- Check [Deployment Guide](./DEPLOYMENT.md)
- Review [Testing Guide](./TESTING.md)

## Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run worker           # Start queue worker

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Check code quality
npm run format           # Format code
npx tsc --noEmit         # Type check

# Utilities
npm run generate-secret  # Generate NextAuth secret
```

## Need Help?

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review error messages in console
- Check Supabase logs
- Verify environment variables
