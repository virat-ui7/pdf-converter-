#!/bin/bash
# Start Staging Environment Script
# Usage: ./scripts/start-staging.sh

set -e

echo "=========================================="
echo "FileConverter Staging Environment Setup"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running"
  echo "   Please start Docker and try again"
  exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
  echo "❌ Error: Docker Compose is not installed"
  echo "   Please install Docker Compose and try again"
  exit 1
fi

# Use docker compose (v2) if available, otherwise docker-compose (v1)
if docker compose version &> /dev/null 2>&1; then
  DOCKER_COMPOSE="docker compose"
else
  DOCKER_COMPOSE="docker-compose"
fi

echo "📦 Step 1: Building Docker images..."
$DOCKER_COMPOSE build --no-cache

echo ""
echo "🚀 Step 2: Starting services..."
$DOCKER_COMPOSE --env-file .env.staging up -d

echo ""
echo "⏳ Step 3: Waiting for services to be healthy..."
echo "   This may take 30-60 seconds..."

# Wait for PostgreSQL
echo "   Waiting for PostgreSQL..."
timeout=60
elapsed=0
while ! docker exec fileconverter-postgres pg_isready -U fileconverter > /dev/null 2>&1; do
  sleep 2
  elapsed=$((elapsed + 2))
  if [ $elapsed -ge $timeout ]; then
    echo "   ❌ PostgreSQL failed to start within $timeout seconds"
    exit 1
  fi
done
echo "   ✅ PostgreSQL is ready"

# Wait for Redis
echo "   Waiting for Redis..."
elapsed=0
while ! docker exec fileconverter-redis redis-cli --raw incr ping > /dev/null 2>&1; do
  sleep 2
  elapsed=$((elapsed + 2))
  if [ $elapsed -ge $timeout ]; then
    echo "   ❌ Redis failed to start within $timeout seconds"
    exit 1
  fi
done
echo "   ✅ Redis is ready"

# Wait for API
echo "   Waiting for API..."
elapsed=0
while ! curl -s http://localhost:3000/api/health?type=live > /dev/null 2>&1; do
  sleep 2
  elapsed=$((elapsed + 2))
  if [ $elapsed -ge $timeout ]; then
    echo "   ❌ API failed to start within $timeout seconds"
    echo "   Check logs with: docker logs fileconverter-api"
    exit 1
  fi
done
echo "   ✅ API is ready"

# Wait for workers
echo "   Waiting for workers..."
sleep 5
echo "   ✅ Workers are starting"

# Wait for Grafana
echo "   Waiting for Grafana..."
elapsed=0
while ! curl -s http://localhost:3001/api/health > /dev/null 2>&1; do
  sleep 2
  elapsed=$((elapsed + 2))
  if [ $elapsed -ge $timeout ]; then
    echo "   ⚠️  Grafana may still be starting (non-critical)"
    break
  fi
done
echo "   ✅ Grafana is ready"

echo ""
echo "🔍 Step 4: Verifying services..."

# Check API health
echo "   Checking API health..."
API_HEALTH=$(curl -s http://localhost:3000/api/health?type=ready | jq -r '.status' 2>/dev/null || echo "unknown")
if [ "$API_HEALTH" = "ok" ]; then
  echo "   ✅ API health check passed"
else
  echo "   ⚠️  API health check returned: $API_HEALTH"
fi

# Check database connection
echo "   Checking database connection..."
DB_CHECK=$(docker exec fileconverter-postgres psql -U fileconverter -d fileconverter_staging -c "SELECT COUNT(*) FROM users;" -t 2>/dev/null | tr -d ' ' || echo "error")
if [ "$DB_CHECK" != "error" ] && [ "$DB_CHECK" -ge "0" ]; then
  echo "   ✅ Database connection verified ($DB_CHECK test users found)"
else
  echo "   ⚠️  Database check failed (may need to wait longer)"
fi

# Check Redis connection
echo "   Checking Redis connection..."
REDIS_CHECK=$(docker exec fileconverter-redis redis-cli ping 2>/dev/null || echo "error")
if [ "$REDIS_CHECK" = "PONG" ]; then
  echo "   ✅ Redis connection verified"
else
  echo "   ⚠️  Redis check failed"
fi

# Check workers
echo "   Checking workers..."
WORKER_1=$(docker ps --filter "name=fileconverter-worker-1" --format "{{.Status}}" 2>/dev/null || echo "not found")
WORKER_2=$(docker ps --filter "name=fileconverter-worker-2" --format "{{.Status}}" 2>/dev/null || echo "not found")
if [[ "$WORKER_1" == *"Up"* ]] && [[ "$WORKER_2" == *"Up"* ]]; then
  echo "   ✅ Both workers are running"
else
  echo "   ⚠️  Workers status: Worker 1: $WORKER_1, Worker 2: $WORKER_2"
fi

echo ""
echo "=========================================="
echo "✅ Staging Environment is Ready!"
echo "=========================================="
echo ""
echo "📊 Service URLs:"
echo "   API:              http://localhost:3000"
echo "   API Health:       http://localhost:3000/api/health?type=deep"
echo "   API Metrics:      http://localhost:3000/api/metrics"
echo "   Grafana:          http://localhost:3001 (admin/admin)"
echo "   Prometheus:       http://localhost:9090"
echo "   PostgreSQL:       localhost:5432"
echo "   Redis:            localhost:6379"
echo ""
echo "👤 Test Users:"
echo "   Free Tier:        free-user@staging.test / TestPassword123!"
echo "   Starter Tier:     starter-user@staging.test / TestPassword123!"
echo "   Professional:     pro-user@staging.test / TestPassword123!"
echo "   Enterprise:       admin@staging.test / TestPassword123!"
echo ""
echo "🔑 Test API Keys:"
echo "   Starter:          fc_staging_starter_test_key_12345"
echo "   Professional:     fc_staging_pro_test_key_12345"
echo "   Enterprise:        fc_staging_enterprise_test_key_12345"
echo ""
echo "📝 Useful Commands:"
echo "   View logs:        docker logs -f fileconverter-api"
echo "   View worker logs: docker logs -f fileconverter-worker-1"
echo "   Stop staging:     ./scripts/stop-staging.sh"
echo "   Restart service:  docker restart fileconverter-api"
echo ""
echo "⚠️  Note: First-time setup may take a few minutes for database initialization"
echo ""

