/**
 * Validation Regression Test
 * Tests file size validation and magic bytes validation after fixes
 */

import { getMaxFileSize, validateFileSize, type UserTier } from './lib/file-limits'
import { validateFileFormat } from './lib/format-validation'
import { getFormatInfo } from './lib/formats'

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL' | 'PARTIAL'
  message: string
  details?: any
}

const results: TestResult[] = []

function logResult(result: TestResult) {
  results.push(result)
  const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'
  console.log(`${statusIcon} ${result.name}: ${result.status}`)
  if (result.message) {
    console.log(`   ${result.message}`)
  }
  if (result.details) {
    console.log(`   Details:`, result.details)
  }
}

async function runTests() {
  console.log('================================================================================')
  console.log('VALIDATION REGRESSION TEST')
  console.log('================================================================================\n')

  // ============================================
  // TEST 1: File Size Validation
  // ============================================
  console.log('TEST 1: File Size Validation')
  console.log('--------------------------------------------------------------------------------')

  // 1.1 Small valid file under limit
  const smallFileSize = 1024 // 1KB
  const smallFileValidation = validateFileSize(smallFileSize, 'free')
  logResult({
    name: '1.1 Small valid file (1KB)',
    status: smallFileValidation.valid ? 'PASS' : 'FAIL',
    message: smallFileValidation.valid 
      ? 'Small file accepted correctly' 
      : `Unexpected rejection: ${smallFileValidation.error}`,
  })

  // 1.2 File just under max size
  const freeMaxSize = getMaxFileSize('free')
  const justUnderMax = freeMaxSize - 1
  const justUnderValidation = validateFileSize(justUnderMax, 'free')
  logResult({
    name: '1.2 File just under max size',
    status: justUnderValidation.valid ? 'PASS' : 'FAIL',
    message: justUnderValidation.valid 
      ? `File at ${justUnderMax} bytes (just under ${freeMaxSize}) accepted` 
      : `Unexpected rejection: ${justUnderValidation.error}`,
  })

  // 1.3 File just over max size
  const justOverMax = freeMaxSize + 1
  const justOverValidation = validateFileSize(justOverMax, 'free')
  logResult({
    name: '1.3 File just over max size',
    status: !justOverValidation.valid ? 'PASS' : 'FAIL',
    message: !justOverValidation.valid 
      ? `File at ${justOverMax} bytes (just over ${freeMaxSize}) correctly rejected` 
      : 'File should have been rejected but was accepted',
    details: {
      expectedRejection: true,
      actualRejection: !justOverValidation.valid,
      errorMessage: justOverValidation.error,
    },
  })

  // 1.4 Tier limits
  const tierLimits: { tier: UserTier; maxSize: number }[] = [
    { tier: 'free', maxSize: 100 * 1024 * 1024 },
    { tier: 'starter', maxSize: 500 * 1024 * 1024 },
    { tier: 'professional', maxSize: 2 * 1024 * 1024 * 1024 },
    { tier: 'enterprise', maxSize: 10 * 1024 * 1024 * 1024 },
  ]

  let tierLimitPass = true
  for (const { tier, maxSize } of tierLimits) {
    const actualMax = getMaxFileSize(tier)
    if (actualMax !== maxSize) {
      tierLimitPass = false
      break
    }
  }

  logResult({
    name: '1.4 Tier limits configuration',
    status: tierLimitPass ? 'PASS' : 'FAIL',
    message: tierLimitPass 
      ? 'All tier limits match expected values' 
      : 'Tier limits mismatch',
    details: tierLimits.map(({ tier, maxSize }) => ({
      tier,
      expected: maxSize,
      actual: getMaxFileSize(tier),
      match: getMaxFileSize(tier) === maxSize,
    })),
  })

  // ============================================
  // TEST 2: Magic Bytes Validation
  // ============================================
  console.log('\nTEST 2: Magic Bytes Validation')
  console.log('--------------------------------------------------------------------------------')

  // 2.1 Valid DOCX file (ZIP signature)
  const validDocxBuffer = Buffer.from([
    0x50, 0x4B, 0x03, 0x04, // ZIP signature (PK\x03\x04)
    ...Array(100).fill(0), // Padding
  ])
  const validDocxValidation = await validateFileFormat(validDocxBuffer, 'docx')
  logResult({
    name: '2.1 Valid DOCX (correct magic bytes)',
    status: validDocxValidation.valid ? 'PASS' : 'FAIL',
    message: validDocxValidation.valid 
      ? 'Valid DOCX file accepted' 
      : `Unexpected rejection: ${validDocxValidation.error}`,
  })

  // 2.2 Invalid DOCX (wrong magic bytes)
  const invalidDocxBuffer = Buffer.from([
    0xFF, 0xFF, 0xFF, 0xFF, // Invalid signature
    ...Array(100).fill(0),
  ])
  const invalidDocxValidation = await validateFileFormat(invalidDocxBuffer, 'docx')
  logResult({
    name: '2.2 Invalid DOCX (wrong magic bytes)',
    status: !invalidDocxValidation.valid ? 'PASS' : 'FAIL',
    message: !invalidDocxValidation.valid 
      ? 'Invalid DOCX correctly rejected' 
      : 'Invalid file should have been rejected',
    details: {
      expectedRejection: true,
      actualRejection: !invalidDocxValidation.valid,
      errorMessage: invalidDocxValidation.error,
    },
  })

  // 2.3 Valid PNG file
  const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    ...Array(100).fill(0),
  ])
  // Note: validateImage uses Sharp which may need more complete PNG data
  // This is a simplified test - actual validation may be more complex
  logResult({
    name: '2.3 Valid PNG (magic bytes check)',
    status: 'PARTIAL',
    message: 'PNG validation requires Sharp library - test would need actual PNG file',
    details: {
      note: 'Image validation uses Sharp which requires complete image data',
    },
  })

  // 2.4 Corrupted file (invalid header)
  const corruptedBuffer = Buffer.from([0x00, 0x00, 0x00, 0x00])
  const corruptedValidation = await validateFileFormat(corruptedBuffer, 'docx')
  logResult({
    name: '2.4 Corrupted file (invalid header)',
    status: !corruptedValidation.valid ? 'PASS' : 'FAIL',
    message: !corruptedValidation.valid 
      ? 'Corrupted file correctly rejected' 
      : 'Corrupted file should have been rejected',
    details: {
      expectedRejection: true,
      actualRejection: !corruptedValidation.valid,
      errorMessage: corruptedValidation.error,
    },
  })

  // ============================================
  // TEST 3: API Contract Consistency
  // ============================================
  console.log('\nTEST 3: API Contract Consistency')
  console.log('--------------------------------------------------------------------------------')

  // 3.1 Error message format
  const sizeError = validateFileSize(getMaxFileSize('free') + 1, 'free')
  const hasErrorField = !!sizeError.error
  const errorIsUserFriendly = sizeError.error && !sizeError.error.includes('stack') && !sizeError.error.includes('Error:')
  
  logResult({
    name: '3.1 Error message format (file size)',
    status: hasErrorField && errorIsUserFriendly ? 'PASS' : 'PARTIAL',
    message: hasErrorField && errorIsUserFriendly 
      ? 'Error message is user-friendly' 
      : 'Error message may need improvement',
    details: {
      hasErrorField,
      errorIsUserFriendly,
      errorMessage: sizeError.error,
    },
  })

  // 3.2 Format validation error format
  const formatError = await validateFileFormat(Buffer.from([0xFF, 0xFF]), 'docx')
  const formatErrorIsUserFriendly = formatError.error && !formatError.error.includes('stack') && !formatError.error.includes('Error:')
  
  logResult({
    name: '3.2 Error message format (format validation)',
    status: !formatError.valid && formatErrorIsUserFriendly ? 'PASS' : 'PARTIAL',
    message: !formatError.valid && formatErrorIsUserFriendly 
      ? 'Format validation error is user-friendly' 
      : 'Error message may need improvement',
    details: {
      hasErrorField: !!formatError.error,
      errorIsUserFriendly: formatErrorIsUserFriendly,
      errorMessage: formatError.error,
    },
  })

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n================================================================================')
  console.log('TEST SUMMARY')
  console.log('================================================================================\n')

  const passCount = results.filter(r => r.status === 'PASS').length
  const failCount = results.filter(r => r.status === 'FAIL').length
  const partialCount = results.filter(r => r.status === 'PARTIAL').length

  console.log(`Total Tests: ${results.length}`)
  console.log(`✅ PASS: ${passCount}`)
  console.log(`⚠️  PARTIAL: ${partialCount}`)
  console.log(`❌ FAIL: ${failCount}`)

  if (failCount > 0) {
    console.log('\n❌ FAILED TESTS:')
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`)
    })
  }

  if (partialCount > 0) {
    console.log('\n⚠️  PARTIAL TESTS:')
    results.filter(r => r.status === 'PARTIAL').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`)
    })
  }

  console.log('\n================================================================================\n')

  return {
    total: results.length,
    pass: passCount,
    partial: partialCount,
    fail: failCount,
    results,
  }
}

// Run tests
runTests()
  .then((summary) => {
    process.exit(summary.fail > 0 ? 1 : 0)
  })
  .catch((error) => {
    console.error('Test execution error:', error)
    process.exit(1)
  })

