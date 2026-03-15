/**
 * Gluco Buddy — AI Glucose Analyse
 * Netlify Function: POST /api/analyse-glucose
 *
 * Body: { readings: [{value, time, date, ctx, meal, isoDate}], profile: {naam, geb, ...} }
 * Returns: { analysis: "..." }
 */

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY niet geconfigureerd in Netlify omgevingsvariabelen.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige JSON' }) };
  }

  const { readings = [], profile = {} } = body;
  if (readings.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Geen metingen meegestuurd' }) };
  }

  // Build compact statistics for the prompt
  const values = readings.map(r => r.value);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const inRange = values.filter(v => v >= 70 && v <= 180).length;
  const low = values.filter(v => v < 70).length;
  const high = values.filter(v => v > 180).length;
  const tir = Math.round(inRange / values.length * 100);
  const tirLow = Math.round(low / values.length * 100);
  const tirHigh = Math.round(high / values.length * 100);

  // Estimate HbA1c (Nathan formula, mg/dL)
  const hba1c = ((avg + 46.7) / 28.7).toFixed(1);

  // Date range
  const dates = readings
    .map(r => r.isoDate || r.date || '')
    .filter(Boolean)
    .sort();
  const fromDate = dates[0] || '';
  const toDate = dates[dates.length - 1] || '';

  // Meal-based averages
  const mealGroups = { breakfast: [], lunch: [], dinner: [], bedtime: [] };
  readings.forEach(r => {
    if (mealGroups[r.meal]) mealGroups[r.meal].push(r.value);
  });
  const mealAvgs = Object.entries(mealGroups).map(([meal, vals]) => {
    if (vals.length === 0) return null;
    const a = Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
    const label = { breakfast: 'Ochtend', lunch: 'Middag', dinner: 'Avond', bedtime: 'Nacht' }[meal];
    return `${label}: ${a} mg/dL (n=${vals.length})`;
  }).filter(Boolean).join(', ');

  // Sample high + low readings (for context)
  const highs = readings.filter(r => r.value > 180).slice(0, 5).map(r => `${r.value} mg/dL (${r.date} ${r.time} - ${r.ctx})`).join('; ');
  const lows = readings.filter(r => r.value < 70).slice(0, 5).map(r => `${r.value} mg/dL (${r.date} ${r.time} - ${r.ctx})`).join('; ');

  const prompt = `Je bent een diabetesassistent die patiëntlogboekdata analyseert. Schrijf een vriendelijke, begrijpelijke analyse in het Nederlands. Gebruik duidelijke taal — geen medisch jargon. Geef altijd aan dat de patiënt deze inzichten moet bespreken met hun arts of endocrinoloog.

PATIËNTPROFIEL:
- Naam: ${profile.naam || 'onbekend'}
- Geboortedatum: ${profile.geb || 'onbekend'}
- Diabetes type: ${profile.diabetesType || 'onbekend'}
- Medicatie: ${profile.meds || 'onbekend'}

GLUCOSEDATA (${readings.length} metingen, periode ${fromDate} t/m ${toDate}):
- Gemiddelde: ${avg} mg/dL
- Min / Max: ${min} / ${max} mg/dL
- Geschat HbA1c: ${hba1c}%
- Tijd in bereik (70-180): ${tir}% (${inRange} metingen)
- Laag (<70): ${tirLow}% (${low} metingen)
- Hoog (>180): ${tirHigh}% (${high} metingen)
- Per maaltijdmoment: ${mealAvgs || 'onvoldoende data'}
${highs ? '- Voorbeelden hoge waarden: ' + highs : ''}
${lows ? '- Voorbeelden lage waarden: ' + lows : ''}

Schrijf een analyse met deze secties (gebruik emoji-koppen):
1. 📊 Samenvatting (2-3 zinnen over het grote geheel)
2. ✅ Wat gaat goed (positieve patronen)
3. ⚠️ Aandachtspunten (patronen die aandacht verdienen)
4. 🍽️ Per maaltijdmoment (wat valt op per dagdeel)
5. 💡 Concrete tips (2-3 praktische suggesties)
6. 👨‍⚕️ Bespreek met je arts (wat is het meest belangrijk om te bespreken)

Houd elke sectie kort (2-4 zinnen). Vermijd paniek-taal. Geef altijd hoop en context.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error('Anthropic API fout: ' + err);
    }

    const data = await response.json();
    const analysis = data.content[0].text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis, stats: { avg, min, max, tir, tirLow, tirHigh, hba1c, total: readings.length } })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI analyse mislukt: ' + err.message })
    };
  }
};
