import type { User } from "@supabase/supabase-js";

export function isAdminUser(user: User | null) {
  if (!user) return false;

  const adminUserId = process.env.ADMIN_USER_ID?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (adminUserId) return user.id === adminUserId;
  if (adminEmail) return user.email?.toLowerCase() === adminEmail;

  return false;
}
