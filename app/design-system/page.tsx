'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function DesignSystem() {
  return (
    <div className="container-custom space-section">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Design System</h1>
        <p className="text-lg text-neutral-medium-gray mb-12">
          Complete design tokens and component showcase
        </p>

        {/* Colors Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Colors</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <div className="h-24 bg-primary rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-neutral-medium-gray">#FF6B35</p>
            </div>
            <div>
              <div className="h-24 bg-primary-hover rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Primary Hover</p>
              <p className="text-xs text-neutral-medium-gray">#E55A24</p>
            </div>
            <div>
              <div className="h-24 bg-success rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Success</p>
              <p className="text-xs text-neutral-medium-gray">#4CAF50</p>
            </div>
            <div>
              <div className="h-24 bg-error rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Error</p>
              <p className="text-xs text-neutral-medium-gray">#F44336</p>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Typography</h2>
          
          <div className="space-y-4">
            <div>
              <h1 className="mb-2">Heading 1 - 48px / Semibold</h1>
              <p className="text-sm text-neutral-medium-gray">Used for page titles</p>
            </div>
            <div>
              <h2 className="mb-2">Heading 2 - 36px / Semibold</h2>
              <p className="text-sm text-neutral-medium-gray">Used for section titles</p>
            </div>
            <div>
              <h3 className="mb-2">Heading 3 - 24px / Semibold</h3>
              <p className="text-sm text-neutral-medium-gray">Used for subsection titles</p>
            </div>
            <div>
              <p className="mb-2">Body text - 14px / Regular</p>
              <p className="text-sm text-neutral-medium-gray">Default body text</p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Buttons</h2>
          
          <div className="space-y-6">
            <div>
              <h4 className="mb-4">Primary Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" isLoading>Loading</Button>
              </div>
            </div>
            
            <div>
              <h4 className="mb-4">Secondary Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="sm">Small</Button>
                <Button variant="secondary" size="md">Medium</Button>
                <Button variant="secondary" size="lg">Large</Button>
              </div>
            </div>
            
            <div>
              <h4 className="mb-4">Ghost Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="ghost" size="sm">Small</Button>
                <Button variant="ghost" size="md">Medium</Button>
                <Button variant="ghost" size="lg">Large</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Input Fields</h2>
          
          <div className="space-y-6 max-w-md">
            <Input label="Email" type="email" placeholder="Enter your email" />
            <Input label="Password" type="password" placeholder="Enter your password" required />
            <Input
              label="Email with Error"
              type="email"
              placeholder="Invalid email"
              error="Please enter a valid email address"
            />
            <Input
              label="Email with Helper"
              type="email"
              placeholder="Enter your email"
              helperText="We'll never share your email"
            />
            <Input label="Disabled" type="text" placeholder="Disabled input" disabled />
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Cards</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is a basic card component with header and content sections.</p>
              </CardContent>
            </Card>
            
            <Card hover>
              <CardHeader>
                <CardTitle>Hoverable Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This card has hover effects enabled.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Badges</h2>
          
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Spacing Scale</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm">4px</div>
              <div className="h-4 bg-primary w-1"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm">8px</div>
              <div className="h-4 bg-primary w-2"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm">12px</div>
              <div className="h-4 bg-primary w-3"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm">16px</div>
              <div className="h-4 bg-primary w-4"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm">24px</div>
              <div className="h-4 bg-primary w-6"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm">32px</div>
              <div className="h-4 bg-primary w-8"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm">48px</div>
              <div className="h-4 bg-primary w-12"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

