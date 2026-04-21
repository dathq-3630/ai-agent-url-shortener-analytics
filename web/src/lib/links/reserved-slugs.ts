/** Single-segment paths that must not be used as short-link slugs. */
export const RESERVED_SLUGS = new Set([
  "api",
  "auth",
  "dashboard",
  "login",
  "register",
  "_next",
  "favicon",
  "favicon.ico",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
