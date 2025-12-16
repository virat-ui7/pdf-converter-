# Test Fixtures Creation Status

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## ✅ Automatically Created Files

| File | Size | Location | Status |
|------|------|----------|--------|
| `empty-docx.docx` | 0 bytes | `invalid/` | ✅ Created |
| `tiny.txt` | ~100 bytes | `valid/` | ✅ Created |
| `sample-10mb.csv` | ~10MB | `valid/` | ✅ Created |
| `corrupted-docx.docx` | 100 bytes | `invalid/` | ✅ Created |
| `free-tier-limit.docx` | 101MB | `tier-limits/` | ✅ Created |
| `starter-tier-limit.docx` | 501MB | `tier-limits/` | ✅ Created |

**Total Auto-Created: 6/13 files**

---

## ⚠️ Files Requiring Manual Creation

These files require specific software (Word, Excel, PowerPoint, image editors) and must be created manually:

### VALID FILES (7 files needed)

1. **sample-2mb.docx** (~2MB)
   - **How to create:**
     - Open Microsoft Word or LibreOffice Writer
     - Create a document with 10-15 pages of text
     - Add headings, formatting, and some images
     - Save as `.docx`
     - Target size: ~2MB
   - **Save to:** `test-fixtures/valid/sample-2mb.docx`

2. **sample-5mb.xlsx** (~5MB)
   - **How to create:**
     - Open Microsoft Excel or LibreOffice Calc
     - Create multiple sheets
     - Add 10,000+ rows of data with formulas
     - Save as `.xlsx`
     - Target size: ~5MB
   - **Save to:** `test-fixtures/valid/sample-5mb.xlsx`

3. **sample-10mb.pptx** (~10MB)
   - **How to create:**
     - Open Microsoft PowerPoint or LibreOffice Impress
     - Create 15-20 slides with text and images
     - Add some animations or transitions
     - Save as `.pptx`
     - Target size: ~10MB
   - **Save to:** `test-fixtures/valid/sample-10mb.pptx`

4. **sample-20mb.png** (~20MB)
   - **How to create:**
     - Use ImageMagick: `magick -size 4000x3000 xc:white -pointsize 72 -draw "text 100,100 'Test Image'" test-fixtures/valid/sample-20mb.png`
     - Or resize an existing image to 4000x3000 pixels, save as PNG (uncompressed)
     - Target size: ~20MB
   - **Save to:** `test-fixtures/valid/sample-20mb.png`

5. **sample-15mb.jpg** (~15MB)
   - **How to create:**
     - Take a photo or download a high-resolution image
     - Resize to 3000x2000 pixels
     - Save as JPG at 85% quality
     - Target size: ~15MB
   - **Save to:** `test-fixtures/valid/sample-15mb.jpg`

6. **sample-1mb.svg** (~1MB)
   - **How to create:**
     - Create or download an SVG vector graphic
     - Add complex paths, shapes, and gradients
     - Target size: ~1MB
   - **Save to:** `test-fixtures/valid/sample-1mb.svg`

7. **medium.pdf** (~50MB)
   - **How to create:**
     - Convert `sample-2mb.docx` to PDF (after creating it)
     - Or download a large PDF sample file
     - Target size: ~50MB
   - **Save to:** `test-fixtures/valid/medium.pdf`

### INVALID FILES (1 file needed)

8. **notreally-docx.docx** (~500KB, actually a PNG)
   - **How to create:**
     - After creating `sample-20mb.png`, copy it: `Copy-Item test-fixtures/valid/sample-20mb.png test-fixtures/invalid/notreally-docx.docx`
     - This creates a PNG file with a `.docx` extension (should be rejected)
   - **Save to:** `test-fixtures/invalid/notreally-docx.docx`

### TIER LIMIT FILES (1 file needed - optional)

9. **pro-tier-limit.docx** (2.1GB) - **OPTIONAL**
   - **How to create:**
     - PowerShell: `$bytes = New-Object byte[] 2202009600; (New-Object Random).NextBytes($bytes); [System.IO.File]::WriteAllBytes("test-fixtures/tier-limits/pro-tier-limit.docx", $bytes)`
     - **Note:** This is a very large file (2.1GB). Only create if you need to test Pro tier limits.
   - **Save to:** `test-fixtures/tier-limits/pro-tier-limit.docx`

---

## Quick Creation Guide

### Option 1: Download Sample Files
You can download sample files from:
- https://file-examples.com/
- https://github.com/sample-files

### Option 2: Use Online Tools
- **DOCX/XLSX/PPTX:** Use Google Docs/Sheets/Slides, export as Office formats
- **Images:** Use online image resizers or ImageMagick
- **PDF:** Use online PDF generators or convert from DOCX

### Option 3: Minimal Test Set
For basic testing, you can start with just these 3 files:
1. `sample-2mb.docx` (most important - used in many tests)
2. `sample-5mb.xlsx` (for spreadsheet conversions)
3. `sample-20mb.png` (for image conversions)

The rest can be added later as needed.

---

## Verification

After creating files, verify them:

```powershell
# Check all files exist
Get-ChildItem -Path "test-fixtures" -Recurse -File | Format-Table Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}

# Run verification script (if available)
bash ./scripts/verify-test-fixtures.sh
```

---

## Next Steps

1. ✅ **6 files created automatically** - Ready to use
2. ⚠️ **7 files need manual creation** - See instructions above
3. After all files are created, run: `./scripts/run-comprehensive-qa.sh`

**Estimated time to create remaining files:** 1-2 hours (depending on software availability)

