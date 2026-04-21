"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithEmail, type AuthFormState } from "@/app/actions/auth";

function SignInSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm({ defaultNext }: { defaultNext: string }) {
  const [state, formAction] = useActionState(signInWithEmail, null as AuthFormState);

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Use the email and password for your Supabase Auth account.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="next" value={defaultNext} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-400 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-400 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </label>
        {state?.error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {state.error}
          </p>
        ) : null}
        <SignInSubmit />
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-neutral-900 underline underline-offset-2 dark:text-neutral-100"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
