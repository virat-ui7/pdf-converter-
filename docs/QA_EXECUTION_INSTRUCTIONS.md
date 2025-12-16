# QA Execution Instructions

**IMPORTANT:** This guide provides step-by-step instructions for executing comprehensive QA tests in staging.

## Prerequisites

1. **Staging environment running:**
   ```bash
   ./scripts/start-staging.sh
   ./scripts/verify-staging.sh
   ```

2. **Test fixtures created:**
   - See `test-fixtures/README.md` for file specifications
   - Create or download all 13 required files
   - Verify with: `./scripts/verify-test-fixtures.sh`

3. **Tools installed:**
   - `curl` (for API calls)
   - `jq` (for JSON parsing)
   - `bc` (for calculations)
   - `docker` (for checking containers)

## Quick Start (Automated)

```bash
# Run comprehensive QA tests
./scripts/run-comprehensive-qa.sh

# Results will be in: qa-results-TIMESTAMP/
```

## Manual Execution (Step-by-Step)

### Step 1: Verify Staging is Ready

```bash
# Check API
curl http://localhost:3000/api/health?type=live

# Check workers
docker ps | grep worker

# Check database
docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -c "SELECT COUNT(*) FROM users;"
```

**Expected:** All checks pass

### Step 2: Create Test Fixtures

**Option A: Use Existing Files**
- Copy files from your computer
- Rename to match specifications
- Place in `test-fixtures/valid/` or `test-fixtures/invalid/`

**Option B: Generate Files**
- Use LibreOffice, ImageMagick, Python scripts
- See `test-fixtures/README.md` for detailed instructions

**Option C: Download Sample Files**
- Visit [file-examples.com](https://file-examples.com/)
- Download files matching size requirements

**Verify:**
```bash
./scripts/verify-test-fixtures.sh
```

### Step 3: Run Conversion Tests

**Test Single Conversion:**
```bash
./scripts/run-conversion-test.sh \
  test-fixtures/valid/sample-2mb.docx \
  docx \
  pdf \
  fc_staging_pro_test_key_12345
```

**Test All Conversions:**
```bash
# DOCX → PDF
./scripts/run-conversion-test.sh test-fixtures/valid/sample-2mb.docx docx pdf

# DOCX → HTML
./scripts/run-conversion-test.sh test-fixtures/valid/sample-2mb.docx docx html

# XLSX → CSV
./scripts/run-conversion-test.sh test-fixtures/valid/sample-5mb.xlsx xlsx csv

# ... continue for all 10 conversions
```

**Record results** in `FINAL_STAGING_QA_REPORT_TEMPLATE.md`

### Step 4: Test Tier Limits

**Free Tier (100MB limit):**
```bash
# Test 50MB file (should pass)
./scripts/test-tier-limit.sh free 50 test-fixtures/valid/50mb-file.docx

# Test 101MB file (should fail)
./scripts/test-tier-limit.sh free 101 test-fixtures/tier-limits/free-tier-limit.docx
```

**Starter Tier (500MB limit):**
```bash
# Test 400MB file (should pass)
./scripts/test-tier-limit.sh starter 400 test-fixtures/valid/400mb-file.docx

# Test 501MB file (should fail)
./scripts/test-tier-limit.sh starter 501 test-fixtures/tier-limits/starter-tier-limit.docx
```

**Pro Tier (2GB limit):**
```bash
# Test 1.5GB file (should pass)
./scripts/test-tier-limit.sh pro 1536 test-fixtures/valid/1.5gb-file.docx

# Test 2.1GB file (should fail)
./scripts/test-tier-limit.sh pro 2150 test-fixtures/tier-limits/pro-tier-limit.docx
```

### Step 5: Test Validation Rejections

```bash
# Corrupted file
./scripts/test-validation-rejection.sh \
  test-fixtures/invalid/corrupted-docx.docx \
  corrupted

# Empty file
./scripts/test-validation-rejection.sh \
  test-fixtures/invalid/empty-docx.docx \
  empty

# Misnamed file
./scripts/test-validation-rejection.sh \
  test-fixtures/invalid/notreally-docx.docx \
  misnamed
```

### Step 6: Check Database & Logs

```bash
./scripts/check-database-logs.sh
```

**Review output:**
- Total conversions
- Success rate (should be >90%)
- Failed conversions with error messages
- No stack traces
- No secrets in logs

### Step 7: Verify Monitoring

1. **Open Grafana:** http://localhost:3001
2. **Login:** admin / (password from .env.staging)
3. **Navigate to:** Dashboards → FileConverter Production Dashboard
4. **Verify panels:**
   - Conversion success rate
   - Conversions per format
   - Error rate
   - Worker utilization
   - Queue depth
   - API latency

### Step 8: Measure Performance

**Run each conversion 5 times:**

```bash
# DOCX → PDF (5 times)
for i in {1..5}; do
  echo "Run $i:"
  time ./scripts/run-conversion-test.sh \
    test-fixtures/valid/sample-2mb.docx \
    docx \
    pdf
  echo ""
done
```

**Record:** Min, Max, Average times for each conversion

### Step 9: Generate Final Report

```bash
# Update FINAL_STAGING_QA_REPORT_TEMPLATE.md with results
# Or use report generator:
npx tsx scripts/staging-qa-report.ts qa-results-*
```

## Troubleshooting

### Tests Failing

1. **Check staging is running:**
   ```bash
   ./scripts/verify-staging.sh
   ```

2. **Check API is accessible:**
   ```bash
   curl http://localhost:3000/api/health?type=live
   ```

3. **Check worker logs:**
   ```bash
   docker logs -f fileconverter-worker-1
   ```

4. **Check database:**
   ```bash
   docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -c "SELECT COUNT(*) FROM conversions;"
   ```

### Missing Test Files

See `test-fixtures/README.md` for instructions on creating test files.

### Performance Issues

If conversions are slow:
1. Check worker CPU/memory usage
2. Check queue depth
3. Review conversion tool logs
4. Consider increasing worker resources

---

**Last Updated:** 2025-12-15  
**Questions?** Review test logs in `qa-results-*/` directory

