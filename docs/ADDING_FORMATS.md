# Adding New File Formats

Step-by-step guide for adding support for new file formats to FileConverter.

## Overview

Adding a new format involves:
1. Registering the format in the format database
2. Adding validation logic
3. Implementing conversion functions
4. Updating the conversion matrix
5. Testing

## Step 1: Register Format

**File:** `lib/formats.ts`

Add your format to the `FILE_FORMATS` array:

```typescript
{
  id: 'newformat',
  name: 'New Format',
  extension: 'new',
  category: 'document', // or 'image', 'spreadsheet', 'presentation'
  mimeType: 'application/x-newformat',
  icon: '📄',
  description: 'Description of the format'
}
```

**Important:**
- Use lowercase `id` (e.g., `newformat`, not `NewFormat`)
- Use correct `category` (determines which converter is used)
- Use standard MIME type if available
- Choose appropriate icon emoji

## Step 2: Add Validation

**File:** Category-specific converter (e.g., `lib/converters/document.ts`)

Add magic bytes validation:

```typescript
export async function validateDocument(
  inputBuffer: Buffer,
  formatId: string
): Promise<boolean> {
  // ... existing validations ...
  
  if (formatId === 'newformat') {
    // Check magic bytes
    const header = inputBuffer.slice(0, 4).toString('hex')
    return header === '4e45574e' // Example magic bytes
  }
  
  return true
}
```

**Magic Bytes Resources:**
- [File Signatures Database](https://www.filesignatures.net/)
- [Wikipedia File Signatures](https://en.wikipedia.org/wiki/List_of_file_signatures)

## Step 3: Implement Conversion

**File:** Category-specific converter

### For Documents

**File:** `lib/converters/document.ts`

```typescript
export async function convertDocument(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  // ... existing conversions ...
  
  if (sourceFormat === 'newformat') {
    // Convert newformat to target
    if (targetFormat === 'pdf') {
      // Use LibreOffice or custom tool
      return await convertNewFormatToPdf(inputBuffer)
    } else if (targetFormat === 'docx') {
      return await convertNewFormatToDocx(inputBuffer)
    }
  }
  
  // Fallback to LibreOffice for unsupported targets
  return await convertWithLibreOffice(inputBuffer, sourceFormat, targetFormat)
}
```

### For Images

**File:** `lib/converters/image.ts`

```typescript
export async function convertImage(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string,
  options?: ImageConversionOptions
): Promise<Buffer> {
  // ... existing conversions ...
  
  if (sourceFormat === 'newformat') {
    // Use Sharp or custom tool
    const image = sharp(inputBuffer)
    return await image.toFormat(targetFormat).toBuffer()
  }
}
```

### For Spreadsheets

**File:** `lib/converters/spreadsheet.ts`

```typescript
export async function convertSpreadsheet(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  // ... existing conversions ...
  
  if (sourceFormat === 'newformat') {
    // Use xlsx, exceljs, or custom tool
    return await convertNewFormatSpreadsheet(inputBuffer, targetFormat)
  }
}
```

### For Presentations

**File:** `lib/converters/presentation.ts`

```typescript
export async function convertPresentation(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  // ... existing conversions ...
  
  if (sourceFormat === 'newformat') {
    // Use LibreOffice or custom tool
    return await convertNewFormatPresentation(inputBuffer, targetFormat)
  }
}
```

## Step 4: Update Conversion Matrix

**File:** `lib/conversion-rules.ts`

Add conversion rules:

```typescript
// In isConversionSupported function
if (sourceFormat === 'newformat') {
  // Define which target formats are supported
  const supportedTargets = ['pdf', 'docx', 'txt', 'html']
  return supportedTargets.includes(targetFormat)
}

// In getSupportedTargetFormatIds function
if (sourceFormat === 'newformat') {
  return ['pdf', 'docx', 'txt', 'html', ...]
}
```

**Conversion Complexity:**
- `1` = Simple (direct conversion, <5 seconds)
- `2` = Moderate (requires processing, 5-30 seconds)
- `3` = Complex (multiple steps, 30-120 seconds)
- `4` = Very Complex (specialized tools, 120+ seconds)

```typescript
// In getConversionComplexity function
if (sourceFormat === 'newformat' && targetFormat === 'pdf') {
  return 2 // Moderate complexity
}
```

## Step 5: Update Worker

**File:** `scripts/start-worker.ts`

The worker automatically routes to the correct converter based on format category. No changes needed unless you're adding a new category.

## Step 6: Testing

### Unit Tests

Create test file: `__tests__/converters/newformat.test.ts`

```typescript
import { convertDocument } from '@/lib/converters/document'
import { validateDocument } from '@/lib/converters/document'
import * as fs from 'fs'

describe('NewFormat Conversion', () => {
  it('should validate newformat file', async () => {
    const file = fs.readFileSync('test-fixtures/valid.newformat')
    const isValid = await validateDocument(file, 'newformat')
    expect(isValid).toBe(true)
  })
  
  it('should convert newformat to PDF', async () => {
    const file = fs.readFileSync('test-fixtures/valid.newformat')
    const result = await convertDocument(file, 'newformat', 'pdf')
    expect(result).toBeInstanceOf(Buffer)
    expect(result.length).toBeGreaterThan(0)
  })
})
```

### Manual Testing

1. Upload a test file in the new format
2. Try converting to supported target formats
3. Verify output quality and correctness
4. Test error handling (corrupted files, invalid formats)

## Step 7: Update Documentation

**Files to Update:**
- `docs/SUPPORTED_FORMATS.md` - Add format to list
- `README.md` - Update format count if needed
- `lib/format-constants.ts` - Update format counts

## Example: Adding a New Document Format

Let's add support for `.odt` (OpenDocument Text) format:

### 1. Register Format

```typescript
// lib/formats.ts
{ 
  id: 'odt', 
  name: 'OpenDocument Text', 
  extension: 'odt', 
  category: 'document', 
  mimeType: 'application/vnd.oasis.opendocument.text', 
  icon: '📄' 
}
```

### 2. Add Validation

```typescript
// lib/converters/document.ts
if (formatId === 'odt') {
  // ODT files are ZIP archives with specific structure
  const header = inputBuffer.slice(0, 2).toString('hex')
  return header === '504b' // ZIP magic bytes
}
```

### 3. Implement Conversion

```typescript
// lib/converters/document.ts
if (sourceFormat === 'odt') {
  // Use LibreOffice to convert ODT
  return await convertWithLibreOffice(inputBuffer, 'odt', targetFormat)
}
```

### 4. Update Conversion Matrix

```typescript
// lib/conversion-rules.ts
// ODT can convert to all document formats
if (sourceFormat === 'odt') {
  return DOCUMENT_FORMATS.includes(targetFormat)
}
```

## Common Conversion Tools

### Documents
- **LibreOffice:** `libreoffice --headless --convert-to {format} {file}`
- **Pandoc:** `pandoc {file} -o {output}`
- **Custom libraries:** `mammoth`, `pdf-lib`, `docx`

### Images
- **Sharp:** `sharp(inputBuffer).toFormat(format).toBuffer()`
- **ImageMagick:** CLI tool
- **Jimp:** JavaScript image processing

### Spreadsheets
- **xlsx:** `XLSX.read()` and `XLSX.write()`
- **exceljs:** Excel file manipulation
- **csv-parse/csv-stringify:** CSV handling

### Presentations
- **LibreOffice:** `libreoffice --headless --convert-to {format} {file}`
- **pptxgenjs:** Create PPTX files

## Troubleshooting

### Conversion Fails

1. Check magic bytes validation
2. Verify conversion tool is installed
3. Check file permissions
4. Review error logs

### Quality Issues

1. Adjust conversion options (quality, compression)
2. Try different conversion tools
3. Check source file quality

### Performance Issues

1. Optimize conversion complexity
2. Add caching for repeated conversions
3. Consider async processing for large files

## Best Practices

1. **Always validate:** Check magic bytes before processing
2. **Handle errors:** Provide clear error messages
3. **Test edge cases:** Empty files, corrupted files, large files
4. **Document complexity:** Set appropriate complexity levels
5. **Update matrix:** Ensure conversion matrix is accurate

---

**Last Updated:** 2025-12-15  
**Need help?** Contact the development team or open an issue.

