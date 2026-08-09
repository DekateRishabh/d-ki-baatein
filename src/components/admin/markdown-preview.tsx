import React from "react";

function inline(value: string) {
  const parts = value.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export default function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={blocks.length}>{inline(paragraph.join(" "))}</p>);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(<ul key={blocks.length}>{list.map((item, index) => <li key={index}>{inline(item)}</li>)}</ul>);
      list = [];
    }
  };

  lines.forEach((line, index) => {
    if (!line.trim()) { flushParagraph(); flushList(); return; }
    if (line.startsWith("- ") || line.startsWith("* ")) { flushParagraph(); list.push(line.slice(2)); return; }
    flushList();
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { flushParagraph(); const Tag = `h${heading[1].length}` as "h1" | "h2" | "h3"; blocks.push(<Tag key={index}>{inline(heading[2])}</Tag>); return; }
    if (line.startsWith("> ")) { flushParagraph(); blocks.push(<blockquote key={index}>{inline(line.slice(2))}</blockquote>); return; }
    paragraph.push(line);
  });
  flushParagraph();
  flushList();

  return <article className="essay-editor-preview">{blocks.length ? blocks : <p>Your essay preview will appear here as you write.</p>}</article>;
}
