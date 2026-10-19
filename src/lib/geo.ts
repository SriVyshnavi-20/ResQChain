export interface Coords {
  lat: number;
  lng: number;
}

/** Resolves the device position, or null if unavailable/denied/timed out. Never throws. */
export function getPosition(timeoutMs = 8000): Promise<Coords | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 60_000 }
    );
  });
}

export const formatCoords = (c: Coords) => `${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`;
