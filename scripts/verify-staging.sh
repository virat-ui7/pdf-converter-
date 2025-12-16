#!/bin/bash
# Verify Staging Environment Script
# Usage: ./scripts/verify-staging.sh

set -e

echo "=========================================="
echo "FileConverter Staging Verification"
echo "=========================================="
echo ""

PASSED=0
FAILED=0

# Function to check and report
check() {
  local name=$1
  local command=$2
  
  echo -n "Checking $name... "
  if eval "$command" > /dev/null 2>&1; then
    echo "✅ PASS"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo "❌ FAIL"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# 1. API Health - Live
check "API /health/live" "curl -s http://localhost:3000/api/health?type=live | grep -q 'ok'"

# 2. API Health - Ready
check "API /health/ready" "curl -s http://localhost:3000/api/health?type=ready | grep -q 'ok'"

# 3. API Health - Deep
check "API /health/deep" "curl -s http://localhost:3000/api/health?type=deep | grep -q 'ok'"

# 4. Database Connection
check "Database Connection" "docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -c 'SELECT 1' > /dev/null 2>&1"

# 5. Database Has Test Users
USER_COUNT=$(docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$USER_COUNT" -ge "4" ]; then
  echo "Checking Database Test Users... ✅ PASS ($USER_COUNT users found)"
  PASSED=$((PASSED + 1))
else
  echo "Checking Database Test Users... ❌ FAIL (found $USER_COUNT, expected 4+)"
  FAILED=$((FAILED + 1))
fi

# 6. Redis Connection
check "Redis Connection" "docker exec fileconverter-redis redis-cli ping | grep -q 'PONG'"

# 7. Workers Running
WORKER_1=$(docker ps --filter "name=fileconverter-worker-1" --format "{{.Status}}" 2>/dev/null | grep -q "Up" && echo "up" || echo "down")
WORKER_2=$(docker ps --filter "name=fileconverter-worker-2" --format "{{.Status}}" 2>/dev/null | grep -q "Up" && echo "up" || echo "down")
if [ "$WORKER_1" = "up" ] && [ "$WORKER_2" = "up" ]; then
  echo "Checking Workers Running... ✅ PASS (both workers up)"
  PASSED=$((PASSED + 1))
else
  echo "Checking Workers Running... ❌ FAIL (Worker 1: $WORKER_1, Worker 2: $WORKER_2)"
  FAILED=$((FAILED + 1))
fi

# 8. Queue Accessible
check "Queue Accessible" "docker exec fileconverter-redis redis-cli LLEN bull:conversions:waiting > /dev/null 2>&1"

# 9. Grafana Running
check "Grafana Running" "curl -s http://localhost:3001/api/health | grep -q 'OK'"

# 10. Prometheus Running
check "Prometheus Running" "curl -s http://localhost:9090/-/healthy | grep -q 'Prometheus'"

# 11. Metrics Endpoint
check "Metrics Endpoint" "curl -s http://localhost:3000/api/metrics | grep -q 'conversion_success_total'"

# 12. Test API Key (Professional)
check "Test API Key Authentication" "curl -s -H 'X-API-Key: fc_staging_pro_test_key_12345' http://localhost:3000/api/health | grep -q 'ok'"

echo ""
echo "=========================================="
echo "Verification Complete"
echo "=========================================="
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All checks passed! Staging environment is ready."
  exit 0
else
  echo "⚠️  Some checks failed. Review the output above."
  exit 1
fi

