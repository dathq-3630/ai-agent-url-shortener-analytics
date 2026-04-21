export default function AuthPlaceholderPage() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Authentication</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        Supabase Auth sign-in and registration UI will be added in Phase 2. This
        route exists so <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">/auth</code>{" "}
        is not treated as a short link.
      </p>
    </main>
  );
}
