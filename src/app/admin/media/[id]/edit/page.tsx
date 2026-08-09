import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteMedia, updateMedia } from "@/lib/admin/media-actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditMediaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item, error } = await supabase.from("media_assets").select("id, storage_path, filename, kind, mime_type, size_bytes, public_url, caption, alt_text, is_public").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!item) notFound();
  const update = updateMedia.bind(null, id);
  const remove = deleteMedia.bind(null, id, item.storage_path);
  return <section className="admin-content"><header className="archive-intro"><p className="section-label">Media · {item.kind}</p><h1>Edit media</h1><p>{item.filename} · {item.mime_type ?? "unknown type"}</p></header>{item.kind === "image" && item.public_url && <img src={item.public_url} alt={item.alt_text ?? item.filename} style={{ maxWidth: "min(100%, 720px)", height: "auto" }} />}<form action={update} className="admin-form"><label>Alt text<input name="alt_text" defaultValue={item.alt_text ?? ""} /></label><label>Caption<input name="caption" defaultValue={item.caption ?? ""} /></label><label><input name="is_public" type="checkbox" defaultChecked={item.is_public} /> Public media</label><div><button type="submit">Save metadata</button><Link href="/admin/media">Back</Link></div></form><form action={remove}><button type="submit">Delete media</button></form></section>;
}
