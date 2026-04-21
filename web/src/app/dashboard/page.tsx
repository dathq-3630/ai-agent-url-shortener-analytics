import Link from "next/link";
import {
  aggregateByDay,
  aggregateByWeek,
  topLinks,
  totalClicks,
  type ClickRow,
  type LinkRow,
} from "@/lib/dashboard/aggregate";
import {
  analyticsWindow,
  parseDashboardDays,
  type DashboardSearchParams,
} from "@/lib/dashboard/date-range";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CreateLinkForm } from "./create-link-form";

function formatDayLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00.000Z`);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function SeriesChart({
  series,
  view,
}: {
  series: { label: string; count: number }[];
  view: "day" | "week";
}) {
  if (series.length === 0) {
    return (
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        No clicks in this date range yet. Open one of your short links to record
        traffic.
      </p>
    );
  }

  const max = Math.max(...series.map((s) => s.count), 1);

  return (
    <ul className="flex flex-col gap-3">
      {series.map((row) => (
        <li key={row.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
            {view === "day"
              ? formatDayLabel(row.label)
              : `Week of ${formatDayLabel(row.label)}`}
          </span>
          <div className="h-7 min-w-0 flex-1 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full min-w-0 rounded-md bg-neutral-800 transition-all dark:bg-neutral-200"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-sm tabular-nums text-neutral-800 dark:text-neutral-200">
            {row.count}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const sp = await searchParams;
  const days = parseDashboardDays(sp.days);
  const view = sp.view === "week" ? "week" : "day";

  const supabase = await createClient();
  const { start, end } = analyticsWindow(days);

  const { data: linksRaw, error: linksError } = await supabase
    .from("links")
    .select("id, slug, destination_url")
    .order("created_at", { ascending: false });

  const links: LinkRow[] = (linksRaw ?? []) as LinkRow[];

  let clicks: ClickRow[] = [];
  if (links.length > 0) {
    const ids = links.map((l) => l.id);
    const { data: clicksRaw, error: clicksError } = await supabase
      .from("clicks")
      .select("link_id, clicked_at")
      .in("link_id", ids)
      .gte("clicked_at", start.toISOString())
      .lte("clicked_at", end.toISOString())
      .order("clicked_at", { ascending: true });

    if (clicksError) {
      return (
        <p className="text-sm text-red-600" role="alert">
          Could not load clicks: {clicksError.message}
        </p>
      );
    }
    clicks = (clicksRaw ?? []) as ClickRow[];
  }

  if (linksError) {
    return (
      <p className="text-sm text-red-600" role="alert">
        Could not load links: {linksError.message}
      </p>
    );
  }

  const series =
    view === "day" ? aggregateByDay(clicks) : aggregateByWeek(clicks);
  const top = topLinks(links, clicks, 10);
  const total = totalClicks(clicks);

  const q = (d: number, v: "day" | "week") =>
    `/dashboard?days=${d}&view=${v}`;

  return (
    <div className="flex flex-col gap-10">
      <CreateLinkForm />

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Clicks in the selected range (your links only).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/api/export?days=${days}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
              prefetch={false}
            >
              Export CSV
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
            <span className="mr-2 self-center text-xs font-medium uppercase tracking-wide text-neutral-500">
              Range
            </span>
            {[7, 30].map((d) => (
              <Link
                key={d}
                href={q(d, view)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  days === d
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                Last {d} days
              </Link>
            ))}
            <span className="ml-2 mr-2 hidden self-center text-xs font-medium uppercase tracking-wide text-neutral-500 sm:inline">
              View
            </span>
            {(
              [
                ["day", "By day"],
                ["week", "By week"],
              ] as const
            ).map(([v, label]) => (
              <Link
                key={v}
                href={q(days, v)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  view === v
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Total clicks
            </h3>
            <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight">
              {total}
            </p>
            <h3 className="mt-8 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {view === "day" ? "Clicks by day" : "Clicks by week (UTC)"}
            </h3>
            <div className="mt-4">
              <SeriesChart series={series} view={view} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Top links
            </h3>
            <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                  <tr>
                    <th className="px-3 py-2">Slug</th>
                    <th className="px-3 py-2">Destination</th>
                    <th className="px-3 py-2 text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {top.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-6 text-center text-neutral-600 dark:text-neutral-400"
                      >
                        No links yet. Create one above.
                      </td>
                    </tr>
                  ) : (
                    top.map((row) => (
                      <tr
                        key={row.slug}
                        className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/80"
                      >
                        <td className="px-3 py-2 font-mono text-xs font-medium">
                          {row.slug}
                        </td>
                        <td className="max-w-[200px] truncate px-3 py-2 text-neutral-600 dark:text-neutral-400">
                          {row.destination_url.length > 48
                            ? `${row.destination_url.slice(0, 48)}…`
                            : row.destination_url}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {row.count}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
