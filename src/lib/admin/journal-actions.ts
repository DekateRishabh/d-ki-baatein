"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function requireEditor() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["admin", "editor"].includes(profile.role)) redirect("/admin/login?error=not-authorized");
  return { supabase, user };
}

export async function createJournalEntry(formData: FormData) {
  const { supabase, user } = await requireEditor();
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? title));
  const bodyMarkdown = String(formData.get("body_markdown") ?? "");
  const entryDate = String(formData.get("entry_date") ?? new Date().toISOString().slice(0, 10));
  if (!title || !slug) throw new Error("Title and slug are required.");
  const { data, error } = await supabase.from("journal_entries").insert({ slug, title, body_markdown: bodyMarkdown, entry_date: entryDate, status: "draft", created_by: user.id }).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/journal");
  redirect(`/admin/journal/${data.id}/edit`);
}

export async function updateJournalEntry(id: string, formData: FormData) {
  const { supabase } = await requireEditor();
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? title));
  const bodyMarkdown = String(formData.get("body_markdown") ?? "");
  const entryDate = String(formData.get("entry_date") ?? new Date().toISOString().slice(0, 10));
  const intent = String(formData.get("intent") ?? "save");
  const status = intent === "publish" ? "published" : intent === "archive" ? "archived" : intent === "unpublish" ? "draft" : String(formData.get("status") ?? "draft");
  const publishedAt = status === "published" ? new Date().toISOString() : null;
  const { error } = await supabase.from("journal_entries").update({ title, slug, body_markdown: bodyMarkdown, entry_date: entryDate, status, published_at: publishedAt }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/journal");
  revalidatePath(`/admin/journal/${id}/edit`);
  revalidatePath("/journal");
  revalidatePath(`/journal/${slug}`);
  redirect(`/admin/journal/${id}/edit`);
}
