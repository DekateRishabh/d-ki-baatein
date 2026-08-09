"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import MarkdownPreview from "@/components/admin/markdown-preview";

type EssayStatus = "draft" | "private" | "published" | "archived";
type EssayFormProps = { mode: "create" | "edit"; essay?: { id: string; title: string; subtitle: string | null; excerpt: string | null; slug: string; body_markdown: string | null; status: EssayStatus } };

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function readingTime(value: string) { return Math.max(1, Math.ceil(value.trim().split(/\s+/).filter(Boolean).length / 200)); }
function wordCount(value: string) { return value.trim().split(/\s+/).filter(Boolean).length; }

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
    const textarea = editorRef.current; if (!textarea) return;
    const start = textarea.selectionStart; const end = textarea.selectionEnd;
    const selected = body.slice(start, end) || "text";
    setBody(`${body.slice(0, start)}${before}${selected}${after}${body.slice(end)}`);
    requestAnimationFrame(() => { textarea.focus(); const cursor = start + before.length + selected.length + after.length; textarea.setSelectionRange(cursor, cursor); });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Your session has expired. Please sign in again."); setSaving(false); return; }
    const values = { title: title.trim(), subtitle: subtitle.trim() || null, excerpt: excerpt.trim() || null, slug: slugify(slug || title), body_markdown: body, body: { format: "markdown", content: body }, status, reading_time_minutes: readingTime(body), published_at: status === "published" ? new Date().toISOString() : null, ...(mode === "create" ? { created_by: user.id } : {}) };
    if (!values.title || !body.trim()) { setError("Add a title and essay content before saving."); setSaving(false); return; }
    const result = mode === "create" ? await supabase.from("essays").insert(values).select("id").single() : await supabase.from("essays").update(values).eq("id", essay!.id).select("id").single();
    if (result.error) { setError(result.error.message); setSaving(false); return; }
    router.push("/admin/essays"); router.refresh();
  }

  return <>
    <style dangerouslySetInnerHTML={{ __html: `
      .essay-editor-form { max-width: 920px !important; gap: 30px !important; }
      .essay-editor-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; padding-bottom:22px; border-bottom:1px solid rgba(23,23,23,.14); }
      .essay-editor-heading h2 { margin:8px 0 0; font-family:var(--font-cormorant),Georgia,serif; font-size:42px; font-weight:500; letter-spacing:-.04em; }
      .essay-editor-fields { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
      .essay-editor-fields label:nth-child(1), .essay-editor-fields label:nth-child(3) { grid-column:1 / -1; }
      .essay-editor-workspace { overflow:hidden; border:1px solid rgba(23,23,23,.16); border-radius:10px; background:rgba(255,252,247,.72); }
      .essay-editor-tabs { display:flex; gap:0; padding:10px 12px; border-bottom:1px solid rgba(23,23,23,.12); background:rgba(23,23,23,.035); }
      .essay-editor-tabs button { min-height:34px !important; padding:0 16px !important; border:0 !important; border-radius:4px !important; background:transparent !important; color:rgba(23,23,23,.58) !important; font-size:10px !important; letter-spacing:.14em !important; }
      .essay-editor-tabs button.is-active { background:#171717 !important; color:#fff !important; }
      .essay-toolbar { display:flex; flex-wrap:wrap; gap:6px; padding:12px; border-bottom:1px solid rgba(23,23,23,.1); }
      .essay-toolbar button { min-height:30px !important; padding:0 10px !important; border:1px solid rgba(23,23,23,.18) !important; border-radius:4px !important; background:transparent !important; color:#171717 !important; font-size:10px !important; letter-spacing:.08em !important; }
      .essay-toolbar button:hover { background:rgba(23,23,23,.08) !important; transform:none !important; }
      .essay-editor-textarea { display:block; min-height:400px !important; border:0 !important; border-radius:0 !important; padding:28px !important; background:transparent !important; font-family:var(--font-cormorant),Georgia,serif !important; font-size:22px !important; line-height:1.65 !important; resize:vertical; box-shadow:none !important; }
      .essay-editor-textarea:focus { box-shadow:none !important; }
      .essay-editor-preview { min-height:400px; max-width:720px; margin:0 auto; padding:38px 30px; font-family:var(--font-cormorant),Georgia,serif; font-size:23px; line-height:1.65; }
      .essay-editor-preview h1,.essay-editor-preview h2,.essay-editor-preview h3 { margin:1.4em 0 .45em; line-height:1.05; font-weight:500; }
      .essay-editor-preview h1 { font-size:46px; } .essay-editor-preview h2 { font-size:36px; } .essay-editor-preview h3 { font-size:29px; }
      .essay-editor-preview p { margin:0 0 1.1em; } .essay-editor-preview blockquote { margin:1.4em 0; padding-left:22px; border-left:2px solid rgba(23,23,23,.35); font-style:italic; }
      .essay-editor-preview ul { margin:0 0 1.1em; padding-left:1.2em; } .essay-editor-preview code { padding:2px 5px; background:rgba(23,23,23,.08); font-family:var(--font-plex-mono),monospace; font-size:.7em; }
      .essay-editor-preview a { color:inherit; text-decoration:underline; text-underline-offset:4px; }
      .essay-editor-meta { display:flex; gap:18px; padding:12px 16px; border-top:1px solid rgba(23,23,23,.1); color:rgba(23,23,23,.55); font-family:var(--font-plex-mono),monospace; font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
      .essay-editor-actions { display:flex; align-items:end; gap:18px; padding-top:8px; } .essay-editor-actions label { flex:0 0 180px; } .essay-editor-actions [role=alert] { flex:1; margin:0 0 12px; }
      .essay-status { padding:7px 10px; border:1px solid rgba(23,23,23,.18); border-radius:999px; font-family:var(--font-plex-mono),monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; }
      @media(max-width:700px) { .essay-editor-fields { grid-template-columns:1fr; } .essay-editor-fields label:nth-child(1),.essay-editor-fields label:nth-child(3) { grid-column:auto; } .essay-editor-heading,.essay-editor-actions { align-items:stretch; flex-direction:column; } .essay-editor-actions label { flex-basis:auto; } .essay-editor-textarea { min-height:320px !important; padding:20px !important; font-size:19px !important; } .essay-editor-preview { padding:26px 20px; font-size:20px; } .essay-editor-preview h1 { font-size:38px; } }
    ` }} />
    <form onSubmit={save} className="admin-form essay-editor-form">
      <div className="essay-editor-heading"><div><p className="section-label">Essay details</p><h2>{mode === "create" ? "Shape the idea." : "Keep refining it."}</h2></div><span className={`essay-status essay-status-${status}`}>{status}</span></div>
      <div className="essay-editor-fields"><label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The title of your essay" required /></label><label>Subtitle<input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="A quiet line beneath the title" /></label><label>Excerpt<textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} placeholder="A short description for cards and search" /></label><label>Slug<input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder={slugify(title) || "essay-slug"} /></label></div>
      <div className="essay-editor-workspace"><div className="essay-editor-tabs" role="tablist" aria-label="Essay editor view"><button type="button" className={tab === "write" ? "is-active" : ""} onClick={() => setTab("write")}>Write</button><button type="button" className={tab === "preview" ? "is-active" : ""} onClick={() => setTab("preview")}>Preview</button></div>{tab === "write" ? <><div className="essay-toolbar" aria-label="Markdown tools"><button type="button" onClick={() => insertMarkdown("# ")}>H1</button><button type="button" onClick={() => insertMarkdown("## ")}>H2</button><button type="button" onClick={() => insertMarkdown("**", "**")}>Bold</button><button type="button" onClick={() => insertMarkdown("*", "*")}>Italic</button><button type="button" onClick={() => insertMarkdown("> ")}>Quote</button><button type="button" onClick={() => insertMarkdown("- ")}>List</button><button type="button" onClick={() => insertMarkdown("[", "](https://)")}>Link</button></div><textarea ref={editorRef} className="essay-editor-textarea" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Begin writing in Markdown…" required /></> : <MarkdownPreview content={body} />}<div className="essay-editor-meta"><span>{wordCount(body)} words</span><span>{readingTime(body)} min read</span><span>Markdown</span></div></div>
      <div className="essay-editor-actions"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as EssayStatus)}><option value="draft">Draft</option><option value="private">Private</option><option value="published">Published</option><option value="archived">Archived</option></select></label>{error ? <p role="alert">{error}</p> : null}<button type="submit" disabled={saving}>{saving ? "Saving…" : status === "published" ? "Save and publish" : "Save draft"}</button></div>
    </form>
  </>;
}
