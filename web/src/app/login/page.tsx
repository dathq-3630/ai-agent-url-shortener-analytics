import { LoginForm } from "./login-form";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const next = sp.next ?? "/dashboard";

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <LoginForm defaultNext={next} />
    </main>
  );
}
