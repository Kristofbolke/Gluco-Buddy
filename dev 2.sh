#!/bin/bash
# ============================================
# Gluco Buddy - Lokale preview
# Gebruik: ./dev.sh
# ============================================

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

PORT=8888

echo "============================================"
echo "  Gluco Buddy - Lokale preview"
echo "============================================"
echo ""
echo "App bereikbaar op: http://localhost:$PORT"
echo "Druk op Ctrl+C om te stoppen."
echo ""

# Start statische server
python3 -m http.server $PORT
