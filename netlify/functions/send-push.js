/**
 * Gluco Buddy — Web Push Sender
 * Netlify Scheduled Function: elke minuut uitvoeren
 * 
 * Werking:
 * 1. Haal alle actieve push subscriptions op uit Supabase
 * 2. Haal reminder-instellingen op per gebruiker
 * 3. Stuur push als het juiste tijdstip bereikt is
 */

const SUPABASE_URL    = process.env.SUPABASE_URL;
const SUPABASE_KEY    = process.env.SUPABASE_SERVICE_KEY; // service_role key (niet anon!)
const VAPID_PUBLIC    = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE   = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL     = process.env.VAPID_EMAIL || 'mailto:admin@glucobuddy.app';

// ─── VAPID JWT helpers (geen externe deps nodig) ─────────────────────────────

function b64url(data) {
  const buf = typeof data === 'string' ? Buffer.from(data) : data;
  return buf.toString('base64url');
}

function b64urlDecode(str) {
  return Buffer.from(str.replace(/-/g,'+').replace(/_/g,'/'), 'base64');
}

async function makeVapidJWT(audience) {
  const header  = b64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = b64url(JSON.stringify({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 3600,
    sub: VAPID_EMAIL
  }));
  const unsigned = `${header}.${payload}`;

  // Importeer VAPID private key (raw P-256 scalar)
  const privBytes = b64urlDecode(VAPID_PRIVATE);
  // Zet om naar PKCS8 DER formaat
  const pkcs8 = buildPKCS8(privBytes);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', pkcs8,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    Buffer.from(unsigned)
  );
  return `${unsigned}.${b64url(new Uint8Array(sig))}`;
}

function buildPKCS8(rawPriv) {
  // PKCS8 wrapper voor P-256 private key
  const oid = Buffer.from('301306072a8648ce3d020106082a8648ce3d030107', 'hex');
  const privKey = Buffer.concat([
    Buffer.from('020100', 'hex'),
    oid,
    Buffer.from('0422', 'hex'), // OCTET STRING, 34 bytes
    Buffer.from('0420', 'hex'), // inner OCTET STRING, 32 bytes
    rawPriv
  ]);
  const seq = Buffer.concat([
    Buffer.from('30', 'hex'),
    encodeLength(privKey.length),
    privKey
  ]);
  return seq.buffer.slice(seq.byteOffset, seq.byteOffset + seq.byteLength);
}

function encodeLength(len) {
  if (len < 128) return Buffer.from([len]);
  if (len < 256) return Buffer.from([0x81, len]);
  return Buffer.from([0x82, len >> 8, len & 0xff]);
}

// ─── Web Push verzenden ──────────────────────────────────────────────────────

async function sendPush(subscription, payload) {
  const endpoint = subscription.endpoint;
  const origin = new URL(endpoint).origin;
  const jwt = await makeVapidJWT(origin);
  const authHeader = `vapid t=${jwt},k=${VAPID_PUBLIC}`;

  // Payload encrypteren (ECE - maar we sturen plain JSON via GCM/FCM die zelf encrypteert)
  // Voor eenvoud: gebruik unencrypted push (werkt met moderne browsers)
  const body = JSON.stringify(payload);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'TTL': '86400',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body).toString()
    },
    body
  });

  return { status: res.status, ok: res.ok };
}

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

function daysUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target - now) / 86400000);
}

// ─── Hoofdlogica ─────────────────────────────────────────────────────────────

export const handler = async (event) => {
  if (!SUPABASE_URL || !SUPABASE_KEY || !VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.error('[Push] Omgevingsvariabelen ontbreken');
    return { statusCode: 500, body: 'Config ontbreekt' };
  }

  let verzonden = 0;
  let fouten = 0;

  try {
    // Haal alle actieve subscriptions op
    const subscriptions = await supabaseQuery(
      'push_subscriptions?select=*&active=eq.true',
      { headers: { 'Prefer': 'return=representation' } }
    );

    console.log(`[Push] ${subscriptions.length} actieve subscriptions`);

    for (const sub of subscriptions) {
      try {
        const subscription = sub.subscription_data;
        const reminders = sub.reminders_data || {};
        const userId = sub.user_id;
        const userTz = sub.timezone || 'Europe/Brussels';

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

        // Verstuur alle berichten
        for (const msg of messages) {
          const result = await sendPush(subscription, msg);
          if (result.ok) {
            verzonden++;
            console.log(`[Push] ✅ Verzonden naar ${userId}: ${msg.title}`);
          } else if (result.status === 410 || result.status === 404) {
            // Subscription verlopen — deactiveer
            await supabaseQuery(
              `push_subscriptions?user_id=eq.${userId}`,
              { method: 'PATCH', body: JSON.stringify({ active: false }) }
            );
            console.log(`[Push] ⚠️ Subscription verlopen voor ${userId} — gedeactiveerd`);
          } else {
            fouten++;
            console.warn(`[Push] ❌ Fout ${result.status} voor ${userId}`);
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
