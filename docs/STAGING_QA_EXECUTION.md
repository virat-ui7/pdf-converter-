# Staging QA Execution Guide

Complete guide for running comprehensive end-to-end tests in the staging environment.

## Prerequisites

1. **Staging environment running:**
   ```bash
   ./scripts/start-staging.sh
   ./scripts/verify-staging.sh
   ```

2. **Test fixtures created:**
   - See `test-fixtures/README.md` for file specifications
   - Create or download all required test files
   - Verify with: `./scripts/verify-test-fixtures.sh`

3. **Tools installed:**
   - `curl` (for API calls)
   - `jq` (for JSON parsing)
   - `bc` (for calculations, optional)

## Test Execution

### Quick Start

```bash
# 1. Verify fixtures
./scripts/verify-test-fixtures.sh

# 2. Run automated tests
./scripts/staging-qa-tests.sh

# 3. Generate report
npx tsx scripts/staging-qa-report.ts qa-results-*
```

### Manual Testing

For tests that require manual verification or cannot be automated:

#### PART 2: Conversion Matrix Tests

**Test each conversion pair:**

```bash
# DOCX → PDF
curl -X POST http://localhost:3000/api/convert \
  -H "X-API-Key: fc_staging_pro_test_key_12345" \
  -F "file=@test-fixtures/sample.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"

# Get job ID from response, then check status:
curl -H "X-API-Key: fc_staging_pro_test_key_12345" \
  http://localhost:3000/api/conversions/{job_id}
```

**Record results in:** `qa-results/conversion-matrix.csv`

#### PART 3: Tier Limit Tests

**Free Tier (100MB limit):**

```bash
# Login as free-user@staging.test
# Submit 50MB file (should pass)
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test-fixtures/medium.pdf" \
  -F "sourceFormat=pdf" \
  -F "targetFormat=docx"

# Submit 101MB file (should fail with 413)
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test-fixtures/huge.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"
```

**Record:** Expected vs actual result, error message quality

#### PART 4: Validation Rejection Tests

**Test each invalid file:**

```bash
# Corrupted file
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test-fixtures/corrupted.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"
# Expected: 400 Bad Request, error about corrupted file

# Empty file
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test-fixtures/empty.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"
# Expected: 400 Bad Request, error about empty file

# Misnamed file
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test-fixtures/notreally.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"
# Expected: 400 Bad Request, error about content mismatch
```

**Record:** Error message clarity and actionability

#### PART 5: Worker Resilience Tests

**Test 1: Kill worker mid-conversion**

```bash
# 1. Submit large conversion
JOB_ID=$(curl -X POST http://localhost:3000/api/convert \
  -H "X-API-Key: fc_staging_pro_test_key_12345" \
  -F "file=@test-fixtures/medium.pdf" \
  -F "sourceFormat=pdf" \
  -F "targetFormat=docx" | jq -r '.conversionId')

# 2. Wait a few seconds for processing to start
sleep 10

# 3. Kill worker
docker kill fileconverter-worker-1

# 4. Wait for timeout (5 minutes)
sleep 300

# 5. Check job status
curl -H "X-API-Key: fc_staging_pro_test_key_12345" \
  http://localhost:3000/api/conversions/$JOB_ID

# Expected: status="failed", error message present
```

**Test 2: Corrupted file after API validation**

This requires modifying the file after API accepts it but before worker processes it. This is difficult to automate and may require code changes to simulate.

**Test 3: Worker crash**

```bash
# 1. Submit conversion
JOB_ID=$(curl -X POST ... | jq -r '.conversionId')

# 2. Crash worker (simulate crash)
docker exec fileconverter-worker-1 pkill -9 node

# 3. Wait and check job status
# Expected: Job marked as failed, not stuck in "processing"
```

#### PART 6: Performance Baseline

**Run 10 conversions of each type and measure time:**

```bash
# DOCX → PDF (10 times)
for i in {1..10}; do
  start=$(date +%s)
  JOB_ID=$(curl -X POST ... | jq -r '.conversionId')
  wait_for_job $JOB_ID
  end=$(date +%s)
  duration=$((end - start))
  echo "$duration" >> qa-results/docx-pdf-times.txt
done

# Calculate min, avg, max
cat qa-results/docx-pdf-times.txt | awk '{sum+=$1; if(NR==1||$1<min)min=$1; if(NR==1||$1>max)max=$1} END {print "Min:", min, "Avg:", sum/NR, "Max:", max}'
```

**Compare to baseline:**
- Simple conversions: <5 seconds
- Complex conversions: <30 seconds
- Flag if >50% over baseline

#### PART 7: API Contract Verification

**Test each endpoint:**

```bash
# Valid conversion
curl -X POST http://localhost:3000/api/convert \
  -H "X-API-Key: fc_staging_pro_test_key_12345" \
  -F "file=@test-fixtures/sample.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"
# Expected: 200 OK, { conversionId, status: "pending", ... }

# Oversized file
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test-fixtures/huge.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"
# Expected: 413 Payload Too Large, { error: "...", ... }

# Unsupported conversion
curl -X POST http://localhost:3000/api/convert \
  -H "X-API-Key: fc_staging_pro_test_key_12345" \
  -F "file=@test-fixtures/sample.raw" \
  -F "sourceFormat=raw" \
  -F "targetFormat=docx"
# Expected: 400 Bad Request, { error: "Cannot convert RAW to DOCX" }
```

**Verify:**
- Response format consistency
- Error messages are user-friendly
- No stack traces or internal paths
- Status codes are correct

#### PART 8: Database & Logging Verification

**Check database:**

```bash
# Connect to database
docker exec -it fileconverter-postgres psql -U fileconverter -d fileconverter_staging

# Check job records
SELECT COUNT(*) FROM conversions;
SELECT status, COUNT(*) FROM conversions GROUP BY status;
SELECT * FROM conversions WHERE status='failed' LIMIT 10;

# Check for clear error reasons
SELECT id, error_message FROM conversions WHERE status='failed';
```

**Check logs:**

```bash
# API logs
docker logs fileconverter-api 2>&1 | grep -i error
docker logs fileconverter-api 2>&1 | grep -i "stack trace"
docker logs fileconverter-api 2>&1 | grep -i "/tmp/"
docker logs fileconverter-api 2>&1 | grep -i "password\|secret\|token"

# Worker logs
docker logs fileconverter-worker-1 2>&1 | grep -i error
docker logs fileconverter-worker-1 2>&1 | grep "job_id\|conversion"
```

**Verify:**
- No stack traces in user-facing logs
- No internal paths exposed
- No secrets logged
- Error messages are clear

#### PART 9: Monitoring Dashboard Verification

1. **Open Grafana:** http://localhost:3001
2. **Login:** admin / (password from .env.staging)
3. **Navigate to:** Dashboards → FileConverter Production Dashboard
4. **Verify panels:**
   - Conversion success rate (should be ~90%+)
   - Conversions per format
   - Error rate (should be <5%)
   - Worker utilization
   - Queue depth
   - API latency (P50, P95)

5. **Test alerts:**
   - Intentionally fail some conversions
   - Verify alert fires in Grafana
   - Check notification channel (email/Slack)

## Generating Final Report

After all tests are complete:

```bash
# Generate report
npx tsx scripts/staging-qa-report.ts qa-results-*

# Report will be saved to: qa-results-*/QA_REPORT.md
```

## Test Results Template

Create `qa-results/test-results.md` with your findings:

```markdown
# Staging QA Test Results

## Conversion Matrix
| From | To | Status | Time | Notes |
|------|-----|--------|------|-------|
| DOCX | PDF | ✅ | 8s | Output quality good |
| ... | ... | ... | ... | ... |

## Tier Limits
- Free 100MB: ✅ PASS
- Starter 500MB: ✅ PASS
- Pro 2GB: ✅ PASS

## Validation Rejections
- Corrupted file: ✅ PASS (clear error message)
- Empty file: ✅ PASS
- Misnamed file: ✅ PASS
- Unsupported: ✅ PASS

## Worker Resilience
- Kill mid-conversion: ✅ PASS (job failed gracefully)
- Worker crash: ✅ PASS (jobs marked failed)

## Performance
- DOCX → PDF: 8s avg (target: <5s) ⚠️
- XLSX → CSV: 3s avg (target: <5s) ✅
- PNG → JPG: 12s avg (target: <30s) ✅
- PPTX → PDF: 25s avg (target: <30s) ✅

## Overall Status: GREEN
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
**Questions?** Contact the QA team.

