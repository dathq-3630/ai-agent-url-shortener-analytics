import type { ClickRow, LinkRow } from "@/lib/dashboard/aggregate";

/** Every link owned by the user with click totals in-range (sorted by clicks desc). */
export function perLinkTotalsForExport(
  links: LinkRow[],
  clicks: ClickRow[],
): { slug: string; destination_url: string; click_count: number }[] {
  const counts = new Map<string, number>();
  for (const c of clicks) {
    counts.set(c.link_id, (counts.get(c.link_id) ?? 0) + 1);
  }

  const rows = links.map((l) => ({
    slug: l.slug,
    destination_url: l.destination_url,
    click_count: counts.get(l.id) ?? 0,
  }));

  return rows.sort((a, b) => b.click_count - a.click_count);
}
