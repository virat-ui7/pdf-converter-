# FileConverter - Multi-Format File Converter Platform

A freemium SaaS platform for converting 117 file formats across documents, images, spreadsheets, and presentations.

## 🚀 Features

- **117 Format Support** - Convert between documents, images, spreadsheets, and presentations
- **Fast & Secure** - Encrypted file processing with automatic cleanup
- **Tiered Subscriptions** - Free, Starter, Professional, and Enterprise plans
- **API Access** - RESTful API for programmatic conversions (Professional+)
- **Webhooks** - Real-time notifications for conversion events
- **Payment Integration** - PhonePe (India) and Card payments (International)
- **Analytics** - Track conversions and usage
- **Email Notifications** - Automated emails for conversions and account events

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (S3-compatible)
- **Authentication:** NextAuth.js v4
- **Queue:** Bull (Redis)
- **Image Processing:** Sharp
- **Document Processing:** LibreOffice (headless)
- **Email:** Mailgun
- **Payments:** PhonePe (India), Direct Card Processing (International)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Redis server (for job queue)
- LibreOffice (for document conversion)
- Mailgun account (for emails)
- PhonePe merchant account (for India payments)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "PDF Converter"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in all required variables in `.env.local` (see Environment Variables section below)

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema: Copy contents of `supabase/schema.sql` and execute in Supabase SQL Editor
   - Create storage buckets:
     - `uploads` (public, for original files)
     - `converted` (public, for converted files)
   - Configure Row Level Security (RLS) policies as needed

5. **Set up Redis**
   - Install Redis locally or use a cloud service
   - Update `REDIS_HOST` and `REDIS_PORT` in `.env.local`

6. **Install LibreOffice** (for document conversion)
   - **Windows:** Download from [LibreOffice.org](https://www.libreoffice.org/download/)
   - **macOS:** `brew install libreoffice`
   - **Linux:** `sudo apt-get install libreoffice` or `sudo yum install libreoffice`

## 🚀 Running the Application

### Development Mode

1. **Start the Next.js dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

2. **Start the queue worker** (in a separate terminal)
   ```bash
   npm run worker
   ```
   This processes conversion jobs from the queue.

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

3. **Start the queue worker** (as a separate process)
   ```bash
   npm run worker
   ```

## 📝 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# PhonePe (India Payments)
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox  # or 'production'

# Mailgun (Email Service)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Redis (Job Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional
```

## 🗄️ Database Setup

1. **Run the schema**
   - Open Supabase Dashboard → SQL Editor
   - Copy and paste contents of `supabase/schema.sql`
   - Execute the script

2. **Verify tables created**
   - Check that all 7 tables are created: `users`, `conversions`, `subscriptions`, `api_keys`, `webhooks`, `email_logs`, `analytics`

3. **Set up storage buckets**
   - Go to Storage in Supabase Dashboard
   - Create bucket: `uploads` (public)
   - Create bucket: `converted` (public)

## 🔐 Authentication Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Add callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

## 💳 Payment Setup

### PhonePe (India)
1. Sign up at [PhonePe Business](https://business.phonepe.com/)
2. Get Merchant ID and Salt Key
3. Add to `.env.local`
4. Use sandbox for testing

### Card Payments (International)
- Currently placeholder - integrate with Razorpay, Stripe, or similar service
- Update `app/api/payments/card/create-payment-intent/route.ts`

## 📧 Email Setup (Mailgun)

1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Verify your domain
3. Get API key and domain
4. Add to `.env.local`

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Sign up with email
   - [ ] Verify email
   - [ ] Login with email/password
   - [ ] Login with Google OAuth
   - [ ] Login with GitHub OAuth
   - [ ] Forgot password flow
   - [ ] Reset password

2. **File Conversion**
   - [ ] Upload file via drag-and-drop
   - [ ] Select target format
   - [ ] Start conversion
   - [ ] Check conversion status
   - [ ] Download converted file
   - [ ] View in conversion history

3. **Dashboard**
   - [ ] View stats
   - [ ] Check conversion history
   - [ ] Filter conversions
   - [ ] Delete conversion
   - [ ] Update profile settings

4. **Payments**
   - [ ] View pricing page
   - [ ] Select plan
   - [ ] Complete checkout (test mode)
   - [ ] Verify subscription in dashboard

5. **API** (Professional+)
   - [ ] Create API key
   - [ ] Use API key for conversion
   - [ ] Create webhook
   - [ ] Test webhook delivery

### Run Tests

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Build check
npm run build
```

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Dashboard pages
│   ├── convert/             # Converter page
│   ├── pricing/             # Pricing page
│   ├── api/                 # API routes
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components
│   └── converter/           # Converter-specific components
├── lib/                     # Utilities and services
│   ├── converters/          # Conversion engines
│   ├── email.ts             # Email service
│   ├── analytics.ts         # Analytics tracking
│   ├── queue.ts             # Job queue
│   └── storage.ts           # Supabase Storage helpers
├── supabase/                # Database schema
│   └── schema.sql           # SQL schema
├── scripts/                 # Utility scripts
│   ├── start-worker.ts      # Queue worker
│   └── generate-secret.js   # Secret generator
└── public/                  # Static assets
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Import project from GitHub
   - Add all environment variables
   - Deploy

3. **Set up Queue Worker**
   - Use Vercel Cron Jobs or separate worker service
   - Or deploy worker separately (Railway, Render, etc.)

### Environment Variables for Production

Update `NEXTAUTH_URL` to your production domain:
```env
NEXTAUTH_URL=https://yourdomain.com
```

### Worker Deployment

The queue worker needs to run as a separate process. Options:
- **Railway:** Deploy `scripts/start-worker.ts` as a service
- **Render:** Create a background worker
- **Docker:** Containerize the worker
- **PM2:** Run on your server with PM2

## 📊 Monitoring

- **Supabase Dashboard:** Monitor database and storage
- **Vercel Analytics:** Track page views and performance
- **Mailgun Dashboard:** Monitor email delivery
- **Redis:** Monitor queue status

## 🔒 Security

- All passwords are hashed with bcrypt
- API keys are hashed with SHA256
- Files are automatically deleted after 24 hours
- Row Level Security (RLS) enabled in Supabase
- CSRF protection via NextAuth
- Input validation with Zod

## 📚 API Documentation

Visit `/api/docs` for complete API documentation (Professional+ plans only).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Your License Here]

## 🆘 Support

- **Documentation:** `/docs`
- **Support:** `/support`
- **Email:** support@fileconverter.com

## 🎯 Roadmap

- [ ] Batch conversion UI
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] White-label option
- [ ] Advanced image editing
- [ ] OCR support
- [ ] Mobile app

---

Built with ❤️ using Next.js, Supabase, and modern web technologies.
#   p d f - c o n v e r t e r - 
 
 