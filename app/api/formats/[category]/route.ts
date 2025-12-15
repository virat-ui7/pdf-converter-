import { NextResponse } from 'next/server'
import { FILE_FORMATS, FormatCategory } from '@/lib/formats'

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category as FormatCategory

    // Validate category
    const validCategories: FormatCategory[] = ['document', 'image', 'spreadsheet', 'presentation']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: document, image, spreadsheet, presentation' },
        { status: 400 }
      )
    }

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
  } catch (error) {
    console.error('Error fetching formats by category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch formats' },
      { status: 500 }
    )
  }
}

