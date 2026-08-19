export const SITE_AUTH_COOKIE = "site_access";

export async function createSiteAuthToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`site-auth:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getSitePassword(): string | undefined {
  const configured = process.env.SITE_PASSWORD?.trim();
  if (!configured || configured === "off" || configured === "false") {
    return undefined;
  }
  return configured;
}
