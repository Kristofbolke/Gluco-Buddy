#!/bin/bash
# ============================================
# Gluco Buddy - Deploy naar Netlify
# Gebruik:
#   ./deploy.sh          -> preview deploy (draft URL)
#   ./deploy.sh --prod   -> productie deploy (live site)
# ============================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

PROD=false
if [[ "$1" == "--prod" ]]; then
  PROD=true
fi

echo "============================================"
echo "  Gluco Buddy - Deploy naar Netlify"
echo "============================================"
echo ""

# Controleer of netlify CLI beschikbaar is
if ! command -v netlify &>/dev/null; then
  echo "Netlify CLI niet gevonden. Installeren via npx..."
  USE_NPX=true
else
  USE_NPX=false
fi

# Controleer of node_modules aanwezig is
if [ ! -d "node_modules" ]; then
  echo "node_modules niet gevonden. Afhankelijkheden installeren..."
  npm install
  echo ""
fi

# Git status tonen
echo "--- Git status ---"
git status --short
echo ""

# Controleer of er uncommitted wijzigingen zijn bij productie deploy
if [ "$PROD" = true ]; then
  if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "WAARSCHUWING: Er zijn niet-gecommitte wijzigingen."
    read -p "Toch deployen naar productie? (j/N): " CONFIRM
    if [[ "$CONFIRM" != "j" && "$CONFIRM" != "J" ]]; then
      echo "Deploy geannuleerd."
      exit 0
    fi
    echo ""
  fi
fi

# Deploy uitvoeren
if [ "$PROD" = true ]; then
  echo "PRODUCTIE deploy starten..."
  echo ""
  if [ "$USE_NPX" = true ]; then
    npx netlify-cli deploy --prod --dir="."
  else
    netlify deploy --prod --dir="."
  fi
  echo ""
  echo "Productie deploy voltooid!"
else
  echo "PREVIEW deploy starten (draft URL)..."
  echo "Tip: gebruik './deploy.sh --prod' voor de live site."
  echo ""
  if [ "$USE_NPX" = true ]; then
    npx netlify-cli deploy --dir="."
  else
    netlify deploy --dir="."
  fi
  echo ""
  echo "Preview deploy voltooid! Gebruik de URL hierboven om te bekijken."
fi
