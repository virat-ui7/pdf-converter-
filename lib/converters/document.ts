import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import { PDFDocument } from 'pdf-lib'

const execAsync = promisify(exec)

/**
 * Document Conversion using LibreOffice (headless mode)
 * Note: LibreOffice must be installed on the server
 */
export interface DocumentConversionOptions {
  quality?: number
  pageRange?: string
}

/**
 * Convert document using specialized libraries or LibreOffice
 * Supported: DOCX, DOC, ODT, RTF, TXT, HTML -> PDF, DOCX, TXT, etc.
 */
export async function convertDocument(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string,
  options: DocumentConversionOptions = {}
): Promise<Buffer> {
  const normalizedSource = sourceFormat.toLowerCase()
  const normalizedTarget = targetFormat.toLowerCase()

  // Handle same format
  if (normalizedSource === normalizedTarget) {
    return inputBuffer
  }

  // Handle extended Office formats (DOCM, DOT, DOTX, DOTM) - treat like DOCX
  const docxVariants = ['docx', 'docm', 'dot', 'dotx', 'dotm']
  const isDocxVariant = docxVariants.includes(normalizedSource)

  // Use specialized libraries for better quality when possible
  // DOCX (and variants) to HTML/TXT using mammoth
  if (isDocxVariant && (normalizedTarget === 'html' || normalizedTarget === 'htm')) {
    try {
      const result = await mammoth.convertToHtml({ buffer: inputBuffer })
      return Buffer.from(result.value, 'utf-8')
    } catch (error: any) {
      // Fallback to LibreOffice if mammoth fails
      console.warn('Mammoth conversion failed, falling back to LibreOffice:', error.message)
    }
  }

  if (isDocxVariant && normalizedTarget === 'txt') {
    try {
      const result = await mammoth.extractRawText({ buffer: inputBuffer })
      return Buffer.from(result.value, 'utf-8')
    } catch (error: any) {
      // Fallback to LibreOffice if mammoth fails
      console.warn('Mammoth text extraction failed, falling back to LibreOffice:', error.message)
    }
  }

  // PDF to TXT using pdf-parse
  if (normalizedSource === 'pdf' && normalizedTarget === 'txt') {
    try {
      const data = await pdfParse(inputBuffer)
      return Buffer.from(data.text, 'utf-8')
    } catch (error: any) {
      // Fallback to LibreOffice if pdf-parse fails
      console.warn('PDF parse failed, falling back to LibreOffice:', error.message)
    }
  }

  // HTML/HTM/XHTML conversions - handle as HTML
  const htmlVariants = ['html', 'htm', 'xhtml']
  const isHtmlVariant = htmlVariants.includes(normalizedSource)
  
  if (isHtmlVariant && normalizedTarget === 'pdf') {
    // For Phase 1, use LibreOffice for HTML to PDF
    // In future phases, could use puppeteer for better rendering
  }

  // Handle MHTML/MHT - these are email-like formats
  if ((normalizedSource === 'mhtml' || normalizedSource === 'mht') && 
      (normalizedTarget === 'html' || normalizedTarget === 'htm' || normalizedTarget === 'pdf')) {
    // MHTML is essentially HTML wrapped in MIME, use LibreOffice
  }

  // Handle Markdown conversions
  if (normalizedSource === 'md' && normalizedTarget === 'html') {
    // Markdown to HTML - could use a markdown library, but LibreOffice works too
  }

  // Handle data format conversions (JSON, XML, YAML)
  const dataFormats = ['json', 'xml', 'yaml', 'yml']
  const isDataFormat = dataFormats.includes(normalizedSource)
  
  if (isDataFormat) {
    // Data formats can convert to TXT, CSV, or each other
    if (normalizedTarget === 'txt') {
      // Just return as text
      return inputBuffer
    }
    
    // JSON <-> XML conversions
    if (normalizedSource === 'json' && normalizedTarget === 'xml') {
      const { parseString } = await import('xml2js')
      const jsonData = JSON.parse(inputBuffer.toString('utf-8'))
      const builder = new (await import('xml2js')).Builder()
      const xml = builder.buildObject(jsonData)
      return Buffer.from(xml, 'utf-8')
    }
    
    if (normalizedSource === 'xml' && normalizedTarget === 'json') {
      const { parseString } = await import('xml2js')
      const xmlText = inputBuffer.toString('utf-8')
      const result = await new Promise((resolve, reject) => {
        parseString(xmlText, (err: any, result: any) => {
          if (err) reject(err)
          else resolve(result)
        })
      })
      return Buffer.from(JSON.stringify(result, null, 2), 'utf-8')
    }
    
    // JSON <-> YAML conversions
    if ((normalizedSource === 'json' && (normalizedTarget === 'yaml' || normalizedTarget === 'yml')) ||
        ((normalizedSource === 'yaml' || normalizedSource === 'yml') && normalizedTarget === 'json')) {
      const yaml = await import('js-yaml')
      if (normalizedSource === 'json') {
        const jsonData = JSON.parse(inputBuffer.toString('utf-8'))
        const yamlText = yaml.dump(jsonData)
        return Buffer.from(yamlText, 'utf-8')
      } else {
        const yamlText = inputBuffer.toString('utf-8')
        const jsonData = yaml.load(yamlText)
        return Buffer.from(JSON.stringify(jsonData, null, 2), 'utf-8')
      }
    }
    
    // Data format to CSV (basic implementation)
    if (normalizedTarget === 'csv') {
      // For now, use LibreOffice or return as TXT
      // In future, could implement proper CSV conversion
    }
  }

  // Use LibreOffice for all other conversions
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-'))
  const inputPath = path.join(tempDir, `input.${normalizedSource}`)
  const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

  try {
    // Write input file
    await fs.writeFile(inputPath, inputBuffer)

    // Determine LibreOffice output format
    const outputFormat = getLibreOfficeFormat(normalizedTarget)

    // Run LibreOffice conversion
    const command = `libreoffice --headless --convert-to ${outputFormat} --outdir "${tempDir}" "${inputPath}"`

    await execAsync(command, {
      timeout: 300000, // 5 minutes timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    })

    // Read converted file
    const convertedBuffer = await fs.readFile(outputPath)

    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    // Cleanup on error
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})

    if (error.code === 'ENOENT') {
      throw new Error(
        'LibreOffice is not installed. Please install LibreOffice on the server.'
      )
    }

    throw new Error(`Document conversion failed: ${error.message}`)
  }
}

/**
 * Map file format to LibreOffice output format
 */
function getLibreOfficeFormat(format: string): string {
  const formatMap: Record<string, string> = {
    pdf: 'pdf',
    docx: 'docx:"MS Word 2007 XML"',
    doc: 'doc:"MS Word 97"',
    odt: 'odt',
    txt: 'txt',
    rtf: 'rtf',
    html: 'html',
    xlsx: 'xlsx:"Calc MS Excel 2007 XML"',
    xls: 'xls:"Calc MS Excel 97"',
    pptx: 'pptx:"Impress MS PowerPoint 2007 XML"',
    ppt: 'ppt:"Impress MS PowerPoint 97"',
  }

  return formatMap[format.toLowerCase()] || format
}

/**
 * Extract text from document (for TXT conversion)
 * Uses specialized libraries when available for better quality
 */
export async function extractText(
  inputBuffer: Buffer,
  sourceFormat: string
): Promise<string> {
  const normalizedFormat = sourceFormat.toLowerCase()

  // Use specialized libraries for better text extraction
  if (normalizedFormat === 'docx') {
    try {
      const result = await mammoth.extractRawText({ buffer: inputBuffer })
      return result.value
    } catch (error: any) {
      console.warn('Mammoth text extraction failed, falling back to LibreOffice:', error.message)
    }
  }

  if (normalizedFormat === 'pdf') {
    try {
      const data = await pdfParse(inputBuffer)
      return data.text
    } catch (error: any) {
      console.warn('PDF parse failed, falling back to LibreOffice:', error.message)
    }
  }

  // Fallback to LibreOffice for other formats
  const txtBuffer = await convertDocument(inputBuffer, sourceFormat, 'txt')
  return txtBuffer.toString('utf-8')
}

/**
 * Validate document file
 */
export async function validateDocument(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  // Basic validation - check file signature (magic bytes)
  const signatures: Record<string, Buffer[]> = {
    pdf: [Buffer.from('%PDF')],
    docx: [
      Buffer.from('PK\x03\x04'), // ZIP signature (DOCX is a ZIP)
    ],
    doc: [Buffer.from('\xd0\xcf\x11\xe0')], // OLE2 signature
    xlsx: [Buffer.from('PK\x03\x04')],
    pptx: [Buffer.from('PK\x03\x04')],
  }

  const sig = signatures[format.toLowerCase()]
  if (!sig) return true // Unknown format, assume valid

  return sig.some((s) => inputBuffer.subarray(0, s.length).equals(s))
}

