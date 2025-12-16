#!/bin/bash
# Comprehensive QA Test Execution Script
# Runs all QA tests and generates report

set -e

API_URL="${API_URL:-http://localhost:3000}"
FIXTURES_DIR="test-fixtures"
RESULTS_DIR="qa-results-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$RESULTS_DIR"

echo "═════════════════════════════════════════════════════════════════════"
echo "     FileConverter Staging QA - Comprehensive Test Execution        "
echo "═════════════════════════════════════════════════════════════════════"
echo ""
echo "API URL: $API_URL"
echo "Results Directory: $RESULTS_DIR"
echo ""

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Initialize results files
echo "From,To,Status,Time(s),Input(MB),Output(MB),Notes" > "$RESULTS_DIR/conversion-matrix.csv"
echo "Tier,FileSize(MB),Expected,Actual,Status,ErrorMessage" > "$RESULTS_DIR/tier-limits.csv"
echo "File,ExpectedError,Rejected,HTTPStatus,ErrorMessage,Clear,Status" > "$RESULTS_DIR/validation-rejections.csv"

# PART 1: Verify staging is ready
echo "PART 1: Verifying Staging Environment"
echo "=========================================="

# Check API health
if curl -s "$API_URL/api/health?type=live" | grep -q "ok"; then
  echo "✅ API is responding"
else
  echo "❌ API is not responding"
  exit 1
fi

# Check workers
if docker ps | grep -q "fileconverter-worker"; then
  echo "✅ Workers are running"
else
  echo "❌ Workers are not running"
  exit 1
fi

# Check database
DB_COUNT=$(docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$DB_COUNT" -ge "4" ]; then
  echo "✅ Database has test users ($DB_COUNT users)"
else
  echo "⚠️  Database has fewer users than expected ($DB_COUNT)"
fi

echo ""

# PART 2: Verify test fixtures
echo "PART 2: Verifying Test Fixtures"
echo "=========================================="
if [ -f "scripts/verify-test-fixtures.sh" ]; then
  ./scripts/verify-test-fixtures.sh || {
    echo "⚠️  Some test fixtures are missing"
    echo "   See test-fixtures/README.md for instructions"
  }
else
  echo "⚠️  Verification script not found, skipping fixture check"
fi
echo ""

# PART 3: Conversion Matrix Tests
echo "PART 3: Conversion Matrix Tests"
echo "=========================================="

declare -a conversions=(
  "valid/sample-2mb.docx:docx:pdf"
  "valid/sample-2mb.docx:docx:html"
  "valid/sample-5mb.xlsx:xlsx:csv"
  "valid/sample-5mb.xlsx:xlsx:pdf"
  "valid/sample-10mb.pptx:pptx:pdf"
  "valid/sample-20mb.png:png:jpg"
  "valid/sample-15mb.jpg:jpg:png"
  "valid/sample-1mb.svg:svg:png"
  "valid/sample-10mb.csv:csv:xlsx"
)

# Note: PDF → DOCX requires a PDF file first
# If medium.pdf exists, add it
if [ -f "$FIXTURES_DIR/valid/medium.pdf" ]; then
  conversions+=("valid/medium.pdf:pdf:docx")
fi

for conversion in "${conversions[@]}"; do
  IFS=':' read -r file source target <<< "$conversion"
  test_name="${source}_to_${target}"
  
  echo "Testing: $source → $target"
  
  if [ ! -f "$FIXTURES_DIR/$file" ]; then
    echo "  ⚠️  SKIP: File not found ($FIXTURES_DIR/$file)"
    echo "$source,$target,SKIP,-,-,-,File not found" >> "$RESULTS_DIR/conversion-matrix.csv"
    continue
  fi
  
  if ./scripts/run-conversion-test.sh "$FIXTURES_DIR/$file" "$source" "$target" "fc_staging_pro_test_key_12345" >> "$RESULTS_DIR/${test_name}.log" 2>&1; then
    echo "  ✅ PASS"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo "$source,$target,PASS,-,-,-" >> "$RESULTS_DIR/conversion-matrix.csv"
  else
    echo "  ❌ FAIL"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo "$source,$target,FAIL,-,-,-" >> "$RESULTS_DIR/conversion-matrix.csv"
  fi
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  echo ""
done

# PART 4: Tier Limit Tests
echo "PART 4: Tier Limit Tests"
echo "=========================================="

# Free tier: 50MB should pass, 101MB should fail
if [ -f "$FIXTURES_DIR/tier-limits/free-tier-limit.docx" ]; then
  echo "Testing Free tier (100MB limit)..."
  if ./scripts/test-tier-limit.sh "free" "101" "$FIXTURES_DIR/tier-limits/free-tier-limit.docx" >> "$RESULTS_DIR/tier-limit-free.log" 2>&1; then
    echo "  ✅ PASS: 101MB file correctly rejected"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo "  ❌ FAIL"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

# Starter tier: 400MB should pass, 501MB should fail
if [ -f "$FIXTURES_DIR/tier-limits/starter-tier-limit.docx" ]; then
  echo "Testing Starter tier (500MB limit)..."
  if ./scripts/test-tier-limit.sh "starter" "501" "$FIXTURES_DIR/tier-limits/starter-tier-limit.docx" >> "$RESULTS_DIR/tier-limit-starter.log" 2>&1; then
    echo "  ✅ PASS: 501MB file correctly rejected"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo "  ❌ FAIL"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

echo ""

# PART 5: Validation Rejection Tests
echo "PART 5: Validation Rejection Tests"
echo "=========================================="

# Corrupted file
if [ -f "$FIXTURES_DIR/invalid/corrupted-docx.docx" ]; then
  echo "Testing corrupted file rejection..."
  if ./scripts/test-validation-rejection.sh "$FIXTURES_DIR/invalid/corrupted-docx.docx" "corrupted" >> "$RESULTS_DIR/validation-corrupted.log" 2>&1; then
    echo "  ✅ PASS"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo "  ❌ FAIL"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

# Empty file
if [ -f "$FIXTURES_DIR/invalid/empty-docx.docx" ]; then
  echo "Testing empty file rejection..."
  if ./scripts/test-validation-rejection.sh "$FIXTURES_DIR/invalid/empty-docx.docx" "empty" >> "$RESULTS_DIR/validation-empty.log" 2>&1; then
    echo "  ✅ PASS"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo "  ❌ FAIL"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

# Misnamed file
if [ -f "$FIXTURES_DIR/invalid/notreally-docx.docx" ]; then
  echo "Testing misnamed file rejection..."
  if ./scripts/test-validation-rejection.sh "$FIXTURES_DIR/invalid/notreally-docx.docx" "misnamed" >> "$RESULTS_DIR/validation-misnamed.log" 2>&1; then
    echo "  ✅ PASS"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo "  ❌ FAIL"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

echo ""

# PART 6: Database & Logging Check
echo "PART 6: Database & Logging Verification"
echo "=========================================="
if ./scripts/check-database-logs.sh > "$RESULTS_DIR/database-logs.txt" 2>&1; then
  echo "✅ Database and logs are clean"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo "⚠️  Some issues found in database/logs"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# PART 7: Generate Summary
echo "═════════════════════════════════════════════════════════════════════"
echo "                    TEST EXECUTION SUMMARY                           "
echo "═════════════════════════════════════════════════════════════════════"
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo "✅ Passed: $PASSED_TESTS"
echo "❌ Failed: $FAILED_TESTS"
echo ""

# Calculate pass rate
if [ $TOTAL_TESTS -gt 0 ]; then
  PASS_RATE=$(echo "scale=1; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc 2>/dev/null || echo "0")
  echo "Pass Rate: ${PASS_RATE}%"
fi

echo ""
echo "Results saved to: $RESULTS_DIR/"
echo ""

# Determine overall status
if [ $FAILED_TESTS -eq 0 ] && [ $TOTAL_TESTS -gt 0 ]; then
  echo "🟢 STATUS: GREEN - All tests passed!"
  exit 0
elif [ $PASSED_TESTS -gt $((TOTAL_TESTS * 8 / 10)) ]; then
  echo "🟡 STATUS: YELLOW - Most tests passed, some issues to address"
  exit 1
else
  echo "🔴 STATUS: RED - Multiple test failures, not ready for production"
  exit 1
fi

