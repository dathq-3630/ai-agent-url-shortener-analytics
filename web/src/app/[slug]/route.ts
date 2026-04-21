import { NextResponse } from "next/server";
import { parseDevice } from "@/lib/analytics/device";
import { parseClickSource } from "@/lib/analytics/source";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const admin = createAdminClient();

  const { data: link, error } = await admin
    .from("links")
    .select("id, destination_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !link) {
    return new NextResponse("Not found", { status: 404 });
  }

  const source = parseClickSource(request);
  const device = parseDevice(request.headers.get("user-agent"));

  const { error: insertError } = await admin.from("clicks").insert({
    link_id: link.id,
    source,
    device,
  });

  if (insertError) {
    console.error("click insert failed", insertError.message);
    return new NextResponse("Analytics error", { status: 500 });
  }

  return NextResponse.redirect(link.destination_url, { status: 307 });
}

/** Redirect without recording a click (preview bots / link checkers). */
export async function HEAD(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const admin = createAdminClient();

  const { data: link, error } = await admin
    .from("links")
    .select("destination_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !link) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.redirect(link.destination_url, { status: 307 });
}
