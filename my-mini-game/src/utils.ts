import { EARTH_RADIUS } from "./constants";

export function calculateDistance(
  pos1: { lat: number | null; lng: number | null },
  pos2: { lat: number | null; lng: number | null }
): number {
  if (
    pos1.lat === null ||
    pos1.lng === null ||
    pos2.lat === null ||
    pos2.lng === null
  ) {
    return 0; // or an appropriate default value
  }

  const R = EARTH_RADIUS; // meters
  const rad = Math.PI / 180;
  const lat1 = pos1.lat * rad;
  const lat2 = pos2.lat * rad;
  const deltaLat = (pos2.lat - pos1.lat) * rad;
  const deltaLng = (pos2.lng - pos1.lng) * rad;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
