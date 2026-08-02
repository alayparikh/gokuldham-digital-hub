// Fallbacks used when a `site_settings` row is missing. The database is the source of
// truth — edit these values in /admin, not here.

export const SITE_INFO = {
  name: "Gokuldham Haveli",
  taglineGu: "મારું ગોકુલધામ, તારું ગોકુલધામ આપણું ગોકુલધામ",
  address: "2397 Satellite Blvd NE, Buford, GA 30518",
  phone: "(770) 492-4346",
  email: "shrinathjihaveliatlanta@gmail.com",
  prasadamUrl: "https://online.gokuldham.org",
  summerCampRegistrationUrl: "https://online.gokuldham.org/registrations/summercamp",
} as const;

// The initial migration seeded invented contact details. Those rows are still live in
// some databases, so treat those exact strings as unset and fall back to SITE_INFO.
// Once the rows are corrected this guard is inert; any other admin-entered value wins.
const STALE_SEED_VALUES = new Set([
  "3350 Bells Ferry Road, Marietta, GA 30066",
  "(770) 555-0143",
  "info@gokuldham.org",
]);

export function settingOr(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  if (!trimmed || STALE_SEED_VALUES.has(trimmed)) return fallback;
  return trimmed;
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
