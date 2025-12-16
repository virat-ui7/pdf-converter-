#!/usr/bin/env python3
"""
Generate 10MB CSV test fixture
Usage: python3 scripts/generate-csv-fixture.py
"""

import csv
import random
import string
import os

def random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_csv():
    csv_path = "test-fixtures/valid/sample-10mb.csv"
    target_size = 10 * 1024 * 1024  # 10MB
    
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'name', 'email', 'value', 'date', 'description', 'category', 'status'])
        
        current_size = f.tell()
        row_count = 0
        
        print(f"Generating CSV file (target: {target_size / 1024 / 1024:.1f}MB)...")
        
        while current_size < target_size:
            row = [
                row_count,
                random_string(20),
                f"{random_string(10)}@example.com",
                random.randint(100, 10000),
                f"2025-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
                random_string(50),
                random.choice(['A', 'B', 'C', 'D']),
                random.choice(['active', 'inactive', 'pending'])
            ]
            writer.writerow(row)
            row_count += 1
            current_size = f.tell()
            
            if row_count % 10000 == 0:
                print(f"  Generated {row_count:,} rows, {current_size / 1024 / 1024:.2f}MB...")
    
    print(f"✅ Created: {csv_path}")
    print(f"   Rows: {row_count:,}")
    print(f"   Size: {current_size / 1024 / 1024:.2f}MB")

if __name__ == "__main__":
    generate_csv()

