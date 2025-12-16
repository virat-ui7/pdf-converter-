#!/bin/bash
# Generate Test Fixtures Script
# Creates test files for staging QA (where possible)

set -e

FIXTURES_DIR="test-fixtures"
mkdir -p "$FIXTURES_DIR"

echo "=========================================="
echo "Generating Test Fixtures"
echo "=========================================="
echo ""

# Check for required tools
check_tool() {
  if ! command -v $1 &> /dev/null; then
    echo "⚠️  $1 not found - skipping $2 generation"
    return 1
  fi
  return 0
}

# Generate empty file
echo "Creating empty.docx..."
touch "$FIXTURES_DIR/empty.docx"
echo "✅ Created empty.docx (0 bytes)"

# Generate tiny text file
echo "Creating tiny.txt..."
echo "This is a test file." > "$FIXTURES_DIR/tiny.txt"
echo "✅ Created tiny.txt (~20 bytes)"

# Generate corrupted DOCX (truncated)
if [ -f "$FIXTURES_DIR/sample.docx" ]; then
  echo "Creating corrupted.docx..."
  head -c 1000 "$FIXTURES_DIR/sample.docx" > "$FIXTURES_DIR/corrupted.docx" 2>/dev/null || {
    # If head doesn't work, use dd
    dd if="$FIXTURES_DIR/sample.docx" of="$FIXTURES_DIR/corrupted.docx" bs=1 count=1000 2>/dev/null || {
      echo "⚠️  Could not create corrupted.docx (need sample.docx first)"
    }
  }
  echo "✅ Created corrupted.docx (truncated)"
fi

# Generate huge file (101MB)
echo "Creating huge.docx..."
if command -v dd &> /dev/null; then
  dd if=/dev/zero of="$FIXTURES_DIR/huge.docx" bs=1M count=101 2>/dev/null
  echo "✅ Created huge.docx (101MB)"
else
  echo "⚠️  dd not found - cannot create huge.docx"
fi

# Note about files that need manual creation
echo ""
echo "=========================================="
echo "Files Requiring Manual Creation"
echo "=========================================="
echo ""
echo "The following files need to be created manually or downloaded:"
echo ""
echo "Valid Files:"
echo "  - sample.docx (~2MB) - Use LibreOffice or Word"
echo "  - sample.xlsx (~5MB) - Use Excel or openpyxl"
echo "  - sample.pptx (~10MB) - Use PowerPoint or LibreOffice"
echo "  - sample.png (~20MB) - Use ImageMagick: convert -size 2000x2000 xc:white sample.png"
echo "  - sample.jpg (~15MB) - Use ImageMagick or download"
echo "  - sample.svg (~1MB) - Create SVG or download"
echo "  - sample.csv (~10MB) - Generate with Python or Excel"
echo "  - medium.pdf (~50MB) - Use LibreOffice or download"
echo ""
echo "Invalid Files:"
echo "  - notreally.docx - Copy a PNG file and rename to .docx"
echo ""
echo "See test-fixtures/README.md for detailed instructions."
echo ""

# Verify what we created
echo "=========================================="
echo "Generated Files"
echo "=========================================="
ls -lh "$FIXTURES_DIR/" 2>/dev/null || echo "No files in $FIXTURES_DIR"
echo ""

echo "✅ Test fixture generation complete"
echo "⚠️  Some files still need manual creation"

