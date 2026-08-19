/**
 * Canonical site origin for metadata, sitemap, and robots.
 * Prefer NEXT_PUBLIC_SITE_URL in production (e.g. https://checkmyfood.net).
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return normalizeCanonicalOrigin(configured);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return normalizeCanonicalOrigin(`https://${host}`);
  }

  return "http://localhost:3000";
}

function normalizeCanonicalOrigin(origin: string): string {
  const normalized = origin.replace(/\/$/, "");

  if (normalized === "https://checkmyfood.net") {
    return "https://www.checkmyfood.net";
  }

  return normalized;
}
