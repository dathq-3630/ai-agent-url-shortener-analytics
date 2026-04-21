import {
  ArrowRight,
  BarChart3,
  Link2,
  MousePointerClick,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  signedIn: boolean;
};

export function HomeLanding({ signedIn }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,var(--color-muted),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <SiteHeader signedIn={signedIn} />

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-20 pt-12 sm:px-6 sm:pt-16 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 px-3 py-1 font-normal">
              Spec-driven · Next.js · Supabase · Tailwind
            </Badge>
            <h1 className="font-heading text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.05]">
              Short links with{" "}
              <span className="text-muted-foreground">analytics that stay clean.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Create branded short URLs, track clicks by source and device, and
              watch trends on a dashboard built for the assignment—not for
              investor decks.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {signedIn ? (
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "lg",
                    className: "min-w-[200px] gap-2 shadow-sm",
                  })}
                >
                  Open dashboard
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className={buttonVariants({
                      size: "lg",
                      className: "min-w-[200px] gap-2 shadow-sm",
                    })}
                  >
                    Create an account
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                      className: "min-w-[200px]",
                    })}
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          <Separator className="mx-auto my-16 max-w-4xl sm:my-20" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                  <Link2 className="size-5 text-foreground" aria-hidden />
                </div>
                <CardTitle>Short URLs</CardTitle>
                <CardDescription>
                  HTTP(S) destinations, optional custom slug, collision-safe
                  generation when you leave it blank.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Row Level Security ties every link to your Supabase Auth user.
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                  <MousePointerClick
                    className="size-5 text-foreground"
                    aria-hidden
                  />
                </div>
                <CardTitle>Click intelligence</CardTitle>
                <CardDescription>
                  Each hit logs source (referrer / UTM) and a simplified device
                  class from the User-Agent.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Redirects run server-side with your service role—no public click
                inserts from the client.
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                  <BarChart3 className="size-5 text-foreground" aria-hidden />
                </div>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  Daily or weekly rollups, totals for the window you pick, and a
                  ranked table of your top links.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-start gap-2 text-xs text-muted-foreground">
                <Shield className="mt-0.5 size-3.5 shrink-0 text-foreground/70" />
                <span>
                  CSV export lands in Phase 3—same filters as the dashboard.
                </span>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          URL Shortener · Analytics · assignment build
        </footer>
      </main>
    </div>
  );
}
