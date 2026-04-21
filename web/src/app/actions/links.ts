"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isReservedSlug } from "@/lib/links/reserved-slugs";

export type CreateLinkState =
  | { error: string }
  | { success: string; shortUrl: string }
  | null;

const SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function createLink(
  _prev: CreateLinkState,
  formData: FormData,
): Promise<CreateLinkState> {
  const rawUrl = String(formData.get("destination_url") ?? "").trim();
  const customSlug = String(formData.get("custom_slug") ?? "").trim();

  if (!rawUrl) {
    return { error: "Destination URL is required." };
  }
  if (!isValidHttpUrl(rawUrl)) {
    return { error: "Enter a valid URL starting with http:// or https://." };
  }

  const slug = customSlug || nanoid(8);

  if (!SLUG_REGEX.test(slug) || slug.length < 3 || slug.length > 64) {
    return {
      error:
        "Slug must be 3–64 characters: letters, numbers, underscores, or hyphens.",
    };
  }

  if (isReservedSlug(slug)) {
    return { error: "That slug is reserved. Pick another." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a link." };
  }

  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  if (!base) {
    return { error: "NEXT_PUBLIC_APP_URL is not configured." };
  }

  const attempts = customSlug ? 1 : 5;
  let lastError: string | null = null;

  for (let i = 0; i < attempts; i++) {
    const trySlug = i === 0 ? slug : nanoid(8);
    const { error } = await supabase.from("links").insert({
      user_id: user.id,
      slug: trySlug,
      destination_url: rawUrl,
    });

    if (!error) {
      revalidatePath("/dashboard");
      const shortUrl = `${base}/${trySlug}`;
      return {
        success: "Short link created.",
        shortUrl,
      };
    }

    if (error.code === "23505") {
      lastError = "That slug is already taken.";
      if (customSlug) return { error: lastError };
      continue;
    }

    return { error: error.message };
  }

  return { error: lastError ?? "Could not generate a unique slug. Try again." };
}
