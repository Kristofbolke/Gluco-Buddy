# 🚀 Gluco Buddy — Deployment & Web Push handleiding

## Overzicht van de bestanden

```
je-github-repo/
  index.html                          ← app (bijgewerkt)
  sw.js                               ← service worker v4 (bijgewerkt)
  netlify.toml                        ← Netlify config (bijgewerkt)
  netlify/
    functions/
      send-push.js                    ← NIEUW: Web Push backend
  manifest.json                       ← ongewijzigd
  icons/                              ← ongewijzigd
```

---

## STAP 1 — GitHub repository bijwerken

Upload deze bestanden naar je GitHub repo:
- `index.html` (vervangen)
- `sw.js` (vervangen)
- `netlify.toml` (vervangen)
- `netlify/functions/send-push.js` (NIEUW — maak de map aan)

**Let op de mappenstructuur:** `netlify/functions/send-push.js`
Zorg dat de map `netlify/functions/` bestaat in je repo.

---

## STAP 2 — Supabase database tabel aanmaken

1. Ga naar **supabase.com** → jouw project
2. Klik links op **"SQL Editor"**
3. Klik op **"New query"**
4. Kopieer de volledige inhoud van `supabase_push_table.sql` en plak die in het venster
5. Klik **"Run"**
6. Je ziet "Success" als alles goed gaat

---

## STAP 3 — Supabase Service Role Key ophalen

De Netlify functie heeft een speciale sleutel nodig die meer rechten heeft dan de gewone "anon" key.

1. Ga naar **supabase.com** → jouw project
2. Klik links op **"Project Settings"** → **"API"**
3. Zoek naar **"service_role"** key (NIET de anon key!)
4. Kopieer deze sleutel (begint met `eyJ...`)
5. Bewaar deze veilig — gebruik hem nergens in de frontend!

---

## STAP 4 — Van GitHub Pages naar Netlify migreren

### 4a. Account aanmaken
1. Ga naar **netlify.com**
2. Klik "Sign up" → "Continue with GitHub"
3. Geef Netlify toegang tot je repositories

### 4b. Site deployen
1. Klik **"Add new site"** → **"Import an existing project"**
2. Kies **"Deploy with GitHub"**
3. Selecteer je Gluco Buddy repository
4. Build settings:
   - Build command: *(leeg laten)*
   - Publish directory: `.` (één punt)
5. Klik **"Deploy site"**
6. Na ±30 seconden is je app live op een netlify.app URL

### 4c. Eigen domein (optioneel)
- In Netlify → "Domain management" → "Add custom domain"

---

## STAP 5 — Omgevingsvariabelen instellen in Netlify

1. Ga in Netlify naar **Site settings** → **Environment variables**
2. Voeg deze 5 variabelen toe (klik telkens "Add variable"):

| Key | Waarde |
|-----|--------|
| `SUPABASE_URL` | `https://puucrpgyaexiiuykdmgr.supabase.co` |
| `SUPABASE_SERVICE_KEY` | *(de service_role key uit Stap 3)* |
| `VAPID_PUBLIC_KEY` | `BDsoPhra_iC5S-vFCBeym3mHp7mVfzSG54TCwY8lRXmbWo3l78cNxleLQX2Fwko4JMfmt7sGUEAf1Gw-rK2VQhc` |
| `VAPID_PRIVATE_KEY` | `eVr-9dgfEEbForKoNijLhfyQTC59qZwaBfJF8thvhaM` |
| `VAPID_EMAIL` | `mailto:jouw@emailadres.be` |
| `ANTHROPIC_API_KEY` | *(jouw Anthropic API key — voor de AI analyse van LibreView data)* |

> **ANTHROPIC_API_KEY ophalen:**
> 1. Ga naar **console.anthropic.com**
> 2. Klik op **"API Keys"** → **"Create Key"**
> 3. Kopieer de key (begint met `sk-ant-...`)
> 4. Plak als waarde voor `ANTHROPIC_API_KEY` in Netlify
>
> *Zonder deze key werkt de CSV-import nog steeds, maar de AI-analyse is niet beschikbaar.*

3. Klik **"Save"**
4. Herstart de deploy: **Deploys** → **"Trigger deploy"** → **"Deploy site"**

---

## STAP 6 — Web Push activeren in de app

1. Open de app op je Netlify URL
2. Ga naar **Meer** → **Herinneringen**
3. Bovenaan zie je de donkere **"Web Push Notificaties"** kaart
4. Klik **"🔕 Push inschakelen"**
5. De browser vraagt toestemming → klik **"Toestaan"**
6. De knop wordt groen: **"🔔 Push uitschakelen"**

✅ Klaar! Je ontvangt nu notificaties ook als de app gesloten is.

---

## Hoe werkt het?

```
Netlify cron (elke minuut)
  → send-push.js wordt uitgevoerd
  → haalt subscriptions op uit Supabase
  → vergelijkt tijdstip met ingestelde herinneringen
  → stuurt Web Push bericht naar jouw browser/telefoon
  → browser toont notificatie (ook als app gesloten is)
```

### Wat wordt verstuurd:
- 🩸 **Glucose meting** — op de tijdstippen die je instelt
- 💊 **Medicatie** — op de tijdstippen van je medicatielijst
- 📡 **Sensor waarschuwing** — 7, 3, 1, 0 dagen voor vervaldatum
- 📅 **Afspraken** — 30 minuten voor elke afspraak

---

## Gratis limieten (meer dan voldoende)

| Service | Gratis tier |
|---------|-------------|
| Netlify | 125.000 functie-aanroepen/maand (= 2/min × 60 × 24 × 30) |
| Supabase | 500 MB database, 2 GB bandbreedte |
| Web Push | Volledig gratis (browser-native) |

---

## Problemen oplossen

**Push werkt niet na instellen:**
- Controleer of alle 5 omgevingsvariabelen correct zijn in Netlify
- Controleer of de Supabase tabel aangemaakt is (Stap 2)
- Bekijk de functie-logs: Netlify → Functions → send-push → Logs

**"Push inschakelen" knop reageert niet:**
- Controleer of je HTTPS gebruikt (Push werkt niet op HTTP)
- Controleer browserinstellingen → Notificaties toestaan voor deze site

**Subscriptions verlopen:**
- Dit is normaal na ±30 dagen of als je browser/toestel gewisseld is
- Klik opnieuw op "Push inschakelen" in de app

---

## Jouw VAPID sleutels (bewaar deze veilig!)

```
PUBLIC:  BDsoPhra_iC5S-vFCBeym3mHp7mVfzSG54TCwY8lRXmbWo3l78cNxleLQX2Fwko4JMfmt7sGUEAf1Gw-rK2VQhc
PRIVATE: eVr-9dgfEEbForKoNijLhfyQTC59qZwaBfJF8thvhaM
```

⚠️ De private key mag NOOIT in je frontend code of GitHub repo staan.
Hij staat alleen als omgevingsvariabele in Netlify.
