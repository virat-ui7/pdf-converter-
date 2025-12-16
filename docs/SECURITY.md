# Security Guide

Security considerations and best practices for FileConverter platform.

## Security Architecture

### Authentication

**NextAuth.js v4:**
- JWT tokens with 15-minute expiry
- Refresh tokens with 7-day expiry
- Secure session management
- CSRF protection

**API Keys:**
- SHA256 hashed before storage
- Never exposed in logs or responses
- Rate-limited per key
- Revocable at any time

**Password Security:**
- Bcrypt hashing (minimum 10 rounds)
- Minimum 8 characters
- No password storage in plain text
- Password reset tokens expire after 1 hour

### File Security

**Upload Validation:**
- File size limits (tier-based)
- Magic bytes validation (content-based type detection)
- Format whitelist (only supported formats)
- Conversion matrix validation

**Storage:**
- Files encrypted in transit (HTTPS)
- Files encrypted at rest (Supabase)
- Automatic cleanup (24 hours for free tier, 7 days for paid)
- No file access by platform operators

**Processing:**
- Worker-level re-validation (defense-in-depth)
- Sandboxed conversion processes
- Timeout limits (5 minutes per job)
- Error message sanitization (no internal details)

### Input Validation

**API Endpoints:**
- Zod schema validation
- Type-safe request handling
- Parameterized queries (SQL injection prevention)
- Rate limiting per user and per IP

**File Validation:**
- Magic bytes check (prevents file type spoofing)
- File size limits (prevents DoS)
- Format whitelist (prevents unsupported formats)
- Content validation (corrupted file detection)

### Data Protection

**User Data:**
- Row Level Security (RLS) in Supabase
- User can only access their own data
- API keys are hashed
- Passwords are hashed

**File Data:**
- Files are not accessible by other users
- Files are automatically deleted after retention period
- No file content is logged or stored permanently
- File URLs are temporary and expire

## Security Best Practices

### For Developers

1. **Never log sensitive data:**
   ```typescript
   // ❌ Bad
   console.log('User password:', password)
   
   // ✅ Good
   console.log('User authentication attempt')
   ```

2. **Sanitize error messages:**
   ```typescript
   // ❌ Bad
   throw new Error(`File path: ${internalPath}`)
   
   // ✅ Good
   throw new Error('File processing failed. Please try again.')
   ```

3. **Validate all inputs:**
   ```typescript
   // ✅ Good
   const schema = z.object({
     email: z.string().email(),
     password: z.string().min(8)
   })
   const validated = schema.parse(input)
   ```

4. **Use parameterized queries:**
   ```typescript
   // ❌ Bad
   await supabase.from('users').select(`* WHERE id = '${userId}'`)
   
   // ✅ Good
   await supabase.from('users').select('*').eq('id', userId)
   ```

### For Operators

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong secrets (generate with `npm run generate-secret`)
   - Rotate secrets regularly
   - Use different secrets for staging and production

2. **Database Access:**
   - Use service role key only in server-side code
   - Never expose service role key to client
   - Use RLS policies to restrict access
   - Regular security audits

3. **Monitoring:**
   - Monitor for suspicious activity
   - Alert on authentication failures
   - Track rate limit hits
   - Review error logs regularly

## Security Features

### Rate Limiting

**API Endpoints:**
- Authentication: 10 requests/hour per IP
- File upload: Tier-based limits
- API calls: Tier-based limits (10-1000/minute)

**Implementation:**
- Per-user rate limiting (tier-based)
- Per-IP rate limiting (global)
- Exponential backoff on failures

### File Validation

**Magic Bytes:**
- Content-based file type detection
- Prevents file type spoofing
- Validates file integrity

**Size Limits:**
- Tier-based file size limits
- Prevents DoS attacks
- Enforced at API and worker levels

**Format Whitelist:**
- Only supported formats accepted
- Conversion matrix validation
- Prevents unsupported conversions

### Error Handling

**Sanitization:**
- No internal paths in error messages
- No stack traces in user-facing errors
- Generic error messages for security
- Detailed errors only in server logs

**Example:**
```typescript
// ❌ Bad
catch (error) {
  return { error: error.message } // May expose internal details
}

// ✅ Good
catch (error) {
  console.error('Internal error:', error) // Log internally
  return { error: 'Conversion failed. Please try again.' } // Generic message
}
```

## Security Checklist

### Pre-Launch

- [ ] All environment variables are set and secure
- [ ] API keys are hashed before storage
- [ ] Passwords are hashed with bcrypt
- [ ] RLS policies are enabled in Supabase
- [ ] Rate limiting is configured
- [ ] File validation is working (magic bytes, size limits)
- [ ] Error messages are sanitized
- [ ] HTTPS is enabled (SSL certificate)
- [ ] CORS is configured correctly
- [ ] Security headers are set

### Ongoing

- [ ] Regular security audits
- [ ] Dependency updates (security patches)
- [ ] Monitor for suspicious activity
- [ ] Review access logs
- [ ] Rotate secrets regularly
- [ ] Test security features
- [ ] Keep documentation updated

## Incident Response

### Security Incident Procedure

1. **Detect:** Identify security issue
2. **Contain:** Isolate affected systems
3. **Assess:** Determine scope and impact
4. **Remediate:** Fix the issue
5. **Notify:** Inform affected users (if required)
6. **Document:** Record incident and lessons learned

### Common Security Issues

**File Upload Attacks:**
- **Symptom:** Malicious files uploaded
- **Mitigation:** Magic bytes validation, format whitelist
- **Response:** Reject file, log incident, alert security team

**Rate Limit Bypass:**
- **Symptom:** Excessive API calls
- **Mitigation:** Per-IP and per-user rate limiting
- **Response:** Block IP, alert security team

**Authentication Bypass:**
- **Symptom:** Unauthorized access
- **Mitigation:** Strong authentication, rate limiting
- **Response:** Revoke tokens, reset passwords, alert users

## Compliance

### GDPR

- **Data Minimization:** Only collect necessary data
- **Right to Access:** Users can request their data
- **Right to Deletion:** Users can delete their account
- **Data Portability:** Users can export their data
- **Privacy Policy:** Clear and accessible

### Data Retention

- **Files:** 24 hours (free tier), 7 days (paid tiers)
- **Conversion Records:** 1 year (Professional+), 30 days (Free)
- **User Data:** Until account deletion
- **Analytics:** 90 days (aggregated, anonymized)

## Security Resources

- **OWASP Top 10:** [owasp.org](https://owasp.org/www-project-top-ten/)
- **Next.js Security:** [nextjs.org/docs/going-to-production#security](https://nextjs.org/docs/going-to-production#security)
- **Supabase Security:** [supabase.com/docs/guides/platform/security](https://supabase.com/docs/guides/platform/security)

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Email: security@fileconverter.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

---

**Last Updated:** 2025-12-15  
**Security Contact:** security@fileconverter.com

