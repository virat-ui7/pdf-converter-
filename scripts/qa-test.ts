/**
 * QA Test Script for File Converter Platform
 * Systematically verifies format registry, conversion routing, and edge cases
 */

import { FILE_FORMATS, getFormatInfo, type FormatCategory } from '../lib/formats'
import { isConversionSupported, getSupportedTargetFormatIds, getConversionComplexity } from '../lib/conversion-rules'
import { getFormatByExtension } from '../lib/formats'

// Test 1: Format Registry & Coverage
console.log('='.repeat(80))
console.log('TEST 1: Format Registry & Coverage')
console.log('='.repeat(80))

const documentFormats = FILE_FORMATS.filter(f => f.category === 'document')
const spreadsheetFormats = FILE_FORMATS.filter(f => f.category === 'spreadsheet')
const presentationFormats = FILE_FORMATS.filter(f => f.category === 'presentation')
const imageFormats = FILE_FORMATS.filter(f => f.category === 'image')

console.log(`Document formats: ${documentFormats.length} (expected: 43)`)
console.log(`Spreadsheet formats: ${spreadsheetFormats.length} (expected: 17)`)
console.log(`Presentation formats: ${presentationFormats.length} (expected: 7)`)
console.log(`Image formats: ${imageFormats.length} (expected: 50)`)
console.log(`Total formats: ${FILE_FORMATS.length} (expected: 117)`)

const formatCountPass = 
  documentFormats.length === 43 &&
  spreadsheetFormats.length === 17 &&
  presentationFormats.length === 7 &&
  imageFormats.length === 50 &&
  FILE_FORMATS.length === 117

console.log(`Format count test: ${formatCountPass ? 'PASS' : 'FAIL'}`)

  if (!formatCountPass) {
    console.log('\nDiscrepancies:')
    if (documentFormats.length !== 43) console.log(`  Documents: expected 43, got ${documentFormats.length}`)
    if (spreadsheetFormats.length !== 17) console.log(`  Spreadsheets: expected 17, got ${spreadsheetFormats.length}`)
    if (presentationFormats.length !== 7) console.log(`  Presentations: expected 7, got ${presentationFormats.length}`)
    if (imageFormats.length !== 50) console.log(`  Images: expected 50, got ${imageFormats.length}`)
    if (FILE_FORMATS.length !== 117) console.log(`  Total: expected 117, got ${FILE_FORMATS.length}`)
  }

// Count total conversion pairs
let totalConversions = 0
for (const source of FILE_FORMATS) {
  const targets = getSupportedTargetFormatIds(source.id)
  totalConversions += targets.length
}

console.log(`\nTotal conversion pairs: ${totalConversions} (expected: 357+)`)
console.log(`Conversion count test: ${totalConversions >= 357 ? 'PASS' : 'FAIL'}`)

// Test 2: Core Conversion Routing
console.log('\n' + '='.repeat(80))
console.log('TEST 2: Core Conversion Routing')
console.log('='.repeat(80))

const routingTests = [
  { source: 'docx', target: 'pdf', expected: true },
  { source: 'docx', target: 'html', expected: true },
  { source: 'docx', target: 'txt', expected: true },
  { source: 'xlsx', target: 'csv', expected: true },
  { source: 'xlsx', target: 'pdf', expected: true },
  { source: 'pptx', target: 'pdf', expected: true },
  { source: 'pptx', target: 'png', expected: true },
  { source: 'png', target: 'jpg', expected: true },
  { source: 'png', target: 'webp', expected: true },
  { source: 'jpg', target: 'pdf', expected: true },
  { source: 'svg', target: 'png', expected: true },
  { source: 'csv', target: 'xlsx', expected: true },
]

let routingPassCount = 0
for (const test of routingTests) {
  const supported = isConversionSupported(test.source, test.target)
  const sourceInfo = getFormatInfo(test.source)
  const targetInfo = getFormatInfo(test.target)
  const complexity = getConversionComplexity(test.source, test.target)
  
  const pass = supported === test.expected
  if (pass) routingPassCount++
  
  console.log(`${test.source} → ${test.target}: ${supported ? 'SUPPORTED' : 'NOT SUPPORTED'} (expected: ${test.expected ? 'SUPPORTED' : 'NOT SUPPORTED'}) [Complexity: ${complexity}] ${pass ? '✓' : '✗'}`)
  
  if (sourceInfo && targetInfo) {
    console.log(`  Source MIME: ${sourceInfo.mimeType}, Target MIME: ${targetInfo.mimeType}`)
  }
}

console.log(`\nRouting test: ${routingPassCount}/${routingTests.length} passed`)

// Test 3: Edge Case Input Handling - Unsupported Conversions
console.log('\n' + '='.repeat(80))
console.log('TEST 3: Edge Case - Unsupported Conversions')
console.log('='.repeat(80))

const unsupportedTests = [
  { source: 'ani', target: 'docx', expected: false },
  { source: 'raw', target: 'docx', expected: false },
  { source: 'dng', target: 'docx', expected: false },
]

let unsupportedPassCount = 0
for (const test of unsupportedTests) {
  const supported = isConversionSupported(test.source, test.target)
  const pass = supported === test.expected
  if (pass) unsupportedPassCount++
  
  console.log(`${test.source} → ${test.target}: ${supported ? 'SUPPORTED' : 'NOT SUPPORTED'} (expected: NOT SUPPORTED) ${pass ? '✓' : '✗'}`)
}

console.log(`\nUnsupported conversion test: ${unsupportedPassCount}/${unsupportedTests.length} passed`)

// Test 4: Same Format Conversion (should be rejected)
console.log('\n' + '='.repeat(80))
console.log('TEST 4: Same Format Conversion (Should be Rejected)')
console.log('='.repeat(80))

const sameFormatTests = ['docx', 'pdf', 'xlsx', 'png', 'jpg']
let sameFormatPassCount = 0

for (const format of sameFormatTests) {
  const supported = isConversionSupported(format, format)
  const pass = !supported // Should be false
  if (pass) sameFormatPassCount++
  
  console.log(`${format} → ${format}: ${supported ? 'SUPPORTED' : 'NOT SUPPORTED'} (expected: NOT SUPPORTED) ${pass ? '✓' : '✗'}`)
}

console.log(`\nSame format test: ${sameFormatPassCount}/${sameFormatTests.length} passed`)

// Test 5: Format Detection by Extension
console.log('\n' + '='.repeat(80))
console.log('TEST 5: Format Detection by Extension')
console.log('='.repeat(80))

const extensionTests = [
  { ext: 'docx', expected: 'docx' },
  { ext: '.docx', expected: 'docx' },
  { ext: 'PDF', expected: 'pdf' },
  { ext: 'xlsx', expected: 'xlsx' },
  { ext: 'png', expected: 'png' },
  { ext: 'jpeg', expected: 'jpeg' },
  { ext: 'jpg', expected: 'jpg' },
]

let extensionPassCount = 0
for (const test of extensionTests) {
  const format = getFormatByExtension(test.ext)
  const pass = format?.id === test.expected
  if (pass) extensionPassCount++
  
  console.log(`Extension "${test.ext}": ${format?.id || 'NOT FOUND'} (expected: ${test.expected}) ${pass ? '✓' : '✗'}`)
}

console.log(`\nExtension detection test: ${extensionPassCount}/${extensionTests.length} passed`)

// Summary
console.log('\n' + '='.repeat(80))
console.log('QA TEST SUMMARY')
console.log('='.repeat(80))
console.log(`Format Registry: ${formatCountPass ? 'PASS' : 'FAIL'}`)
console.log(`Conversion Count: ${totalConversions >= 357 ? 'PASS' : 'FAIL'} (${totalConversions} pairs)`)
console.log(`Routing Tests: ${routingPassCount}/${routingTests.length} passed`)
console.log(`Unsupported Tests: ${unsupportedPassCount}/${unsupportedTests.length} passed`)
console.log(`Same Format Tests: ${sameFormatPassCount}/${sameFormatTests.length} passed`)
console.log(`Extension Detection: ${extensionPassCount}/${extensionTests.length} passed`)

const overallPass = formatCountPass && 
                   totalConversions >= 357 && 
                   routingPassCount === routingTests.length &&
                   unsupportedPassCount === unsupportedTests.length &&
                   sameFormatPassCount === sameFormatTests.length &&
                   extensionPassCount === extensionTests.length

console.log(`\nOverall: ${overallPass ? 'PASS' : 'FAIL'}`)
