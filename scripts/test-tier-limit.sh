#!/bin/bash
# Test Tier Limit Enforcement
# Usage: ./scripts/test-tier-limit.sh <tier> <file_size_mb> <file_path> [api_key]

set -e

API_URL="${API_URL:-http://localhost:3000}"
TIER=$1
FILE_SIZE_MB=$2
FILE_PATH=$3
API_KEY=${4:-""}

if [ -z "$TIER" ] || [ -z "$FILE_SIZE_MB" ] || [ -z "$FILE_PATH" ]; then
  echo "Usage: $0 <tier> <file_size_mb> <file_path> [api_key]"
  exit 1
fi

# Map tier to API key if not provided
if [ -z "$API_KEY" ]; then
  case $TIER in
    free|starter)
      API_KEY="fc_staging_starter_test_key_12345"
      ;;
    professional|pro)
      API_KEY="fc_staging_pro_test_key_12345"
      ;;
    enterprise)
      API_KEY="fc_staging_enterprise_test_key_12345"
      ;;
    *)
      echo "Unknown tier: $TIER"
      exit 1
      ;;
  esac
fi

# Get tier limits
case $TIER in
  free)
    LIMIT_MB=100
    ;;
  starter)
    LIMIT_MB=500
    ;;
  professional|pro)
    LIMIT_MB=2048
    ;;
  enterprise)
    LIMIT_MB=10240
    ;;
  *)
    echo "Unknown tier: $TIER"
    exit 1
    ;;
esac

echo "=========================================="
echo "Testing Tier Limit: $TIER ($LIMIT_MB MB limit)"
echo "File size: ${FILE_SIZE_MB}MB"
echo "Expected: $([ $(echo "$FILE_SIZE_MB > $LIMIT_MB" | bc) -eq 1 ] && echo "REJECT" || echo "ACCEPT")"
echo "=========================================="
echo ""

# Submit conversion
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/convert" \
  -H "X-API-Key: $API_KEY" \
  -F "file=@$FILE_PATH" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

# Check if should be accepted or rejected
SHOULD_REJECT=$(echo "$FILE_SIZE_MB > $LIMIT_MB" | bc)

if [ "$SHOULD_REJECT" -eq 1 ]; then
  # Should be rejected
  if [ "$HTTP_CODE" = "413" ]; then
    echo "✅ PASS: File correctly rejected (413 Payload Too Large)"
    ERROR_MSG=$(echo "$BODY" | jq -r '.error // .message' 2>/dev/null || echo "$BODY")
    echo "Error message: $ERROR_MSG"
    
    # Check error message quality
    if echo "$ERROR_MSG" | grep -qi "exceed\|limit\|upgrade"; then
      echo "✅ Error message is clear and actionable"
      exit 0
    else
      echo "⚠️  Error message could be clearer"
      exit 0  # Still pass, but note improvement needed
    fi
  else
    echo "❌ FAIL: File should be rejected but got HTTP $HTTP_CODE"
    echo "Response: $BODY"
    exit 1
  fi
else
  # Should be accepted
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "202" ]; then
    JOB_ID=$(echo "$BODY" | jq -r '.conversionId // .job_id // .id' 2>/dev/null || echo "")
    if [ -n "$JOB_ID" ] && [ "$JOB_ID" != "null" ]; then
      echo "✅ PASS: File correctly accepted (HTTP $HTTP_CODE)"
      echo "Job ID: $JOB_ID"
      exit 0
    else
      echo "⚠️  WARNING: Accepted but no job ID in response"
      exit 0
    fi
  else
    echo "❌ FAIL: File should be accepted but got HTTP $HTTP_CODE"
    echo "Response: $BODY"
    exit 1
  fi
fi

