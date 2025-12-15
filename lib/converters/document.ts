import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'

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
 * Convert document using LibreOffice
 * Supported: DOCX, DOC, ODT, RTF, TXT, HTML -> PDF, DOCX, TXT, etc.
 */
export async function convertDocument(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string,
  options: DocumentConversionOptions = {}
): Promise<Buffer> {
  // Create temporary directory for conversion
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-'))
  const inputPath = path.join(tempDir, `input.${sourceFormat}`)
  const outputPath = path.join(tempDir, `output.${targetFormat}`)

  try {
    // Write input file
    await fs.writeFile(inputPath, inputBuffer)

    // Determine LibreOffice output format
    const outputFormat = getLibreOfficeFormat(targetFormat)

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
 */
export async function extractText(
  inputBuffer: Buffer,
  sourceFormat: string
): Promise<string> {
  // For now, use LibreOffice to convert to TXT
  // In production, could use specialized libraries like pdf-parse, mammoth, etc.
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

