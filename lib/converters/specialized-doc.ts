/**
 * Specialized Document Format Converter
 * Converts specialized document formats (ONE, CHM, TEX, XMIND, PST, SDF, INI)
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Convert specialized document format
 */
export async function convertSpecializedDoc(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  const normalizedSource = sourceFormat.toLowerCase()
  const normalizedTarget = targetFormat.toLowerCase()

  // Most specialized formats require LibreOffice or specialized tools
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-specialized-'))
  const inputPath = path.join(tempDir, `input.${normalizedSource}`)
  const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      pdf: 'pdf',
      docx: 'docx:"MS Word 2007 XML"',
      txt: 'txt',
      html: 'html',
    }

    const outputFormat = formatMap[normalizedTarget] || normalizedTarget
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

    // For TEX files, try LaTeX compilation
    if (normalizedSource === 'tex' && normalizedTarget === 'pdf') {
      return await convertLaTeXToPDF(inputBuffer)
    }

    throw new Error(`Specialized document conversion failed: ${error.message}`)
  }
}

/**
 * Convert LaTeX to PDF
 */
async function convertLaTeXToPDF(inputBuffer: Buffer): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-latex-'))
  const inputPath = path.join(tempDir, 'input.tex')
  const outputPath = path.join(tempDir, 'output.pdf')

  try {
    await fs.writeFile(inputPath, inputBuffer)

    // Compile LaTeX to PDF using pdflatex
    const command = `pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${inputPath}"`
    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})

    if (error.code === 'ENOENT') {
      throw new Error(
        'LaTeX (pdflatex) is not installed. Please install LaTeX on the server.'
      )
    }

    throw new Error(`LaTeX to PDF conversion failed: ${error.message}`)
  }
}

/**
 * Validate specialized document file
 */
export async function validateSpecializedDoc(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()

  try {
    if (normalizedFormat === 'one') {
      // OneNote files are OLE2 format
      return inputBuffer.subarray(0, 8).equals(Buffer.from('\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1'))
    } else if (normalizedFormat === 'chm') {
      // CHM files are compiled HTML help
      return inputBuffer.subarray(0, 4).equals(Buffer.from('ITSF'))
    } else if (normalizedFormat === 'tex') {
      // LaTeX files are plain text
      const text = inputBuffer.toString('utf-8')
      return text.includes('\\documentclass') || text.includes('\\begin{document}')
    } else if (normalizedFormat === 'ini') {
      // INI files are plain text
      const text = inputBuffer.toString('utf-8')
      return text.includes('[') && text.includes(']')
    }
    return true // Unknown format, assume valid
  } catch {
    return false
  }
}

