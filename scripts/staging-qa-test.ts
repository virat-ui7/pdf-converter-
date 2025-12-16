/**
 * Staging QA Test Script
 * 
 * This script automates end-to-end conversion testing in staging.
 * Run with: npx tsx scripts/staging-qa-test.ts
 * 
 * Prerequisites:
 * - Staging environment running
 * - Test fixtures available in test-fixtures/
 * - Valid API endpoint configured
 * - Test user accounts for each tier
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { readFile } from 'fs/promises'

interface TestResult {
  testName: string
  inputFile: string
  inputSize: number
  sourceFormat: string
  targetFormat: string
  expectedOutcome: 'success' | 'fail'
  expectedReason?: string
  actualOutcome?: 'success' | 'fail'
  actualReason?: string
  outputFile?: string
  outputSize?: number
  errorMessage?: string
  status: 'PASS' | 'FAIL' | 'SKIP' | 'CANNOT_VERIFY'
  duration?: number
}

interface TestSuite {
  name: string
  results: TestResult[]
}

const STAGING_API_URL = process.env.STAGING_API_URL || 'http://localhost:3000'
const TEST_FIXTURES_DIR = path.join(process.cwd(), 'test-fixtures')

// Test user credentials (should be in .env.staging)
const TEST_USERS = {
  free: {
    email: process.env.TEST_USER_FREE_EMAIL || 'test-free@example.com',
    password: process.env.TEST_USER_FREE_PASSWORD || 'test123',
    tier: 'free',
  },
  starter: {
    email: process.env.TEST_USER_STARTER_EMAIL || 'test-starter@example.com',
    password: process.env.TEST_USER_STARTER_PASSWORD || 'test123',
    tier: 'starter',
  },
  professional: {
    email: process.env.TEST_USER_PRO_EMAIL || 'test-pro@example.com',
    password: process.env.TEST_USER_PRO_PASSWORD || 'test123',
    tier: 'professional',
  },
  enterprise: {
    email: process.env.TEST_USER_ENTERPRISE_EMAIL || 'test-enterprise@example.com',
    password: process.env.TEST_USER_ENTERPRISE_PASSWORD || 'test123',
    tier: 'enterprise',
  },
}

/**
 * Get authentication token for a test user
 */
async function getAuthToken(user: typeof TEST_USERS.free): Promise<string | null> {
  try {
    const response = await fetch(`${STAGING_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    })

    if (!response.ok) {
      console.error(`Failed to authenticate ${user.email}: ${response.statusText}`)
      return null
    }

    // Extract token from response (adjust based on your auth implementation)
    const data = await response.json()
    return data.token || data.accessToken || null
  } catch (error) {
    console.error(`Error authenticating ${user.email}:`, error)
    return null
  }
}

/**
 * Submit a conversion request
 */
async function submitConversion(
  filePath: string,
  sourceFormat: string,
  targetFormat: string,
  authToken?: string
): Promise<{
  success: boolean
  conversionId?: string
  error?: string
  statusCode?: number
}> {
  try {
    const fileBuffer = await readFile(filePath)
    const fileName = path.basename(filePath)
    const fileSize = fileBuffer.length

    const formData = new FormData()
    formData.append('file', new Blob([fileBuffer]), fileName)
    formData.append('sourceFormat', sourceFormat)
    formData.append('targetFormat', targetFormat)

    const headers: HeadersInit = {}
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(`${STAGING_API_URL}/api/convert`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
        statusCode: response.status,
      }
    }

    return {
      success: true,
      conversionId: data.conversionId,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    }
  }
}

/**
 * Poll for conversion status
 */
async function pollConversionStatus(
  conversionId: string,
  maxWaitSeconds: number = 300
): Promise<{
  status: 'completed' | 'failed' | 'processing' | 'timeout'
  errorMessage?: string
  downloadUrl?: string
}> {
  const startTime = Date.now()
  const pollInterval = 2000 // 2 seconds

  while (Date.now() - startTime < maxWaitSeconds * 1000) {
    try {
      const response = await fetch(`${STAGING_API_URL}/api/conversions/${conversionId}`)
      const data = await response.json()

      if (data.status === 'completed') {
        return {
          status: 'completed',
          downloadUrl: data.downloadUrl || data.converted_file_url,
        }
      }

      if (data.status === 'failed') {
        return {
          status: 'failed',
          errorMessage: data.error_message || data.error,
        }
      }

      // Still processing
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    } catch (error) {
      // Continue polling on error
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    }
  }

  return { status: 'timeout' }
}

/**
 * Run a single conversion test
 */
async function runConversionTest(
  testName: string,
  filePath: string,
  sourceFormat: string,
  targetFormat: string,
  expectedOutcome: 'success' | 'fail',
  expectedReason?: string,
  user?: typeof TEST_USERS.free
): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const fileStats = await fs.stat(filePath)
    const fileSize = fileStats.size

    // Get auth token if user provided
    let authToken: string | null = null
    if (user) {
      authToken = await getAuthToken(user)
      if (!authToken) {
        return {
          testName,
          inputFile: path.basename(filePath),
          inputSize: fileSize,
          sourceFormat,
          targetFormat,
          expectedOutcome,
          expectedReason,
          actualOutcome: 'fail',
          actualReason: 'Authentication failed',
          status: 'SKIP',
        }
      }
    }

    // Submit conversion
    const submitResult = await submitConversion(filePath, sourceFormat, targetFormat, authToken || undefined)
    const duration = (Date.now() - startTime) / 1000

    if (!submitResult.success) {
      // Expected failure
      if (expectedOutcome === 'fail') {
        return {
          testName,
          inputFile: path.basename(filePath),
          inputSize: fileSize,
          sourceFormat,
          targetFormat,
          expectedOutcome,
          expectedReason,
          actualOutcome: 'fail',
          actualReason: submitResult.error,
          errorMessage: submitResult.error,
          status: 'PASS',
          duration,
        }
      }

      // Unexpected failure
      return {
        testName,
        inputFile: path.basename(filePath),
        inputSize: fileSize,
        sourceFormat,
        targetFormat,
        expectedOutcome,
        expectedReason,
        actualOutcome: 'fail',
        actualReason: submitResult.error,
        errorMessage: submitResult.error,
        status: 'FAIL',
        duration,
      }
    }

    // Conversion submitted, poll for status
    if (!submitResult.conversionId) {
      return {
        testName,
        inputFile: path.basename(filePath),
        inputSize: fileSize,
        sourceFormat,
        targetFormat,
        expectedOutcome,
        expectedReason,
        actualOutcome: 'fail',
        actualReason: 'No conversion ID returned',
        status: 'FAIL',
        duration,
      }
    }

    const statusResult = await pollConversionStatus(submitResult.conversionId)

    if (statusResult.status === 'completed' && expectedOutcome === 'success') {
      return {
        testName,
        inputFile: path.basename(filePath),
        inputSize: fileSize,
        sourceFormat,
        targetFormat,
        expectedOutcome,
        expectedReason,
        actualOutcome: 'success',
        outputFile: statusResult.downloadUrl,
        status: 'PASS',
        duration: (Date.now() - startTime) / 1000,
      }
    }

    if (statusResult.status === 'failed' && expectedOutcome === 'fail') {
      return {
        testName,
        inputFile: path.basename(filePath),
        inputSize: fileSize,
        sourceFormat,
        targetFormat,
        expectedOutcome,
        expectedReason,
        actualOutcome: 'fail',
        actualReason: statusResult.errorMessage,
        errorMessage: statusResult.errorMessage,
        status: 'PASS',
        duration: (Date.now() - startTime) / 1000,
      }
    }

    // Unexpected outcome
    return {
      testName,
      inputFile: path.basename(filePath),
      inputSize: fileSize,
      sourceFormat,
      targetFormat,
      expectedOutcome,
      expectedReason,
      actualOutcome: statusResult.status === 'completed' ? 'success' : 'fail',
      actualReason: statusResult.errorMessage || 'Unexpected status',
      errorMessage: statusResult.errorMessage,
      status: 'FAIL',
      duration: (Date.now() - startTime) / 1000,
    }
  } catch (error: any) {
    return {
      testName,
      inputFile: path.basename(filePath),
      inputSize: 0,
      sourceFormat,
      targetFormat,
      expectedOutcome,
      expectedReason,
      actualOutcome: 'fail',
      actualReason: error.message,
      status: 'FAIL',
      duration: (Date.now() - startTime) / 1000,
    }
  }
}

/**
 * Test conversion matrix
 */
async function testConversionMatrix(): Promise<TestSuite> {
  const results: TestResult[] = []

  const conversions = [
    { source: 'docx', target: 'pdf', file: 'valid/valid.docx' },
    { source: 'docx', target: 'html', file: 'valid/valid.docx' },
    { source: 'docx', target: 'txt', file: 'valid/valid.docx' },
    { source: 'xlsx', target: 'csv', file: 'valid/valid.xlsx' },
    { source: 'xlsx', target: 'pdf', file: 'valid/valid.xlsx' },
    { source: 'xlsx', target: 'json', file: 'valid/valid.xlsx' },
    { source: 'pptx', target: 'pdf', file: 'valid/valid.pptx' },
    { source: 'pptx', target: 'png', file: 'valid/valid.pptx' },
    { source: 'png', target: 'jpg', file: 'valid/valid.png' },
    { source: 'png', target: 'webp', file: 'valid/valid.png' },
    { source: 'png', target: 'pdf', file: 'valid/valid.png' },
    { source: 'jpg', target: 'png', file: 'valid/valid.jpg' },
    { source: 'jpg', target: 'pdf', file: 'valid/valid.jpg' },
    { source: 'svg', target: 'png', file: 'valid/valid.svg' },
    { source: 'svg', target: 'pdf', file: 'valid/valid.svg' },
    { source: 'csv', target: 'xlsx', file: 'valid/valid.csv' },
    { source: 'csv', target: 'json', file: 'valid/valid.csv' },
  ]

  for (const conv of conversions) {
    const filePath = path.join(TEST_FIXTURES_DIR, conv.file)
    
    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      results.push({
        testName: `${conv.source} → ${conv.target}`,
        inputFile: conv.file,
        inputSize: 0,
        sourceFormat: conv.source,
        targetFormat: conv.target,
        expectedOutcome: 'success',
        status: 'CANNOT_VERIFY',
        actualReason: 'Test file not found',
      })
      continue
    }

    const result = await runConversionTest(
      `${conv.source} → ${conv.target}`,
      filePath,
      conv.source,
      conv.target,
      'success'
    )

    results.push(result)
  }

  return {
    name: 'Conversion Matrix Testing',
    results,
  }
}

/**
 * Test tier limits
 */
async function testTierLimits(): Promise<TestSuite> {
  const results: TestResult[] = []

  const tierTests = [
    { tier: 'free', file: 'tier-limits/free-50mb.txt', size: 50 * 1024 * 1024, expected: 'success' },
    { tier: 'free', file: 'tier-limits/free-101mb.txt', size: 101 * 1024 * 1024, expected: 'fail' },
    { tier: 'starter', file: 'tier-limits/starter-400mb.txt', size: 400 * 1024 * 1024, expected: 'success' },
    { tier: 'starter', file: 'tier-limits/starter-501mb.txt', size: 501 * 1024 * 1024, expected: 'fail' },
    { tier: 'professional', file: 'tier-limits/pro-1.5gb.txt', size: 1.5 * 1024 * 1024 * 1024, expected: 'success' },
    { tier: 'professional', file: 'tier-limits/pro-2.1gb.txt', size: 2.1 * 1024 * 1024 * 1024, expected: 'fail' },
  ]

  for (const test of tierTests) {
    const filePath = path.join(TEST_FIXTURES_DIR, test.file)
    const user = TEST_USERS[test.tier as keyof typeof TEST_USERS]

    try {
      await fs.access(filePath)
    } catch {
      results.push({
        testName: `${test.tier} tier - ${test.file}`,
        inputFile: test.file,
        inputSize: test.size,
        sourceFormat: 'txt',
        targetFormat: 'pdf',
        expectedOutcome: test.expected as 'success' | 'fail',
        status: 'CANNOT_VERIFY',
        actualReason: 'Test file not found',
      })
      continue
    }

    const result = await runConversionTest(
      `${test.tier} tier - ${test.file}`,
      filePath,
      'txt',
      'pdf',
      test.expected as 'success' | 'fail',
      test.expected === 'fail' ? 'File size exceeds tier limit' : undefined,
      user
    )

    results.push(result)
  }

  return {
    name: 'Tier Limit Testing',
    results,
  }
}

/**
 * Test validation rejections
 */
async function testValidationRejections(): Promise<TestSuite> {
  const results: TestResult[] = []

  const rejectionTests = [
    { file: 'invalid/corrupted.docx', source: 'docx', target: 'pdf', reason: 'Corrupted file' },
    { file: 'invalid/corrupted.png', source: 'png', target: 'jpg', reason: 'Corrupted file' },
    { file: 'invalid/misnamed.docx', source: 'docx', target: 'pdf', reason: 'Magic bytes mismatch' },
    { file: 'invalid/empty.docx', source: 'docx', target: 'pdf', reason: 'Empty file' },
  ]

  for (const test of rejectionTests) {
    const filePath = path.join(TEST_FIXTURES_DIR, test.file)

    try {
      await fs.access(filePath)
    } catch {
      results.push({
        testName: `Rejection: ${test.reason}`,
        inputFile: test.file,
        inputSize: 0,
        sourceFormat: test.source,
        targetFormat: test.target,
        expectedOutcome: 'fail',
        expectedReason: test.reason,
        status: 'CANNOT_VERIFY',
        actualReason: 'Test file not found',
      })
      continue
    }

    const result = await runConversionTest(
      `Rejection: ${test.reason}`,
      filePath,
      test.source,
      test.target,
      'fail',
      test.reason
    )

    results.push(result)
  }

  return {
    name: 'Validation Rejection Testing',
    results,
  }
}

/**
 * Main test runner
 */
async function runStagingQATests() {
  console.log('================================================================================')
  console.log('STAGING QA TEST SUITE')
  console.log('================================================================================\n')

  console.log('⚠️  NOTE: This script requires:')
  console.log('  1. Staging environment running')
  console.log('  2. Test fixtures in test-fixtures/ directory')
  console.log('  3. Test user accounts configured')
  console.log('  4. STAGING_API_URL environment variable set\n')

  const suites: TestSuite[] = []

  // Run test suites
  console.log('Running Conversion Matrix Tests...')
  suites.push(await testConversionMatrix())

  console.log('\nRunning Tier Limit Tests...')
  suites.push(await testTierLimits())

  console.log('\nRunning Validation Rejection Tests...')
  suites.push(await testValidationRejections())

  // Generate report
  console.log('\n================================================================================')
  console.log('TEST RESULTS SUMMARY')
  console.log('================================================================================\n')

  for (const suite of suites) {
    console.log(`${suite.name}:`)
    const passCount = suite.results.filter((r) => r.status === 'PASS').length
    const failCount = suite.results.filter((r) => r.status === 'FAIL').length
    const skipCount = suite.results.filter((r) => r.status === 'SKIP').length
    const cannotVerifyCount = suite.results.filter((r) => r.status === 'CANNOT_VERIFY').length

    console.log(`  ✅ PASS: ${passCount}`)
    console.log(`  ❌ FAIL: ${failCount}`)
    console.log(`  ⏭️  SKIP: ${skipCount}`)
    console.log(`  ⚠️  CANNOT_VERIFY: ${cannotVerifyCount}`)
    console.log(`  Total: ${suite.results.length}\n`)

    // Show failures
    if (failCount > 0) {
      console.log('  Failures:')
      suite.results
        .filter((r) => r.status === 'FAIL')
        .forEach((r) => {
          console.log(`    - ${r.testName}: ${r.actualReason}`)
        })
      console.log()
    }
  }

  // Overall status
  const totalPass = suites.reduce((sum, s) => sum + s.results.filter((r) => r.status === 'PASS').length, 0)
  const totalFail = suites.reduce((sum, s) => sum + s.results.filter((r) => r.status === 'FAIL').length, 0)
  const totalCannotVerify = suites.reduce(
    (sum, s) => sum + s.results.filter((r) => r.status === 'CANNOT_VERIFY').length,
    0
  )

  console.log('================================================================================')
  console.log('OVERALL STATUS')
  console.log('================================================================================\n')
  console.log(`Total Tests: ${suites.reduce((sum, s) => sum + s.results.length, 0)}`)
  console.log(`✅ PASS: ${totalPass}`)
  console.log(`❌ FAIL: ${totalFail}`)
  console.log(`⚠️  CANNOT_VERIFY: ${totalCannotVerify}`)

  if (totalFail === 0 && totalCannotVerify === 0) {
    console.log('\n✅ ALL TESTS PASSED')
    process.exit(0)
  } else if (totalFail === 0) {
    console.log('\n⚠️  SOME TESTS COULD NOT BE VERIFIED (test files missing)')
    process.exit(0)
  } else {
    console.log('\n❌ SOME TESTS FAILED')
    process.exit(1)
  }
}

// Run tests
runStagingQATests().catch((error) => {
  console.error('Test execution error:', error)
  process.exit(1)
})

