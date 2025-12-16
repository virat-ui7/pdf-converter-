# Test Fixture Creation Guide

Complete guide for creating all 13 test files required for QA testing.

## Quick Start

**Option 1: Automated (Partial)**
```bash
./scripts/create-test-fixtures.sh
```
This will create: empty file, tiny.txt, corrupted DOCX, CSV, and tier limit files.

**Option 2: Manual Creation**
Follow instructions below for each file.

---

## VALID FILES (7 files)

### 1. sample-2mb.docx (2MB Word Document)

**Method A: Using Microsoft Word**
1. Open Microsoft Word
2. Create new document
3. Add content:
   - Title: "Test Document for FileConverter QA"
   - 10 pages of text (copy-paste paragraphs)
   - Add headings (H1, H2)
   - Add bold, italic formatting
   - Add bullet points
   - Add a table
4. Save as `sample-2mb.docx`
5. Check file size (should be ~2MB)
6. If smaller, add more content or images
7. Copy to: `test-fixtures/valid/sample-2mb.docx`

**Method B: Using LibreOffice Writer**
```bash
# Create document
libreoffice --headless --convert-to docx --outdir test-fixtures/valid/ your-source-file.docx

# Or create manually in LibreOffice Writer
```

**Method C: Using Python (docx library)**
```python
from docx import Document
from docx.shared import Inches

doc = Document()
doc.add_heading('Test Document', 0)

# Add 10 pages of content
for i in range(100):
    doc.add_paragraph('This is paragraph ' + str(i) + '. ' * 50)
    if i % 10 == 0:
        doc.add_heading('Section ' + str(i//10), level=1)

doc.save('test-fixtures/valid/sample-2mb.docx')
```

**Verify:**
```bash
ls -lh test-fixtures/valid/sample-2mb.docx
# Should show ~2.0M
```

---

### 2. sample-5mb.xlsx (5MB Excel Spreadsheet)

**Method A: Using Microsoft Excel**
1. Open Excel
2. Create new workbook
3. Add multiple sheets (Sheet1, Sheet2, Sheet3)
4. In each sheet:
   - Add headers: A1=ID, B1=Name, C1=Email, D1=Value, E1=Date
   - Fill ~10,000 rows with data
   - Add formulas: =SUM(D2:D10000) in some cells
5. Save as `sample-5mb.xlsx`
6. Check file size (should be ~5MB)
7. Copy to: `test-fixtures/valid/sample-5mb.xlsx`

**Method B: Using Python (openpyxl)**
```python
from openpyxl import Workbook
import random
import string

wb = Workbook()
ws = wb.active
ws.title = "Data"

# Add headers
ws.append(['ID', 'Name', 'Email', 'Value', 'Date'])

# Add 10,000 rows
for i in range(1, 10001):
    ws.append([
        i,
        ''.join(random.choices(string.ascii_letters, k=20)),
        f"user{i}@example.com",
        random.randint(100, 10000),
        f"2025-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
    ])
    
    # Add formula every 100 rows
    if i % 100 == 0:
        ws[f'F{i}'] = f'=SUM(D{i-99}:D{i})'

# Add more sheets
for sheet_num in range(2, 4):
    ws = wb.create_sheet(f"Sheet{sheet_num}")
    ws.append(['ID', 'Name', 'Email', 'Value', 'Date'])
    for i in range(1, 5001):
        ws.append([i, f"Name{i}", f"email{i}@test.com", random.randint(100, 10000), "2025-01-01"])

wb.save('test-fixtures/valid/sample-5mb.xlsx')
```

**Verify:**
```bash
ls -lh test-fixtures/valid/sample-5mb.xlsx
# Should show ~5.0M
```

---

### 3. sample-10mb.pptx (10MB PowerPoint)

**Method A: Using Microsoft PowerPoint**
1. Open PowerPoint
2. Create new presentation
3. Add 15 slides:
   - Each slide: Title + content + image
   - Add transitions
   - Add animations
4. Save as `sample-10mb.pptx`
5. Check file size (should be ~10MB)
6. If smaller, add more images or slides
7. Copy to: `test-fixtures/valid/sample-10mb.pptx`

**Method B: Using LibreOffice Impress**
1. Open LibreOffice Impress
2. Create 15 slides with content and images
3. Save as .pptx
4. Copy to test-fixtures/valid/

---

### 4. sample-20mb.png (20MB PNG Image)

**Method A: Using ImageMagick**
```bash
# Create 4000x3000 PNG
convert -size 4000x3000 xc:white \
  -pointsize 72 -draw "text 100,100 'Test Image'" \
  -quality 100 \
  test-fixtures/valid/sample-20mb.png

# If too small, create with more detail
convert -size 4000x3000 gradient:blue-red \
  -noise Random \
  test-fixtures/valid/sample-20mb.png
```

**Method B: Using GIMP or Photoshop**
1. Create new image: 4000x3000 pixels
2. Fill with content (gradient, photo, etc.)
3. Save as PNG (uncompressed or minimal compression)
4. If <20MB, increase resolution or add more detail
5. Copy to: `test-fixtures/valid/sample-20mb.png`

**Method C: Resize Existing Image**
```bash
# Using ImageMagick
convert large-image.jpg -resize 4000x3000 -quality 100 sample-20mb.png
```

**Verify:**
```bash
ls -lh test-fixtures/valid/sample-20mb.png
# Should show ~20M
```

---

### 5. sample-15mb.jpg (15MB JPEG Image)

**Method A: Using ImageMagick**
```bash
# Create 3000x2000 JPG
convert -size 3000x2000 gradient:blue-green \
  -quality 85 \
  test-fixtures/valid/sample-15mb.jpg

# Or resize existing photo
convert photo.jpg -resize 3000x2000 -quality 85 sample-15mb.jpg
```

**Method B: Using Camera/Phone**
1. Take a photo
2. Resize to 3000x2000 pixels
3. Save as JPG at 85% quality
4. Copy to: `test-fixtures/valid/sample-15mb.jpg`

**Verify:**
```bash
ls -lh test-fixtures/valid/sample-15mb.jpg
# Should show ~15M
```

---

### 6. sample-1mb.svg (1MB SVG Vector)

**Method A: Using Python Script**
```bash
python3 scripts/generate-svg-fixture.py
```

**Method B: Manual Creation**
1. Create SVG with many complex paths
2. Add gradients, filters, patterns
3. Duplicate content to reach 1MB
4. Save to: `test-fixtures/valid/sample-1mb.svg`

**Method C: Download Sample**
- Download complex SVG from internet
- Modify to reach 1MB if needed

---

### 7. sample-10mb.csv (10MB CSV Data)

**Method A: Using Python Script**
```bash
python3 scripts/generate-csv-fixture.py
```

**Method B: Manual Creation**
```python
import csv
import random

with open('test-fixtures/valid/sample-10mb.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['id', 'name', 'email', 'value', 'date'])
    for i in range(100000):
        writer.writerow([i, f"Name{i}", f"email{i}@test.com", random.randint(100, 10000), "2025-01-01"])
```

**Verify:**
```bash
ls -lh test-fixtures/valid/sample-10mb.csv
# Should show ~10M
```

---

## INVALID FILES (3 files)

### 8. corrupted-docx.docx (Corrupted File)

**Method A: Truncate Valid DOCX**
```bash
# Create valid DOCX first, then truncate
head -c 100 sample-2mb.docx > test-fixtures/invalid/corrupted-docx.docx
```

**Method B: Using Python**
```python
# Create minimal DOCX, then truncate
import zipfile

with zipfile.ZipFile('test-fixtures/invalid/corrupted-docx.docx', 'w') as zf:
    zf.writestr('[Content_Types].xml', '<?xml version="1.0"?><Types></Types>')

# Truncate to 100 bytes
with open('test-fixtures/invalid/corrupted-docx.docx', 'r+b') as f:
    f.truncate(100)
```

**Verify:**
```bash
ls -lh test-fixtures/invalid/corrupted-docx.docx
# Should show ~100 bytes
```

---

### 9. empty-docx.docx (0 bytes)

**Already created by script:**
```bash
touch test-fixtures/invalid/empty-docx.docx
```

**Verify:**
```bash
ls -lh test-fixtures/invalid/empty-docx.docx
# Should show 0 bytes
```

---

### 10. notreally-docx.docx (PNG with Wrong Extension)

**After creating sample-20mb.png:**
```bash
cp test-fixtures/valid/sample-20mb.png test-fixtures/invalid/notreally-docx.docx
```

**Verify:**
```bash
file test-fixtures/invalid/notreally-docx.docx
# Should show: PNG image data
```

---

## TIER LIMIT FILES (3 files)

### 11. free-tier-limit.docx (101MB)

**Method A: Using dd (Linux/Mac)**
```bash
dd if=/dev/zero of=test-fixtures/tier-limits/free-tier-limit.docx bs=1M count=101
```

**Method B: Using PowerShell (Windows)**
```powershell
$bytes = New-Object byte[] 105906176  # 101MB
[System.IO.File]::WriteAllBytes("test-fixtures/tier-limits/free-tier-limit.docx", $bytes)
```

**Method C: Using Python**
```python
with open('test-fixtures/tier-limits/free-tier-limit.docx', 'wb') as f:
    f.write(b'\x00' * (101 * 1024 * 1024))
```

**Verify:**
```bash
ls -lh test-fixtures/tier-limits/free-tier-limit.docx
# Should show ~101M
```

---

### 12. starter-tier-limit.docx (501MB)

**Same methods as above, but 501MB:**
```bash
dd if=/dev/zero of=test-fixtures/tier-limits/starter-tier-limit.docx bs=1M count=501
```

---

### 13. pro-tier-limit.docx (2.1GB)

**Same methods, but 2.1GB (2150MB):**
```bash
dd if=/dev/zero of=test-fixtures/tier-limits/pro-tier-limit.docx bs=1M count=2150
```

**Note:** This is a very large file. Only create if you have disk space and need to test Pro tier limits.

---

## Verification

After creating all files:

```bash
./scripts/verify-test-fixtures.sh
```

**Expected output:**
```
✅ sample-2mb.docx: 2.0MB
✅ sample-5mb.xlsx: 5.0MB
✅ sample-10mb.pptx: 10.0MB
✅ sample-20mb.png: 20.0MB
✅ sample-15mb.jpg: 15.0MB
✅ sample-1mb.svg: 1.0MB
✅ sample-10mb.csv: 10.0MB
✅ corrupted-docx.docx: 0.1MB (truncated)
✅ empty-docx.docx: 0 bytes
✅ notreally-docx.docx: 20.0MB (PNG)
✅ free-tier-limit.docx: 101.0MB
✅ starter-tier-limit.docx: 501.0MB
✅ pro-tier-limit.docx: 2150.0MB
```

---

## Troubleshooting

### File Size Too Small

**For DOCX/XLSX/PPTX:**
- Add more content (text, images, data)
- Add more pages/sheets/slides
- Add formatting and complex structures

**For Images:**
- Increase resolution
- Reduce compression
- Add more detail/complexity

**For CSV:**
- Add more rows
- Add more columns
- Add longer text fields

### File Size Too Large

**For DOCX/XLSX/PPTX:**
- Remove some content
- Reduce image sizes
- Simplify formatting

**For Images:**
- Reduce resolution
- Increase compression
- Simplify content

### Cannot Create Binary Files

**Use online tools:**
- [File Examples](https://file-examples.com/)
- [Sample Files](https://sample-files.com/)
- Download and resize as needed

---

**Last Updated:** 2025-12-15  
**Need Help?** See `test-fixtures/README.md` for more details

