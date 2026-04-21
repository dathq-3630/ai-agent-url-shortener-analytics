import { NextResponse } from "next/server";
import type { ClickRow, LinkRow } from "@/lib/dashboard/aggregate";
import {
  analyticsWindow,
  parseDashboardDays,
} from "@/lib/dashboard/date-range";
import { perLinkTotalsForExport } from "@/lib/dashboard/per-link-export";
import { toCsv } from "@/lib/csv";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const days = parseDashboardDays(url.searchParams.get("days") ?? undefined);
  const { start, end } = analyticsWindow(days);

  const { data: linksRaw, error: linksError } = await supabase
    .from("links")
    .select("id, slug, destination_url")
    .order("created_at", { ascending: false });

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

  const links = (linksRaw ?? []) as LinkRow[];

  let clicks: ClickRow[] = [];
  if (links.length > 0) {
    const ids = links.map((l) => l.id);
    const { data: clicksRaw, error: clicksError } = await supabase
      .from("clicks")
      .select("link_id, clicked_at")
      .in("link_id", ids)
      .gte("clicked_at", start.toISOString())
      .lte("clicked_at", end.toISOString());

    if (clicksError) {
      return NextResponse.json({ error: clicksError.message }, { status: 500 });
    }
    clicks = (clicksRaw ?? []) as ClickRow[];
  }

  const rows = perLinkTotalsForExport(links, clicks).map((r) => [
    r.slug,
    r.destination_url,
    String(r.click_count),
  ]);

  const csv = toCsv(["slug", "destination_url", "click_count"], rows);

  const filenameSafe = `link-analytics-last-${days}d-${start.toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filenameSafe}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
