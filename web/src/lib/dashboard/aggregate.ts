export type LinkRow = {
  id: string;
  slug: string;
  destination_url: string;
};

export type ClickRow = {
  link_id: string;
  clicked_at: string;
};

function dayKey(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

/** UTC Monday date (YYYY-MM-DD) for the week containing this click. */
function weekBucketLabel(iso: string): string {
  const d = new Date(iso);
  const day = d.getUTCDay();
  const daysSinceMonday = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysSinceMonday);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function aggregateByDay(clicks: ClickRow[]): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const c of clicks) {
    const k = dayKey(c.clicked_at);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }));
}

export function aggregateByWeek(clicks: ClickRow[]): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const c of clicks) {
    const k = weekBucketLabel(c.clicked_at);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }));
}

export function topLinks(
  links: LinkRow[],
  clicks: ClickRow[],
  limit = 10,
): { slug: string; destination_url: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of clicks) {
    counts.set(c.link_id, (counts.get(c.link_id) ?? 0) + 1);
  }
  const byLink = links.map((l) => ({
    slug: l.slug,
    destination_url: l.destination_url,
    count: counts.get(l.id) ?? 0,
  }));
  return byLink.sort((a, b) => b.count - a.count).slice(0, limit);
}

export function totalClicks(clicks: ClickRow[]): number {
  return clicks.length;
}
