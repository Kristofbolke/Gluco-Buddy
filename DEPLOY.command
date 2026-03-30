#!/bin/bash
cd "$(dirname "$0")"

echo "Wat is de omschrijving van je wijziging?"
read -p "> " MSG
MSG="${MSG:-update}"

git pull --rebase origin main
git add -A
git commit -m "$MSG"
git push origin main

echo ""
echo "Klaar! Netlify deployed automatisch."
echo "Druk op Enter om dit venster te sluiten."
read
