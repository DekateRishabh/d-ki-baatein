"use client";

import { FormEvent, useRef, useState } from "react";
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

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export default function EssayForm({ mode, essay }: EssayFormProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(essay?.title ?? "");
  const [subtitle, setSubtitle] = useState(essay?.subtitle ?? "");
  const [excerpt, setExcerpt] = useState(essay?.excerpt ?? "");
  const [slug, setSlug] = useState(essay?.slug ?? "");
  const [body, setBody] = useState(essay?.body_markdown ?? "");
  const [status, setStatus] = useState<EssayStatus>(essay?.status ?? "draft");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function insertMarkdown(before: string, after = "") {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = body.slice(start, end) || "text";
    const nextBody = `${body.slice(0, start)}${before}${selected}${after}${body.slice(end)}`;
    setBody(nextBody);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + before.length + selected.length + after.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

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

  const words = wordCount(body);
  const minutes = readingTime(body);

  return (
    <form onSubmit={save} className="admin-form essay-editor-form">
      <div className="essay-editor-heading">
        <div><p className="section-label">Essay details</p><h2>{mode === "create" ? "Shape the idea." : "Keep refining it."}</h2></div>
        <span className={`essay-status essay-status-${status}`}>{status}</span>
      </div>

      <div className="essay-editor-fields">
        <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The title of your essay" required /></label>
        <label>Subtitle<input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="A quiet line beneath the title" /></label>
        <label>Excerpt<textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} placeholder="A short description for cards and search" /></label>
        <label>Slug<input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder={slugify(title) || "essay-slug"} /></label>
      </div>

      <div className="essay-editor-workspace">
        <div className="essay-editor-tabs" role="tablist" aria-label="Essay editor view">
          <button type="button" className={tab === "write" ? "is-active" : ""} onClick={() => setTab("write")}>Write</button>
          <button type="button" className={tab === "preview" ? "is-active" : ""} onClick={() => setTab("preview")}>Preview</button>
        </div>

        {tab === "write" ? (
          <>
            <div className="essay-toolbar" aria-label="Markdown tools">
              <button type="button" onClick={() => insertMarkdown("# ")}>H1</button>
              <button type="button" onClick={() => insertMarkdown("## ")}>H2</button>
              <button type="button" onClick={() => insertMarkdown("**", "**")}>Bold</button>
              <button type="button" onClick={() => insertMarkdown("*", "*")}>Italic</button>
              <button type="button" onClick={() => insertMarkdown("> ")}>Quote</button>
              <button type="button" onClick={() => insertMarkdown("- ")}>List</button>
              <button type="button" onClick={() => insertMarkdown("[", "](https://)")}>Link</button>
            </div>
            <textarea ref={editorRef} className="essay-editor-textarea" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Begin writing in Markdown…" required />
          </>
        ) : (
          <article className="essay-editor-preview">
            {body.trim() ? <pre>{body}</pre> : <p>Your essay preview will appear here as you write.</p>}
          </article>
        )}

        <div className="essay-editor-meta"><span>{words} words</span><span>{minutes} min read</span><span>Markdown</span></div>
      </div>

      <div className="essay-editor-actions">
        <label>Status<select value={status} onChange={(event) => setStatus(event.target.value as EssayStatus)}><option value="draft">Draft</option><option value="private">Private</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" disabled={saving}>{saving ? "Saving…" : status === "published" ? "Save and publish" : "Save draft"}</button>
      </div>
    </form>
  );
}
