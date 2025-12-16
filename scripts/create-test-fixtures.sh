#!/bin/bash
# Create Test Fixtures Script
# Generates test files where possible, provides instructions for others

set -e

FIXTURES_DIR="test-fixtures"
VALID_DIR="$FIXTURES_DIR/valid"
INVALID_DIR="$FIXTURES_DIR/invalid"
TIER_LIMITS_DIR="$FIXTURES_DIR/tier-limits"

mkdir -p "$VALID_DIR" "$INVALID_DIR" "$TIER_LIMITS_DIR"

echo "=========================================="
echo "Creating Test Fixtures"
echo "=========================================="
echo ""

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# 1. Create empty file
echo "1. Creating empty-docx.docx..."
touch "$INVALID_DIR/empty-docx.docx"
echo "   ✅ Created: $INVALID_DIR/empty-docx.docx (0 bytes)"

# 2. Create tiny text file
echo "2. Creating tiny.txt..."
cat > "$VALID_DIR/tiny.txt" << 'EOF'
This is a test file for FileConverter QA testing.
It contains minimal content to test small file conversions.
EOF
echo "   ✅ Created: $VALID_DIR/tiny.txt (~100 bytes)"

# 3. Create corrupted DOCX (truncated)
echo "3. Creating corrupted-docx.docx..."
# Create a minimal valid DOCX structure, then truncate
if command_exists python3; then
  python3 << 'PYTHON'
import zipfile
import os

# Create a minimal DOCX (ZIP structure)
corrupted_path = "test-fixtures/invalid/corrupted-docx.docx"
with zipfile.ZipFile(corrupted_path, 'w') as zf:
    zf.writestr('[Content_Types].xml', '<?xml version="1.0"?><Types></Types>')
    zf.writestr('_rels/.rels', '<?xml version="1.0"?><Relationships></Relationships>')

# Truncate to 100 bytes to make it corrupted
with open(corrupted_path, 'r+b') as f:
    f.truncate(100)

print(f"   ✅ Created: {corrupted_path} (truncated to 100 bytes)")
PYTHON
else
  echo "   ⚠️  Python not found - cannot create corrupted DOCX"
  echo "   Manual: Create any .docx, truncate to 100 bytes"
fi

# 4. Create large CSV file (10MB)
echo "4. Creating sample-10mb.csv..."
if command_exists python3; then
  python3 << 'PYTHON'
import csv
import random
import string

def random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

csv_path = "test-fixtures/valid/sample-10mb.csv"
target_size = 10 * 1024 * 1024  # 10MB

with open(csv_path, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['id', 'name', 'email', 'value', 'date', 'description'])
    
    current_size = len(','.join(['id', 'name', 'email', 'value', 'date', 'description']) + '\n')
    row_count = 0
    
    while current_size < target_size:
        row = [
            row_count,
            random_string(20),
            f"{random_string(10)}@example.com",
            random.randint(100, 10000),
            f"2025-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            random_string(50)
        ]
        writer.writerow(row)
        row_count += 1
        current_size = f.tell()
        
        if row_count % 10000 == 0:
            print(f"   Generated {row_count} rows, {current_size / 1024 / 1024:.2f}MB...")

print(f"   ✅ Created: {csv_path} ({row_count} rows, {current_size / 1024 / 1024:.2f}MB)")
PYTHON
else
  echo "   ⚠️  Python not found - cannot create CSV"
  echo "   Manual: Generate CSV with 100,000+ rows"
fi

# 5. Create huge file (101MB) for tier limit testing
echo "5. Creating free-tier-limit.docx (101MB)..."
if command_exists dd; then
  dd if=/dev/zero of="$TIER_LIMITS_DIR/free-tier-limit.docx" bs=1M count=101 2>/dev/null
  echo "   ✅ Created: $TIER_LIMITS_DIR/free-tier-limit.docx (101MB)"
elif command_exists fsutil; then
  # Windows
  fsutil file createnew "$TIER_LIMITS_DIR/free-tier-limit.docx" 105906176 2>/dev/null || {
    echo "   ⚠️  Cannot create 101MB file on Windows"
    echo "   Manual: Use PowerShell: New-Item -Path '$TIER_LIMITS_DIR/free-tier-limit.docx' -ItemType File -Value (New-Object byte[] 105906176)"
  }
else
  echo "   ⚠️  Cannot create large file - use manual method"
fi

# 6. Create 501MB file for starter tier
echo "6. Creating starter-tier-limit.docx (501MB)..."
if command_exists dd; then
  dd if=/dev/zero of="$TIER_LIMITS_DIR/starter-tier-limit.docx" bs=1M count=501 2>/dev/null
  echo "   ✅ Created: $TIER_LIMITS_DIR/starter-tier-limit.docx (501MB)"
else
  echo "   ⚠️  Cannot create 501MB file automatically"
  echo "   Manual: Create file just over 500MB"
fi

# 7. Create 2.1GB file for pro tier (optional, very large)
echo "7. Creating pro-tier-limit.docx (2.1GB)..."
echo "   ⚠️  Skipping 2.1GB file (very large, optional for testing)"
echo "   Manual: Create if needed: dd if=/dev/zero of=pro-tier-limit.docx bs=1M count=2150"

echo ""
echo "=========================================="
echo "Files That Need Manual Creation"
echo "=========================================="
echo ""
echo "The following files require specific software and must be created manually:"
echo ""
echo "VALID FILES:"
echo "  1. sample-2mb.docx - Word document (2MB)"
echo "     → Open Word/LibreOffice, create 10 pages, save as .docx"
echo ""
echo "  2. sample-5mb.xlsx - Excel spreadsheet (5MB)"
echo "     → Open Excel/LibreOffice Calc, add 10,000+ rows, save as .xlsx"
echo ""
echo "  3. sample-10mb.pptx - PowerPoint (10MB)"
echo "     → Open PowerPoint/LibreOffice Impress, create 15 slides, save as .pptx"
echo ""
echo "  4. sample-20mb.png - PNG image (20MB)"
echo "     → Use ImageMagick: convert -size 4000x3000 xc:white sample-20mb.png"
echo "     → Or resize existing image to 4000x3000, save as PNG"
echo ""
echo "  5. sample-15mb.jpg - JPEG image (15MB)"
echo "     → Resize photo to 3000x2000, save as JPG at 85% quality"
echo ""
echo "  6. sample-1mb.svg - SVG vector (1MB)"
echo "     → Create or download SVG, add complex paths"
echo ""
echo "  7. medium.pdf - PDF document (50MB)"
echo "     → Convert sample-2mb.docx to PDF, or download large PDF"
echo ""
echo "INVALID FILES:"
echo "  8. notreally-docx.docx - PNG with wrong extension"
echo "     → Copy sample-20mb.png and rename to notreally-docx.docx"
echo ""
echo "See test-fixtures/README.md for detailed instructions."
echo ""

# Summary
echo "=========================================="
echo "Summary"
echo "=========================================="
AUTO_CREATED=$(find "$FIXTURES_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "Files created automatically: $AUTO_CREATED"
echo "Files needing manual creation: ~7"
echo ""
echo "Next steps:"
echo "  1. Create remaining files manually (see above)"
echo "  2. Verify all files: ./scripts/verify-test-fixtures.sh"
echo "  3. Run tests: ./scripts/run-comprehensive-qa.sh"
echo ""

