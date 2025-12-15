#!/usr/bin/env node

/**
 * Generate a secure random secret for NextAuth.js
 * Usage: node scripts/generate-secret.js
 */

const crypto = require('crypto')

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64')
}

const secret = generateSecret()

console.log('\n✅ NextAuth Secret Generated:')
console.log('─'.repeat(50))
console.log(secret)
console.log('─'.repeat(50))
console.log('\n📋 Copy this value to your .env.local file:')
console.log(`NEXTAUTH_SECRET=${secret}\n`)

