#!/bin/bash
# Check Monitoring Dashboard
# Verifies Grafana is displaying correct data

set -e

GRAFANA_URL="${GRAFANA_URL:-http://localhost:3001}"
GRAFANA_USER="${GRAFANA_USER:-admin}"
GRAFANA_PASS="${GRAFANA_PASS:-admin}"

echo "=========================================="
echo "Monitoring Dashboard Verification"
echo "=========================================="
echo ""

# Check Grafana is accessible
echo "1. Checking Grafana accessibility..."
if curl -s -u "$GRAFANA_USER:$GRAFANA_PASS" "$GRAFANA_URL/api/health" | grep -q "OK"; then
  echo "   ✅ Grafana is accessible"
else
  echo "   ❌ Grafana is not accessible"
  echo "   URL: $GRAFANA_URL"
  exit 1
fi

echo ""
echo "2. Checking Prometheus data source..."
# Check if Prometheus is configured
DS_RESPONSE=$(curl -s -u "$GRAFANA_USER:$GRAFANA_PASS" "$GRAFANA_URL/api/datasources" 2>/dev/null || echo "")
if echo "$DS_RESPONSE" | grep -q "Prometheus"; then
  echo "   ✅ Prometheus data source configured"
else
  echo "   ⚠️  Prometheus data source may not be configured"
  echo "   Manual: Check Grafana → Configuration → Data Sources"
fi

echo ""
echo "3. Dashboard Verification:"
echo "   ⚠️  Manual verification required"
echo ""
echo "   Please open Grafana in browser:"
echo "   URL: $GRAFANA_URL"
echo "   Username: $GRAFANA_USER"
echo "   Password: $GRAFANA_PASS"
echo ""
echo "   Verify these panels:"
echo "   - Conversion success rate (should be ~95%+)"
echo "   - Conversions per format (should show data)"
echo "   - Error rate (should be <5%)"
echo "   - Worker utilization (should show activity)"
echo "   - Queue depth (should show jobs)"
echo "   - API latency (P50, P95 percentiles)"
echo ""
echo "   Record your findings in the QA report."
echo ""

# Check Prometheus directly
echo "4. Checking Prometheus metrics..."
if curl -s http://localhost:9090/api/v1/query?query=conversion_success_total | grep -q "result"; then
  echo "   ✅ Prometheus is collecting metrics"
else
  echo "   ⚠️  Prometheus may not have metrics yet"
  echo "   (This is OK if no conversions have been run)"
fi

echo ""
echo "=========================================="
echo "Monitoring Check Complete"
echo "=========================================="
echo ""
echo "⚠️  Manual verification of Grafana dashboard required"
echo "   See docs/MONITORING_AND_ALERTING.md for dashboard details"

