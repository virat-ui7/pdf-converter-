# FileConverter - Pre-Launch Checklist

Use this checklist before deploying to production.

## 🔧 Setup & Configuration

### Environment Variables
- [ ] All required variables set in `.env.local`
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] Supabase credentials configured
- [ ] Redis connection configured
- [ ] Mailgun credentials set (if using email)
- [ ] PhonePe credentials set (if using India payments)
- [ ] OAuth credentials set (if using OAuth)

### Database
- [ ] Supabase project created
- [ ] Schema executed (`supabase/schema.sql`)
- [ ] All 7 tables created and verified
- [ ] RLS policies configured
- [ ] Test data inserted (optional)

### Storage
- [ ] `uploads` bucket created
- [ ] `converted` bucket created
- [ ] Bucket permissions configured
- [ ] CORS rules set (if needed)

### Infrastructure
- [ ] Redis server running
- [ ] LibreOffice installed (for document conversion)
- [ ] Worker process configured
- [ ] Monitoring set up

## 🧪 Testing

### Authentication
- [ ] Sign up flow works
- [ ] Email verification works
- [ ] Login works (email/password)
- [ ] OAuth login works (if enabled)
- [ ] Password reset works
- [ ] Session management works

### File Conversion
- [ ] File upload works
- [ ] Format selection works
- [ ] Conversion processes successfully
- [ ] Status updates work
- [ ] Download works
- [ ] Error handling works

### Dashboard
- [ ] Stats display correctly
- [ ] Conversion history loads
- [ ] Filters work
- [ ] Settings update works
- [ ] Billing page displays

### Payments
- [ ] Pricing page displays
- [ ] Checkout flow works
- [ ] Payment processing works (test mode)
- [ ] Webhook receives callbacks
- [ ] Subscription created in database

### API (Professional+)
- [ ] API key creation works
- [ ] API authentication works
- [ ] Conversion via API works
- [ ] Webhook creation works
- [ ] Webhook delivery works

## 🔒 Security

- [ ] Passwords hashed (bcrypt)
- [ ] API keys hashed (SHA256)
- [ ] Input validation on all forms
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection
- [ ] CSRF protection (NextAuth)
- [ ] Environment variables not exposed
- [ ] RLS policies enabled
- [ ] File upload validation
- [ ] Rate limiting considered

## 📱 Responsive Design

- [ ] Mobile layout works (< 768px)
- [ ] Tablet layout works (768px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Touch targets adequate (44px+)
- [ ] Text readable on mobile
- [ ] Forms usable on mobile
- [ ] Navigation works on mobile

## ♿ Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast adequate (4.5:1)
- [ ] Alt text on images
- [ ] ARIA labels where needed
- [ ] Screen reader compatible

## ⚡ Performance

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive reasonable
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Code splitting working

## 📧 Email

- [ ] Verification emails send
- [ ] Password reset emails send
- [ ] Conversion emails send
- [ ] Email templates render correctly
- [ ] Links in emails work
- [ ] Email delivery rate acceptable

## 🔍 SEO

- [ ] Meta tags on all pages
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Structured data (if applicable)
- [ ] Canonical URLs

## 📝 Documentation

- [ ] README.md complete
- [ ] API documentation complete
- [ ] Deployment guide complete
- [ ] Testing guide complete
- [ ] Troubleshooting guide complete
- [ ] Environment setup guide complete

## 🚀 Deployment

### Pre-Deployment
- [ ] Code committed to Git
- [ ] All tests passing
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Environment variables documented

### Deployment
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Build successful
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Worker deployed separately

### Post-Deployment
- [ ] All pages load correctly
- [ ] API endpoints work
- [ ] Database connection works
- [ ] Storage access works
- [ ] Email sending works
- [ ] Payment processing works (test)
- [ ] Monitoring active

## 🎯 Launch

- [ ] Final testing completed
- [ ] Team notified
- [ ] Support channels ready
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Backup strategy in place

## 📊 Post-Launch

- [ ] Monitor error rates
- [ ] Check conversion success rate
- [ ] Monitor performance metrics
- [ ] Review user feedback
- [ ] Plan improvements

---

**Status:** Ready for launch when all items checked ✅

