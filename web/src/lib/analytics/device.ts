export type DeviceCategory = "desktop" | "mobile" | "tablet" | "unknown";

export function parseDevice(userAgent: string | null): DeviceCategory {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();

  if (/tablet|ipad|playbook|silk|(android(?!.*mobile))/.test(ua)) {
    return "tablet";
  }
  if (
    /mobi|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/.test(ua)
  ) {
    return "mobile";
  }
  return "desktop";
}
