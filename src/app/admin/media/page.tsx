import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data: media, error } = await supabase.from("media_assets").select("id, filename, kind, mime_type, size_bytes, public_url, caption, alt_text, is_public, created_at").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return <section className="admin-content"><header className="archive-intro"><p className="section-label">Private archive</p><h1>Media library</h1><p>Upload and manage images, documents, audio, and video for the site.</p><Link href="/admin/media/upload">Upload media</Link></header><div className="admin-list">{media?.map((item) => <article className="admin-list-item" key={item.id}><div>{item.kind === "image" && item.public_url && <img src={item.public_url} alt={item.alt_text ?? item.filename} width={96} height={72} style={{ objectFit: "cover" }} />}<p className="section-label">{item.kind} · {item.is_public ? "public" : "private"}</p><h2>{item.filename}</h2><p>{item.caption ?? item.mime_type ?? "No caption"}</p></div><Link href={`/admin/media/${item.id}/edit`}>Edit</Link></article>)}</div></section>;
}
