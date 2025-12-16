# Supported File Formats

**Total: 117 formats across 4 categories**

FileConverter supports comprehensive file format conversion across documents, spreadsheets, presentations, and images.

## Format Categories

### Documents (43 formats)
- **Core Documents:** PDF, DOCX, DOC, TXT, RTF, ODT, HTML, HTM, XHTML, MHTML, MHT, MD
- **Office Documents:** DOCM, DOT, DOTX, DOTM
- **Data Formats:** JSON, XML, YAML, YML
- **Email Formats:** EML, MSG
- **Calendar Formats:** ICS, VCS, VCF
- **eBook Formats:** EPUB, MOBI, PRC
- **Specialized:** ONE, CHM, TEX, XMIND, PST, SDF, INI
- **Programming:** BAS, ASM, CBL, VBP, PAS, APA, BET, ASC

### Spreadsheets (17 formats)
- **Core Spreadsheets:** XLSX, XLS, CSV, ODS, TSV
- **Extended Office:** XLSM, XLSB, XLT, XLTX, XLTM
- **Other Formats:** WPS, OTT, WKS, WK3, NUMBERS, SYLK, DIF

### Presentations (7 formats)
- **Core Presentations:** PPTX, PPT, ODP
- **Extended Office:** PPTM, PPS, PPSX
- **Other Formats:** KEY

### Images (50 formats)
- **Common Formats:** JPG, JPEG, PNG, GIF, WEBP, BMP, TIFF, TIF, ICO, SVG
- **Modern Formats:** HEIC, HEIF, AVIF, FLIF
- **RAW Formats:** CR2, CR3, NEF, ARW, DNG, ORF, RW2, PEF, SRW, X3F, RAF, 3FR, MEF, DCR, KDC, ERF, MRW, MOS, IIQ, RWL, SRF, SR2, BAY, DCS, DRF, GPR, JXR, NRW, RWZ, X3F
- **Vector Formats:** EPS, EMF, WMF
- **Professional Formats:** PSD, AI, DJVU, JP2, JPX, J2K, J2C, CDR, FPX

## Conversion Matrix

FileConverter supports **357+ conversion paths** between these formats. Conversions are organized by category:

### Document Conversions
- **Documents → Documents:** All document formats can convert to PDF, DOCX, DOC, TXT, RTF, ODT, HTML, MD, JSON, XML
- **Documents → Images:** Documents can convert to PNG, JPG, PDF (as image)
- **Documents → Spreadsheets:** Limited (CSV, JSON only)

### Spreadsheet Conversions
- **Spreadsheets → Spreadsheets:** All spreadsheet formats can convert to XLSX, XLS, CSV, ODS, TSV
- **Spreadsheets → Documents:** Spreadsheets can convert to PDF, HTML, JSON, XML
- **Spreadsheets → Images:** Spreadsheets can convert to PNG, JPG (as charts/images)

### Presentation Conversions
- **Presentations → Presentations:** All presentation formats can convert to PPTX, PPT, ODP
- **Presentations → Documents:** Presentations can convert to PDF, HTML
- **Presentations → Images:** Presentations can convert to PNG, JPG (slide export)

### Image Conversions
- **Images → Images:** All image formats can convert to JPG, PNG, WEBP, BMP, TIFF, SVG, PDF
- **Images → Documents:** Images can convert to PDF (as embedded image)

## Conversion Complexity

Conversions are categorized by complexity:

1. **Simple (1):** Direct conversion, fast (<5 seconds)
   - Image format conversions (JPG → PNG, PNG → WEBP)
   - Simple text conversions (TXT → PDF)

2. **Moderate (2):** Requires processing, medium time (5-30 seconds)
   - Document conversions (DOCX → PDF, DOCX → HTML)
   - Spreadsheet conversions (XLSX → CSV, XLSX → PDF)

3. **Complex (3):** Multiple steps, longer time (30-120 seconds)
   - Presentation conversions (PPTX → PDF)
   - Complex document conversions (PDF → DOCX)
   - Multi-page conversions

4. **Very Complex (4):** Specialized tools, longest time (120+ seconds)
   - RAW image conversions
   - Professional format conversions (PSD → PNG, AI → PDF)
   - Large file conversions (>100MB)

## Format-Specific Notes

### PDF
- **From:** Can convert from most document formats
- **To:** Can convert to DOCX, HTML, TXT, PNG, JPG
- **Limitations:** Complex PDFs with embedded images may have quality loss

### DOCX/DOC
- **From:** PDF, TXT, RTF, ODT, HTML
- **To:** PDF, HTML, TXT, RTF, ODT
- **Limitations:** Macros and advanced formatting may not be preserved

### XLSX/XLS
- **From:** CSV, ODS, TSV, JSON
- **To:** CSV, PDF, HTML, JSON, ODS
- **Limitations:** Complex formulas may not be preserved

### PPTX/PPT
- **From:** Limited (mainly from other presentation formats)
- **To:** PDF, PNG, JPG (slide export)
- **Limitations:** Animations and transitions are not preserved

### Images
- **From:** Most image formats can convert to other image formats
- **To:** JPG, PNG, WEBP, BMP, TIFF, SVG, PDF
- **Quality:** Lossless conversions available for PNG, TIFF, BMP
- **Compression:** Adjustable quality for JPG, WEBP

## Unsupported Conversions

Some conversions are not supported due to technical limitations:

- **RAW → Document formats:** RAW images cannot convert directly to DOCX, PDF (text)
- **Video formats:** Not currently supported
- **Audio formats:** Not currently supported
- **Archive formats:** ZIP, RAR, etc. are not supported
- **Executable formats:** EXE, APP, etc. are not supported

## Quality Considerations

- **Lossless formats:** PNG, TIFF, BMP preserve original quality
- **Lossy formats:** JPG, WEBP may have quality loss (adjustable)
- **Document conversions:** Formatting may vary slightly between formats
- **Image conversions:** Color profiles may be adjusted for compatibility

## File Size Limits

File size limits vary by subscription tier:

- **Free:** 100MB per file
- **Starter:** 500MB per file
- **Professional:** 2GB per file
- **Enterprise:** 10GB per file (practical limit, though UI shows "Unlimited")

## Getting Help

If you need help with a specific format conversion:

1. Check the [Conversion Matrix](/conversion-matrix) page
2. Visit the [FAQ](/support/faq) page
3. Contact [Support](/support/contact)

---

**Last Updated:** 2025-12-15  
**Total Formats:** 117  
**Total Conversion Paths:** 357+

