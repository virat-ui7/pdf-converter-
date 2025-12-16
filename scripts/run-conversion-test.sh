#!/bin/bash
# Run Single Conversion Test
# Usage: ./scripts/run-conversion-test.sh <source_file> <source_format> <target_format> [api_key]

set -e

API_URL="${API_URL:-http://localhost:3000}"
SOURCE_FILE=$1
SOURCE_FORMAT=$2
TARGET_FORMAT=$3
API_KEY=${4:-"fc_staging_pro_test_key_12345"}

if [ -z "$SOURCE_FILE" ] || [ -z "$SOURCE_FORMAT" ] || [ -z "$TARGET_FORMAT" ]; then
  echo "Usage: $0 <source_file> <source_format> <target_format> [api_key]"
  exit 1
fi

echo "=========================================="
echo "Testing: $SOURCE_FORMAT → $TARGET_FORMAT"
echo "File: $SOURCE_FILE"
echo "=========================================="
echo ""

# Get file size
FILE_SIZE=$(stat -f%z "$SOURCE_FILE" 2>/dev/null || stat -c%s "$SOURCE_FILE" 2>/dev/null || echo "0")
FILE_SIZE_MB=$(echo "scale=2; $FILE_SIZE / 1024 / 1024" | bc 2>/dev/null || echo "0")
echo "Input file size: ${FILE_SIZE_MB}MB"
echo ""

# Submit conversion
echo "Submitting conversion..."
START_TIME=$(date +%s)
RESPONSE=$(curl -s -X POST "$API_URL/api/convert" \
  -H "X-API-Key: $API_KEY" \
  -F "file=@$SOURCE_FILE" \
  -F "sourceFormat=$SOURCE_FORMAT" \
  -F "targetFormat=$TARGET_FORMAT")

# Check if request was successful
HTTP_CODE=$(echo "$RESPONSE" | grep -oP 'HTTP/\d\.\d \K\d+' || echo "200")
if echo "$RESPONSE" | grep -q "error\|Error\|ERROR"; then
  echo "❌ FAIL: Request rejected"
  echo "Response: $RESPONSE"
  exit 1
fi

# Extract job ID
JOB_ID=$(echo "$RESPONSE" | jq -r '.conversionId // .job_id // .id' 2>/dev/null || echo "")
if [ -z "$JOB_ID" ] || [ "$JOB_ID" = "null" ]; then
  echo "❌ FAIL: No job ID in response"
  echo "Response: $RESPONSE"
  exit 1
fi

echo "✅ Job submitted: $JOB_ID"
echo "Waiting for completion..."

# Poll for job status
MAX_WAIT=300  # 5 minutes
ELAPSED=0
while [ $ELAPSED -lt $MAX_WAIT ]; do
  STATUS_RESPONSE=$(curl -s -H "X-API-Key: $API_KEY" "$API_URL/api/conversions/$JOB_ID")
  STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status' 2>/dev/null || echo "unknown")
  
  if [ "$STATUS" = "completed" ]; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    # Get output file URL
    OUTPUT_URL=$(echo "$STATUS_RESPONSE" | jq -r '.convertedFileUrl // .file_url' 2>/dev/null || echo "")
    
    if [ -n "$OUTPUT_URL" ] && [ "$OUTPUT_URL" != "null" ]; then
      echo "✅ PASS: Conversion completed in ${DURATION}s"
      echo "Output URL: $OUTPUT_URL"
      
      # Try to get output file size
      OUTPUT_SIZE=$(curl -s -I "$OUTPUT_URL" 2>/dev/null | grep -i "content-length" | awk '{print $2}' | tr -d '\r' || echo "0")
      if [ "$OUTPUT_SIZE" != "0" ]; then
        OUTPUT_SIZE_MB=$(echo "scale=2; $OUTPUT_SIZE / 1024 / 1024" | bc 2>/dev/null || echo "0")
        echo "Output file size: ${OUTPUT_SIZE_MB}MB"
      fi
      
      echo ""
      echo "Result: ✅ PASS"
      echo "Duration: ${DURATION}s"
      echo "Input: ${FILE_SIZE_MB}MB"
      echo "Output: ${OUTPUT_SIZE_MB}MB"
      exit 0
    else
      echo "⚠️  WARNING: Job completed but no output URL"
      exit 1
    fi
  elif [ "$STATUS" = "failed" ]; then
    ERROR_MSG=$(echo "$STATUS_RESPONSE" | jq -r '.error_message // .error' 2>/dev/null || echo "Unknown error")
    echo "❌ FAIL: Conversion failed"
    echo "Error: $ERROR_MSG"
    exit 1
  fi
  
  sleep 5
  ELAPSED=$((ELAPSED + 5))
  echo -n "."
done

echo ""
echo "❌ FAIL: Timeout after ${MAX_WAIT}s"
exit 1

