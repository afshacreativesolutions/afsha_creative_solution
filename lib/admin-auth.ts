import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

type CachedAdminSession = {
  user: User;
  role: string;
  expiresAt: number;
};

// In-memory cache for validated admin sessions (TTL: 60 seconds)
const adminSessionCache = new Map<string, CachedAdminSession>();

export function clearAdminSessionCache() {
  adminSessionCache.clear();
}

/**
 * Fast admin session resolution:
 * 1. Checks if Supabase auth cookies are present in the request. If none, returns null instantly in 0ms.
 * 2. If present, checks in-memory cache using a composite token key. If valid, returns in 0ms (no network).
 * 3. On cache miss, verifies session with Supabase Auth API and admin_users table, then caches for 60s.
 * 4. Wrapped in React cache() to deduplicate calls within the same request lifecycle.
 */
export const getAdminSession = cache(async () => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const cookieStore = await cookies();
  const authCookies = cookieStore
    .getAll()
    .filter((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!authCookies.length) {
    return null;
  }

  // Generate cache key from auth token cookies
  const tokenKey = authCookies.map((c) => `${c.name}=${c.value}`).join(";");
  const cached = adminSessionCache.get(tokenKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { supabase, user: cached.user, role: cached.role };
  }

  // Validate session with Supabase Auth API
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    adminSessionCache.delete(tokenKey);
    return null;
  }

  // Verify catalog admin roster
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    adminSessionCache.delete(tokenKey);
    return null;
  }

  const session = {
    user,
    role: (admin.role as string) || "admin",
    expiresAt: Date.now() + 60_000, // 60 seconds TTL
  };

  adminSessionCache.set(tokenKey, session);
  return { supabase, user, role: session.role };
});

export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireAdminAction() {
  const admin = await getAdminSession();
  if (!admin) throw new Error("You must be signed in as an administrator.");
  return admin;
}
