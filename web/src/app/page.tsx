import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        Assignment · URL Shortener with Analytics
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Short links & click analytics
      </h1>
      <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-400">
        Phase 1 is wired: Supabase schema (see repo{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
          docs/sql/001_initial.sql
        </code>
        ), session middleware, and{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
          /[slug]
        </code>{" "}
        redirects that record clicks. Copy{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
          .env.local.example
        </code>{" "}
        to{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
          .env.local
        </code>{" "}
        with your Supabase keys.
      </p>
      <nav className="mt-10 flex flex-wrap gap-4 text-sm font-medium">
        <Link
          className="text-neutral-900 underline underline-offset-4 dark:text-neutral-100"
          href="/dashboard"
        >
          Dashboard (Phase 2)
        </Link>
        <Link
          className="text-neutral-900 underline underline-offset-4 dark:text-neutral-100"
          href="/auth"
        >
          Auth placeholder
        </Link>
      </nav>
    </main>
  );
}
