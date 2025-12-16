#!/bin/bash
# Staging QA Test Execution Script
# Runs comprehensive end-to-end tests against staging environment

set -e

API_URL="${API_URL:-http://localhost:3000}"
FIXTURES_DIR="test-fixtures"
RESULTS_DIR="qa-results-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$RESULTS_DIR"

echo "=========================================="
echo "FileConverter Staging QA Tests"
echo "=========================================="
echo "API URL: $API_URL"
echo "Results: $RESULTS_DIR"
echo ""

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test and record result
run_test() {
  local test_name=$1
  local test_command=$2
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  echo "Test $TOTAL_TESTS: $test_name"
  
  if eval "$test_command" > "$RESULTS_DIR/${test_name}.log" 2>&1; then
    echo "  ✅ PASS"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo "$test_name,PASS" >> "$RESULTS_DIR/results.csv"
    return 0
  else
    echo "  ❌ FAIL"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo "$test_name,FAIL" >> "$RESULTS_DIR/results.csv"
    echo "  Log: $RESULTS_DIR/${test_name}.log"
    return 1
  fi
}

# Function to submit conversion
submit_conversion() {
  local file=$1
  local source_format=$2
  local target_format=$3
  local api_key=${4:-""}
  
  local headers=()
  if [ -n "$api_key" ]; then
    headers+=("-H" "X-API-Key: $api_key")
  fi
  
  curl -s -X POST "$API_URL/api/convert" \
    "${headers[@]}" \
    -F "file=@$FIXTURES_DIR/$file" \
    -F "sourceFormat=$source_format" \
    -F "targetFormat=$target_format"
}

# Function to check job status
check_job_status() {
  local job_id=$1
  local api_key=${2:-""}
  
  local headers=()
  if [ -n "$api_key" ]; then
    headers+=("-H" "X-API-Key: $api_key")
  fi
  
  curl -s "${headers[@]}" "$API_URL/api/conversions/$job_id"
}

# Function to wait for job completion
wait_for_job() {
  local job_id=$1
  local api_key=${2:-""}
  local max_wait=${3:-300}  # 5 minutes default
  local elapsed=0
  
  while [ $elapsed -lt $max_wait ]; do
    local status=$(check_job_status "$job_id" "$api_key" | jq -r '.status' 2>/dev/null || echo "unknown")
    
    if [ "$status" = "completed" ]; then
      return 0
    elif [ "$status" = "failed" ]; then
      return 1
    fi
    
    sleep 5
    elapsed=$((elapsed + 5))
  done
  
  return 1  # Timeout
}

echo "PART 1: Verifying Test Fixtures"
echo "----------------------------------------"
./scripts/verify-test-fixtures.sh || {
  echo "⚠️  Some test fixtures are missing. Please create them first."
  echo "   See test-fixtures/README.md for instructions"
  exit 1
}

echo ""
echo "PART 2: Conversion Matrix Tests"
echo "----------------------------------------"

# High-value conversion pairs
declare -a conversions=(
  "sample.docx:docx:pdf"
  "sample.docx:docx:html"
  "sample.xlsx:xlsx:csv"
  "sample.xlsx:xlsx:pdf"
  "sample.pptx:pptx:pdf"
  "sample.png:png:jpg"
  "sample.jpg:jpg:png"
  "sample.svg:svg:png"
  "sample.csv:csv:xlsx"
  "medium.pdf:pdf:docx"
)

for conversion in "${conversions[@]}"; do
  IFS=':' read -r file source target <<< "$conversion"
  test_name="convert_${source}_to_${target}"
  
  echo "Testing: $source → $target"
  
  # Submit conversion
  response=$(submit_conversion "$file" "$source" "$target" "fc_staging_pro_test_key_12345")
  job_id=$(echo "$response" | jq -r '.conversionId' 2>/dev/null || echo "")
  
  if [ -z "$job_id" ] || [ "$job_id" = "null" ]; then
    echo "  ❌ Failed to submit conversion"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    continue
  fi
  
  echo "  Job ID: $job_id"
  
  # Wait for completion
  start_time=$(date +%s)
  if wait_for_job "$job_id" "fc_staging_pro_test_key_12345" 300; then
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    
    # Get job details
    job_details=$(check_job_status "$job_id" "fc_staging_pro_test_key_12345")
    output_url=$(echo "$job_details" | jq -r '.convertedFileUrl' 2>/dev/null || echo "")
    
    if [ -n "$output_url" ] && [ "$output_url" != "null" ]; then
      echo "  ✅ PASS (${duration}s)"
      echo "$test_name,PASS,${duration}s" >> "$RESULTS_DIR/conversion-matrix.csv"
    else
      echo "  ❌ FAIL (no output URL)"
      echo "$test_name,FAIL,${duration}s" >> "$RESULTS_DIR/conversion-matrix.csv"
    fi
  else
    echo "  ❌ FAIL (timeout or error)"
    echo "$test_name,FAIL,timeout" >> "$RESULTS_DIR/conversion-matrix.csv"
  fi
done

echo ""
echo "PART 3: Tier Limit Tests"
echo "----------------------------------------"

# Free tier: 50MB should pass, 101MB should fail
echo "Testing Free tier (100MB limit)..."
response_50mb=$(submit_conversion "medium.pdf" "pdf" "docx" "" 2>&1)
if echo "$response_50mb" | grep -q "conversionId\|job_id"; then
  echo "  ✅ 50MB file accepted (PASS)"
else
  echo "  ❌ 50MB file rejected (FAIL)"
fi

response_101mb=$(submit_conversion "huge.docx" "docx" "pdf" "" 2>&1)
if echo "$response_101mb" | grep -q "exceeds\|limit\|413"; then
  echo "  ✅ 101MB file rejected with error (PASS)"
else
  echo "  ❌ 101MB file not rejected (FAIL)"
fi

echo ""
echo "PART 4: Validation Rejection Tests"
echo "----------------------------------------"

# Test corrupted file
echo "Testing corrupted file rejection..."
response=$(submit_conversion "corrupted.docx" "docx" "pdf" "" 2>&1)
if echo "$response" | grep -q "corrupted\|invalid\|400"; then
  echo "  ✅ Corrupted file rejected (PASS)"
else
  echo "  ❌ Corrupted file not rejected (FAIL)"
fi

# Test empty file
echo "Testing empty file rejection..."
response=$(submit_conversion "empty.docx" "docx" "pdf" "" 2>&1)
if echo "$response" | grep -q "empty\|400"; then
  echo "  ✅ Empty file rejected (PASS)"
else
  echo "  ❌ Empty file not rejected (FAIL)"
fi

# Test misnamed file
echo "Testing misnamed file rejection..."
response=$(submit_conversion "notreally.docx" "docx" "pdf" "" 2>&1)
if echo "$response" | grep -q "content does not match\|magic bytes\|400"; then
  echo "  ✅ Misnamed file rejected (PASS)"
else
  echo "  ❌ Misnamed file not rejected (FAIL)"
fi

echo ""
echo "=========================================="
echo "Test Execution Complete"
echo "=========================================="
echo "Total Tests: $TOTAL_TESTS"
echo "✅ Passed: $PASSED_TESTS"
echo "❌ Failed: $FAILED_TESTS"
echo ""
echo "Results saved to: $RESULTS_DIR/"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️  Some tests failed. Review logs in $RESULTS_DIR/"
  exit 1
fi

