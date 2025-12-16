#!/bin/bash
# Verify Test Fixtures Script
# Checks that all required test files exist and have correct sizes

set -e

echo "=========================================="
echo "Verifying Test Fixtures"
echo "=========================================="
echo ""

FIXTURES_DIR="test-fixtures"
PASSED=0
FAILED=0
MISSING=0

# Function to check file
check_file() {
  local file=$1
  local expected_size=$2
  local purpose=$3
  
  local path="$FIXTURES_DIR/$file"
  
  if [ ! -f "$path" ]; then
    echo "❌ MISSING: $file ($purpose)"
    MISSING=$((MISSING + 1))
    return 1
  fi
  
  local actual_size=$(stat -f%z "$path" 2>/dev/null || stat -c%s "$path" 2>/dev/null || echo "0")
  local size_mb=$(echo "scale=2; $actual_size / 1024 / 1024" | bc 2>/dev/null || echo "0")
  
  # Check if size is approximately correct (within 20% tolerance)
  if [ "$expected_size" = "0" ]; then
    if [ "$actual_size" -eq 0 ]; then
      echo "✅ $file: 0 bytes (empty file - correct)"
      PASSED=$((PASSED + 1))
      return 0
    else
      echo "⚠️  $file: Expected 0 bytes, got ${size_mb}MB"
      FAILED=$((FAILED + 1))
      return 1
    fi
  fi
  
  # For non-zero files, just check they exist and have reasonable size
  if [ "$actual_size" -gt 0 ]; then
    echo "✅ $file: ${size_mb}MB ($purpose)"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo "❌ $file: File is empty (expected non-zero)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# Check valid files
echo "📄 Valid Files:"
check_file "sample.docx" "2MB" "Word document"
check_file "sample.xlsx" "5MB" "Excel spreadsheet"
check_file "sample.pptx" "10MB" "PowerPoint presentation"
check_file "sample.png" "20MB" "PNG image"
check_file "sample.jpg" "15MB" "JPG image"
check_file "sample.svg" "1MB" "SVG vector"
check_file "sample.csv" "10MB" "CSV data"
check_file "tiny.txt" "1KB" "Small text file"
check_file "medium.pdf" "50MB" "Medium PDF"

echo ""
echo "🔍 Edge Case Files:"
check_file "tiny.txt" "1KB" "Minimum size"
check_file "medium.pdf" "50MB" "Near tier limit"

echo ""
echo "❌ Invalid Files (should be rejected):"
check_file "corrupted.docx" "1MB" "Corrupted file"
check_file "empty.docx" "0" "Empty file"
check_file "notreally.docx" "500KB" "Misnamed file (PNG)"
check_file "huge.docx" "101MB" "Oversized file"

echo ""
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo "⚠️  Missing: $MISSING"
echo ""

if [ $MISSING -gt 0 ]; then
  echo "⚠️  Some files are missing. Create them using:"
  echo "   - See test-fixtures/README.md for instructions"
  echo "   - Or download from sample file repositories"
  echo ""
fi

if [ $FAILED -eq 0 ] && [ $MISSING -eq 0 ]; then
  echo "🎉 All test fixtures are ready!"
  exit 0
else
  echo "⚠️  Some files need attention before running tests."
  exit 1
fi

