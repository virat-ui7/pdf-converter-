import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import { parse as csvParse, stringify as csvStringify } from 'csv-parse/sync'
import { stringify as csvStringifyAsync } from 'csv-stringify'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'
import { PDFDocument } from 'pdf-lib'

const execAsync = promisify(exec)

export interface SpreadsheetConversionOptions {
  quality?: number
  sheetName?: string
  includeHeaders?: boolean
}

/**
 * Convert spreadsheet from one format to another
 * Supports: XLSX, XLS, CSV, ODS, TSV, PDF, JSON, XML
 */
export async function convertSpreadsheet(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string,
  options: SpreadsheetConversionOptions = {}
): Promise<Buffer> {
  const normalizedSource = sourceFormat.toLowerCase()
  const normalizedTarget = targetFormat.toLowerCase()

  // Handle same format
  if (normalizedSource === normalizedTarget || 
      (normalizedSource === 'jpeg' && normalizedTarget === 'jpg') ||
      (normalizedSource === 'jpg' && normalizedTarget === 'jpeg')) {
    return inputBuffer
  }

  // Read source file
  let workbook: XLSX.WorkBook

  switch (normalizedSource) {
    case 'xlsx':
    case 'xlsm':
    case 'xlsb':
    case 'xltx':
    case 'xltm':
      // Extended Excel formats - XLSX library can handle these
      workbook = XLSX.read(inputBuffer, { type: 'buffer' })
      break

    case 'xls':
      // Legacy Excel format
      workbook = XLSX.read(inputBuffer, { type: 'buffer', cellDates: true })
      break

    case 'csv':
      const csvText = inputBuffer.toString('utf-8')
      workbook = XLSX.read(csvText, { type: 'string' })
      break

    case 'tsv':
      const tsvText = inputBuffer.toString('utf-8')
      workbook = XLSX.read(tsvText, { type: 'string', FS: '\t' })
      break

    case 'ods':
      // OpenDocument Spreadsheet - use LibreOffice for conversion
      return await convertODSToFormat(inputBuffer, normalizedTarget, options)

    case 'wps':
    case 'wks':
      // Microsoft Works - use LibreOffice
      return await convertWorksToFormat(inputBuffer, normalizedTarget, options)

    case 'wk3':
      // Lotus 1-2-3 - use LibreOffice
      return await convertLotusToFormat(inputBuffer, normalizedTarget, options)

    case 'numbers':
      // Apple Numbers - convert via XLSX using LibreOffice
      return await convertNumbersToFormat(inputBuffer, normalizedTarget, options)

    case 'sylk':
      // SYLK format - parse as text and convert
      const sylkText = inputBuffer.toString('utf-8')
      workbook = XLSX.read(sylkText, { type: 'string' })
      break

    case 'dif':
      // DIF format - parse as text
      const difText = inputBuffer.toString('utf-8')
      workbook = XLSX.read(difText, { type: 'string' })
      break

    case 'json':
      const jsonData = JSON.parse(inputBuffer.toString('utf-8'))
      workbook = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(Array.isArray(jsonData) ? jsonData : [jsonData])
      XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1')
      break

    case 'xml':
      // XML to Excel - basic implementation
      workbook = XLSX.read(inputBuffer.toString('utf-8'), { type: 'string' })
      break

    default:
      throw new Error(`Unsupported source format: ${sourceFormat}`)
  }

  // Convert to target format
  switch (normalizedTarget) {
    case 'xlsx':
      return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }))

    case 'xls':
      return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xls' }))

    case 'csv':
      const firstSheetName = workbook.SheetNames[0]
      const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName])
      return Buffer.from(csvData, 'utf-8')

    case 'tsv':
      const firstSheetNameTSV = workbook.SheetNames[0]
      const tsvData = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetNameTSV], { FS: '\t' })
      return Buffer.from(tsvData, 'utf-8')

    case 'ods':
      // Use LibreOffice for ODS conversion
      return await convertToODS(inputBuffer, normalizedSource, options)

    case 'json':
      const firstSheetNameJSON = workbook.SheetNames[0]
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetNameJSON])
      return Buffer.from(JSON.stringify(jsonData, null, 2), 'utf-8')

    case 'xml':
      const firstSheetNameXML = workbook.SheetNames[0]
      const xmlData = XLSX.utils.sheet_to_xml(workbook.Sheets[firstSheetNameXML])
      return Buffer.from(xmlData, 'utf-8')

    case 'pdf':
      return await convertSpreadsheetToPDF(workbook, options)

    default:
      throw new Error(`Unsupported target format: ${targetFormat}`)
  }
}

/**
 * Convert ODS to other formats using LibreOffice
 */
async function convertODSToFormat(
  inputBuffer: Buffer,
  targetFormat: string,
  options: SpreadsheetConversionOptions
): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-ods-'))
  const inputPath = path.join(tempDir, 'input.ods')
  const outputPath = path.join(tempDir, `output.${targetFormat}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      xlsx: 'xlsx:"Calc MS Excel 2007 XML"',
      xls: 'xls:"Calc MS Excel 97"',
      csv: 'csv',
      pdf: 'pdf',
    }

    const outputFormat = formatMap[targetFormat] || targetFormat
    const command = `libreoffice --headless --convert-to ${outputFormat} --outdir "${tempDir}" "${inputPath}"`

    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`ODS conversion failed: ${error.message}`)
  }
}

/**
 * Convert to ODS using LibreOffice
 */
async function convertToODS(
  inputBuffer: Buffer,
  sourceFormat: string,
  options: SpreadsheetConversionOptions
): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-to-ods-'))
  const inputPath = path.join(tempDir, `input.${sourceFormat}`)
  const outputPath = path.join(tempDir, 'output.ods')

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const command = `libreoffice --headless --convert-to ods --outdir "${tempDir}" "${inputPath}"`

    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`Conversion to ODS failed: ${error.message}`)
  }
}

/**
 * Convert spreadsheet to PDF
 */
async function convertSpreadsheetToPDF(
  workbook: XLSX.WorkBook,
  options: SpreadsheetConversionOptions
): Promise<Buffer> {
  // For Phase 1, we'll use LibreOffice to convert XLSX to PDF
  // In future phases, we could use a library like exceljs with pdf-lib
  
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'spreadsheet-pdf-'))
  const inputPath = path.join(tempDir, 'input.xlsx')
  const outputPath = path.join(tempDir, 'output.pdf')

  try {
    // Write workbook as XLSX
    const xlsxBuffer = Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }))
    await fs.writeFile(inputPath, xlsxBuffer)

    // Convert to PDF using LibreOffice
    const command = `libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${inputPath}"`
    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const pdfBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return pdfBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`Spreadsheet to PDF conversion failed: ${error.message}`)
  }
}

/**
 * Convert Works format to other formats
 */
async function convertWorksToFormat(
  inputBuffer: Buffer,
  targetFormat: string,
  options: SpreadsheetConversionOptions
): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-works-'))
  const inputPath = path.join(tempDir, 'input.wps')
  const outputPath = path.join(tempDir, `output.${targetFormat}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      xlsx: 'xlsx:"Calc MS Excel 2007 XML"',
      csv: 'csv',
      ods: 'ods',
    }

    const outputFormat = formatMap[targetFormat] || targetFormat
    const command = `libreoffice --headless --convert-to ${outputFormat} --outdir "${tempDir}" "${inputPath}"`

    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`Works conversion failed: ${error.message}`)
  }
}

/**
 * Convert Lotus 1-2-3 format to other formats
 */
async function convertLotusToFormat(
  inputBuffer: Buffer,
  targetFormat: string,
  options: SpreadsheetConversionOptions
): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-lotus-'))
  const inputPath = path.join(tempDir, 'input.wk3')
  const outputPath = path.join(tempDir, `output.${targetFormat}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      xlsx: 'xlsx:"Calc MS Excel 2007 XML"',
      csv: 'csv',
      ods: 'ods',
    }

    const outputFormat = formatMap[targetFormat] || targetFormat
    const command = `libreoffice --headless --convert-to ${outputFormat} --outdir "${tempDir}" "${inputPath}"`

    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`Lotus conversion failed: ${error.message}`)
  }
}

/**
 * Convert Apple Numbers format to other formats
 */
async function convertNumbersToFormat(
  inputBuffer: Buffer,
  targetFormat: string,
  options: SpreadsheetConversionOptions
): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-numbers-'))
  const inputPath = path.join(tempDir, 'input.numbers')
  const outputPath = path.join(tempDir, `output.${targetFormat}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      xlsx: 'xlsx:"Calc MS Excel 2007 XML"',
      csv: 'csv',
    }

    const outputFormat = formatMap[targetFormat] || targetFormat
    const command = `libreoffice --headless --convert-to ${outputFormat} --outdir "${tempDir}" "${inputPath}"`

    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`Numbers conversion failed: ${error.message}`)
  }
}

/**
 * Validate spreadsheet file
 */
export async function validateSpreadsheet(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()

  try {
    switch (normalizedFormat) {
      case 'xlsx':
      case 'xlsm':
      case 'xlsb':
      case 'xls':
        // Check for Excel signatures
        const xlsSignatures = [
          Buffer.from('PK\x03\x04'), // XLSX (ZIP)
          Buffer.from('\xd0\xcf\x11\xe0'), // XLS (OLE2)
        ]
        return xlsSignatures.some((sig) =>
          inputBuffer.subarray(0, sig.length).equals(sig)
        )

      case 'csv':
      case 'tsv':
        // CSV/TSV is plain text, try to parse
        const text = inputBuffer.toString('utf-8')
        return text.length > 0 && text.includes(',')

      case 'ods':
        // ODS is a ZIP file
        return inputBuffer.subarray(0, 4).equals(Buffer.from('PK\x03\x04'))

      case 'json':
        JSON.parse(inputBuffer.toString('utf-8'))
        return true

      default:
        return true // Unknown format, assume valid
    }
  } catch {
    return false
  }
}

