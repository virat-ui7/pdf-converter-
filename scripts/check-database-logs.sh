#!/bin/bash
# Check Database and Logs for Issues
# Usage: ./scripts/check-database-logs.sh

set -e

echo "=========================================="
echo "Database & Logging Verification"
echo "=========================================="
echo ""

# Check if we can connect to database
if ! docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -c "SELECT 1" > /dev/null 2>&1; then
  echo "❌ Cannot connect to database"
  exit 1
fi

echo "✅ Database connection successful"
echo ""

# Database checks
echo "📊 Database Statistics:"
echo "----------------------------------------"

# Total conversions
TOTAL=$(docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -t -c "SELECT COUNT(*) FROM conversions;" 2>/dev/null | tr -d ' ' || echo "0")
echo "Total conversions: $TOTAL"

# Successful conversions
SUCCESS=$(docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -t -c "SELECT COUNT(*) FROM conversions WHERE status='completed';" 2>/dev/null | tr -d ' ' || echo "0")
echo "Successful: $SUCCESS"

# Failed conversions
FAILED=$(docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -t -c "SELECT COUNT(*) FROM conversions WHERE status='failed';" 2>/dev/null | tr -d ' ' || echo "0")
echo "Failed: $FAILED"

# Calculate success rate
if [ "$TOTAL" -gt 0 ]; then
  SUCCESS_RATE=$(echo "scale=2; $SUCCESS * 100 / $TOTAL" | bc 2>/dev/null || echo "0")
  echo "Success rate: ${SUCCESS_RATE}%"
  
  if (( $(echo "$SUCCESS_RATE >= 90" | bc -l) )); then
    echo "✅ Success rate is acceptable (>=90%)"
  else
    echo "⚠️  Success rate is below 90%"
  fi
fi

echo ""

# Check for failed conversions with error messages
echo "📋 Failed Conversions (sample):"
echo "----------------------------------------"
docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -c "SELECT id, original_format, target_format, error_message, created_at FROM conversions WHERE status='failed' ORDER BY created_at DESC LIMIT 5;" 2>/dev/null || echo "No failed conversions"

echo ""

# Check timestamps
echo "🕐 Timestamp Verification:"
echo "----------------------------------------"
INVALID_TIMESTAMPS=$(docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -t -c "SELECT COUNT(*) FROM conversions WHERE created_at > NOW() OR created_at < '2020-01-01';" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$INVALID_TIMESTAMPS" = "0" ]; then
  echo "✅ All timestamps are valid"
else
  echo "⚠️  Found $INVALID_TIMESTAMPS invalid timestamps"
fi

echo ""

# Log checks
echo "📝 Log Analysis:"
echo "----------------------------------------"

# Check for errors
ERROR_COUNT=$(docker logs fileconverter-api 2>&1 | grep -i "error" | wc -l | tr -d ' ')
echo "Error messages in API logs: $ERROR_COUNT"

# Check for stack traces
STACK_TRACES=$(docker logs fileconverter-api 2>&1 | grep -i "stack trace\|stacktrace\|at \|Error:" | grep -v "grep" | wc -l | tr -d ' ')
if [ "$STACK_TRACES" = "0" ]; then
  echo "✅ No stack traces in logs"
else
  echo "❌ Found $STACK_TRACES stack traces in logs"
fi

# Check for secrets
SECRETS=$(docker logs fileconverter-api 2>&1 | grep -iE "password|token|secret|api_key" | grep -v "X-API-Key" | grep -v "grep" | wc -l | tr -d ' ')
if [ "$SECRETS" = "0" ]; then
  echo "✅ No secrets found in logs"
else
  echo "❌ Found $SECRETS potential secrets in logs"
fi

# Check for internal paths
INTERNAL_PATHS=$(docker logs fileconverter-api 2>&1 | grep -iE "/tmp/|/var/|/home/|C:\\" | grep -v "grep" | wc -l | tr -d ' ')
if [ "$INTERNAL_PATHS" = "0" ]; then
  echo "✅ No internal paths exposed in logs"
else
  echo "⚠️  Found $INTERNAL_PATHS internal paths in logs"
fi

echo ""

# Worker logs
echo "👷 Worker Log Analysis:"
echo "----------------------------------------"
WORKER_ERRORS=$(docker logs fileconverter-worker-1 2>&1 | grep -i "error" | wc -l | tr -d ' ')
echo "Error messages in worker logs: $WORKER_ERRORS"

WORKER_JOBS=$(docker logs fileconverter-worker-1 2>&1 | grep -i "conversion.*completed\|job.*completed" | wc -l | tr -d ' ')
echo "Completed jobs logged: $WORKER_JOBS"

echo ""
echo "=========================================="
echo "Verification Complete"
echo "=========================================="

# Summary
ISSUES=0
if [ "$STACK_TRACES" != "0" ]; then
  ISSUES=$((ISSUES + 1))
fi
if [ "$SECRETS" != "0" ]; then
  ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
  echo "✅ All checks passed"
  exit 0
else
  echo "⚠️  Found $ISSUES issues that need attention"
  exit 1
fi

