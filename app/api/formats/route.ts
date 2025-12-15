import { NextResponse } from 'next/server'
import { FILE_FORMATS, FormatCategory } from '@/lib/formats'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as FormatCategory | null

    if (category) {
      // Return formats for specific category
      const formats = FILE_FORMATS.filter((f) => f.category === category)
      return NextResponse.json({
        category,
        formats: formats.map((f) => ({
          id: f.id,
          name: f.name,
          extension: f.extension,
          mimeType: f.mimeType,
          icon: f.icon,
          description: f.description,
        })),
        count: formats.length,
      })
    }

    // Return all formats grouped by category
    const documents = FILE_FORMATS.filter((f) => f.category === 'document')
    const images = FILE_FORMATS.filter((f) => f.category === 'image')
    const spreadsheets = FILE_FORMATS.filter((f) => f.category === 'spreadsheet')
    const presentations = FILE_FORMATS.filter((f) => f.category === 'presentation')

    return NextResponse.json({
      documents: {
        count: documents.length,
        formats: documents.map((f) => ({
          id: f.id,
          name: f.name,
          extension: f.extension,
          mimeType: f.mimeType,
          icon: f.icon,
        })),
      },
      images: {
        count: images.length,
        formats: images.map((f) => ({
          id: f.id,
          name: f.name,
          extension: f.extension,
          mimeType: f.mimeType,
          icon: f.icon,
        })),
      },
      spreadsheets: {
        count: spreadsheets.length,
        formats: spreadsheets.map((f) => ({
          id: f.id,
          name: f.name,
          extension: f.extension,
          mimeType: f.mimeType,
          icon: f.icon,
        })),
      },
      presentations: {
        count: presentations.length,
        formats: presentations.map((f) => ({
          id: f.id,
          name: f.name,
          extension: f.extension,
          mimeType: f.mimeType,
          icon: f.icon,
        })),
      },
      total: FILE_FORMATS.length,
    })
  } catch (error) {
    console.error('Error fetching formats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch formats' },
      { status: 500 }
    )
  }
}

