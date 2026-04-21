/**
 * Publishable key (`sb_publishable_…`) replaces the legacy anon JWT during Supabase’s API key migration.
 * @see https://supabase.com/docs/guides/api/api-keys
 */
export function getSupabasePublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (Project Settings → API Keys → Publishable). Legacy NEXT_PUBLIC_SUPABASE_ANON_KEY is still accepted until you migrate.",
    );
  }
  return key;
}
