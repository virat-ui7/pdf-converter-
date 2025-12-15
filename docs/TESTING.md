# Testing Guide

Comprehensive testing guide for FileConverter platform.

## Test Environment Setup

1. **Local Development**
   ```bash
   npm run dev
   npm run worker  # In separate terminal
   ```

2. **Test Accounts**
   - Create test users in Supabase
   - Use test payment credentials
   - Use Mailgun test domain

## Test Cases

### 1. Authentication Flow

#### Sign Up
- [ ] Navigate to `/auth/signup`
- [ ] Fill in form with valid data
- [ ] Submit form
- [ ] Verify email sent (check Mailgun logs)
- [ ] Enter verification code
- [ ] Verify redirect to login

#### Login
- [ ] Navigate to `/auth/login`
- [ ] Enter valid credentials
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Check session persists

#### OAuth Login
- [ ] Click "Sign in with Google"
- [ ] Complete OAuth flow
- [ ] Verify account created
- [ ] Verify redirect to dashboard

#### Password Reset
- [ ] Navigate to `/auth/forgot-password`
- [ ] Enter registered email
- [ ] Submit form
- [ ] Verify email sent
- [ ] Click reset link
- [ ] Enter new password
- [ ] Verify password updated

### 2. File Conversion

#### Upload File
- [ ] Navigate to `/convert`
- [ ] Drag and drop file
- [ ] Verify file accepted
- [ ] Check file details displayed
- [ ] Test file size limit (upload file > limit)
- [ ] Test unsupported format

#### Format Selection
- [ ] After upload, verify format dropdown
- [ ] Search for format
- [ ] Select target format
- [ ] Verify format compatibility

#### Conversion Process
- [ ] Click "Convert" button
- [ ] Verify job queued
- [ ] Check status updates (polling)
- [ ] Verify worker processes job
- [ ] Check conversion status in database
- [ ] Verify converted file uploaded to storage

#### Download
- [ ] Wait for conversion to complete
- [ ] Click download button
- [ ] Verify file downloads
- [ ] Check file format is correct

### 3. Dashboard

#### Stats Display
- [ ] Navigate to `/dashboard`
- [ ] Verify stats cards display
- [ ] Check conversion count
- [ ] Check storage usage
- [ ] Verify progress bars

#### Conversion History
- [ ] Navigate to `/dashboard/history`
- [ ] Verify conversions listed
- [ ] Test filters (status, format)
- [ ] Test search
- [ ] Test pagination
- [ ] Delete conversion
- [ ] Verify deletion

### 4. Settings

#### Profile Update
- [ ] Navigate to `/dashboard/settings`
- [ ] Update full name
- [ ] Save changes
- [ ] Verify update successful
- [ ] Check session refreshed

#### Preferences
- [ ] Toggle email notifications
- [ ] Toggle newsletter
- [ ] Verify preferences saved

### 5. Billing

#### Pricing Page
- [ ] Navigate to `/pricing`
- [ ] Verify all plans displayed
- [ ] Toggle monthly/annual
- [ ] Verify pricing updates
- [ ] Click "Choose Plan"

#### Checkout
- [ ] Select plan
- [ ] Navigate to checkout
- [ ] Verify order summary
- [ ] Select payment method
- [ ] Complete payment (test mode)
- [ ] Verify redirect to callback
- [ ] Check subscription created

#### Subscription Management
- [ ] Navigate to `/dashboard/billing`
- [ ] Verify current plan displayed
- [ ] Check usage tracker
- [ ] Verify billing date

### 6. API (Professional+)

#### API Key Management
- [ ] Navigate to `/dashboard/api`
- [ ] Create new API key
- [ ] Verify key displayed (once)
- [ ] Copy key
- [ ] Delete key
- [ ] Verify deletion

#### API Usage
- [ ] Use API key in request
- [ ] Make conversion request
- [ ] Verify conversion created
- [ ] Check conversion status
- [ ] Download converted file

#### Webhooks
- [ ] Create webhook
- [ ] Verify webhook saved
- [ ] Complete conversion
- [ ] Verify webhook triggered
- [ ] Check webhook payload

### 7. Email Notifications

#### Verification Email
- [ ] Sign up new user
- [ ] Check email inbox
- [ ] Verify email received
- [ ] Check email content
- [ ] Verify links work

#### Conversion Email
- [ ] Complete conversion
- [ ] Check email inbox
- [ ] Verify completion email
- [ ] Check download link

#### Error Email
- [ ] Trigger conversion error
- [ ] Check email inbox
- [ ] Verify error email
- [ ] Check error message

### 8. Error Handling

#### Invalid Input
- [ ] Submit form with invalid email
- [ ] Submit form with weak password
- [ ] Upload unsupported file format
- [ ] Verify error messages display

#### Network Errors
- [ ] Simulate network failure
- [ ] Verify error handling
- [ ] Check user-friendly messages

#### Server Errors
- [ ] Trigger 500 error
- [ ] Verify error logged
- [ ] Check user notification

### 9. Performance

#### Page Load
- [ ] Test landing page load time
- [ ] Test dashboard load time
- [ ] Check Lighthouse score
- [ ] Verify Core Web Vitals

#### Conversion Speed
- [ ] Time small file conversion
- [ ] Time large file conversion
- [ ] Check queue processing speed
- [ ] Verify concurrent conversions

### 10. Security

#### Authentication
- [ ] Test session expiration
- [ ] Verify protected routes
- [ ] Check CSRF protection
- [ ] Test password hashing

#### Authorization
- [ ] Test user data access
- [ ] Verify API key validation
- [ ] Check webhook authorization
- [ ] Test subscription limits

#### Input Validation
- [ ] Test SQL injection attempts
- [ ] Test XSS attempts
- [ ] Verify file type validation
- [ ] Check file size limits

## Automated Testing

### Unit Tests (Future)

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react

# Run tests
npm test
```

### Integration Tests (Future)

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run tests
npx playwright test
```

## Performance Testing

### Lighthouse Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Target scores:
   - Performance: >90
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90

### Load Testing

Use tools like:
- **k6** - Load testing
- **Artillery** - Performance testing
- **Apache Bench** - Simple load testing

## Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast ratios
- [ ] ARIA labels
- [ ] Focus indicators

## Security Testing

- [ ] OWASP Top 10 vulnerabilities
- [ ] Dependency vulnerabilities (`npm audit`)
- [ ] Authentication bypass attempts
- [ ] Authorization checks
- [ ] Input sanitization

## Regression Testing

Before each release:
1. Run all test cases above
2. Test critical user flows
3. Verify no breaking changes
4. Check performance metrics

## Bug Reporting

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
- Console errors
- Screenshots if applicable

