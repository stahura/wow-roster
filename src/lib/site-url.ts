export type SiteUrlEnv = {
  RAILWAY_PUBLIC_DOMAIN?: string;
  RAILWAY_STATIC_URL?: string;
};

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function siteOriginFromEnv(env: SiteUrlEnv = process.env as SiteUrlEnv): string {
  const domain = env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (domain) {
    const host = stripTrailingSlash(domain.replace(/^https?:\/\//i, ""));
    if (host) return `https://${host}`;
  }

  const staticUrl = env.RAILWAY_STATIC_URL?.trim();
  if (staticUrl) {
    try {
      const url = new URL(staticUrl.includes("://") ? staticUrl : `https://${staticUrl}`);
      const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
      if (!local) url.protocol = "https:";
      return url.origin;
    } catch {
      // Invalid Railway URL — fall through to local default.
    }
  }

  return "http://localhost:3000";
}

export function metadataBaseFromOrigin(origin: string): URL | undefined {
  const trimmed = origin.trim();
  if (!trimmed) return undefined;
  try {
    return new URL(trimmed);
  } catch {
    return undefined;
  }
}
