#!/bin/bash
# Measure Performance Baseline
# Runs each conversion 5 times and calculates average

set -e

API_URL="${API_URL:-http://localhost:3000}"
API_KEY="fc_staging_pro_test_key_12345"
RESULTS_FILE="qa-results/performance-baseline.csv"

mkdir -p qa-results

echo "=========================================="
echo "Performance Baseline Measurement"
echo "=========================================="
echo ""

# Function to measure conversion time
measure_conversion() {
  local file=$1
  local source=$2
  local target=$3
  local test_name="${source}_to_${target}"
  
  echo "Measuring: $source → $target"
  echo "File: $file"
  echo ""
  
  local times=()
  
  for run in {1..5}; do
    echo -n "  Run $run/5: "
    
    # Submit conversion
    START_TIME=$(date +%s%N)
    RESPONSE=$(curl -s -X POST "$API_URL/api/convert" \
      -H "X-API-Key: $API_KEY" \
      -F "file=@$file" \
      -F "sourceFormat=$source" \
      -F "targetFormat=$target")
    
    # Get job ID
    JOB_ID=$(echo "$RESPONSE" | jq -r '.conversionId // .job_id // .id' 2>/dev/null || echo "")
    
    if [ -z "$JOB_ID" ] || [ "$JOB_ID" = "null" ]; then
      echo "❌ Failed to submit"
      continue
    fi
    
    # Wait for completion
    MAX_WAIT=300
    ELAPSED=0
    while [ $ELAPSED -lt $MAX_WAIT ]; do
      STATUS_RESPONSE=$(curl -s -H "X-API-Key: $API_KEY" "$API_URL/api/conversions/$JOB_ID")
      STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status' 2>/dev/null || echo "unknown")
      
      if [ "$STATUS" = "completed" ]; then
        END_TIME=$(date +%s%N)
        DURATION_MS=$(( (END_TIME - START_TIME) / 1000000 ))
        DURATION_S=$(echo "scale=2; $DURATION_MS / 1000" | bc)
        times+=($DURATION_S)
        echo "${DURATION_S}s"
        break
      elif [ "$STATUS" = "failed" ]; then
        echo "❌ Failed"
        break
      fi
      
      sleep 2
      ELAPSED=$((ELAPSED + 2))
    done
    
    if [ $ELAPSED -ge $MAX_WAIT ]; then
      echo "⏱️  Timeout"
    fi
  done
  
  # Calculate statistics
  if [ ${#times[@]} -gt 0 ]; then
    # Sort times
    IFS=$'\n' sorted=($(sort -n <<<"${times[*]}"))
    unset IFS
    
    MIN=${sorted[0]}
    MAX=${sorted[${#sorted[@]}-1]}
    
    # Calculate average
    SUM=0
    for t in "${times[@]}"; do
      SUM=$(echo "$SUM + $t" | bc)
    done
    AVG=$(echo "scale=2; $SUM / ${#times[@]}" | bc)
    
    echo ""
    echo "  Results:"
    echo "    Min: ${MIN}s"
    echo "    Avg: ${AVG}s"
    echo "    Max: ${MAX}s"
    echo ""
    
    # Determine baseline and pass status
    case "$test_name" in
      docx_to_pdf|xlsx_to_csv)
        BASELINE=10
        ;;
      png_to_jpg|pptx_to_pdf)
        BASELINE=30
        ;;
      *)
        BASELINE=30
        ;;
    esac
    
    PASS="❌"
    if (( $(echo "$AVG <= $BASELINE" | bc -l) )); then
      PASS="✅"
    fi
    
    echo "$test_name,$MIN,$AVG,$MAX,$BASELINE,$PASS" >> "$RESULTS_FILE"
  else
    echo "  ⚠️  No successful runs"
    echo "$test_name,-,-,-,$BASELINE,❌" >> "$RESULTS_FILE"
  fi
  
  echo "----------------------------------------"
  echo ""
}

# Initialize results file
echo "Conversion,Min(s),Avg(s),Max(s),Baseline(s),Pass" > "$RESULTS_FILE"

# Measure each conversion
if [ -f "test-fixtures/valid/sample-2mb.docx" ]; then
  measure_conversion "test-fixtures/valid/sample-2mb.docx" "docx" "pdf"
fi

if [ -f "test-fixtures/valid/sample-5mb.xlsx" ]; then
  measure_conversion "test-fixtures/valid/sample-5mb.xlsx" "xlsx" "csv"
fi

if [ -f "test-fixtures/valid/sample-20mb.png" ]; then
  measure_conversion "test-fixtures/valid/sample-20mb.png" "png" "jpg"
fi

if [ -f "test-fixtures/valid/sample-10mb.pptx" ]; then
  measure_conversion "test-fixtures/valid/sample-10mb.pptx" "pptx" "pdf"
fi

echo "=========================================="
echo "Performance Measurement Complete"
echo "=========================================="
echo ""
echo "Results saved to: $RESULTS_FILE"
echo ""
cat "$RESULTS_FILE"

