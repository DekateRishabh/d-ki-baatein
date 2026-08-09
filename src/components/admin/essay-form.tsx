"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type EssayStatus = "draft" | "private" | "published" | "archived";

type EssayFormProps = {
  mode: "create" | "edit";
  essay?: {
    id: string;
    title: string;
    subtitle: string | null;
    excerpt: string | null;
    slug: string;
    body_markdown: string | null;
    status: EssayStatus;
  };
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function readingTime(value: string) {
  return Math.max(1, Math.ceil(value.trim().split(/\s+/).filter(Boolean).length / 200));
}

export default function EssayForm({ mode, essay }: EssayFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(essay?.title ?? "");
  const [subtitle, setSubtitle] = useState(essay?.subtitle ?? "");
  const [excerpt, setExcerpt] = useState(essay?.excerpt ?? "");
  const [slug, setSlug] = useState(essay?.slug ?? "");
  const [body, setBody] = useState(essay?.body_markdown ?? "");
  const [status, setStatus] = useState<EssayStatus>(essay?.status ?? "draft");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Your session has expired. Please sign in again.");
      setSaving(false);
      return;
    }

    const values = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      excerpt: excerpt.trim() || null,
      slug: slugify(slug || title),
      body_markdown: body,
      body: { format: "markdown", content: body },
      status,
      reading_time_minutes: readingTime(body),
      published_at: status === "published" ? new Date().toISOString() : null,
      ...(mode === "create" ? { created_by: user.id } : {}),
    };

    if (!values.title || !body.trim()) {
      setError("Add a title and essay content before saving.");
      setSaving(false);
      return;
    }

    const result = mode === "create"
      ? await supabase.from("essays").insert(values).select("id").single()
      : await supabase.from("essays").update(values).eq("id", essay!.id).select("id").single();

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/essays");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="admin-form">
      <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
      <label>Subtitle<input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></label>
      <label>Excerpt<textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} /></label>
      <label>Slug<input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder={slugify(title)} /></label>
      <label>Essay content<textarea value={body} onChange={(event) => setBody(event.target.value)} rows={22} placeholder="Write your essay in Markdown…" required /></label>
      <label>Status<select value={status} onChange={(event) => setStatus(event.target.value as EssayStatus)}><option value="draft">Draft</option><option value="private">Private</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
      <p>Estimated reading time: {readingTime(body)} minute{readingTime(body) === 1 ? "" : "s"}</p>
      {error ? <p role="alert">{error}</p> : null}
      <button type="submit" disabled={saving}>{saving ? "Saving…" : mode === "create" ? "Create essay" : "Save changes"}</button>
    </form>
  );
}
