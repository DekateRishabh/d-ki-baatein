import React from "react";

function inline(value: string) {
  return value.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={`em-${index}`}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={`code-${index}`}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (link) return <a key={`link-${index}`} href={link[2]}>{link[1]}</a>;
    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
}

export default function MarkdownContent({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  const paragraph: string[] = [];
  let blockIndex = 0;
  const flush = () => {
    if (paragraph.length) {
      blocks.push(<p key={`paragraph-${blockIndex++}`}>{inline(paragraph.join(" "))}</p>);
      paragraph.length = 0;
    }
  };

  content.split("\n").forEach((line) => {
    if (!line.trim()) { flush(); return; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flush();
      const Tag = `h${heading[1].length}` as "h1" | "h2" | "h3";
      blocks.push(<Tag key={`heading-${blockIndex++}`}>{inline(heading[2])}</Tag>);
      return;
    }
    if (line.startsWith("> ")) {
      flush();
      blocks.push(<blockquote key={`quote-${blockIndex++}`}>{inline(line.slice(2))}</blockquote>);
      return;
    }
    if (line.startsWith("- ")) {
      flush();
      blocks.push(<ul key={`list-${blockIndex++}`}><li>{inline(line.slice(2))}</li></ul>);
      return;
    }
    paragraph.push(line);
  });

  flush();
  return <>{blocks}</>;
}
