# PRD ANALYSIS SUMMARY
**Document Version:** 1.1  
**Analysis Date:** December 2025  
**Last Updated:** December 2025  
**Analyst:** Senior Full-Stack Architect

## 🔑 KEY DECISIONS & UPDATES

### Payment Processors
- **Global Market:** Stripe (USD payments)
- **India Market:** PhonePe (INR payments) ⚠️ **UPDATED: Replaces Razorpay**

### Core Infrastructure
- **Database:** Supabase (PostgreSQL) ⭐ **PRIMARY DATABASE - ALL DATA STORED HERE**
- **File Storage:** Supabase Storage (S3-compatible) ⭐ **ALL FILES STORED HERE**
- **Note:** Supabase is the core infrastructure platform for both database AND file storage

---

## 1. PRODUCT VISION

A freemium SaaS platform enabling users to convert 110+ file formats across documents, spreadsheets, presentations, and images with a lightweight, privacy-first interface. Monetized through ads (free tier) and subscriptions (3 paid tiers: Starter, Professional, Enterprise). Target launch: Q1 2026.

**Key Metrics:**
- TAM: 600,000 users/year
- Free tier: 500,000 users
- Paid tier conversion: 8-12% (India), 6-10% (Global)
- Projected Year 1 Revenue: $7.2M+
- Target 99.99% uptime SLA for Enterprise tier

---

## 2. KEY FEATURES

### Core Features
- ✓ **110+ Format Support** across 4 categories (Documents: 43, Spreadsheets: 14, Presentations: 7, Images: 47)
- ✓ **Drag-and-drop** file upload interface
- ✓ **Batch processing** (unlimited for paid tiers)
- ✓ **Instant preview** before download
- ✓ **Cloud storage** integration (Google Drive, Dropbox, OneDrive)
- ✓ **API/Webhook** access (Professional+ tiers)
- ✓ **White-label** option (Professional+ tiers)
- ✓ **Priority processing** for paid users
- ✓ **Zero-signup conversion** (free users don't need account)
- ✓ **Conversion history** tracking
- ✓ **Advanced options** (image quality, compression, page range, color mode)
- ✓ **Real-time progress** tracking
- ✓ **Email notifications** for conversions
- ✓ **Team management** (Enterprise tier)

### Monetization Features
- ✓ Ad-supported free tier (728x90 banner, 300x600 sidebar)
- ✓ Subscription tiers with tiered pricing
- ✓ Stripe payment integration (Global)
- ✓ PhonePe payment integration (India market)
- ✓ 14-day free trial for paid tiers
- ✓ 30-day money-back guarantee

### SEO & Marketing Features
- ✓ Blog with SEO-optimized content
- ✓ Format-specific landing pages
- ✓ FAQ pages
- ✓ Support ticket system
- ✓ Newsletter signup

---

## 3. USER TIERS & PRICING

### Global Pricing (USD)

| Tier | Monthly Price | Annual Price | Conversions/mo | File Size Limit | Processing Speed | Image Quality | Support | Features |
|------|---------------|--------------|----------------|-----------------|------------------|--------------|---------|----------|
| **Free** | $0 | $0 | 200 | 100MB | 2-5 min (standard) | 72 DPI | Email (within docs) | Basic conversion, ads |
| **Starter** | $4.99 | $39.99 | 1,000 | 500MB | 1-2 min (fast) | 300 DPI | Email (48h response) | Standard features |
| **Professional** | $14.99 | $119.99 | 10,000 | 2GB | 30s (express) | 600 DPI | Priority chat (2h) | API + Webhooks, White-label |
| **Enterprise** | $49.99 | $399.99 | Unlimited | Unlimited | Instant | Lossless | Priority phone (1h) | Full white-label, 99.99% SLA |

### India Pricing (INR) - Mentioned in Executive Summary
- India-focused paid tier: ₹49.99-₹399.99/month (specific breakdown not detailed in PRD)

### Tier Benefits Summary
- **Free:** Basic conversion, ad-supported, no account required
- **Starter:** 5x conversions, larger files, faster processing
- **Professional:** 50x conversions, API access, webhooks, white-label
- **Enterprise:** Unlimited everything, instant processing, SLA guarantee, team management

---

## 4. TECHNOLOGY STACK

### Frontend
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Modules
- **State Management:** Zustand
- **API Client:** TanStack React Query + Axios
- **Form Management:** React Hook Form + Zod
- **UI Components:** Radix UI + Custom components
- **Animations:** Framer Motion
- **File Upload:** React Dropzone
- **Content:** React Markdown (blog)
- **SEO:** next-seo

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Next.js API Routes
- **Language:** TypeScript
- **Authentication:** NextAuth.js v4 (Email/Password + OAuth: Google, GitHub)
- **File Processing:**
  - Documents: LibreOffice + python-docx
  - Images: Sharp + ImageMagick wrapper
  - Spreadsheets: XLSX library
  - Presentations: python-pptx
- **Job Queue:** Bull (Redis-based)
- **Validation:** Zod

### Database & Storage
- **Primary Database:** Supabase (PostgreSQL) ⭐ **PRIMARY DATA PLATFORM**
- **File Storage:** Supabase Storage (S3-compatible) ⭐ **ALL FILE STORAGE**
- **Caching:** Redis (optional, for scaling)

### Third-Party Services
- **Payments:** Stripe (Global), PhonePe (India market)
- **Email Service:** Mailgun (node-mailgun.js)
- **Authentication:** NextAuth.js (OAuth providers: Google, GitHub)

### Key Libraries
```
Frontend:
- next@14.0.0
- react@18.2.0
- typescript@5.2.0
- tailwindcss@3.3.0
- zustand@4.4.0
- @tanstack/react-query@5.0.0
- react-hook-form@7.47.0
- zod@3.22.0
- framer-motion@10.16.0
- react-dropzone@14.2.0

Backend:
- next-auth@4.24.0
- stripe@13.0.0
- bull@4.11.0
- sharp@0.32.0
- jsonwebtoken@9.1.0
```

---

## 5. SUPPORTED FORMATS

### Documents (43 formats)
- Common: PDF, DOC, DOCX, RTF, TXT, ODT, HTML, EPUB, MOBI, etc.
- Full list not detailed in PRD, but 43 total formats

### Spreadsheets (14 formats)
- Common: XLS, XLSX, CSV, ODS, TSV, etc.
- 14 total formats

### Presentations (7 formats)
- Common: PPT, PPTX, ODP, PDF, etc.
- 7 total formats

### Images (47 formats)
- Common: JPG, PNG, GIF, WEBP, SVG, BMP, TIFF, HEIC, AVIF, etc.
- 47 total formats

**Total: 110+ formats** across 4 categories

---

## 6. CORE USER JOURNEYS

### 6.1 Free User Journey
```
Landing Page (/)
  ↓
[View Features/Formats] (optional)
  ↓
Click "Start Converting" → /convert
  ↓
Upload File (Drag & Drop) - No signup required
  ↓
Select Target Format
  ↓
Process & Download
  ↓
[Optional: Signup CTA shown]
  ↓
View Upgrade Prompt (if limit reached)
```

### 6.2 Signup → Paid Conversion Journey
```
Free User reaches 200 conversions/month limit
  ↓
Upgrade Prompt Modal
  ↓
Click "View Plans" → /pricing
  ↓
Select Plan (Starter/Professional/Enterprise)
  ↓
If not logged in: Quick signup form
  ↓
Billing Information
  ↓
Stripe Checkout Page
  ↓
Payment Success
  ↓
Subscription created in DB
  ↓
User tier updated
  ↓
Onboarding email sent (Mailgun)
  ↓
Redirect to /dashboard
  ↓
Usage limits updated
```

### 6.3 API Integration Flow (Professional+)
```
Logged-in Professional/Enterprise User
  ↓
Go to Dashboard → API Keys (/dashboard/api)
  ↓
Generate API Key
  ↓
Copy & Store Securely
  ↓
Read API Documentation
  ↓
Create Webhook (Optional)
  ↓
Make First API Call: POST /api/conversions/convert
  ↓
Poll for status: GET /api/conversions/:conversionId
  ↓
When status = "completed"
  ↓
Download converted file
  ↓
Webhook event sent (if subscribed): POST {webhookUrl}
```

---

## 7. DATABASE SCHEMA OVERVIEW

### Main Tables & Relationships

#### 1. `users` Table
- **Primary Key:** `id` (UUID)
- **Key Fields:**
  - `email` (unique, required)
  - `password_hash` (nullable for OAuth users)
  - `tier` (enum: 'free', 'starter', 'professional', 'enterprise')
  - `stripe_customer_id`
  - `conversions_used` (monthly counter)
  - `conversions_reset_date` (timestamp)
  - `storage_used_mb`
  - `is_verified` (boolean)
- **Relationships:** One-to-many with `conversions`, `subscriptions`, `api_keys`, `webhooks`

#### 2. `conversions` Table
- **Primary Key:** `id` (UUID)
- **Key Fields:**
  - `user_id` (FK → users.id, nullable for anonymous conversions)
  - `original_filename`, `original_format`, `target_format`
  - `original_file_url`, `converted_file_url` (Supabase Storage URLs)
  - `file_size_mb`
  - `status` (enum: 'pending', 'processing', 'completed', 'failed')
  - `processing_time_seconds`
  - `image_quality`, `compression` (advanced options)
  - `error_message` (nullable)
- **Indexes:** `(user_id, created_at)` for history queries

#### 3. `subscriptions` Table
- **Primary Key:** `id` (UUID)
- **Key Fields:**
  - `user_id` (FK → users.id)
  - `stripe_subscription_id` (unique)
  - `plan_name`, `plan_price_monthly`, `plan_price_yearly`
  - `status` (enum: 'active', 'canceled', 'paused')
  - `current_period_start`, `current_period_end`
  - `cancel_at_period_end` (boolean)

#### 4. `api_keys` Table
- **Primary Key:** `id` (UUID)
- **Key Fields:**
  - `user_id` (FK → users.id)
  - `key_hash` (unique, hashed API key)
  - `name`, `permissions` (array)
  - `last_used_at` (timestamp)
  - `is_active` (boolean)
- **Indexes:** `(user_id)` for user queries

#### 5. `webhooks` Table
- **Primary Key:** `id` (UUID)
- **Key Fields:**
  - `user_id` (FK → users.id)
  - `url` (webhook endpoint)
  - `event_type` (e.g., 'conversion.completed', 'conversion.failed')
  - `is_active` (boolean)
  - `failed_attempts` (counter)
- **Indexes:** `(user_id)` for user queries

#### 6. `email_logs` Table
- **Primary Key:** `id` (UUID)
- **Key Fields:**
  - `user_id` (FK → users.id, nullable)
  - `email_type` (e.g., 'welcome', 'conversion_complete', 'password_reset')
  - `recipient_email`
  - `status` (enum: 'sent', 'failed', 'bounced')
- **Indexes:** `(user_id, created_at)` for analytics

#### 7. `analytics` Table
- **Primary Key:** `id` (UUID)
- **Key Fields:**
  - `user_id` (UUID, nullable for anonymous events)
  - `event_type` (e.g., 'conversion_started', 'download', 'upgrade_clicked')
  - `event_data` (JSONB for flexible event properties)
- **Indexes:** `(user_id, created_at)` for user analytics

### Relationships Summary
- **users** → **conversions** (1:N, optional - supports anonymous)
- **users** → **subscriptions** (1:1, optional)
- **users** → **api_keys** (1:N)
- **users** → **webhooks** (1:N)
- **users** → **email_logs** (1:N, optional)
- **users** → **analytics** (1:N, optional)

---

## 8. API ENDPOINTS SUMMARY

### 8.1 Authentication APIs
```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/forgot-password   - Password reset request
POST   /api/auth/reset-password    - Password reset confirmation
GET    /api/auth/me                - Get current user
```

### 8.2 Conversion APIs
```
POST   /api/conversions/upload     - Upload file (FormData)
POST   /api/conversions/convert    - Start conversion (returns conversionId)
GET    /api/conversions/:id        - Get conversion status
GET    /api/conversions/history    - Get conversion history (paginated)
DELETE /api/conversions/:id        - Delete conversion
POST   /api/conversions/:id/download - Download converted file
```

### 8.3 User APIs
```
GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update user profile
PUT    /api/users/password          - Change password
GET    /api/users/usage            - Get usage stats (conversions, storage, API calls)
```

### 8.4 Billing APIs
```
GET    /api/billing/subscription   - Get current subscription
POST   /api/billing/upgrade        - Upgrade plan (returns Stripe session URL)
POST   /api/billing/cancel         - Cancel subscription
GET    /api/billing/invoices       - Get invoices (paginated)
POST   /api/billing/payment-method - Update payment method
DELETE /api/billing/payment-method - Remove payment method
```

### 8.5 API Keys & Webhooks APIs
```
GET    /api/api-keys               - List API keys
POST   /api/api-keys               - Create API key
DELETE /api/api-keys/:id           - Delete API key
GET    /api/webhooks               - List webhooks
POST   /api/webhooks               - Create webhook
PUT    /api/webhooks/:id           - Update webhook
DELETE /api/webhooks/:id           - Delete webhook
POST   /api/webhooks/:id/test      - Test webhook
```

### 8.6 Public APIs (No Auth Required)
```
GET    /api/formats                - Get all supported formats
GET    /api/formats/:category      - Get formats by category
GET    /api/health                 - Health check endpoint
```

---

## 9. CRITICAL REQUIREMENTS

### 9.1 Authentication
- **Method:** NextAuth.js v4
- **Providers:** Email/Password, OAuth (Google, GitHub)
- **Security:**
  - Password hashing: bcrypt (min 10 rounds)
  - JWT tokens: 15-min expiry
  - Refresh tokens: 7-day expiry
  - Rate limiting on auth endpoints
  - Optional 2FA (TOTP)

### 9.2 Database
- **Primary:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage (S3-compatible)
- **Caching:** Redis (optional, for scaling)

### 9.3 Payments
- **India:** PhonePe (India market payment processor for ₹ pricing)
- **International:** Direct card processing (Visa, Mastercard, Amex)
- **Features:** Subscription management, invoices, payment method updates
- **Note:** No Stripe - Using PhonePe for India and direct card processing for international users

### 9.4 Email Service
- **Provider:** Mailgun (node-mailgun.js)
- **Use Cases:** Welcome emails, conversion notifications, password resets, billing

### 9.5 Job Queue
- **System:** Bull (Redis-based)
- **Purpose:** Async file conversion processing
- **Features:** Priority queues per tier, retry logic (3 attempts)

### 9.6 Frontend Framework
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **API Client:** TanStack React Query + Axios

### 9.7 File Processing
- **Documents:** LibreOffice + python-docx
- **Images:** Sharp + ImageMagick wrapper
- **Spreadsheets:** XLSX library
- **Presentations:** python-pptx

---

## 10. IMPORTANT DECISIONS

### 10.1 Why This Tech Stack?

**Next.js 14+ with App Router:**
- Server-side rendering for SEO (critical for organic traffic)
- API routes for backend (unified codebase)
- Built-in optimizations (image, font, script)
- TypeScript support out of the box

**Supabase:** ⭐ **PRIMARY PLATFORM**
- PostgreSQL database (robust, scalable) - **ALL DATA STORED HERE**
- Built-in authentication (though using NextAuth.js instead)
- S3-compatible storage (easy migration path) - **ALL FILES STORED HERE**
- Real-time capabilities (future-proof)
- Generous free tier for MVP
- **Note:** Supabase is the core infrastructure for database AND file storage

**Stripe:**
- Industry standard for subscriptions
- Webhook support for subscription events
- Global payment support
- Excellent documentation

**Bull (Redis):**
- Reliable job queue for async processing
- Priority queues (critical for tier-based processing)
- Retry logic built-in
- Scales horizontally

### 10.2 Constraints

**File Processing:**
- Requires server-side processing (LibreOffice, ImageMagick)
- Cannot run in serverless functions (Vercel) - needs dedicated server
- Processing time varies (2-5 min for free, instant for Enterprise)

**Storage:**
- Files deleted 24 hours after conversion (privacy-first)
- Storage costs scale with usage
- Need cleanup job for expired files

**Rate Limiting:**
- Free tier: 200 conversions/month
- Must track usage per user
- Reset logic on monthly basis

**Anonymous Users:**
- Free tier supports no-account conversions
- Must track conversions without user_id
- Conversion history lost if user doesn't sign up

### 10.3 MVP vs Future Phases

**Phase 1 MVP (Weeks 1-4):**
- ✓ Next.js setup + authentication
- ✓ Design system + Tailwind CSS
- ✓ Home page + Landing page
- ✓ Converter page (4 core formats: PDF↔DOCX, JPG↔PNG)
- ✓ Pricing page
- ✓ Basic user dashboard
- ✓ Stripe integration
- ✓ Authentication (email/password)

**Phase 2: Core Features (Weeks 5-8):**
- ✓ Conversion history page
- ✓ User settings page
- ✓ API keys generation
- ✓ Webhook support
- ✓ Blog pages (3-5 articles)
- ✓ FAQ page
- ✓ Support ticket system

**Phase 3: Polish & Launch (Weeks 9-10):**
- ✓ Performance optimization
- ✓ SEO optimization
- ✓ Security audit
- ✓ User testing
- ✓ Bug fixes
- ✓ Production deployment

**Future Phases (Not in MVP):**
- Full 110+ format support (MVP: 4 core formats)
- Cloud storage integration (Google Drive, Dropbox, OneDrive)
- White-label option
- Team management (Enterprise)
- Dark mode
- Multi-language support
- Admin dashboard

### 10.4 Performance Targets

**Page Load:**
- Home page: < 2 seconds
- Converter page: < 1.5 seconds
- Dashboard: < 2 seconds
- Blog pages: < 2.5 seconds
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

**Conversion Processing:**
- Free tier: 2-5 minutes (standard queue)
- Starter tier: 1-2 minutes (fast queue)
- Professional tier: 30 seconds (express queue)
- Enterprise tier: Instant (priority processing)

**Availability:**
- Free tier: 99.9% uptime SLA
- Paid tiers: 99.99% uptime SLA
- Maintenance windows: Sunday 2-4 AM UTC (max)

---

## 11. CLARIFYING QUESTIONS

### 11.1 Ambiguities Identified

1. **India Pricing Structure:**
   - PRD mentions "₹49.99-₹399.99/month" but doesn't break down which tier corresponds to which price
   - **Question:** Should India pricing mirror Global pricing structure (4 tiers) or have different tier names/benefits?

2. **File Processing Infrastructure:**
   - PRD mentions LibreOffice and python libraries, but Next.js runs on Node.js
   - **Question:** Will file processing run in separate Python microservice, or use Node.js wrappers? How will LibreOffice be installed/accessed?

3. **Anonymous User Tracking:**
   - Free tier supports no-account conversions
   - **Question:** How to track 200 conversions/month limit for anonymous users? IP-based? Cookie-based? Browser fingerprinting?

4. **PhonePe Integration:**
   - India market payment processor (replaces Razorpay)
   - **Question:** Is PhonePe required for MVP or Phase 2? Should it be parallel to Stripe or replace Stripe for India?

5. **OAuth Providers:**
   - PRD mentions Google and GitHub in auth pages, but not in tech stack details
   - **Question:** Are OAuth providers required for MVP or Phase 2?

6. **Format Support in MVP:**
   - PRD says "4 core formats" in Phase 1, but doesn't specify which 4
   - **Question:** Should MVP support PDF↔DOCX and JPG↔PNG, or different formats?

7. **Ad Integration:**
   - Free tier is ad-supported, but no ad provider specified
   - **Question:** Which ad network? Google AdSense? When to implement? MVP or Phase 2?

8. **File Cleanup:**
   - Files deleted 24 hours after conversion
   - **Question:** Should cleanup be automated job? Cron? Bull queue? When to run?

9. **Team Management:**
   - Enterprise tier has team management, but not in MVP
   - **Question:** What's the priority? Phase 2 or Phase 3?

10. **Deployment:**
    - No deployment platform specified
    - **Question:** Vercel for frontend? Railway/Render for backend? Separate server for file processing?

### 11.2 Assumptions Made

1. **Deployment:**
- Frontend: Vercel (Next.js optimized)
- Backend API: Vercel (Next.js API routes)
- File Processing: Separate server (Railway/Render/DigitalOcean) due to LibreOffice/ImageMagick requirements
- **Database: Supabase (managed PostgreSQL)** ⭐ **PRIMARY DATABASE**
- **File Storage: Supabase Storage** ⭐ **ALL FILES STORED HERE**
- Redis: Upstash or Railway (managed Redis for Bull)

2. **Format Support:**
   - MVP: PDF ↔ DOCX, JPG ↔ PNG (4 core conversions)
   - Phase 2+: Expand to full 110+ formats

3. **OAuth:**
   - Phase 2 feature (not MVP)
   - Google and GitHub providers

4. **Ad Integration:**
   - Phase 2 feature (not MVP)
   - Google AdSense (standard choice)

5. **PhonePe:**
   - Phase 2 feature (not MVP)
   - Parallel to Stripe for India market
   - Handles ₹ (INR) payments for Indian users

6. **Anonymous User Tracking:**
   - Cookie-based session tracking
   - IP + User-Agent fingerprinting as fallback
   - Limit enforced per browser session

---

## 12. CONFIDENCE LEVEL

### Rating: **8.5/10**

### Strengths
- ✅ Comprehensive PRD with detailed specifications
- ✅ Clear tech stack decisions
- ✅ Well-defined user tiers and pricing
- ✅ Detailed database schema
- ✅ Complete API endpoint list
- ✅ Design system fully specified
- ✅ Performance targets defined
- ✅ Implementation timeline provided

### Blockers or Concerns

**Minor Blockers:**
1. **File Processing Infrastructure:** Need clarification on Python/Node.js integration for LibreOffice
2. **Anonymous User Tracking:** Need decision on tracking method (cookie vs IP vs fingerprinting)
3. **India Pricing:** Need breakdown of ₹49.99-₹399.99 tiers

**Technical Concerns:**
1. **Serverless Limitation:** File processing cannot run in Vercel serverless functions - need dedicated server
2. **Processing Time:** 2-5 minutes for free tier may cause user drop-off - need progress indicators
3. **Storage Costs:** 24-hour file retention + cleanup job needed
4. **Rate Limiting:** Must implement robust usage tracking and reset logic

**Business Concerns:**
1. **Ad Revenue:** No ad provider specified - need to research and integrate
2. **Payment Processing:** PhonePe integration not detailed - may need separate checkout flow for India
3. **Format Support:** MVP only supports 4 formats - may limit initial user adoption

**No Critical Blockers:** All concerns are addressable with clarifications or reasonable assumptions.

### Ready to Proceed: **YES** ✅

---

## 13. NEXT STEPS

### Immediate Actions
1. ✅ **PRD Analysis Complete** - This document
2. ⏭️ **Get Clarifications** - Address 10 questions above
3. ⏭️ **Review Process Requirement Document (PRoD)** - If available
4. ⏭️ **Technical Architecture Design** - Detailed system design
5. ⏭️ **Sprint Planning** - Break down Phase 1 MVP into tasks

### What I'm Ready to Do Next

1. ✅ **Analyze Process Requirement Document (PRoD)** - If you have one
2. ✅ **Create Technical Architecture Document** - System design, infrastructure, deployment
3. ✅ **Set Up Project Structure** - Initialize Next.js project with TypeScript, Tailwind, etc.
4. ✅ **Implement Phase 1 MVP** - Start building core features
5. ✅ **Create Database Schema** - Set up Supabase tables and migrations
6. ✅ **Build API Endpoints** - Implement all API routes
7. ✅ **Design Component Library** - Build reusable UI components
8. ✅ **Set Up CI/CD Pipeline** - Automated testing and deployment

---

## 14. PHASE FOCUS RECOMMENDATION

### Recommended Focus: **Phase 1 MVP**

**Rationale:**
- Foundation for all future features
- Validates core product concept
- Enables early user testing
- 4-week timeline is aggressive but achievable

**Phase 1 MVP Scope:**
1. Project setup (Next.js, TypeScript, Tailwind, Supabase)
2. Authentication (NextAuth.js - email/password only)
3. Home page + Landing page
4. Converter page (4 core formats: PDF↔DOCX, JPG↔PNG)
5. Pricing page
6. Basic dashboard (usage stats, recent conversions)
7. Stripe integration (subscription checkout)
8. File upload + processing (Bull queue)
9. Download functionality

**Out of Scope for MVP:**
- OAuth providers (Phase 2)
- API keys & webhooks (Phase 2)
- Blog pages (Phase 2)
- Full 110+ format support (Phase 2+)
- Cloud storage integration (Phase 2+)
- Team management (Phase 3)

---

## 15. QUESTIONS FOR PRODUCT MANAGER

1. **India Pricing:** Can you provide the breakdown of ₹49.99-₹399.99 tiers?
2. **File Processing:** Should we use a Python microservice or Node.js wrappers for LibreOffice?
3. **Anonymous Tracking:** What method should we use for tracking free tier limits (cookie/IP/fingerprint)?
4. **OAuth:** Are Google/GitHub logins required for MVP or Phase 2?
5. **Ad Provider:** Which ad network should we integrate? Google AdSense?
6. **PhonePe:** Is this required for MVP or Phase 2? (India payment processor)
7. **Format Priority:** Which 4 formats should MVP support? (Assumed: PDF↔DOCX, JPG↔PNG)
8. **Deployment:** Preferred hosting platform? (Assumed: Vercel + Railway)
9. **Team Management:** Priority for Enterprise tier? Phase 2 or Phase 3?
10. **File Cleanup:** Automated job schedule? (Assumed: Daily cron at 2 AM UTC)

---

**END OF ANALYSIS**

**Status:** Ready to proceed with development  
**Confidence:** 8.5/10  
**Recommendation:** Start with Phase 1 MVP, address clarifications as we build

