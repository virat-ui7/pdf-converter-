# Troubleshooting Guide

Common issues and solutions for FileConverter platform.

## Authentication Issues

### "Too many redirects" Error

**Symptoms:** Browser shows redirect loop

**Solutions:**
1. Check middleware configuration in `middleware.ts`
2. Verify NextAuth pages are not protected
3. Clear browser cookies
4. Check `NEXTAUTH_URL` matches actual domain

### OAuth Not Working

**Symptoms:** OAuth login fails or redirects incorrectly

**Solutions:**
1. Verify OAuth callback URLs match in provider settings
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
3. Verify redirect URI format: `https://yourdomain.com/api/auth/callback/google`
4. Check OAuth app is not in test mode (if needed)

### Email Verification Not Sending

**Symptoms:** Verification emails not received

**Solutions:**
1. Check Mailgun configuration
2. Verify `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` are set
3. Check Mailgun domain is verified
4. Review Mailgun logs for errors
5. Check spam folder

## Conversion Issues

### Conversion Stuck in "Queued" Status

**Symptoms:** Conversion never processes

**Solutions:**
1. Verify queue worker is running: `npm run worker`
2. Check Redis connection
3. Verify Redis is accessible
4. Check worker logs for errors
5. Restart worker process

### Conversion Fails Immediately

**Symptoms:** Conversion fails with error

**Solutions:**
1. Check file format is supported
2. Verify file is not corrupted
3. Check file size limits
4. Review error message in database
5. Check worker logs

### LibreOffice Errors

**Symptoms:** Document conversion fails

**Solutions:**
1. Verify LibreOffice is installed: `libreoffice --version`
2. Check LibreOffice is in PATH
3. Test manual conversion: `libreoffice --headless --convert-to pdf input.docx`
4. Check file permissions
5. Verify sufficient disk space

### Image Conversion Errors

**Symptoms:** Image conversion fails

**Solutions:**
1. Verify Sharp is installed: `npm list sharp`
2. Check image format is supported
3. Verify image is not corrupted
4. Check memory limits
5. Review Sharp error messages

## Database Issues

### Connection Errors

**Symptoms:** "Failed to connect to database"

**Solutions:**
1. Verify Supabase credentials
2. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Verify Supabase project is active
4. Check network connectivity
5. Review Supabase status page

### RLS Policy Errors

**Symptoms:** "Permission denied" errors

**Solutions:**
1. Review Row Level Security policies
2. Check user has correct permissions
3. Verify policies are enabled
4. Test with service role key (temporarily)
5. Review Supabase logs

## Storage Issues

### File Upload Fails

**Symptoms:** Files not uploading to Supabase Storage

**Solutions:**
1. Verify storage buckets exist
2. Check bucket permissions
3. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
4. Check file size limits
5. Review Supabase Storage logs

### Files Not Accessible

**Symptoms:** Download links return 404

**Solutions:**
1. Check bucket is public
2. Verify file path is correct
3. Check CORS configuration
4. Verify file exists in storage
5. Check URL format

## Payment Issues

### PhonePe Payment Fails

**Symptoms:** Payment initialization fails

**Solutions:**
1. Verify PhonePe credentials
2. Check `PHONEPE_ENV` is set correctly
3. Verify merchant ID and salt key
4. Check PhonePe API status
5. Review PhonePe logs

### Webhook Not Received

**Symptoms:** Payment webhook not processing

**Solutions:**
1. Verify webhook URL is accessible
2. Check webhook endpoint is correct
3. Verify signature validation
4. Check webhook logs
5. Test webhook manually

## Queue Issues

### Jobs Not Processing

**Symptoms:** Queue has jobs but nothing processes

**Solutions:**
1. Verify worker is running
2. Check Redis connection
3. Review worker logs
4. Check job data format
5. Verify queue name matches

### Redis Connection Errors

**Symptoms:** "Cannot connect to Redis"

**Solutions:**
1. Verify Redis is running: `redis-cli ping`
2. Check `REDIS_HOST` and `REDIS_PORT`
3. Verify Redis password (if set)
4. Check firewall rules
5. Test connection: `redis-cli -h HOST -p PORT`

## Performance Issues

### Slow Page Loads

**Symptoms:** Pages take long to load

**Solutions:**
1. Check network tab for slow requests
2. Verify database queries are optimized
3. Check for N+1 queries
4. Enable caching where appropriate
5. Review Vercel Analytics

### Slow Conversions

**Symptoms:** Conversions take too long

**Solutions:**
1. Check file size
2. Verify worker has enough resources
3. Check queue length
4. Review conversion logs
5. Consider upgrading worker resources

## Build Issues

### Build Fails

**Symptoms:** `npm run build` fails

**Solutions:**
1. Check TypeScript errors: `npx tsc --noEmit`
2. Verify all dependencies installed
3. Check for missing environment variables
4. Review build logs
5. Clear `.next` folder and rebuild

### Type Errors

**Symptoms:** TypeScript compilation errors

**Solutions:**
1. Run `npx tsc --noEmit` to see all errors
2. Check type definitions are installed
3. Verify import paths are correct
4. Review type errors in IDE
5. Fix type mismatches

## Environment Issues

### Environment Variables Not Loading

**Symptoms:** Variables undefined

**Solutions:**
1. Verify `.env.local` exists
2. Check variable names match code
3. Restart dev server after changes
4. Verify `NEXT_PUBLIC_` prefix for client vars
5. Check for typos in variable names

### Missing Dependencies

**Symptoms:** Module not found errors

**Solutions:**
1. Run `npm install`
2. Check `package.json` has dependency
3. Verify node_modules exists
4. Clear node_modules and reinstall
5. Check for version conflicts

## Getting Help

If issues persist:

1. **Check Logs**
   - Vercel logs (if deployed)
   - Supabase logs
   - Worker logs
   - Browser console

2. **Review Documentation**
   - README.md
   - API documentation
   - Component documentation

3. **Search Issues**
   - Check GitHub issues
   - Search error messages
   - Review similar problems

4. **Contact Support**
   - Create detailed issue report
   - Include error logs
   - Provide reproduction steps

