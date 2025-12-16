#!/bin/bash
# Quick QA Check - Verify staging is ready for QA execution
# Usage: ./scripts/quick-qa-check.sh

set -e

echo "=========================================="
echo "Quick QA Pre-Execution Check"
echo "=========================================="
echo ""

ALL_GOOD=true

# Check 1: API Health
echo "1. Checking API health..."
if curl -s http://localhost:3000/api/health?type=live | grep -q "ok"; then
  echo "   ✅ API is responding"
else
  echo "   ❌ API is not responding"
  ALL_GOOD=false
fi

# Check 2: Workers
echo "2. Checking workers..."
if docker ps | grep -q "fileconverter-worker"; then
  WORKER_COUNT=$(docker ps | grep "fileconverter-worker" | wc -l | tr -d ' ')
  echo "   ✅ Workers are running ($WORKER_COUNT workers)"
else
  echo "   ❌ Workers are not running"
  ALL_GOOD=false
fi

# Check 3: Database
echo "3. Checking database..."
DB_COUNT=$(docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$DB_COUNT" -ge "4" ]; then
  echo "   ✅ Database has test users ($DB_COUNT users)"
else
  echo "   ⚠️  Database has fewer users than expected ($DB_COUNT, expected 4+)"
  ALL_GOOD=false
fi

# Check 4: Redis
echo "4. Checking Redis..."
if docker exec fileconverter-redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
  echo "   ✅ Redis is responding"
else
  echo "   ❌ Redis is not responding"
  ALL_GOOD=false
fi

# Check 5: Test fixtures
echo "5. Checking test fixtures..."
if [ -d "test-fixtures" ]; then
  FIXTURE_COUNT=$(find test-fixtures -type f 2>/dev/null | wc -l | tr -d ' ')
  echo "   Found $FIXTURE_COUNT files in test-fixtures/"
  if [ "$FIXTURE_COUNT" -ge "5" ]; then
    echo "   ✅ Some test fixtures exist"
  else
    echo "   ⚠️  Few test fixtures found (may need to create more)"
  fi
else
  echo "   ⚠️  test-fixtures/ directory not found"
fi

echo ""
echo "=========================================="
if [ "$ALL_GOOD" = true ]; then
  echo "✅ All critical checks passed"
  echo "   Staging is ready for QA execution"
  echo ""
  echo "Next steps:"
  echo "  1. Create test fixtures (if not done)"
  echo "  2. Run: ./scripts/run-comprehensive-qa.sh"
  exit 0
else
  echo "❌ Some checks failed"
  echo "   Fix issues before running QA tests"
  echo ""
  echo "Troubleshooting:"
  echo "  - Start staging: ./scripts/start-staging.sh"
  echo "  - Check logs: docker logs fileconverter-api"
  exit 1
fi

