import { haversineKm } from '../data';
import { GeoPosition } from './geocode';

// Negozi reali da OpenStreetMap via Overpass API: gratuito e senza chiave,
// adatto alle ricerche manuali di questa app (non a volumi da produzione).
// Scarichiamo tutti i supermercati nel raggio e filtriamo le catene qui:
// le query con regex sul server vengono spesso rifiutate dal suo firewall.
// Il rate limit è severo (poche richieste ravvicinate per IP): il chiamante
// deve evitare chiamate duplicate, e in caso di rifiuto proviamo un mirror.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

interface OverpassElement {
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string; brand?: string };
}

/**
 * Distanza (km) dal supermercato reale più vicino di ogni catena, entro il
 * raggio dato. Le catene senza negozi nel raggio non compaiono nel risultato
 * (il chiamante tiene la distanza di ripiego). Chiavi: nome catena minuscolo.
 */
export async function nearbyChainDistancesKm(
  pos: GeoPosition,
  chainNames: string[],
  radiusKm = 15
): Promise<Record<string, number>> {
  const query =
    '[out:json][timeout:25];nwr["shop"="supermarket"](around:' +
    Math.round(radiusKm * 1000) +
    ',' +
    pos.lat +
    ',' +
    pos.lon +
    ');out center tags;';
  // I server Overpass rifiutano o falliscono a intermittenza (406/504 anche
  // su richieste identiche): proviamo entrambi gli endpoint più volte, con
  // una pausa crescente tra i giri.
  let data: { elements?: OverpassElement[] } | null = null;
  let lastError: unknown = new Error('Overpass non raggiungibile');
  attempts: for (let round = 0; round < 3; round++) {
    if (round > 0) await new Promise(r => setTimeout(r, 2000 * round));
    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'data=' + encodeURIComponent(query),
        });
        if (!res.ok) throw new Error('Overpass HTTP ' + res.status);
        data = (await res.json()) as { elements?: OverpassElement[] };
        break attempts;
      } catch (err) {
        lastError = err;
      }
    }
  }
  if (!data) throw lastError;

  const wanted = chainNames.map(n => n.toLowerCase());
  const best: Record<string, number> = {};
  for (const el of data.elements ?? []) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    // "Ipercoop", "Conad City", "Carrefour Market"... contano per la catena.
    const text = ((el.tags?.brand ?? '') + ' ' + (el.tags?.name ?? '')).toLowerCase();
    const chain = wanted.find(c => text.includes(c));
    if (!chain) continue;
    const km = haversineKm(pos, { lat, lon });
    if (best[chain] == null || km < best[chain]) best[chain] = km;
  }
  return best;
}
