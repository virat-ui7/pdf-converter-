#!/bin/bash
# Test Validation Rejection
# Usage: ./scripts/test-validation-rejection.sh <file_path> <expected_error_type> [api_key]

set -e

API_URL="${API_URL:-http://localhost:3000}"
FILE_PATH=$1
EXPECTED_ERROR=$2  # corrupted, empty, misnamed, unsupported
API_KEY=${3:-"fc_staging_pro_test_key_12345"}

if [ -z "$FILE_PATH" ] || [ -z "$EXPECTED_ERROR" ]; then
  echo "Usage: $0 <file_path> <expected_error_type> [api_key]"
  echo "Error types: corrupted, empty, misnamed, unsupported"
  exit 1
fi

# Get file extension for format detection
FILE_EXT=$(echo "$FILE_PATH" | sed 's/.*\.//')
SOURCE_FORMAT=${SOURCE_FORMAT:-$FILE_EXT}
TARGET_FORMAT=${TARGET_FORMAT:-"pdf"}

echo "=========================================="
echo "Testing Validation Rejection"
echo "File: $FILE_PATH"
echo "Expected error: $EXPECTED_ERROR"
echo "=========================================="
echo ""

# Submit conversion
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/convert" \
  -H "X-API-Key: $API_KEY" \
  -F "file=@$FILE_PATH" \
  -F "sourceFormat=$SOURCE_FORMAT" \
  -F "targetFormat=$TARGET_FORMAT")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

# Should be rejected with 400
if [ "$HTTP_CODE" != "400" ]; then
  echo "❌ FAIL: Expected HTTP 400, got $HTTP_CODE"
  echo "Response: $BODY"
  exit 1
fi

echo "✅ PASS: File correctly rejected (HTTP 400)"

# Extract error message
ERROR_MSG=$(echo "$BODY" | jq -r '.error // .message // .error_message' 2>/dev/null || echo "$BODY")
echo "Error message: $ERROR_MSG"

# Check error message matches expected type
CLEAR=false
case $EXPECTED_ERROR in
  corrupted)
    if echo "$ERROR_MSG" | grep -qi "corrupt\|invalid\|damaged"; then
      CLEAR=true
    fi
    ;;
  empty)
    if echo "$ERROR_MSG" | grep -qi "empty\|zero\|no content"; then
      CLEAR=true
    fi
    ;;
  misnamed)
    if echo "$ERROR_MSG" | grep -qi "content.*match\|extension\|magic bytes\|format"; then
      CLEAR=true
    fi
    ;;
  unsupported)
    if echo "$ERROR_MSG" | grep -qi "not support\|cannot convert\|unsupported"; then
      CLEAR=true
    fi
    ;;
esac

if [ "$CLEAR" = true ]; then
  echo "✅ Error message is clear and matches expected type"
else
  echo "⚠️  Error message may not clearly indicate the issue"
fi

# Check for user-friendly language
if echo "$ERROR_MSG" | grep -qi "stack trace\|nullpointer\|exception\|internal"; then
  echo "❌ FAIL: Error message contains internal details"
  exit 1
fi

echo ""
echo "Result: ✅ PASS"
echo "HTTP Status: 400"
echo "Error Message: $ERROR_MSG"
echo "User-Friendly: YES"

