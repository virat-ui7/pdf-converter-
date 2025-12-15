# TEST PROMPTS - QUICK REFERENCE
## File Converter Platform - All Test Prompts in One Place

**Purpose:** Quick access to all test prompts for manual testing  
**Usage:** Copy the relevant test prompt and execute step-by-step

---

## 📋 TEST PROMPTS INDEX

### Public Pages
1. [Home Page Test](#1-home-page-test)
2. [Converter Page Test](#2-converter-page-test)
3. [Pricing Page Test](#3-pricing-page-test)

### Authentication Pages
4. [Login Page Test](#4-login-page-test)
5. [Signup Page Test](#5-signup-page-test)
6. [Forgot Password Test](#6-forgot-password-test)
7. [Verify Email Test](#7-verify-email-test)
8. [Reset Password Test](#8-reset-password-test)

### Dashboard Pages
9. [Dashboard Home Test](#9-dashboard-home-test)
10. [Conversion History Test](#10-conversion-history-test)
11. [User Settings Test](#11-user-settings-test)
12. [Billing Page Test](#12-billing-page-test)
13. [API Keys & Webhooks Test](#13-api-keys--webhooks-test)

### Payment & Checkout
14. [Checkout Page Test](#14-checkout-page-test)
15. [Payment Callback Test](#15-payment-callback-test)

### API Endpoints
16. [Authentication APIs Test](#16-authentication-apis-test)
17. [Conversion APIs Test](#17-conversion-apis-test)
18. [User APIs Test](#18-user-apis-test)
19. [Billing APIs Test](#19-billing-apis-test)
20. [API Keys & Webhooks APIs Test](#20-api-keys--webhooks-apis-test)

---

## 1. HOME PAGE TEST

**Route:** `/`  
**Auth Required:** No

```markdown
TASK: Test Home Page

CHECKLIST:
□ Page loads without errors
□ Hero section: "Convert 110+ File Formats Instantly"
□ "Start Converting Now" button → Links to /convert
□ Value proposition: 3 cards visible
□ Supported formats grid: 4 categories
□ How it works: 3 steps displayed
□ Pricing comparison: 4 tiers
□ Testimonials: 3-5 testimonials
□ FAQ: Top 5 questions
□ CTA section: "Start Converting Now"
□ Footer: Links to Privacy, Terms, Contact
□ Responsive: Mobile (375px), Tablet (768px), Desktop (1440px)
□ SEO: Title, description, keywords present
□ Performance: Loads in <3 seconds

RESULT: ✓ PASS / ✗ FAIL
```

---

## 2. CONVERTER PAGE TEST

**Route:** `/convert`  
**Auth Required:** No (optional for enhanced features)

```markdown
TASK: Test Converter Page

CHECKLIST:
□ Page loads without errors
□ Upload area visible (drag & drop)
□ File picker works (click to browse)
□ File validation: Unsupported format → Error
□ File validation: Size limit → Error
□ Format selection dropdown works
□ Target format can be selected
□ "Convert" button visible
□ Conversion starts on click
□ Processing indicator shows
□ Progress bar updates (if implemented)
□ Download section appears after conversion
□ Download button works
□ File downloads successfully
□ Error handling: Network error → Message
□ Error handling: Conversion fails → Message
□ Tier limits enforced (free: 200/month)
□ Responsive: Mobile, Tablet, Desktop

RESULT: ✓ PASS / ✗ FAIL

MISSING FEATURES:
- Batch processing
- Cloud storage integration
- Instant preview
- Advanced options (fully)
```

---

## 3. PRICING PAGE TEST

**Route:** `/pricing`  
**Auth Required:** No

```markdown
TASK: Test Pricing Page

CHECKLIST:
□ Page loads without errors
□ 4 pricing cards: Free, Starter, Professional, Enterprise
□ Prices correct: $0, $4.99, $14.99, $49.99
□ Monthly/Annual toggle works
□ Annual prices show "Save 20%" (if applicable)
□ Feature comparison table visible
□ India (INR) pricing visible (if implemented)
□ "Get Started" buttons on each card
□ Buttons link to /checkout
□ FAQ section visible
□ Responsive: Mobile, Tablet, Desktop
□ SEO: Title includes "Pricing"

RESULT: ✓ PASS / ✗ FAIL
```

---

## 4. LOGIN PAGE TEST

**Route:** `/auth/login`  
**Auth Required:** No

```markdown
TASK: Test Login Page

CHECKLIST:
□ Page loads at /auth/login
□ Email input visible
□ Password input visible
□ "Sign In" button visible
□ "Remember me" checkbox visible
□ "Forgot password?" link → /auth/forgot-password
□ "Sign up" link → /auth/signup
□ Google login button (if configured)
□ GitHub login button (if configured)
□ Form validation: Empty → Error
□ Form validation: Invalid email → Error
□ Form validation: Wrong password → Error
□ Valid credentials → Redirects to /dashboard
□ "Remember me" → Session persists
□ Social login works (if configured)
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL
```

---

## 5. SIGNUP PAGE TEST

**Route:** `/auth/signup`  
**Auth Required:** No

```markdown
TASK: Test Signup Page

CHECKLIST:
□ Page loads at /auth/signup
□ Full name input visible
□ Email input visible
□ Password input visible
□ Confirm password input visible
□ Password strength indicator works
□ Terms checkbox visible
□ "Sign Up" button visible
□ Form validation: Empty → Error
□ Form validation: Invalid email → Error
□ Form validation: Password < 8 chars → Error
□ Form validation: Passwords don't match → Error
□ Form validation: Terms unchecked → Error
□ Valid form → Redirects to /auth/verify-email
□ Duplicate email → Error: "User already exists"
□ Social signup works (if configured)
□ Verification email sent (check logs)
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL
```

---

## 6. FORGOT PASSWORD TEST

**Route:** `/auth/forgot-password`  
**Auth Required:** No

```markdown
TASK: Test Forgot Password Page

CHECKLIST:
□ Page loads at /auth/forgot-password
□ Email input visible
□ "Send Reset Link" button visible
□ "Back to login" link → /auth/login
□ Form validation: Empty → Error
□ Form validation: Invalid email → Error
□ Valid email → Success message: "Reset link sent"
□ Reset email received (check Mailgun logs)
□ Reset link in email works → /auth/reset-password
□ Non-existent email → Success (don't reveal)
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL
```

---

## 7. VERIFY EMAIL TEST

**Route:** `/auth/verify-email`  
**Auth Required:** No (but requires verification code)

```markdown
TASK: Test Email Verification Page

CHECKLIST:
□ Page loads at /auth/verify-email
□ 6-digit code input visible
□ Countdown timer visible (10:00)
□ "Resend code" button visible
□ Code input accepts 6 digits
□ Valid code → Redirects to /dashboard
□ User marked as verified in database
□ Invalid code → Error message
□ Expired code → Error: "Code expired"
□ Resend code → New code sent
□ Countdown resets on resend
□ Timer counts down correctly
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL
```

---

## 8. RESET PASSWORD TEST

**Route:** `/auth/reset-password?token=...`  
**Auth Required:** No (but requires reset token)

```markdown
TASK: Test Reset Password Page

CHECKLIST:
□ Page loads with token parameter
□ New password input visible
□ Confirm password input visible
□ "Reset Password" button visible
□ Form validation: Empty → Error
□ Form validation: Password < 8 chars → Error
□ Form validation: Passwords don't match → Error
□ Valid form → Password updated
□ Success message displayed
□ Redirects to /auth/login
□ Can login with new password
□ Old password no longer works
□ Invalid token → Error message
□ Expired token → Error message
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL
```

---

## 9. DASHBOARD HOME TEST

**Route:** `/dashboard`  
**Auth Required:** Yes

```markdown
TASK: Test Dashboard Home Page

CHECKLIST:
□ Page loads at /dashboard
□ Requires auth (redirects if not logged in)
□ Quick stats cards visible:
  - Conversions count
  - Storage used
  - API calls (if Professional+)
□ Recent conversions table visible
□ Table columns: File name, Format, Status, Date, Actions
□ Download button works
□ Delete button works
□ Usage progress bars visible
□ Progress shows usage vs limit
□ Free tier: 200 conversions limit
□ Paid tier: Higher limits
□ Visual indicator at 80%, 100%
□ Quick action cards visible
□ "New Conversion" → /convert
□ "View History" → /dashboard/history
□ "Upgrade Plan" (if free tier) → /pricing
□ Upgrade prompt (if near limit)
□ Responsive: Mobile, Tablet, Desktop

RESULT: ✓ PASS / ✗ FAIL
```

---

## 10. CONVERSION HISTORY TEST

**Route:** `/dashboard/history`  
**Auth Required:** Yes

```markdown
TASK: Test Conversion History Page

CHECKLIST:
□ Page loads at /dashboard/history
□ Full history table visible
□ Filters visible: Status, Format, Search
□ Table columns: File name, Source, Target, Status, Date, Actions
□ Status badges colored (Success=green, Failed=red, Processing=yellow)
□ Filter by Status → Table updates
□ Filter by Format → Table updates
□ Search by file name → Results filter
□ Clear filters → All results show
□ Pagination visible (if >20 results)
□ Next page works
□ Previous page works
□ Page numbers clickable
□ Download button → Downloads file
□ Delete button → Deletes conversion
□ Delete confirmation (if implemented)
□ Sort by date (newest first)
□ Sort by status
□ Sort by format
□ Empty state: "No conversions yet"
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL
```

---

## 11. USER SETTINGS TEST

**Route:** `/dashboard/settings`  
**Auth Required:** Yes

```markdown
TASK: Test User Settings Page

CHECKLIST:
□ Page loads at /dashboard/settings
□ Account settings section visible
□ Preferences section visible
□ Danger zone visible
□ Full name input → Can edit
□ Email input → Can edit (or read-only)
□ Save button → Updates profile
□ Success message on save
□ Notification toggles visible
□ Email notifications toggle
□ Save preferences → Updates
□ Password change section visible
□ Old password input
□ New password input
□ Confirm password input
□ Update button → Changes password
□ Password validation works
□ "Delete Account" button visible
□ Delete confirmation modal
□ Confirm delete → Account deleted
□ Redirects to home after delete
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL

MISSING:
- Avatar upload
```

---

## 12. BILLING PAGE TEST

**Route:** `/dashboard/billing`  
**Auth Required:** Yes

```markdown
TASK: Test Billing Page

CHECKLIST:
□ Page loads at /dashboard/billing
□ Current plan displayed
□ Subscription status visible
□ Plan name: Free/Starter/Professional/Enterprise
□ Price displayed
□ Renewal date (if paid)
□ Status: Active/Cancelled
□ Usage tracker visible:
  - Conversions used / limit
  - Storage used / limit
  - API calls used / limit
□ Progress bars visible
□ "Add Payment Method" button (if implemented)
□ Payment method list (if implemented)
□ Remove payment method (if implemented)
□ Invoices list (if implemented)
□ Download invoice (if implemented)
□ "Upgrade Plan" button (if free/paid)
□ "Downgrade Plan" button (if applicable)
□ "Cancel Subscription" button (if paid)
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL

MISSING:
- Invoices list
- Payment method management
- Upgrade/downgrade flows
```

---

## 13. API KEYS & WEBHOOKS TEST

**Route:** `/dashboard/api`  
**Auth Required:** Yes (Professional+ tier)

```markdown
TASK: Test API Keys & Webhooks Page

CHECKLIST:
□ Page loads at /dashboard/api
□ Free/Starter tier → "Upgrade required" message
□ Professional+ tier → Full access
□ API Keys section visible
□ Webhooks section visible
□ API keys list visible
□ Each key shows: Name, Created date, Last used
□ "Create API Key" button visible
□ Create modal/form opens
□ Enter name → Submit
□ Key displayed (only once)
□ Copy button works
□ Key saved to list
□ Delete button for each key
□ Delete confirmation
□ Key deleted → List updates
□ Webhooks list visible
□ Each webhook shows: URL, Event type, Status, Created date
□ "Create Webhook" button visible
□ Create form opens
□ Enter URL, Select event type
□ Submit → Webhook created
□ Appears in list
□ Delete button works
□ Delete confirmation
□ Webhook deleted
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL

MISSING:
- Edit webhook
- Test webhook
- Webhook delivery status
```

---

## 14. CHECKOUT PAGE TEST

**Route:** `/checkout`  
**Auth Required:** No (but recommended)

```markdown
TASK: Test Checkout Page

CHECKLIST:
□ Page loads at /checkout
□ Order summary visible
□ Plan name displayed
□ Price displayed (monthly/annual)
□ Features list
□ Total amount
□ Payment method selection visible
□ PhonePe option (for India)
□ Card option (for International)
□ Selection works
□ "Pay with PhonePe" button
□ Redirects to PhonePe gateway
□ Payment completes
□ Redirects to /payment/callback
□ Card form appears (if implemented)
□ Enter card details
□ Submit → Payment processes
□ Error handling: Payment fails → Error message
□ Retry option
□ Responsive: Mobile, Desktop

RESULT: ✓ PASS / ✗ FAIL

MISSING:
- Billing address form
- Card form UI
```

---

## 15. PAYMENT CALLBACK TEST

**Route:** `/payment/callback?status=...`  
**Auth Required:** No

```markdown
TASK: Test Payment Callback Page

CHECKLIST:
□ Success: /payment/callback?status=success
□ Success message displayed
□ "Go to Dashboard" button visible
□ Click → Redirects to /dashboard
□ Subscription activated
□ Failure: /payment/callback?status=failed
□ Error message displayed
□ "Try Again" button visible
□ Click → Redirects to /checkout
□ Invalid callback → Error message
□ Missing parameters → Error handling

RESULT: ✓ PASS / ✗ FAIL
```

---

## 16. AUTHENTICATION APIs TEST

**Base URL:** `http://localhost:3000/api`

```markdown
TASK: Test Authentication APIs

ENDPOINTS TO TEST:

1. POST /api/auth/register
   □ Body: { email, password, fullName }
   □ Status: 201 Created
   □ Response: { message, userId }
   □ User created in database
   □ Verification email sent

2. POST /api/auth/login (via NextAuth)
   □ Body: { email, password }
   □ Status: 200 OK
   □ Response: { token, user }
   □ Session created

3. POST /api/auth/logout (via NextAuth)
   □ Headers: Authorization: Bearer token
   □ Status: 200 OK
   □ Session destroyed

4. POST /api/auth/forgot-password
   □ Body: { email }
   □ Status: 200 OK
   □ Response: { message: "Reset link sent" }
   □ Reset email sent

5. POST /api/auth/reset-password
   □ Body: { token, newPassword }
   □ Status: 200 OK
   □ Password updated

6. GET /api/auth/me
   □ Headers: Authorization: Bearer token
   □ Status: 200 OK
   □ Response: { user }

7. POST /api/auth/verify-email
   □ Body: { email, code }
   □ Status: 200 OK
   □ User verified

8. POST /api/auth/resend-verification
   □ Body: { email }
   □ Status: 200 OK
   □ New code sent

RESULT: ✓ PASS / ✗ FAIL
```

---

## 17. CONVERSION APIs TEST

```markdown
TASK: Test Conversion APIs

ENDPOINTS TO TEST:

1. POST /api/convert
   □ Body: FormData { file, sourceFormat, targetFormat }
   □ Headers: Authorization: Bearer token (optional)
   □ Status: 200 OK
   □ Response: { conversionId, jobId, status }
   □ File uploaded to Supabase Storage
   □ Conversion record created
   □ Job added to queue

2. GET /api/conversions
   □ Headers: Authorization: Bearer token
   □ Query: ?limit=20&offset=0&format=pdf
   □ Status: 200 OK
   □ Response: { conversions: [], total, hasMore }
   □ Pagination works

3. GET /api/conversions/[id]
   □ Headers: Authorization: Bearer token
   □ Status: 200 OK
   □ Response: { id, status, convertedFileUrl, completedAt }
   □ Status: queued/processing/completed/failed

4. DELETE /api/conversions/[id]
   □ Headers: Authorization: Bearer token
   □ Status: 204 No Content
   □ Conversion deleted

RESULT: ✓ PASS / ✗ FAIL

MISSING:
- POST /api/conversions/:id/download
```

---

## 18. USER APIs TEST

```markdown
TASK: Test User APIs

ENDPOINTS TO TEST:

1. GET /api/users/profile
   □ Headers: Authorization: Bearer token
   □ Status: 200 OK
   □ Response: { user details }

2. PUT /api/users/profile
   □ Headers: Authorization: Bearer token
   □ Body: { fullName, preferences }
   □ Status: 200 OK
   □ Profile updated

RESULT: ✓ PASS / ✗ FAIL

MISSING:
- PUT /api/users/password
- GET /api/users/usage
```

---

## 19. BILLING APIs TEST

```markdown
TASK: Test Billing APIs

ENDPOINTS TO TEST:

1. GET /api/billing/subscription
   □ Headers: Authorization: Bearer token
   □ Status: 200 OK
   □ Response: { plan, status, renewalDate, price }

RESULT: ✓ PASS / ✗ FAIL

MISSING:
- POST /api/billing/upgrade
- POST /api/billing/cancel
- GET /api/billing/invoices
- POST /api/billing/payment-method
- DELETE /api/billing/payment-method
```

---

## 20. API KEYS & WEBHOOKS APIs TEST

```markdown
TASK: Test API Keys & Webhooks APIs

ENDPOINTS TO TEST:

1. GET /api/api-keys
   □ Headers: Authorization: Bearer token
   □ Status: 200 OK
   □ Response: { keys: [] }

2. POST /api/api-keys
   □ Headers: Authorization: Bearer token
   □ Body: { name }
   □ Status: 201 Created
   □ Response: { key, secret }
   □ Key hashed in database

3. DELETE /api/api-keys/[id]
   □ Headers: Authorization: Bearer token
   □ Status: 204 No Content
   □ Key deleted

4. GET /api/webhooks
   □ Headers: Authorization: Bearer token
   □ Status: 200 OK
   □ Response: { webhooks: [] }

5. POST /api/webhooks
   □ Headers: Authorization: Bearer token
   □ Body: { url, eventType }
   □ Status: 201 Created
   □ Response: { webhook }

6. DELETE /api/webhooks/[id]
   □ Headers: Authorization: Bearer token
   □ Status: 204 No Content
   □ Webhook deleted

RESULT: ✓ PASS / ✗ FAIL

MISSING:
- PUT /api/webhooks/[id]
- POST /api/webhooks/[id]/test
```

---

## USAGE INSTRUCTIONS

1. **Copy the test prompt** you want to execute
2. **Open the application** in your browser (localhost:3000)
3. **Follow each checklist item** step by step
4. **Mark items as complete** (✓) or failed (✗)
5. **Note any issues** in the "ISSUES FOUND" section
6. **Record the result** (PASS/FAIL)
7. **Move to next test** if PASS, or fix issues if FAIL

---

**Last Updated:** December 15, 2025  
**Total Test Prompts:** 20

