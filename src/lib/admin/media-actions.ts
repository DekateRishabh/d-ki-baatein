"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireEditor() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["admin", "editor"].includes(profile.role)) redirect("/admin/login?error=not-authorized");
  return { supabase, user };
}

function mediaKind(type: string) {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "document";
}

export async function uploadMedia(formData: FormData) {
  const { supabase, user } = await requireEditor();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose a file to upload.");
  if (file.size > 50 * 1024 * 1024) throw new Error("Files must be 50 MB or smaller.");

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const storagePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(storagePath, new Uint8Array(await file.arrayBuffer()), { contentType: file.type || "application/octet-stream", upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicData } = supabase.storage.from("media").getPublicUrl(storagePath);
  const { data, error } = await supabase.from("media_assets").insert({ storage_path: storagePath, public_url: publicData.publicUrl, kind: mediaKind(file.type), filename: file.name, mime_type: file.type || null, size_bytes: file.size, alt_text: String(formData.get("alt_text") ?? "").trim() || null, caption: String(formData.get("caption") ?? "").trim() || null, is_public: formData.get("is_public") === "on", uploaded_by: user.id }).select("id").single();
  if (error) {
    await supabase.storage.from("media").remove([storagePath]);
    throw new Error(error.message);
  }
  revalidatePath("/admin/media");
  redirect(`/admin/media/${data.id}/edit`);
}

export async function updateMedia(id: string, formData: FormData) {
  const { supabase } = await requireEditor();
  const { error } = await supabase.from("media_assets").update({ alt_text: String(formData.get("alt_text") ?? "").trim() || null, caption: String(formData.get("caption") ?? "").trim() || null, is_public: formData.get("is_public") === "on" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${id}/edit`);
  redirect(`/admin/media/${id}/edit`);
}

export async function deleteMedia(id: string, storagePath: string) {
  const { supabase } = await requireEditor();
  const { error: storageError } = await supabase.storage.from("media").remove([storagePath]);
  if (storageError) throw new Error(storageError.message);
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
  redirect("/admin/media");
}
