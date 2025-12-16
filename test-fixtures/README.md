# Test Fixtures for Staging QA

This directory contains test files for comprehensive end-to-end testing of the FileConverter platform in staging.

## File Specifications

### VALID FILES (Should Convert Successfully)

| File | Size | Format | Purpose | Expected Result |
|------|------|--------|---------|----------------|
| `sample.docx` | ~2MB | DOCX | Word document with text and formatting | ✅ PASS - Convert to PDF, HTML, TXT |
| `sample.xlsx` | ~5MB | XLSX | Excel spreadsheet with formulas and data | ✅ PASS - Convert to CSV, PDF, JSON |
| `sample.pptx` | ~10MB | PPTX | PowerPoint with images and text | ✅ PASS - Convert to PDF, PNG (slide export) |
| `sample.png` | ~20MB | PNG | Large PNG image | ✅ PASS - Convert to JPG, WEBP, PDF |
| `sample.jpg` | ~15MB | JPG | Large JPG image | ✅ PASS - Convert to PNG, WEBP, PDF |
| `sample.svg` | ~1MB | SVG | Vector graphic | ✅ PASS - Convert to PNG, PDF |
| `sample.csv` | ~10MB | CSV | Large CSV data file | ✅ PASS - Convert to XLSX, JSON |
| `tiny.txt` | ~1KB | TXT | Small plain text file | ✅ PASS - Convert to PDF, DOCX |
| `medium.pdf` | ~50MB | PDF | Medium-sized PDF document | ✅ PASS - Convert to DOCX, HTML, TXT |

### EDGE CASE FILES

| File | Size | Format | Purpose | Expected Result |
|------|------|--------|---------|----------------|
| `tiny.txt` | 1KB | TXT | Minimum size test | ✅ PASS - Should process quickly |
| `medium.pdf` | 50MB | PDF | Medium size, near Free tier limit | ✅ PASS - Should process within tier limit |

### INVALID FILES (Should Be Rejected)

| File | Size | Format | Purpose | Expected Result | Error Message |
|------|------|--------|---------|----------------|---------------|
| `corrupted.docx` | ~1MB | Invalid | Truncated/invalid ZIP structure | ❌ FAIL | "File is corrupted or invalid. Please try another file." |
| `empty.docx` | 0 bytes | DOCX | Empty file | ❌ FAIL | "File is empty. Please upload a valid file." |
| `notreally.docx` | ~500KB | PNG | PNG file with .docx extension | ❌ FAIL | "File content does not match the declared format. The file may be corrupted or have an incorrect extension." |
| `huge.docx` | 101MB | DOCX | Exceeds Free tier limit | ❌ FAIL | "File size (101MB) exceeds the free tier limit of 100MB. Please upgrade your plan or reduce file size." |

## Creating Test Files

### Option 1: Generate Real Files (Recommended)

**For DOCX:**
```bash
# Use LibreOffice or Microsoft Word to create a 2MB document
# Or use Python:
python -c "
from docx import Document
doc = Document()
for i in range(1000):
    doc.add_paragraph('This is test content. ' * 50)
doc.save('test-fixtures/sample.docx')
"
```

**For XLSX:**
```bash
# Use Excel or Python:
python -c "
import openpyxl
wb = openpyxl.Workbook()
ws = wb.active
for row in range(1000):
    for col in range(10):
        ws.cell(row=row+1, column=col+1, value=f'Data {row}-{col}')
wb.save('test-fixtures/sample.xlsx')
"
```

**For Images:**
```bash
# Use ImageMagick or create programmatically
convert -size 2000x2000 xc:white -pointsize 72 -draw "text 100,100 'Test Image'" test-fixtures/sample.png
```

### Option 2: Use Sample Files from Internet

Download sample files from:
- [Sample Files Archive](https://file-examples.com/)
- [Test Files Repository](https://github.com/sample-files)

### Option 3: Create Invalid Files

**Corrupted DOCX:**
```bash
# Create a valid DOCX, then truncate it
head -c 1000 sample.docx > test-fixtures/corrupted.docx
```

**Empty File:**
```bash
touch test-fixtures/empty.docx
```

**Misnamed File:**
```bash
# Copy a PNG and rename it
cp sample.png test-fixtures/notreally.docx
```

**Oversized File:**
```bash
# Create a 101MB file
dd if=/dev/zero of=test-fixtures/huge.docx bs=1M count=101
```

## Verification

Before running tests, verify all files exist and have correct sizes:

```bash
# Run verification script
./scripts/verify-test-fixtures.sh
```

Or manually check:
```bash
ls -lh test-fixtures/
```

Expected output:
```
-rw-r--r--  1 user  staff   2.0M  sample.docx
-rw-r--r--  1 user  staff   5.0M  sample.xlsx
-rw-r--r--  1 user  staff  10.0M  sample.pptx
-rw-r--r--  1 user  staff  20.0M  sample.png
-rw-r--r--  1 user  staff  15.0M  sample.jpg
-rw-r--r--  1 user  staff   1.0M  sample.svg
-rw-r--r--  1 user  staff  10.0M  sample.csv
-rw-r--r--  1 user  staff   1.0K  tiny.txt
-rw-r--r--  1 user  staff  50.0M  medium.pdf
-rw-r--r--  1 user  staff   1.0M  corrupted.docx
-rw-r--r--  1 user  staff     0B  empty.docx
-rw-r--r--  1 user  staff 500.0K  notreally.docx
-rw-r--r--  1 user  staff 101.0M  huge.docx
```

## Usage in Tests

Test scripts will reference these files by path:
- `test-fixtures/sample.docx`
- `test-fixtures/sample.xlsx`
- etc.

Make sure to run tests from the project root directory.

---

**Last Updated:** 2025-12-15  
**Note:** Actual binary files need to be created manually or downloaded. This README provides specifications only.
