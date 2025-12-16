import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Blog - File Converter Tips, Guides & Updates',
  description:
    'Learn about file conversion, format guides, tips, and best practices. Stay updated with the latest features and tutorials.',
  keywords: 'file converter blog, conversion guides, format tips, file conversion tutorials',
}

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Convert PDF to Word: Complete Guide',
      excerpt:
        'Learn the best methods to convert PDF files to Word documents while preserving formatting and layout.',
      date: 'December 15, 2025',
      category: 'Guides',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Best Free File Converter Tools [2025 Comparison]',
      excerpt:
        'Compare the top free file converter tools available online. Find the best solution for your needs.',
      date: 'December 10, 2025',
      category: 'Reviews',
      readTime: '8 min read',
    },
    {
      id: 3,
      title: 'Image File Format Guide: JPG vs PNG vs WebP',
      excerpt:
        'Understand the differences between popular image formats and when to use each one for optimal results.',
      date: 'December 5, 2025',
      category: 'Guides',
      readTime: '6 min read',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">Blog</h1>
            <p className="text-lg text-neutral-medium-gray max-w-2xl mx-auto">
              Tips, guides, and updates about file conversion and formats
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-neutral-medium-gray">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-neutral-medium-gray mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-medium-gray">{post.date}</span>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm">
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-12">
            <p className="text-neutral-medium-gray mb-4">
              More blog posts coming soon! Check back regularly for updates.
            </p>
            <Link href="/convert">
              <Button variant="primary" size="lg">
                Start Converting Files
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

