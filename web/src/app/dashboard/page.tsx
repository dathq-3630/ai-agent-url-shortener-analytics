export default function DashboardPlaceholderPage() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        Analytics and top links will appear here in Phase 2. This route takes
        precedence over dynamic short-link slugs for{" "}
        <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">/dashboard</code>.
      </p>
    </main>
  );
}
