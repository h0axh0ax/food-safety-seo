import type { Metadata } from "next";

import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Enter password",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from } = await searchParams;
  const redirectTo = from?.startsWith("/") ? from : "/";

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            CheckMyFood
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Site access
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Enter the password to continue.
          </p>
        </div>

        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
