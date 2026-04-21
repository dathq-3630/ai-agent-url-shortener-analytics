import { createClient } from "@/lib/supabase/server";
import { HomeLanding } from "@/components/home/home-landing";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HomeLanding signedIn={!!user} />;
}
