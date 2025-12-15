# Deployment Guide

Complete guide for deploying FileConverter to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase database schema executed
- [ ] Storage buckets created (`uploads`, `converted`)
- [ ] Redis server running
- [ ] LibreOffice installed on worker server
- [ ] Mailgun domain verified
- [ ] Payment gateways configured
- [ ] OAuth apps configured with production URLs
- [ ] SSL certificate configured

## Deployment Steps

### 1. Vercel Deployment (Frontend + API)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository
   - Select framework: Next.js

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Add all variables from `.env.local`
   - Update `NEXTAUTH_URL` to production domain
   - Update OAuth callback URLs

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Test the deployment

### 2. Worker Deployment (Queue Processor)

The queue worker must run as a separate process. Choose one:

#### Option A: Railway

1. Create new Railway project
2. Add Node.js service
3. Set start command: `npm run worker`
4. Add environment variables (Redis, Supabase, etc.)
5. Deploy

#### Option B: Render

1. Create new Background Worker
2. Build command: `npm install`
3. Start command: `npm run worker`
4. Add environment variables
5. Deploy

#### Option C: Docker

Create `Dockerfile.worker`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "worker"]
```

Deploy to any container service.

### 3. Redis Setup

#### Option A: Upstash (Managed Redis)

1. Create Upstash Redis database
2. Copy connection details
3. Update `REDIS_HOST` and `REDIS_PORT` in environment variables

#### Option B: Self-Hosted

1. Install Redis on your server
2. Configure firewall rules
3. Set up authentication
4. Update environment variables

### 4. Database Migration

1. **Backup existing data** (if any)
2. **Run schema migration**
   - Connect to Supabase production database
   - Execute `supabase/schema.sql`
   - Verify all tables created

3. **Set up RLS policies**
   - Review and enable Row Level Security
   - Test policies with different user roles

### 5. Storage Configuration

1. **Create buckets in Supabase**
   - `uploads` - Public bucket for original files
   - `converted` - Public bucket for converted files

2. **Configure bucket policies**
   - Set appropriate CORS rules
   - Configure public access if needed

### 6. Email Configuration

1. **Verify Mailgun domain**
   - Add DNS records
   - Verify domain in Mailgun dashboard

2. **Test email sending**
   - Send test email
   - Verify delivery

### 7. Payment Gateway Setup

#### PhonePe (India)

1. **Switch to production**
   - Update `PHONEPE_ENV=production`
   - Use production Merchant ID and Salt Key
   - Test with small amount first

#### Card Payments

1. **Integrate payment processor**
   - Choose: Razorpay, Stripe, or similar
   - Update `app/api/payments/card/create-payment-intent/route.ts`
   - Test in sandbox mode first

### 8. Monitoring Setup

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Monitor performance metrics

2. **Error Tracking**
   - Set up Sentry or similar
   - Add error tracking to API routes

3. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor main endpoints

### 9. Post-Deployment

1. **Test all features**
   - Authentication flow
   - File conversion
   - Payment processing
   - Email delivery

2. **Performance check**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Optimize if needed

3. **Security audit**
   - Run security scan
   - Check for vulnerabilities
   - Review access controls

## Environment Variables Reference

### Required for Production

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_production_secret

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Mailgun
MAILGUN_API_KEY=your_production_api_key
MAILGUN_DOMAIN=your_verified_domain

# PhonePe (Production)
PHONEPE_MERCHANT_ID=your_production_merchant_id
PHONEPE_SALT_KEY=your_production_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=production
```

### Optional

```env
# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Scaling Considerations

1. **Horizontal Scaling**
   - Deploy multiple worker instances
   - Use Redis for shared queue
   - Load balance API routes

2. **Database Optimization**
   - Add indexes for frequently queried columns
   - Set up connection pooling
   - Monitor query performance

3. **Storage Optimization**
   - Implement file cleanup job
   - Set up CDN for file delivery
   - Monitor storage usage

4. **Caching**
   - Cache format lists
   - Cache user data
   - Use Redis for session storage

## Troubleshooting

### Common Issues

1. **Worker not processing jobs**
   - Check Redis connection
   - Verify worker is running
   - Check queue for stuck jobs

2. **Conversions failing**
   - Verify LibreOffice is installed
   - Check file permissions
   - Review error logs

3. **Email not sending**
   - Verify Mailgun credentials
   - Check domain verification
   - Review Mailgun logs

4. **Payment failures**
   - Verify gateway credentials
   - Check webhook endpoints
   - Review payment logs

## Backup Strategy

1. **Database Backups**
   - Enable Supabase automatic backups
   - Set up manual backup schedule

2. **Code Backups**
   - Use Git for version control
   - Tag releases

3. **Environment Variables**
   - Store securely (1Password, etc.)
   - Document all variables

## Maintenance

1. **Regular Updates**
   - Update dependencies monthly
   - Security patches immediately
   - Test updates in staging first

2. **Monitoring**
   - Check logs daily
   - Monitor error rates
   - Review performance metrics

3. **Cleanup**
   - Delete old conversion files
   - Archive old analytics data
   - Clean up expired sessions

