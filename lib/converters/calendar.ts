/**
 * Calendar Format Converter
 * Converts calendar formats (ICS, VCS, VCF)
 */

import ICAL from 'ical.js'
import vcard from 'vcard'

/**
 * Convert ICS to VCS
 */
export async function convertICSToVCS(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const icsText = inputBuffer.toString('utf-8')
    const jcalData = ICAL.parse(icsText)
    const comp = new ICAL.Component(jcalData)
    
    // Convert to VCS format (similar to ICS but with different headers)
    // For Phase 3, we'll do a basic conversion
    // VCS is essentially ICS with different MIME type
    const vcsText = icsText.replace(/BEGIN:VCALENDAR/g, 'BEGIN:VCALENDAR')
                           .replace(/VERSION:2.0/g, 'VERSION:1.0')
    
    return Buffer.from(vcsText, 'utf-8')
  } catch (error: any) {
    throw new Error(`ICS to VCS conversion failed: ${error.message}`)
  }
}

/**
 * Convert VCS to ICS
 */
export async function convertVCSToICS(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const vcsText = inputBuffer.toString('utf-8')
    // VCS to ICS is similar - just update version header
    const icsText = vcsText.replace(/VERSION:1.0/g, 'VERSION:2.0')
    
    return Buffer.from(icsText, 'utf-8')
  } catch (error: any) {
    throw new Error(`VCS to ICS conversion failed: ${error.message}`)
  }
}

/**
 * Convert VCF to CSV
 */
export async function convertVCFToCSV(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const vcfText = inputBuffer.toString('utf-8')
    const card = vcard.parse(vcfText)
    
    // Convert to CSV format
    const csvRows = ['Name,Email,Phone,Organization']
    const row = [
      card.get('fn') || '',
      card.get('email') || '',
      card.get('tel') || '',
      card.get('org') || '',
    ].map(field => `"${field.replace(/"/g, '""')}"`).join(',')
    csvRows.push(row)
    
    return Buffer.from(csvRows.join('\n'), 'utf-8')
  } catch (error: any) {
    throw new Error(`VCF to CSV conversion failed: ${error.message}`)
  }
}

/**
 * Convert VCF to JSON
 */
export async function convertVCFToJSON(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const vcfText = inputBuffer.toString('utf-8')
    const card = vcard.parse(vcfText)
    
    // Convert to JSON
    const jsonData = {
      name: card.get('fn') || '',
      email: card.get('email') || '',
      phone: card.get('tel') || '',
      organization: card.get('org') || '',
      address: card.get('adr') || '',
    }
    
    return Buffer.from(JSON.stringify(jsonData, null, 2), 'utf-8')
  } catch (error: any) {
    throw new Error(`VCF to JSON conversion failed: ${error.message}`)
  }
}

/**
 * Validate calendar file
 */
export async function validateCalendar(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()
  const text = inputBuffer.toString('utf-8')

  try {
    if (normalizedFormat === 'ics' || normalizedFormat === 'vcs') {
      return text.includes('BEGIN:VCALENDAR') && text.includes('END:VCALENDAR')
    } else if (normalizedFormat === 'vcf') {
      return text.includes('BEGIN:VCARD') && text.includes('END:VCARD')
    }
    return false
  } catch {
    return false
  }
}

