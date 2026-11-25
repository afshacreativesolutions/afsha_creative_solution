import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAdminSession } from "@/lib/admin-auth";
import { signIn } from "../actions";
import { SubmitButton } from "../submit-button";

export const metadata: Metadata = { title: "Admin Sign In | Afsha Creative Solution" };

type LoginProps = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: LoginProps) {
  if (await getAdminSession()) redirect("/admin/products");
  const { error } = await searchParams;
  const configured = Boolean(getSupabaseConfig());
  const message = error === "invalid"
    ? "Email or password is incorrect."
    : error === "unauthorized"
      ? "This account does not have catalog administrator access."
      : error === "setup" || !configured
        ? "Add the Supabase URL and anon key to your environment to enable admin sign in."
        : null;

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="w-full max-w-md border border-white/10 bg-[#080808] p-5 sm:p-10">
        <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-textGold">Catalog management</p>
        <h1 className="text-3xl font-light">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-white/50">Sign in with an account that has been added to the catalog admin roster.</p>
        {message && <p role="alert" className="mt-6 border border-red-900/60 bg-red-950/30 p-3 text-sm leading-5 text-red-200">{message}</p>}
        <form action={signIn} className="mt-7 space-y-5">
          <label className="block text-[10px] uppercase tracking-[0.16em] text-white/55">Email
            <input name="email" type="email" autoComplete="username" required className="mt-2 w-full border border-white/15 bg-black px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-textGold" />
          </label>
          <label className="block text-[10px] uppercase tracking-[0.16em] text-white/55">Password
            <input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full border border-white/15 bg-black px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-textGold" />
          </label>
          <SubmitButton
            disabled={!configured}
            loadingText="Signing in..."
            className="w-full border border-textGold/60 bg-textGold px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-transparent hover:text-textGold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sign in
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
