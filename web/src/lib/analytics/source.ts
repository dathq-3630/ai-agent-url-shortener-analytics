const MAX_LEN = 256;

/**
 * Prefer utm_source from the short-link query string, else Referer hostname, else "direct".
 */
export function parseClickSource(request: Request): string {
  const url = new URL(request.url);
  const utm = url.searchParams.get("utm_source");
  if (utm?.trim()) {
    return utm.trim().slice(0, MAX_LEN);
  }

  const referer = request.headers.get("referer");
  if (!referer) return "direct";

  try {
    const host = new URL(referer).hostname;
    return host ? host.slice(0, MAX_LEN) : "direct";
  } catch {
    return "direct";
  }
}
