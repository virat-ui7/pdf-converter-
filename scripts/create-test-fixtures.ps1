# Create Test Fixtures Script (PowerShell)
# Generates test files where possible, provides instructions for others

$ErrorActionPreference = "Stop"

$FIXTURES_DIR = "test-fixtures"
$VALID_DIR = "$FIXTURES_DIR\valid"
$INVALID_DIR = "$FIXTURES_DIR\invalid"
$TIER_LIMITS_DIR = "$FIXTURES_DIR\tier-limits"

# Create directories
New-Item -ItemType Directory -Force -Path $VALID_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $INVALID_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $TIER_LIMITS_DIR | Out-Null

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Creating Test Fixtures" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Create empty file
Write-Host "1. Creating empty-docx.docx..." -ForegroundColor Yellow
New-Item -ItemType File -Path "$INVALID_DIR\empty-docx.docx" -Force | Out-Null
Write-Host "   ✅ Created: $INVALID_DIR\empty-docx.docx (0 bytes)" -ForegroundColor Green

# 2. Create tiny text file
Write-Host "2. Creating tiny.txt..." -ForegroundColor Yellow
@"
This is a test file for FileConverter QA testing.
It contains minimal content to test small file conversions.
"@ | Out-File -FilePath "$VALID_DIR\tiny.txt" -Encoding UTF8
Write-Host "   ✅ Created: $VALID_DIR\tiny.txt (~100 bytes)" -ForegroundColor Green

# 3. Create corrupted DOCX (truncated)
Write-Host "3. Creating corrupted-docx.docx..." -ForegroundColor Yellow
try {
    # Create a minimal DOCX structure using ZIP
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $corruptedPath = "$INVALID_DIR\corrupted-docx.docx"
    
    # Create ZIP file (DOCX is a ZIP)
    $zip = [System.IO.Compression.ZipFile]::Open($corruptedPath, [System.IO.Compression.ZipArchiveMode]::Create)
    $entry = $zip.CreateEntry("[Content_Types].xml")
    $stream = $entry.Open()
    $bytes = [System.Text.Encoding]::UTF8.GetBytes('<?xml version="1.0"?><Types></Types>')
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
    $zip.Dispose()
    
    # Truncate to 100 bytes
    $file = [System.IO.File]::Open($corruptedPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Write)
    $file.SetLength(100)
    $file.Close()
    
    Write-Host "   ✅ Created: $corruptedPath (truncated to 100 bytes)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not create corrupted DOCX: $_" -ForegroundColor Yellow
    Write-Host "   Manual: Create any .docx, truncate to 100 bytes" -ForegroundColor Yellow
}

# 4. Create large CSV file (10MB)
Write-Host "4. Creating sample-10mb.csv..." -ForegroundColor Yellow
try {
    python scripts/generate-csv-fixture.py
    if (Test-Path "$VALID_DIR\sample-10mb.csv") {
        Write-Host "   ✅ Created: $VALID_DIR\sample-10mb.csv" -ForegroundColor Green
    } else {
        throw "Python script did not create file"
    }
} catch {
    Write-Host "   ⚠️  Python not available or failed: $_" -ForegroundColor Yellow
    Write-Host "   Manual: Run: python scripts/generate-csv-fixture.py" -ForegroundColor Yellow
}

# 5. Create SVG file (1MB)
Write-Host "5. Creating sample-1mb.svg..." -ForegroundColor Yellow
try {
    python scripts/generate-svg-fixture.py
    if (Test-Path "$VALID_DIR\sample-1mb.svg") {
        Write-Host "   ✅ Created: $VALID_DIR\sample-1mb.svg" -ForegroundColor Green
    } else {
        throw "Python script did not create file"
    }
} catch {
    Write-Host "   ⚠️  Python not available or failed: $_" -ForegroundColor Yellow
    Write-Host "   Manual: Run: python scripts/generate-svg-fixture.py" -ForegroundColor Yellow
}

# 6. Create huge file (101MB) for tier limit testing
Write-Host "6. Creating free-tier-limit.docx (101MB)..." -ForegroundColor Yellow
try {
    $size = 101 * 1024 * 1024  # 101MB
    $bytes = New-Object byte[] $size
    [System.IO.File]::WriteAllBytes("$TIER_LIMITS_DIR\free-tier-limit.docx", $bytes)
    Write-Host "   ✅ Created: $TIER_LIMITS_DIR\free-tier-limit.docx (101MB)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not create 101MB file: $_" -ForegroundColor Yellow
    Write-Host "   Manual: Use PowerShell: `$bytes = New-Object byte[] 105906176; [System.IO.File]::WriteAllBytes('$TIER_LIMITS_DIR\free-tier-limit.docx', `$bytes)" -ForegroundColor Yellow
}

# 7. Create 501MB file for starter tier
Write-Host "7. Creating starter-tier-limit.docx (501MB)..." -ForegroundColor Yellow
try {
    $size = 501 * 1024 * 1024  # 501MB
    $bytes = New-Object byte[] $size
    [System.IO.File]::WriteAllBytes("$TIER_LIMITS_DIR\starter-tier-limit.docx", $bytes)
    Write-Host "   ✅ Created: $TIER_LIMITS_DIR\starter-tier-limit.docx (501MB)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not create 501MB file (may take time): $_" -ForegroundColor Yellow
    Write-Host "   Manual: Create file just over 500MB" -ForegroundColor Yellow
}

# 8. Create 2.1GB file for pro tier (optional, very large)
Write-Host "8. Creating pro-tier-limit.docx (2.1GB)..." -ForegroundColor Yellow
Write-Host "   ⚠️  Skipping 2.1GB file (very large, optional for testing)" -ForegroundColor Yellow
Write-Host "   Manual: Create if needed (2150MB)" -ForegroundColor Yellow

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Files That Need Manual Creation" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The following files require specific software and must be created manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "VALID FILES:" -ForegroundColor Green
Write-Host "  1. sample-2mb.docx - Word document (2MB)" -ForegroundColor White
Write-Host "     → Open Word/LibreOffice, create 10 pages, save as .docx" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. sample-5mb.xlsx - Excel spreadsheet (5MB)" -ForegroundColor White
Write-Host "     → Open Excel/LibreOffice Calc, add 10,000+ rows, save as .xlsx" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. sample-10mb.pptx - PowerPoint (10MB)" -ForegroundColor White
Write-Host "     → Open PowerPoint/LibreOffice Impress, create 15 slides, save as .pptx" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. sample-20mb.png - PNG image (20MB)" -ForegroundColor White
Write-Host "     → Use ImageMagick or resize existing image to 4000x3000, save as PNG" -ForegroundColor Gray
Write-Host ""
Write-Host "  5. sample-15mb.jpg - JPEG image (15MB)" -ForegroundColor White
Write-Host "     → Resize photo to 3000x2000, save as JPG at 85% quality" -ForegroundColor Gray
Write-Host ""
Write-Host "  6. medium.pdf - PDF document (50MB)" -ForegroundColor White
Write-Host "     → Convert sample-2mb.docx to PDF, or download large PDF" -ForegroundColor Gray
Write-Host ""
Write-Host "INVALID FILES:" -ForegroundColor Red
Write-Host "  7. notreally-docx.docx - PNG with wrong extension" -ForegroundColor White
Write-Host "     → After creating sample-20mb.png, copy it and rename to notreally-docx.docx" -ForegroundColor Gray
Write-Host ""
Write-Host "See docs/FIXTURE_CREATION_GUIDE.md for detailed instructions." -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
$autoCreated = (Get-ChildItem -Path $FIXTURES_DIR -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike "*node_modules*" }).Count
Write-Host "Files created automatically: $autoCreated" -ForegroundColor White
Write-Host "Files needing manual creation: ~7" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Create remaining files manually (see above)" -ForegroundColor White
Write-Host "  2. Verify all files: bash scripts/verify-test-fixtures.sh" -ForegroundColor White
Write-Host "  3. Run tests: bash scripts/run-comprehensive-qa.sh" -ForegroundColor White
Write-Host ""

