#!/usr/bin/env python3
"""
Generate 1MB SVG test fixture
Usage: python3 scripts/generate-svg-fixture.py
"""

import os

def generate_svg():
    svg_path = "test-fixtures/valid/sample-1mb.svg"
    target_size = 1 * 1024 * 1024  # 1MB
    
    os.makedirs(os.path.dirname(svg_path), exist_ok=True)
    
    # Create complex SVG with many paths to reach 1MB
    svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" viewBox="0 0 2000 2000">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0,0,255);stop-opacity:1" />
    </linearGradient>
  </defs>
'''
    
    # Add many complex paths to increase file size
    for i in range(1000):
        x = (i % 50) * 40
        y = (i // 50) * 40
        svg_content += f'''  <path d="M {x} {y} L {x+30} {y} L {x+15} {y+30} Z" 
    fill="url(#grad1)" 
    stroke="black" 
    stroke-width="2"
    opacity="0.8"
    transform="rotate({i*0.36} {x+15} {y+15})" />
'''
    
    svg_content += '</svg>'
    
    # If still too small, add more content
    while len(svg_content.encode('utf-8')) < target_size:
        svg_content += '<!-- ' + 'x' * 1000 + ' -->\n'
    
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content[:target_size])
    
    actual_size = os.path.getsize(svg_path)
    print(f"✅ Created: {svg_path}")
    print(f"   Size: {actual_size / 1024 / 1024:.2f}MB")

if __name__ == "__main__":
    generate_svg()

