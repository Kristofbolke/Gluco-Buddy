#!/bin/bash
# ============================================
# Gluco Buddy - Push naar GitHub
# Netlify deployed automatisch na de push.
# Gebruik: ./push.sh "omschrijving van de wijziging"
# ============================================

cd "$(dirname "$0")"

MSG="${1:-update}"

git add -A
git commit -m "$MSG"
git push origin main

echo ""
echo "Gepusht naar GitHub. Netlify deployed automatisch."
