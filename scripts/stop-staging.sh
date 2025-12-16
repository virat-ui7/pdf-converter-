#!/bin/bash
# Stop Staging Environment Script
# Usage: ./scripts/stop-staging.sh [--archive-logs]

set -e

ARCHIVE_LOGS=false

# Check for archive flag
if [ "$1" = "--archive-logs" ]; then
  ARCHIVE_LOGS=true
fi

echo "=========================================="
echo "Stopping FileConverter Staging Environment"
echo "=========================================="
echo ""

# Use docker compose (v2) if available, otherwise docker-compose (v1)
if docker compose version &> /dev/null 2>&1; then
  DOCKER_COMPOSE="docker compose"
else
  DOCKER_COMPOSE="docker-compose"
fi

# Archive logs if requested
if [ "$ARCHIVE_LOGS" = true ]; then
  ARCHIVE_DIR="logs-archive-$(date +%Y%m%d_%H%M%S)"
  echo "📦 Archiving logs to $ARCHIVE_DIR..."
  mkdir -p "$ARCHIVE_DIR"
  
  # Save logs from each service
  docker logs fileconverter-api > "$ARCHIVE_DIR/api.log" 2>&1 || true
  docker logs fileconverter-worker-1 > "$ARCHIVE_DIR/worker-1.log" 2>&1 || true
  docker logs fileconverter-worker-2 > "$ARCHIVE_DIR/worker-2.log" 2>&1 || true
  docker logs fileconverter-postgres > "$ARCHIVE_DIR/postgres.log" 2>&1 || true
  docker logs fileconverter-redis > "$ARCHIVE_DIR/redis.log" 2>&1 || true
  docker logs fileconverter-grafana > "$ARCHIVE_DIR/grafana.log" 2>&1 || true
  docker logs fileconverter-prometheus > "$ARCHIVE_DIR/prometheus.log" 2>&1 || true
  
  echo "   ✅ Logs archived to $ARCHIVE_DIR"
  echo ""
fi

echo "🛑 Stopping services..."
$DOCKER_COMPOSE --env-file .env.staging down

echo ""
echo "✅ Staging environment stopped"
echo ""
echo "💡 To remove volumes (clean slate):"
echo "   $DOCKER_COMPOSE --env-file .env.staging down -v"
echo ""
echo "💡 To start again:"
echo "   ./scripts/start-staging.sh"
echo ""

