/**
 * Gluco Buddy — Web Push Sender
 * Netlify Scheduled Function: elke minuut uitvoeren
 *
 * Werking:
 * 1. Haal alle actieve push subscriptions op uit Supabase
 * 2. Haal reminder-instellingen op per gebruiker
 * 3. Stuur push als het juiste tijdstip bereikt is
 */

const webpush = require('web-push');

const SUPABASE_URL  = process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY; // service_role key (niet anon!)
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL   = process.env.VAPID_EMAIL || 'mailto:admin@glucobuddy.app';

// ─── Supabase helpers ────────────────────────────────────────────────────────

async function supabaseQuery(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error ${res.status}: ${err}`);
  }
  return res.json();
}

// ─── Tijdsvergelijking ───────────────────────────────────────────────────────

function tijdMatchNu(tijdStr) {
  if (!tijdStr) return false;
  const now = new Date();
  const [hh, mm] = tijdStr.split(':').map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const remMin = hh * 60 + mm;
  return Math.abs(nowMin - remMin) <= 1; // ±1 minuut venster
}

// ─── Hoofdlogica ─────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  if (!SUPABASE_URL || !SUPABASE_KEY || !VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.error('[Push] Omgevingsvariabelen ontbreken');
    return { statusCode: 500, body: 'Config ontbreekt' };
  }

  // Initialiseer web-push met VAPID sleutels
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

  let verzonden = 0;
  let fouten = 0;

  try {
    // Haal alle actieve subscriptions op
    const subscriptions = await supabaseQuery(
      'push_subscriptions?select=*&active=eq.true'
    );

    console.log(`[Push] ${subscriptions.length} actieve subscriptions`);

    for (const sub of subscriptions) {
      try {
        const subscription = sub.subscription_data;
        const reminders = sub.reminders_data || {};
        const userId = sub.user_id;

        // Berichten om te versturen
        const messages = [];

        // 1. Glucose herinneringen
        if (reminders.glucoseEnabled && Array.isArray(reminders.glucoseTimes)) {
          for (const r of reminders.glucoseTimes) {
            if (r.enabled && tijdMatchNu(r.time)) {
              messages.push({
                title: '🩸 Glucose meting',
                body: `Tijd om je glucose te meten (${r.time})`,
                tag: `glu-${r.time}`,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png'
              });
            }
          }
        }

        // 2. Medicatie herinneringen
        if (reminders.medsEnabled && Array.isArray(reminders.medTimes)) {
          for (const r of reminders.medTimes) {
            if (r.enabled && tijdMatchNu(r.time)) {
              const medNamen = Array.isArray(r.meds) ? r.meds.join(', ') : 'jouw medicatie';
              messages.push({
                title: '💊 Medicatie',
                body: `Tijd voor: ${medNamen} (${r.label || r.time})`,
                tag: `med-${r.time}-${r.block}`,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                requireInteraction: true
              });
            }
          }
        }

        // 3. Sensor waarschuwingen (dagelijks 08:00 check)
        if (tijdMatchNu('08:00') && sub.sensor_data) {
          const sensor = sub.sensor_data;
          if (sensor.start && sensor.duration) {
            const sEnd = new Date(sensor.start);
            sEnd.setDate(sEnd.getDate() + parseInt(sensor.duration));
            const daysLeft = Math.ceil((sEnd - new Date()) / 86400000);
            const sw = reminders.sensorWarnings || {};
            [7, 3, 1, 0].forEach(d => {
              if (sw[d] && daysLeft === d) {
                const msg = d === 0 ? 'Sensor is vandaag verlopen — vervang nu!' :
                            d === 1 ? 'Sensor vervalt morgen — zet een nieuwe klaar' :
                            `Sensor vervalt over ${d} dagen`;
                messages.push({
                  title: '📡 Sensor waarschuwing',
                  body: msg,
                  tag: `sensor-${d}`,
                  icon: '/icons/icon-192x192.png',
                  requireInteraction: true
                });
              }
            });
          }
        }

        // 4. Afspraken herinneringen (30 min voor)
        if (Array.isArray(sub.appointments)) {
          const now = new Date();
          for (const appt of sub.appointments) {
            if (!appt.date || !appt.time) continue;
            const apptDate = new Date(`${appt.date}T${appt.time}`);
            const minsDiff = Math.round((apptDate - now) / 60000);
            if (minsDiff >= 29 && minsDiff <= 31) {
              messages.push({
                title: '📅 Afspraak herinnering',
                body: `${appt.title || 'Afspraak'} begint over 30 minuten`,
                tag: `appt-${appt.date}-${appt.time}`,
                icon: '/icons/icon-192x192.png',
                requireInteraction: true
              });
            }
          }
        }

        // Verstuur alle berichten via web-push (met correcte encryptie)
        for (const msg of messages) {
          try {
            await webpush.sendNotification(subscription, JSON.stringify(msg));
            verzonden++;
            console.log(`[Push] ✅ Verzonden naar ${userId}: ${msg.title}`);
          } catch (pushErr) {
            if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
              // Subscription verlopen — deactiveer
              await supabaseQuery(
                `push_subscriptions?user_id=eq.${userId}`,
                { method: 'PATCH', body: JSON.stringify({ active: false }) }
              );
              console.log(`[Push] ⚠️ Subscription verlopen voor ${userId} — gedeactiveerd`);
            } else {
              fouten++;
              console.warn(`[Push] ❌ Fout ${pushErr.statusCode} voor ${userId}:`, pushErr.body);
            }
          }
        }

      } catch (subErr) {
        fouten++;
        console.error('[Push] Fout bij subscription:', subErr.message);
      }
    }

  } catch (err) {
    console.error('[Push] Algemene fout:', err);
    return { statusCode: 500, body: err.message };
  }

  console.log(`[Push] Klaar: ${verzonden} verzonden, ${fouten} fouten`);
  return {
    statusCode: 200,
    body: JSON.stringify({ verzonden, fouten })
  };
};
