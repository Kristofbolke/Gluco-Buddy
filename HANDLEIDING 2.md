# Gluco Buddy — Gebruikershandleiding

> **Versie:** 1.0 · **Doelgroep:** Patiënten met diabetes type 1 en type 2
> **Platform:** Web-app (iPhone, Android, desktop) · Geen installatie vereist

---

## Welkom bij Gluco Buddy

Gluco Buddy is jouw persoonlijke digitale assistent voor het dagelijkse leven met diabetes. De app helpt je om je glucosewaarden bij te houden, je medicatie te beheren, afspraken te plannen en alle medische informatie overzichtelijk te bewaren — alles op één plek, altijd bij de hand.

De app werkt als een **PWA (Progressive Web App)**: je opent hem via de browser op je telefoon of computer, en je kan hem installeren op je thuisscherm alsof het een gewone app is. Er is geen App Store of Google Play voor nodig.

> 📸 *[Screenshot: startscherm van Gluco Buddy op iPhone]*

---

## Inhoudsopgave

1. [Aan de slag — eerste gebruik](#1-aan-de-slag)
2. [Gluco — jouw persoonlijke assistent](#2-gluco)
3. [Glucosemeting invoeren](#3-glucosemeting-invoeren)
4. [Insuline calculator](#4-insuline-calculator)
5. [Medisch Paspoort](#5-medisch-paspoort)
6. [Medicatie & Voorraad](#6-medicatie--voorraad)
7. [HbA1c — historiek & schatting](#7-hba1c)
8. [Bloeddruk](#8-bloeddruk)
9. [Weekpatroon — glucose heatmap](#9-weekpatroon)
10. [Afspraken & Kalender](#10-afspraken--kalender)
11. [Logboek](#11-logboek)
12. [Rapporten voor je arts](#12-rapporten-voor-je-arts)
13. [Sensorbeheer](#13-sensorbeheer)
14. [Beveiligde Documenten Wallet](#14-beveiligde-documenten-wallet)
15. [Handige Tools](#15-handige-tools)
16. [Educatie & Hypo actieplan](#16-educatie--hypo-actieplan)
17. [Prestaties & Badges](#17-prestaties--badges)
18. [Backup & Overdracht tussen toestellen](#18-backup--overdracht-tussen-toestellen)
19. [Instellingen](#19-instellingen)
20. [Privacy & Beveiliging](#20-privacy--beveiliging)
21. [FAQ — Veelgestelde vragen](#21-faq)

---

## 1. Aan de slag

### De app openen en installeren

1. Open de browser op je telefoon (Safari op iPhone, Chrome op Android)
2. Ga naar het adres van de app
3. Tik op **"Deel"** (iPhone) of het menu-icoon (Android) → **"Voeg toe aan beginscherm"**
4. De app verschijnt nu als icoon op je thuisscherm

> 📸 *[Screenshot: "Voeg toe aan beginscherm" op iPhone Safari]*

### Onboarding — jouw profiel aanmaken

Bij het eerste gebruik word je begeleid door een korte onboarding van 5 minuten. Je vult stap voor stap in:

- **Persoonlijke gegevens:** naam, geboortedatum, geslacht, adres, telefoonnummer
- **Medische gegevens:** type diabetes, bloedgroep, glucosemeter, sensortype
- **Insuline:** snelwerkend en/of langwerkend insuline met doses
- **Streefwaarden:** jouw persoonlijke doelwaarden voor glucose en HbA1c
- **Noodcontact:** naam en telefoonnummer van een vertrouwenspersoon
- **Foto of avatar:** voeg een profielfoto toe of kies een avatar

> 📸 *[Screenshot: onboarding stap 1 — persoonlijke gegevens]*

**Heb je al een account op een ander toestel?** Kies dan "Ik heb een koppelcode" en voer de code in die je op het andere toestel hebt aangemaakt. Alle gegevens worden automatisch overgedragen.

**Bestaande gegevens aanpassen?** Je kan de onboarding altijd opnieuw doorlopen via **Meer → Medisch Paspoort → "Laten we elkaar beter leren kennen"**.

---

## 2. Gluco

Gluco is het vriendelijke personage dat je begeleidt doorheen de app. Je vindt Gluco op het meetscherm als een vrolijk karakter met een tekstballon.

> 📸 *[Screenshot: Gluco karakter met tekstballon op het meetscherm]*

**Wat doet Gluco?**
- Gluco spreekt je aan bij naam en geeft persoonlijke boodschappen
- Na een meting reageert Gluco op jouw glucosewaarde met gerichte feedback
- Bij een te lage waarde waarschuwt Gluco direct en geeft concrete actie-instructies
- Bij een hoge waarde geeft Gluco advies en herinnert je aan je insuline

**Tik op Gluco** om een motiverende boodschap te horen. Gluco spreekt via de ingebouwde tekst-naar-spraak van je telefoon in het Nederlands.

De stem van Gluco kan je uitschakelen via **Meer → Instellingen → Stem van Gluco**.

---

## 3. Glucosemeting invoeren

Het meetscherm is het hart van de app. Je bereikt het via de **bloeddruppel-knop** in de navigatiebalk onderaan.

> 📸 *[Screenshot: meetscherm met invoervelden]*

### Een meting invoeren

1. Tik op het **meetmoment** (nuchter, voor maaltijd, na maaltijd, bedtijd, …)
2. Voer je **glucosewaarde** in (in mg/dL)
3. Kies optioneel een **gevoel** (goed, moe, hoofdpijn, …)
4. Voeg een **notitie** toe indien gewenst
5. Tik op **"Opslaan"**

Gluco reageert direct op je waarde met een persoonlijke boodschap.

### Kleurcodering van glucosewaarden

| Kleur | Waarde | Betekenis |
|---|---|---|
| 🔴 Rood | < 70 mg/dL | Te laag — actie vereist |
| 🟠 Oranje | 70–80 mg/dL | Licht aan de lage kant |
| 🟢 Groen | 80–140 mg/dL | Streefbereik |
| 🟡 Geel | 140–180 mg/dL | Licht verhoogd |
| 🔴 Rood | > 180 mg/dL | Te hoog |

### Insuline calculator

Vanuit het meetscherm kan je rechtstreeks naar de **insuline calculator** navigeren om je bolus te berekenen op basis van je huidige glucose en geplande maaltijd.

---

## 4. Insuline Calculator

De insuline calculator helpt je om de juiste insulinedosis te berekenen.

> 📸 *[Screenshot: insuline calculator]*

**Je vindt de calculator via:**
- Het meetscherm (knop na meting)
- Meer → Gezondheid & Behandeling → Insuline calculator

### Hoe werkt de calculator?

1. Voer je **huidige glucosewaarde** in
2. Voer de **koolhydraten** in van je maaltijd (in gram)
3. De app berekent op basis van:
   - Jouw **streefwaarde**
   - Je **insuline/koolhydraat-ratio**
   - Je **correctiefactor**
4. Je krijgt een **aanbevolen dosis** als resultaat

> ⚠️ *De calculator is een hulpmiddel. Volg altijd het advies van jouw behandelend arts.*

---

## 5. Medisch Paspoort

Het medisch paspoort is jouw complete digitale medische identiteitskaart. Artsen, ambulanciers en zorgverleners kunnen in één oogopslag alle cruciale informatie zien.

> 📸 *[Screenshot: medisch paspoort overzicht]*

**Je vindt het paspoort via:** Meer → Medisch Paspoort

### Wat staat er in?

- **Persoonlijke gegevens:** naam, geboortedatum, adres, telefoonnummer
- **Noodcontact:** naam en nummer van je vertrouwenspersoon
- **Allergieën** en bloedgroep (prominent zichtbaar)
- **Diabetestype** en glucosemeter
- **Insulineschema:** snelwerkend en langwerkend met doses
- **Streefwaarden:** nuchter, na maaltijd, HbA1c
- **Medicatie:** volledig overzicht
- **Diabetes team:** endocrinoloog, huisarts, educator, …
- **Rijbewijs:** geldigheid met automatische waarschuwing bij vervaldatum

### Sectie bewerken

Tik op **"✏️ Bewerken"** naast elke sectie om gegevens aan te passen. Wijzigingen worden automatisch opgeslagen.

### PDF genereren

Tik op de rode **📄 PDF** knop bovenaan het paspoort om een professioneel opgemaakt medisch paspoort te genereren. Dit PDF-document bevat:

- Jouw persoonlijke gegevens en foto
- Noodstrip met noodcontact en allergieën
- Insulineschema en streefwaarden
- Volledige medicatielijst
- Diabetes team overzicht

Je kan de PDF afdrukken of digitaal delen met je arts.

> 📸 *[Screenshot: voorbeeld van gegenereerd PDF-paspoort]*

---

## 6. Medicatie & Voorraad

Beheer al je medicatie op één plek — van insulinepens tot bloedverdunner.

> 📸 *[Screenshot: medicatielijst]*

**Je vindt medicatie via:** Meer → Medicatie

### Medicatie toevoegen

Tik op **"+ Medicatie toevoegen"** en vul in:

- **Naam** van het geneesmiddel
- **Sterkte** (bv. 500 mg, 100 IE/ml)
- **Toedieningsvorm** (Tablet, Capsule, Flexpen, Pen, Injectie, …)
- **Indicatie** (Snelwerkende insuline, Traagwerkende insuline, Hart, Bloedverdunner, Hoge bloeddruk, Cardio, Cholesterol, Andere)
- **Dosering** en frequentie
- **Tijdstip** van inname (ochtend, middag, avond, bedtijd, voor/na maaltijd)
- **Voorschrijver** (arts uit jouw team wordt automatisch voorgesteld)
- **Voorraad:** aantal verpakkingen en eenheden per verpakking

### Voorraad bijhouden

De app berekent automatisch hoeveel eenheden/tabletten je nog hebt. Bij een lage voorraad verschijnt er een waarschuwing.

### Tabbladen

- **💊 Medicatie:** jouw geneesmiddelen
- **🧰 Benodigdheden:** insulinepennaalden, teststrips, lancetten, …
- **💉 Doses:** voorgeschreven insulinedoses (snelwerkend per maaltijd, langwerkend)

> 📸 *[Screenshot: medicatie toevoegen formulier]*

---

## 7. HbA1c

Volg je HbA1c-waarden over de tijd en krijg een schatting op basis van je recente glucosemetingen.

> 📸 *[Screenshot: HbA1c historiek grafiek]*

**Je vindt HbA1c via:** Meer → HbA1c

### Wat kan je hier?

- **Nieuwe meting invoeren:** voer je HbA1c in (in % of mmol/mol)
- **Grafiek:** zie de evolutie van al je HbA1c-waarden
- **Schatting:** de app berekent een geschatte HbA1c op basis van je laatste glucosemetingen
- **Converter:** reken snel om tussen % en mmol/mol

---

## 8. Bloeddruk

Registreer en volg je bloeddrukmetingen.

**Je vindt bloeddruk via:** Meer → Bloeddruk

- Voer systolische en diastolische waarde in
- Voeg je hartslag toe
- Bekijk de historiek in een grafiek
- De app geeft aan of je waarden normaal zijn volgens de WHO-richtlijnen

---

## 9. Weekpatroon

De glucose heatmap toont in één oogopslag op welke momenten van de week je glucose het vaakst hoog of laag is.

> 📸 *[Screenshot: weekpatroon heatmap]*

**Je vindt het weekpatroon via:** Meer → Gezondheid & Behandeling → Weekpatroon

- Rijen = dagen van de week
- Kolommen = uren van de dag
- Kleur = gemiddelde glucosewaarde op dat tijdstip
- Ideaal om patronen te herkennen en te bespreken met je arts

---

## 10. Afspraken & Kalender

Beheer al je medische afspraken op één plek.

> 📸 *[Screenshot: afsprakenoverzicht]*

**Je vindt afspraken via:** Meer → Afspraken

### Afspraak toevoegen

- Titel van de afspraak
- Datum en tijdstip
- Arts of locatie
- Notities

Je krijgt een herinnering **1 dag voor de afspraak** via een pushmelding (als je meldingen hebt toegestaan).

---

## 11. Logboek

Het logboek toont een chronologisch overzicht van alle ingevoerde gegevens.

**Je vindt het logboek via:** Meer → Logboek

- Filter op type: glucose, insuline, medicatie, bloeddruk, …
- Blader door de volledige geschiedenis
- Exporteer gegevens voor je arts

---

## 12. Rapporten voor je arts

Genereer professionele medische rapporten om mee te nemen naar je consultatie.

> 📸 *[Screenshot: rapport selectie]*

**Je vindt rapporten via:** Meer → Rapporten

### Beschikbare rapporten

- **Rapport Endocrinoloog:** glucosehistoriek, HbA1c, insulineschema, patronen
- **Rapport Huisarts:** algemeen medisch overzicht, medicatie, bloeddruk

De rapporten openen in een nieuw venster en kunnen afgedrukt of als PDF opgeslagen worden.

> 🔒 *Rapporten bevatten vertrouwelijke medische gegevens. Deel ze enkel met jouw behandelend arts.*

---

## 13. Sensorbeheer

Registreer en beheer je glucosesensor (bv. Freestyle Libre, Dexcom, …).

**Je vindt sensorbeheer via:** Meer → Sensor

- Registreer de startdatum van je huidige sensor
- Je krijgt een melding **3 dagen voor de verwisseldatum**
- Bekijk de geschiedenis van je sensors

### LibreView Import

Heb je een Freestyle Libre? Je kan je glucosegegevens importeren vanuit LibreView:

1. Exporteer een CSV-bestand vanuit LibreView
2. Ga naar **Meer → LibreView Import**
3. Upload het CSV-bestand
4. De app importeert al je glucosewaarden en toont een AI-analyse

---

## 14. Beveiligde Documenten Wallet

Bewaar al je medische documenten veilig in de app.

> 📸 *[Screenshot: documenten wallet]*

**Je vindt de wallet via:** Meer → Documenten

### Toegang met pincode

De wallet is beveiligd met een pincode die je zelf instelt. Niemand anders kan jouw documenten zien.

### Documenten toevoegen

- **Foto nemen** van een document (bv. voorschrift, identiteitskaart)
- **Bestand uploaden** (afbeelding of PDF)
- **Link toevoegen** naar een online document

### Categorieën

- 📋 Toestemming
- 🛡️ Verzekering
- ✈️ Reisdocument
- 🚗 Rijbewijs
- 📁 Andere

PDF-bestanden kunnen rechtstreeks geopend worden via de **"Openen"** knop.

---

## 15. Handige Tools

Een verzameling handige rekentools voor diabetespatiënten.

**Je vindt de tools via:** Meer → Extra & Educatie → Handige Tools

### Glucose Omzetter

Reken snel om tussen **mg/dL** en **mmol/L**. Typ een waarde in één veld en de andere waarde verschijnt automatisch.

> 📸 *[Screenshot: glucose omzetter]*

### BMI Calculator

- Voer je lengte (cm) en gewicht (kg) in
- De app berekent je BMI en toont de WHO-classificatie
- Metingen worden opgeslagen voor historiek

---

## 16. Educatie & Hypo actieplan

### Educatie

Lees infographics en tips over leven met diabetes:
- Wat is diabetes?
- Hypoglycemie herkennen
- Voeding & diabetes
- Bewegen met diabetes

**Je vindt educatie via:** Meer → Extra & Educatie → Educatie

### Hypo Actieplan

Een stap-voor-stap gids voor wat je moet doen bij een hypoglycemie (te lage bloedsuiker).

> 📸 *[Screenshot: hypo actieplan]*

**Je vindt het plan via:** Meer → Extra & Educatie → Hypo actieplan

Het plan is ook direct bereikbaar via de **noodknop** op het startscherm.

---

## 17. Prestaties & Badges

Gluco Buddy beloont je voor consistent gebruik van de app.

**Je vindt prestaties via:** Meer → Prestaties

Verdien badges voor:
- 7 dagen op rij meten (streak)
- Eerste meting invoeren
- Medisch paspoort voltooien
- En nog veel meer…

> 📸 *[Screenshot: badges overzicht]*

---

## 18. Backup & Overdracht tussen toestellen

### Automatische opslag

Al je gegevens worden automatisch opgeslagen op jouw toestel. Je hoeft hier niets voor te doen.

### Backup maken

Maak regelmatig een extra kopie via **Meer → Backup & Sync → Backup downloaden**. Sla dit bestand op in Google Drive of iCloud.

### Gegevens overzetten naar een nieuw toestel

**Stap 1 — Op het oude toestel:**
1. Ga naar Meer → Backup & Sync
2. Tik op tabblad **"📤 Code sturen"**
3. Tik op **"Genereer koppelcode"**
4. Een 6-cijferige code verschijnt (geldig voor 24 uur)

> 📸 *[Screenshot: koppelcode gegenereerd]*

**Stap 2 — Op het nieuwe toestel:**
1. Ga naar Meer → Backup & Sync
2. Tik op tabblad **"📥 Code ontvangen"**
3. Voer de 6 cijfers in
4. Tik op **"📲 Gegevens ophalen"**

Alle gegevens worden overgedragen, inclusief medicatie, afspraken, documenten en medisch paspoort.

> ⚠️ *Dit overschrijft de bestaande gegevens op het nieuwe toestel.*

---

## 19. Instellingen

**Je vindt instellingen via:** Meer → Profiel & Instellingen → Instellingen

### Stem van Gluco

Schakel de stem van Gluco aan of uit. Als de stem aan staat, spreekt Gluco berichten uit via de tekst-naar-spraak van jouw toestel.

### Eenheden

- **Bloedglucose:** mg/dL of mmol/L
- **Gewicht:** kg of lbs
- **Lengte:** cm of ft/in

### App PIN

Beveilig de volledige app met een pincode via **Meer → Profiel & Instellingen → App PIN instellen**.

---

## 20. Privacy & Beveiliging

- **Lokale opslag:** alle gegevens worden opgeslagen op jouw eigen toestel
- **Geen reclame:** de app verzamelt geen gegevens voor commerciële doeleinden
- **Documenten wallet:** beveiligd met een persoonlijke pincode
- **Koppelcodes:** eenmalig te gebruiken en verlopen na 24 uur
- **HTTPS:** alle verbindingen zijn versleuteld

---

## 21. FAQ

**Veelgestelde vragen**

---

**Moet ik een account aanmaken?**
Nee. Je kan de app gebruiken zonder account. Je gegevens worden lokaal op jouw toestel bewaard. Een account is optioneel voor cloudsynchronisatie.

---

**Werkt de app ook zonder internet?**
Ja. De app werkt volledig offline nadat je hem één keer geladen hebt. Alleen de koppelcode-overdracht en LibreView-import hebben een internetverbinding nodig.

---

**Mijn naam verdwijnt na het herladen van de app. Wat moet ik doen?**
Ga naar het Medisch Paspoort en controleer of je naam ingevuld is. Tik op "Opslaan" om de gegevens opnieuw te bewaren. Als het probleem aanhoudt, maak dan een backup en importeer die opnieuw.

---

**Hoe installeer ik de app op mijn iPhone?**
Open de app in Safari → tik op het deelicoon (vierkantje met pijl omhoog) → kies "Zet op beginscherm" → tik op "Voeg toe". De app verschijnt dan als icoon op je thuisscherm.

---

**De app laadt nog de oude versie. Hoe vernieuw ik?**
Op iPhone: verwijder de app van je thuisscherm en installeer hem opnieuw via de browser. Op desktop: druk op Ctrl+Shift+R (Windows) of Cmd+Shift+R (Mac) voor een hard refresh.

---

**Kan ik de app gebruiken op meerdere toestellen tegelijk?**
Ja. Gebruik de koppelcode (Backup & Sync) om gegevens over te zetten. Voor permanente synchronisatie tussen toestellen is een cloudaccount nodig.

---

**Zijn mijn medische gegevens veilig?**
Ja. Je gegevens worden nooit automatisch gedeeld met derden. Alles staat op jouw eigen toestel. De documenten wallet heeft een extra pincodebescherming.

---

**De stem van Gluco werkt niet op mijn iPhone.**
Op iPhone moet je eerst ergens op het scherm tikken voordat de spraak werkt (vereiste van Apple). Tik op het Gluco-karakter om de stem te activeren. Je kan de stem ook uitschakelen via Instellingen.

---

**Hoe deel ik mijn gegevens met mijn arts?**
Ga naar Meer → Rapporten en genereer een rapport voor je endocrinoloog of huisarts. Je kan ook het medisch paspoort als PDF genereren via het paspoort-scherm.

---

**Ik heb mijn pincode vergeten.**
De pincode is lokaal opgeslagen op jouw toestel. Als je hem vergeet, kan je de app resetten via de browserinstellingen (cache wissen). Let op: dit verwijdert ook al je gegevens. Maak daarom altijd regelmatig een backup.

---

**Kan ik de app gebruiken als ik geen insuline gebruik?**
Ja. De app is geschikt voor zowel type 1 als type 2 diabetes, met of zonder insuline. Insulinegerelateerde velden zijn optioneel.

---

**Hoe importeer ik gegevens vanuit LibreView?**
Ga in LibreView naar "Exporteer gegevens" en download een CSV-bestand. Ga daarna in Gluco Buddy naar Meer → LibreView Import, upload het bestand en de app verwerkt je gegevens automatisch.

---

**De app geeft een melding dat mijn rijbewijs vervalt. Wat betekent dat?**
Als je een rijbewijsdatum hebt ingevuld in het Medisch Paspoort, waarschuwt de app je wanneer de vervaldatum nadert. Dit is een herinnering om je rijbewijs tijdig te verlengen. Voor diabetespatiënten gelden specifieke medische attesten — bespreek dit met je arts.

---

*Gluco Buddy — Ontwikkeld met zorg voor mensen met diabetes.*
*Voor medisch advies raadpleeg je altijd jouw behandelend arts of diabetesteam.*
