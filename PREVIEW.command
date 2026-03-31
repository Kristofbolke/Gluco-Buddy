#!/bin/bash
# Test op een tijdelijke preview URL — live site blijft onaangeroerd
cd "$(dirname "$0")"

if ! command -v netlify &>/dev/null; then
  npx netlify-cli deploy --dir="." 2>&1 | grep -E "Website Draft URL|Draft URL|https://"
else
  netlify deploy --dir="." 2>&1 | grep -E "Website Draft URL|Draft URL|https://"
fi

echo ""
echo "Test de preview URL hierboven voor je live deployt."
echo "Druk op Enter om te sluiten."
read
