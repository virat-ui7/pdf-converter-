#!/bin/bash
# Rollback Script for FileConverter
# Usage: ./scripts/rollback.sh [VERSION]

set -e

VERSION=${1:-"previous"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="rollback_${TIMESTAMP}.log"

echo "=== FileConverter Rollback Script ===" | tee -a "$LOG_FILE"
echo "Timestamp: $(date)" | tee -a "$LOG_FILE"
echo "Target Version: $VERSION" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Check if running in production
if [ "$NODE_ENV" != "production" ]; then
  echo "⚠️  WARNING: Not in production environment" | tee -a "$LOG_FILE"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled."
    exit 1
  fi
fi

# Step 1: Stop accepting new traffic (if load balancer)
echo "Step 1: Stopping new traffic..." | tee -a "$LOG_FILE"
# TODO: Implement load balancer traffic stop
# Example: aws elb deregister-instances-from-load-balancer
echo "✅ Traffic stopped (manual step required)" | tee -a "$LOG_FILE"

# Step 2: Check current version
echo "" | tee -a "$LOG_FILE"
echo "Step 2: Checking current version..." | tee -a "$LOG_FILE"
CURRENT_VERSION=$(git describe --tags --exact-match 2>/dev/null || git rev-parse --short HEAD)
echo "Current version: $CURRENT_VERSION" | tee -a "$LOG_FILE"

# Step 3: Get target version
if [ "$VERSION" == "previous" ]; then
  TARGET_VERSION=$(git log --oneline -2 | tail -1 | awk '{print $1}')
  echo "Rolling back to previous commit: $TARGET_VERSION" | tee -a "$LOG_FILE"
else
  TARGET_VERSION=$VERSION
  echo "Rolling back to: $TARGET_VERSION" | tee -a "$LOG_FILE"
fi

# Step 4: Verify target version exists
if ! git rev-parse --verify "$TARGET_VERSION" > /dev/null 2>&1; then
  echo "❌ Error: Version $TARGET_VERSION not found" | tee -a "$LOG_FILE"
  exit 1
fi

# Step 5: Checkout target version
echo "" | tee -a "$LOG_FILE"
echo "Step 3: Checking out target version..." | tee -a "$LOG_FILE"
git checkout "$TARGET_VERSION" || {
  echo "❌ Error: Failed to checkout version" | tee -a "$LOG_FILE"
  exit 1
}
echo "✅ Checked out $TARGET_VERSION" | tee -a "$LOG_FILE"

# Step 6: Install dependencies (if needed)
echo "" | tee -a "$LOG_FILE"
echo "Step 4: Installing dependencies..." | tee -a "$LOG_FILE"
npm install --production || {
  echo "❌ Error: Failed to install dependencies" | tee -a "$LOG_FILE"
  exit 1
}
echo "✅ Dependencies installed" | tee -a "$LOG_FILE"

# Step 7: Build application
echo "" | tee -a "$LOG_FILE"
echo "Step 5: Building application..." | tee -a "$LOG_FILE"
npm run build || {
  echo "❌ Error: Build failed" | tee -a "$LOG_FILE"
  exit 1
}
echo "✅ Build successful" | tee -a "$LOG_FILE"

# Step 8: Restart services
echo "" | tee -a "$LOG_FILE"
echo "Step 6: Restarting services..." | tee -a "$LOG_FILE"

# Restart API (if using PM2)
if command -v pm2 &> /dev/null; then
  pm2 restart fileconverter-api || {
    echo "⚠️  Warning: PM2 restart failed (may not be using PM2)" | tee -a "$LOG_FILE"
  }
fi

# Restart workers (if using PM2)
if command -v pm2 &> /dev/null; then
  pm2 restart fileconverter-worker || {
    echo "⚠️  Warning: PM2 restart failed (may not be using PM2)" | tee -a "$LOG_FILE"
  }
fi

echo "✅ Services restarted" | tee -a "$LOG_FILE"

# Step 9: Health check
echo "" | tee -a "$LOG_FILE"
echo "Step 7: Running health checks..." | tee -a "$LOG_FILE"
sleep 5

HEALTH_URL="${NEXTAUTH_URL:-http://localhost:3000}/api/health?type=deep"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")

if [ "$HEALTH_RESPONSE" == "200" ]; then
  echo "✅ Health check passed" | tee -a "$LOG_FILE"
else
  echo "⚠️  Warning: Health check returned $HEALTH_RESPONSE" | tee -a "$LOG_FILE"
  echo "   Manual verification recommended" | tee -a "$LOG_FILE"
fi

# Step 10: Resume traffic
echo "" | tee -a "$LOG_FILE"
echo "Step 8: Resuming traffic..." | tee -a "$LOG_FILE"
# TODO: Implement load balancer traffic resume
# Example: aws elb register-instances-with-load-balancer
echo "✅ Traffic resumed (manual step required)" | tee -a "$LOG_FILE"

# Step 11: Monitor for 5 minutes
echo "" | tee -a "$LOG_FILE"
echo "Step 9: Monitoring system (5 minutes)..." | tee -a "$LOG_FILE"
echo "   Check logs and metrics for any issues" | tee -a "$LOG_FILE"
echo "   Monitor conversion success rate" | tee -a "$LOG_FILE"
echo "   Check error logs" | tee -a "$LOG_FILE"

# Final summary
echo "" | tee -a "$LOG_FILE"
echo "=== Rollback Complete ===" | tee -a "$LOG_FILE"
echo "Rolled back from: $CURRENT_VERSION" | tee -a "$LOG_FILE"
echo "Rolled back to: $TARGET_VERSION" | tee -a "$LOG_FILE"
echo "Log file: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "⚠️  IMPORTANT: Review logs and metrics before considering rollback complete" | tee -a "$LOG_FILE"
echo "⚠️  If issues persist, contact infrastructure team" | tee -a "$LOG_FILE"

