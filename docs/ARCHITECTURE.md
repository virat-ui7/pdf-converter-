# System Architecture

Overview of FileConverter platform architecture and design.

## High-Level Architecture

```
┌─────────────┐
│   Client    │ (Browser, Mobile, API)
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────┐
│         Next.js Application          │
│  ┌─────────────┐  ┌──────────────┐ │
│  │   Frontend  │  │  API Routes   │ │
│  │  (React)    │  │  (Next.js)    │ │
│  └─────────────┘  └──────┬────────┘ │
└───────────────────────────┼──────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │     Redis     │  │   Workers    │
│  (PostgreSQL │  │   (Bull Queue)│  │ (Conversion) │
│   + Storage) │  │               │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Components

### 1. Frontend (Next.js App Router)

**Technology:** Next.js 14, React, TypeScript, Tailwind CSS

**Pages:**
- Public pages: Landing, Pricing, Features, Formats, FAQ
- Auth pages: Login, Signup, Forgot Password, Reset Password
- Protected pages: Dashboard, History, Settings, Billing, API Settings

**Key Features:**
- Server-side rendering (SSR) for SEO
- Client-side interactivity for conversions
- Real-time status updates (polling)
- Responsive design (mobile-first)

### 2. API Layer (Next.js API Routes)

**Technology:** Next.js API Routes, NextAuth.js

**Endpoints:**
- `/api/auth/*` - Authentication
- `/api/convert` - File conversion
- `/api/conversions/*` - Conversion management
- `/api/users/*` - User management
- `/api/billing/*` - Billing and subscriptions
- `/api/api-keys/*` - API key management
- `/api/webhooks/*` - Webhook management
- `/api/health` - Health checks
- `/api/metrics` - Prometheus metrics

**Authentication:**
- NextAuth.js v4
- JWT tokens (15-min expiry)
- Refresh tokens (7-day expiry)
- API key authentication (Professional+)

### 3. Database (Supabase PostgreSQL)

**Technology:** Supabase (PostgreSQL)

**Tables:**
- `users` - User accounts and profiles
- `conversions` - Conversion jobs and results
- `subscriptions` - Subscription plans and billing
- `api_keys` - API keys (hashed)
- `webhooks` - Webhook configurations
- `email_logs` - Email delivery tracking
- `analytics` - Event tracking

**Features:**
- Row Level Security (RLS)
- Automatic backups
- Connection pooling
- Real-time subscriptions (optional)

### 4. File Storage (Supabase Storage)

**Technology:** Supabase Storage (S3-compatible)

**Buckets:**
- `uploads` - Original uploaded files
- `converted` - Converted output files

**Features:**
- Automatic cleanup (24 hours for free tier, 7 days for paid)
- Public URLs for downloads
- CDN integration

### 5. Job Queue (Bull + Redis)

**Technology:** Bull.js, Redis (ioredis)

**Queue Configuration:**
- Queue name: `conversions`
- Concurrency: 5 jobs per worker
- Max retries: 3 attempts
- Timeout: 5 minutes per job
- Backoff: Exponential (2s, 4s, 8s)

**Job Structure:**
```typescript
{
  conversionId: string
  userId: string | null
  originalFileUrl: string
  originalFileName: string
  sourceFormat: string
  targetFormat: string
  quality?: number
  compression?: boolean
}
```

### 6. Conversion Workers

**Technology:** Node.js, TypeScript

**Worker Process:**
1. Polls queue for jobs
2. Downloads file from storage
3. Validates file (size, format, magic bytes)
4. Routes to appropriate converter
5. Processes conversion
6. Uploads result to storage
7. Updates database
8. Sends notifications (email, webhooks)

**Converters:**
- `lib/converters/document.ts` - Document conversions (LibreOffice)
- `lib/converters/image.ts` - Image conversions (Sharp)
- `lib/converters/spreadsheet.ts` - Spreadsheet conversions (xlsx, exceljs)
- `lib/converters/presentation.ts` - Presentation conversions (LibreOffice)
- `lib/converters/email.ts` - Email conversions (mailparser)
- `lib/converters/calendar.ts` - Calendar conversions (ical.js)
- `lib/converters/ebook.ts` - eBook conversions (LibreOffice)
- `lib/converters/raw.ts` - RAW image conversions (dcraw)
- `lib/converters/vector.ts` - Vector conversions (sharp, potrace)
- `lib/converters/professional.ts` - Professional formats (ag-psd, ghostscript)
- `lib/converters/programming.ts` - Programming formats (text)

## Conversion Pipeline

### 1. Upload Phase

```
User uploads file
  ↓
API validates:
  - File size (tier limit)
  - File format (magic bytes)
  - Conversion supported (matrix check)
  ↓
File uploaded to Supabase Storage
  ↓
Conversion record created in database
  ↓
Job added to Bull queue
  ↓
Response: { conversionId, status: "pending" }
```

### 2. Processing Phase

```
Worker picks up job
  ↓
Downloads file from storage
  ↓
Re-validates (defense-in-depth):
  - File size
  - Magic bytes
  - Conversion matrix
  ↓
Routes to appropriate converter
  ↓
Converter processes:
  - Document: LibreOffice CLI
  - Image: Sharp
  - Spreadsheet: xlsx/exceljs
  - Presentation: LibreOffice CLI
  ↓
Conversion completes or fails
```

### 3. Completion Phase

```
If success:
  - Upload converted file to storage
  - Update database: status="completed"
  - Increment user conversion count
  - Send email notification
  - Trigger webhook (if configured)
  - Log analytics event

If failure:
  - Update database: status="failed"
  - Store error message (sanitized)
  - Send error email
  - Trigger webhook (if configured)
  - Log analytics event
```

## Validation Pipeline

### API-Level Validation

**Location:** `app/api/convert/route.ts`

**Checks:**
1. File size validation (`lib/file-limits.ts`)
2. Magic bytes validation (`lib/format-validation.ts`)
3. Conversion matrix check (`lib/conversion-rules.ts`)

**Rejection Codes:**
- `413 Payload Too Large` - File exceeds tier limit
- `400 Bad Request` - Invalid format or unsupported conversion

### Worker-Level Validation (Defense-in-Depth)

**Location:** `scripts/start-worker.ts`

**Checks:**
1. Re-check file size
2. Re-validate magic bytes
3. Re-check conversion matrix

**Purpose:** Prevent malicious or corrupted files from reaching conversion tools

## Security Architecture

### Authentication

- **NextAuth.js:** Session management
- **JWT:** Token-based authentication
- **API Keys:** SHA256 hashed, stored securely
- **Rate Limiting:** Per-user and per-IP

### File Security

- **Magic Bytes Validation:** Content-based file type detection
- **File Size Limits:** Tier-based enforcement
- **Automatic Cleanup:** Files deleted after retention period
- **Encryption:** HTTPS in transit, encrypted at rest (Supabase)

### Input Validation

- **Zod Schemas:** Type-safe validation
- **Sanitization:** Error messages sanitized (no internal details)
- **SQL Injection:** Parameterized queries (Supabase)

## Monitoring & Observability

### Metrics

**Prometheus Metrics:**
- Conversion success/failure rates
- Conversion duration (P50, P95, P99)
- Queue depth and worker utilization
- API error rates (4xx, 5xx)
- Validation rejections
- Tier usage

**Endpoint:** `/api/metrics`

### Health Checks

**Endpoints:**
- `/api/health?type=live` - Liveness probe
- `/api/health?type=ready` - Readiness probe
- `/api/health?type=deep` - Full system check

### Logging

- **Application Logs:** Console (structured JSON)
- **Error Tracking:** Sentry (optional)
- **Analytics:** Supabase `analytics` table

## Scalability

### Horizontal Scaling

- **API Servers:** Stateless, can scale horizontally
- **Workers:** Multiple worker instances can process jobs
- **Database:** Supabase handles connection pooling
- **Queue:** Redis supports multiple workers

### Vertical Scaling

- **Worker Resources:** CPU and memory for conversion processing
- **Database:** Supabase auto-scales
- **Storage:** Supabase Storage scales automatically

### Caching

- **Format Lists:** Cached in memory
- **User Data:** Session-based caching
- **Conversion Results:** Temporary URLs (7 days)

## Deployment Architecture

### Production

- **Frontend + API:** Vercel (Next.js)
- **Workers:** Railway, Render, or Docker containers
- **Database:** Supabase (managed PostgreSQL)
- **Storage:** Supabase Storage
- **Queue:** Upstash Redis or self-hosted Redis

### Staging

- **Same architecture as production**
- **Separate Supabase project**
- **Separate Redis instance**
- **Test payment credentials**

## Technology Stack Summary

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Node.js |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (S3-compatible) |
| Queue | Bull.js, Redis (ioredis) |
| Auth | NextAuth.js v4 |
| Image Processing | Sharp |
| Document Processing | LibreOffice (headless) |
| Email | Mailgun |
| Payments | PhonePe (India), Direct Card Processing |
| Monitoring | Prometheus, Grafana (recommended) |

---

**Last Updated:** 2025-12-15  
**Architecture Version:** 1.0

