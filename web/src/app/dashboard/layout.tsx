import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            URL shortener
          </Link>
          <div className="flex items-center gap-4">
            {user?.email ? (
              <span className="max-w-[200px] truncate text-sm text-neutral-600 dark:text-neutral-400">
                {user.email}
              </span>
            ) : null}
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline dark:text-neutral-300"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
