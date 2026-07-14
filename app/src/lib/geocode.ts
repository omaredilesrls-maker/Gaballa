// Geocodifica con Nominatim (OpenStreetMap): gratuito, senza chiave, ma con
// limite di ~1 richiesta al secondo e obbligo di identificarsi — va bene per
// le ricerche manuali di questa app; per volumi da produzione passare a un
// servizio con chiave API (Google, Mapbox, HERE).
const NOMINATIM = 'https://nominatim.openstreetmap.org';

// Sul web i browser ignorano l'header User-Agent custom (usano il proprio);
// su Android/iOS invece è questo a identificarci come richiesto dalla policy.
const HEADERS = { 'User-Agent': 'MigliorSpesa/1.0 (https://github.com/omaredilesrls-maker/Gaballa)' };

export interface GeoPosition {
  lat: number;
  lon: number;
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  suburb?: string;
  quarter?: string;
  neighbourhood?: string;
}

function cityOf(a: NominatimAddress): string {
  return a.city || a.town || a.village || a.municipality || '';
}

/** CAP (5 cifre) o nome di città/zona -> coordinate + etichetta leggibile. */
export async function geocodePlace(
  query: string
): Promise<{ pos: GeoPosition; label: string } | null> {
  const q = query.trim();
  if (!q) return null;
  const isCap = /^\d{5}$/.test(q);
  const params = isCap
    ? 'postalcode=' + encodeURIComponent(q) + '&countrycodes=it'
    : 'q=' + encodeURIComponent(q + ', Italia') + '&countrycodes=it';
  const res = await fetch(
    NOMINATIM + '/search?format=jsonv2&limit=1&addressdetails=1&' + params,
    { headers: HEADERS }
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as {
    lat: string;
    lon: string;
    name?: string;
    address?: NominatimAddress;
  }[];
  if (!rows.length) return null;
  const r = rows[0];
  const city = cityOf(r.address ?? {});
  const label = isCap ? (city ? city + ', ' + q : 'CAP ' + q) : city || r.name || q;
  return { pos: { lat: parseFloat(r.lat), lon: parseFloat(r.lon) }, label };
}

/** Coordinate GPS -> etichetta tipo "Milano, Navigli". */
export async function reverseLabel(pos: GeoPosition): Promise<string | null> {
  const res = await fetch(
    NOMINATIM +
      '/reverse?format=jsonv2&zoom=14&addressdetails=1&lat=' +
      pos.lat +
      '&lon=' +
      pos.lon,
    { headers: HEADERS }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { address?: NominatimAddress };
  const a = data.address ?? {};
  const city = cityOf(a);
  const zone = a.suburb || a.quarter || a.neighbourhood || '';
  if (city && zone && zone !== city) return city + ', ' + zone;
  return city || zone || null;
}
