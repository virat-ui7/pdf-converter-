# Staging Environment Setup Guide

Complete guide for setting up and using the FileConverter staging environment.

## Overview

The staging environment is a Docker Compose-based setup that mirrors production infrastructure for testing before launch.

**Services Included:**
- FileConverter API (Next.js)
- PostgreSQL Database
- Redis Cache & Queue
- 2 Conversion Workers
- Prometheus (Metrics)
- Grafana (Monitoring Dashboards)

## Prerequisites

1. **Docker** (20.10+)
2. **Docker Compose** (v2.0+ or docker-compose v1.29+)
3. **curl** (for health checks)
4. **jq** (optional, for JSON parsing)

### Install Docker

**macOS:**
```bash
brew install --cask docker
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

**Windows:**
- Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

## Quick Start

### 1. Configure Environment

Copy and edit the staging environment file:

```bash
cp .env.staging .env.staging.local
# Edit .env.staging.local with your values
```

**Required Changes:**
- `NEXTAUTH_SECRET`: Generate with `npm run generate-secret`
- `POSTGRES_PASSWORD`: Set a strong password
- `REDIS_PASSWORD`: Set a strong password
- `GRAFANA_ADMIN_PASSWORD`: Set admin password (default: admin)

### 2. Start Staging Environment

```bash
./scripts/start-staging.sh
```

This will:
- Build Docker images
- Start all services
- Wait for services to be healthy
- Verify all connections
- Display service URLs and test credentials

### 3. Verify Setup

Check that all services are running:

```bash
docker ps
```

You should see 7 containers:
- `fileconverter-api`
- `fileconverter-worker-1`
- `fileconverter-worker-2`
- `fileconverter-postgres`
- `fileconverter-redis`
- `fileconverter-grafana`
- `fileconverter-prometheus`

### 4. Access Services

**API:**
- URL: http://localhost:3000
- Health: http://localhost:3000/api/health?type=deep
- Metrics: http://localhost:3000/api/metrics

**Grafana:**
- URL: http://localhost:3001
- Username: `admin`
- Password: (from `.env.staging.local` or default `admin`)

**Prometheus:**
- URL: http://localhost:9090

## Test Users

The staging environment includes pre-configured test users:

| Email | Password | Tier | File Limit |
|-------|----------|------|------------|
| `free-user@staging.test` | `TestPassword123!` | Free | 100MB |
| `starter-user@staging.test` | `TestPassword123!` | Starter | 500MB |
| `pro-user@staging.test` | `TestPassword123!` | Professional | 2GB |
| `admin@staging.test` | `TestPassword123!` | Enterprise | 10GB |

## Test API Keys

For API testing:

| Key | Tier | User |
|-----|------|------|
| `fc_staging_starter_test_key_12345` | Starter | starter-user@staging.test |
| `fc_staging_pro_test_key_12345` | Professional | pro-user@staging.test |
| `fc_staging_enterprise_test_key_12345` | Enterprise | admin@staging.test |

**Usage:**
```bash
curl -H "X-API-Key: fc_staging_pro_test_key_12345" \
  http://localhost:3000/api/health
```

## Testing Conversions

### Via API

```bash
# Upload and convert a file
curl -X POST http://localhost:3000/api/convert \
  -H "X-API-Key: fc_staging_pro_test_key_12345" \
  -F "file=@test.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"
```

### Via Web UI

1. Visit http://localhost:3000
2. Login with test user credentials
3. Upload a file and convert

## Monitoring

### Grafana Dashboard

1. Visit http://localhost:3001
2. Login with admin credentials
3. Navigate to Dashboards → FileConverter Production Dashboard
4. View metrics:
   - Conversion success rates
   - Queue depth
   - Worker utilization
   - Error rates

### Prometheus

1. Visit http://localhost:9090
2. Query metrics:
   - `conversion_success_total`
   - `queue_depth`
   - `worker_utilization_percent`

## Stopping Staging

### Graceful Shutdown

```bash
./scripts/stop-staging.sh
```

### Shutdown with Log Archive

```bash
./scripts/stop-staging.sh --archive-logs
```

This will:
- Stop all services
- Optionally archive logs to `logs-archive-TIMESTAMP/`
- Preserve Docker volumes (data persists)

### Clean Slate (Remove All Data)

```bash
docker compose --env-file .env.staging down -v
```

**⚠️ Warning:** This removes all volumes including database data.

## Troubleshooting

### Services Won't Start

**Check Docker:**
```bash
docker info
```

**Check logs:**
```bash
docker logs fileconverter-api
docker logs fileconverter-postgres
docker logs fileconverter-redis
```

### API Health Check Fails

**Check API logs:**
```bash
docker logs -f fileconverter-api
```

**Common issues:**
- Database connection failed → Check PostgreSQL is running
- Redis connection failed → Check Redis is running
- Missing environment variables → Check `.env.staging.local`

### Workers Not Processing Jobs

**Check worker logs:**
```bash
docker logs -f fileconverter-worker-1
docker logs -f fileconverter-worker-2
```

**Check queue:**
```bash
docker exec fileconverter-redis redis-cli LLEN bull:conversions:waiting
docker exec fileconverter-redis redis-cli LLEN bull:conversions:active
```

### Database Connection Issues

**Test connection:**
```bash
docker exec -it fileconverter-postgres psql -U fileconverter -d fileconverter_staging
```

**Check users:**
```sql
SELECT email, tier, conversions_used FROM users;
```

### Port Conflicts

If ports are already in use:

1. Edit `docker-compose.yml`
2. Change port mappings:
   ```yaml
   ports:
     - "3001:3000"  # Change 3000 to 3001
   ```
3. Restart services

## Resource Limits

Staging environment uses reduced resources:

| Service | CPU | Memory |
|---------|-----|--------|
| API | 2 cores | 2GB |
| Worker (each) | 2 cores | 2GB |
| PostgreSQL | 1 core | 1GB |
| Redis | 0.5 cores | 512MB |
| Grafana | 0.5 cores | 512MB |
| Prometheus | 0.5 cores | 512MB |

**Total:** ~8 cores, ~8GB RAM

## Data Persistence

Docker volumes persist data between restarts:

- `postgres_data`: Database data
- `redis_data`: Redis data
- `prometheus_data`: Metrics data
- `grafana_data`: Grafana dashboards and settings

To reset all data:
```bash
docker compose --env-file .env.staging down -v
```

## Network

All services are on the `staging` network:
- Services can communicate by container name
- Not exposed to internet (only localhost ports)
- Internal DNS resolution works

## Updating Staging

### Update Code

```bash
# Pull latest code
git pull

# Rebuild and restart
./scripts/stop-staging.sh
./scripts/start-staging.sh
```

### Update Database Schema

```bash
# Connect to database
docker exec -it fileconverter-postgres psql -U fileconverter -d fileconverter_staging

# Run migration SQL
\i /path/to/migration.sql
```

## Verification Checklist

After setup, verify:

- [ ] API responds to `/api/health/live`
- [ ] `/api/health/ready` shows all dependencies healthy
- [ ] Database is accessible and populated (4 test users)
- [ ] Workers are processing jobs from queue
- [ ] Grafana dashboard is live
- [ ] Test conversions can be submitted via API
- [ ] Metrics are being collected in Prometheus
- [ ] All test users can login
- [ ] API keys work for authenticated requests

## Next Steps

1. **Run Staging QA Tests:**
   - Use test fixtures from `test-fixtures/`
   - Run conversion matrix tests
   - Verify tier limits
   - Test validation rejections

2. **Monitor Metrics:**
   - Watch Grafana dashboard
   - Check for errors in logs
   - Verify conversion success rates

3. **Load Testing:**
   - Submit multiple conversions
   - Monitor queue depth
   - Check worker utilization

4. **Security Testing:**
   - Test file validation
   - Test rate limiting
   - Test authentication

---

**Last Updated:** 2025-12-15  
**Questions?** Contact the infrastructure team.

