"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLink, type CreateLinkState } from "@/app/actions/links";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
    >
      {pending ? "Creating…" : "Create short link"}
    </button>
  );
}

export function CreateLinkForm() {
  const [state, formAction] = useActionState(createLink, null as CreateLinkState);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-lg font-semibold tracking-tight">New short link</h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Destination is required. Leave slug empty to auto-generate a random path.
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Destination URL
          </span>
          <input
            name="destination_url"
            type="url"
            required
            placeholder="https://example.com/page"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-400 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>
        <label className="flex w-full min-w-[140px] flex-col gap-1.5 text-sm sm:max-w-xs">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Custom slug (optional)
          </span>
          <input
            name="custom_slug"
            type="text"
            maxLength={64}
            placeholder="my-link"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-400 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>
        <SubmitButton />
      </form>

      {state && "error" in state ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      {state && "success" in state ? (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm dark:bg-emerald-950/40">
          <p className="font-medium text-emerald-900 dark:text-emerald-200">
            {state.success}
          </p>
          <p className="mt-1 break-all font-mono text-emerald-800 dark:text-emerald-100">
            {state.shortUrl}
          </p>
        </div>
      ) : null}
    </section>
  );
}
