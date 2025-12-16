# Scaling Guide

How to scale FileConverter platform as traffic grows.

## Current Architecture

- **Frontend + API:** Next.js on Vercel (auto-scales)
- **Workers:** Node.js processes (manual scaling)
- **Database:** Supabase (managed, auto-scales)
- **Queue:** Redis (Upstash or self-hosted)
- **Storage:** Supabase Storage (auto-scales)

## Scaling Strategies

### 1. Horizontal Scaling (Workers)

**When:** Queue depth > 1000 jobs, worker utilization > 80%

**How:**
1. Deploy additional worker instances
2. All workers share the same Redis queue
3. Bull automatically distributes jobs

**Example:**
```bash
# Deploy 3 worker instances
npm run worker  # Instance 1
npm run worker  # Instance 2
npm run worker  # Instance 3
```

**Platform Options:**
- **Railway:** Deploy multiple services
- **Render:** Deploy multiple background workers
- **Docker:** Run multiple containers
- **Kubernetes:** Deploy worker pods

**Monitoring:**
- Queue depth should decrease
- Worker utilization should balance across instances
- Conversion success rate should remain stable

### 2. Vertical Scaling (Worker Resources)

**When:** Individual conversions are slow, workers are CPU/memory bound

**How:**
1. Increase CPU cores (for parallel processing)
2. Increase memory (for large file processing)
3. Use faster storage (SSD for temporary files)

**Example:**
- **Before:** 2 CPU cores, 4GB RAM
- **After:** 4 CPU cores, 8GB RAM

**Impact:**
- Faster individual conversions
- Can process larger files
- Higher cost per worker

### 3. Database Scaling

**Supabase Auto-Scaling:**
- Connection pooling (automatic)
- Query optimization (indexes)
- Read replicas (Enterprise plan)

**Optimization:**
1. **Add Indexes:**
   ```sql
   CREATE INDEX idx_conversions_user_status 
   ON conversions(user_id, status, created_at DESC);
   ```

2. **Query Optimization:**
   - Use `select()` to limit fields
   - Use pagination (`limit`, `offset`)
   - Avoid N+1 queries

3. **Connection Pooling:**
   - Supabase handles automatically
   - Monitor connection count
   - Adjust pool size if needed

### 4. Queue Scaling

**Redis Scaling:**
- **Upstash:** Auto-scales, pay-per-use
- **Self-Hosted:** Add Redis replicas, use Redis Cluster

**Queue Optimization:**
1. **Increase Concurrency:**
   ```typescript
   // In scripts/start-worker.ts
   conversionQueue.process(10, async (job) => { // Increase from 5 to 10
     // ...
   })
   ```

2. **Job Prioritization:**
   ```typescript
   // Priority queue for Enterprise users
   await conversionQueue.add(jobData, {
     priority: userTier === 'enterprise' ? 1 : 5
   })
   ```

3. **Job Batching:**
   - Process multiple small jobs together
   - Reduce queue overhead

### 5. Caching

**What to Cache:**
- Format lists (rarely change)
- User data (session-based)
- Conversion results (temporary URLs)

**Implementation:**
```typescript
// Redis cache example
import { redis } from '@/lib/queue'

async function getFormats() {
  const cached = await redis.get('formats:list')
  if (cached) return JSON.parse(cached)
  
  const formats = await fetchFormats()
  await redis.setex('formats:list', 3600, JSON.stringify(formats))
  return formats
}
```

### 6. CDN for File Delivery

**When:** High download traffic, global users

**How:**
1. Use Supabase Storage CDN (automatic)
2. Or integrate Cloudflare/CDN
3. Cache converted files at edge

**Benefits:**
- Faster downloads
- Reduced server load
- Lower bandwidth costs

## Scaling Metrics

### Key Metrics to Monitor

1. **Queue Depth:**
   - Target: < 100 jobs
   - Alert: > 1000 jobs
   - Action: Add workers

2. **Worker Utilization:**
   - Target: 50-80%
   - Alert: > 95% or < 10%
   - Action: Scale workers

3. **Conversion Success Rate:**
   - Target: > 95%
   - Alert: < 90%
   - Action: Investigate failures

4. **API Response Time:**
   - Target: P95 < 2 seconds
   - Alert: P95 > 60 seconds
   - Action: Optimize or scale API

5. **Database Connection Count:**
   - Target: < 80% of pool
   - Alert: > 90% of pool
   - Action: Optimize queries or scale database

## Scaling Plan by Traffic

### Low Traffic (< 1000 conversions/day)

**Current Setup:**
- 1-2 worker instances
- Basic monitoring
- Standard database plan

**No changes needed.**

### Medium Traffic (1000-10,000 conversions/day)

**Scaling Actions:**
1. Add 2-3 worker instances
2. Enable caching (Redis)
3. Optimize database queries
4. Set up monitoring dashboards

**Cost Impact:** +$50-100/month

### High Traffic (10,000-100,000 conversions/day)

**Scaling Actions:**
1. Scale to 5-10 worker instances
2. Use CDN for file delivery
3. Database read replicas (if needed)
4. Advanced monitoring and alerting
5. Load balancing for API (if self-hosted)

**Cost Impact:** +$200-500/month

### Very High Traffic (> 100,000 conversions/day)

**Scaling Actions:**
1. Auto-scaling worker pool (Kubernetes)
2. Database sharding (if needed)
3. Multi-region deployment
4. Dedicated infrastructure
5. Custom SLA

**Cost Impact:** +$1000+/month

## Cost Optimization

### Reduce Costs

1. **Right-Size Workers:**
   - Don't over-provision
   - Monitor actual usage
   - Scale down during low traffic

2. **Optimize Conversions:**
   - Cache common conversions
   - Batch similar conversions
   - Use efficient conversion tools

3. **Storage Cleanup:**
   - Automatic file deletion
   - Archive old conversion records
   - Compress stored files

4. **Database Optimization:**
   - Add indexes for common queries
   - Use pagination
   - Archive old data

## Scaling Checklist

### Before Scaling

- [ ] Monitor current metrics (baseline)
- [ ] Identify bottlenecks
- [ ] Plan scaling strategy
- [ ] Estimate costs
- [ ] Test in staging

### During Scaling

- [ ] Deploy additional workers
- [ ] Monitor queue depth
- [ ] Verify job distribution
- [ ] Check conversion success rate
- [ ] Monitor costs

### After Scaling

- [ ] Verify metrics improved
- [ ] Check for new bottlenecks
- [ ] Optimize if needed
- [ ] Document changes
- [ ] Update runbooks

## Troubleshooting Scaling Issues

### Queue Not Processing

**Symptoms:** Queue depth increasing, workers idle

**Solutions:**
1. Check worker logs for errors
2. Verify Redis connection
3. Check worker process count
4. Restart workers

### High Database Load

**Symptoms:** Slow queries, connection pool exhausted

**Solutions:**
1. Add database indexes
2. Optimize queries
3. Use connection pooling
4. Consider read replicas

### Worker Crashes

**Symptoms:** Workers restarting, jobs failing

**Solutions:**
1. Check memory limits
2. Review error logs
3. Increase worker resources
4. Fix conversion bugs

## Best Practices

1. **Monitor First:** Always monitor before scaling
2. **Scale Gradually:** Add workers incrementally
3. **Test Changes:** Test scaling in staging first
4. **Document:** Keep scaling decisions documented
5. **Automate:** Use auto-scaling when possible

---

**Last Updated:** 2025-12-15  
**Need help scaling?** Contact the infrastructure team.

