import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { signIn } from "../actions";
import { SubmitButton } from "../submit-button";

export const metadata: Metadata = { title: "Admin Sign In | Afsha Creative Solution" };

type LoginProps = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: LoginProps) {
  if (await getAdminSession()) redirect("/admin");

  const { error } = await searchParams;
  const configured = Boolean(getSupabaseConfig());
  const message =
    error === "invalid"
      ? "Email or password is incorrect."
      : error === "unauthorized"
        ? "This account does not have catalog administrator access."
        : error === "setup" || !configured
          ? "Add the Supabase URL and anon key to your environment to enable admin sign in."
          : null;

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#080808] px-4 py-10 text-white sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 shadow-2xl sm:p-8">
        <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-textGold">
          Afsha Executive Suite
        </p>
        <h1 className="text-2xl font-light sm:text-3xl">Admin Sign In</h1>
        <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm">
          Sign in with an authorized administrator account to manage leads, products, blog guides,
          and website pages.
        </p>

        {message && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-900/60 bg-red-950/35 p-3 text-xs leading-5 text-red-200 sm:text-sm"
          >
            {message}
          </p>
        )}

        <form action={signIn} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-[11px] font-medium uppercase tracking-[0.16em] text-white/60"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-black px-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-textGold sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-medium uppercase tracking-[0.16em] text-white/60"
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-black px-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-textGold sm:text-sm"
            />
          </div>

          <SubmitButton
            disabled={!configured}
            loadingText="Signing in..."
            className="min-h-12 w-full rounded-lg border border-textGold bg-textGold px-5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sign In
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
