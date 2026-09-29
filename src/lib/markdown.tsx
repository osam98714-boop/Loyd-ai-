import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Seg =
  | { type: "text"; value: string }
  | { type: "code"; lang: string; value: string };

function splitFences(input: string): Seg[] {
  const parts: Seg[] = [];
  const re = /```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)```/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(input))) {
    if (match.index > last) {
      parts.push({ type: "text", value: input.slice(last, match.index) });
    }
    parts.push({
      type: "code",
      lang: match[1] || "",
      value: match[2].replace(/\n$/, ""),
    });
    last = match.index + match[0].length;
  }
  if (last < input.length) parts.push({ type: "text", value: input.slice(last) });
  return parts;
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s)]+)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={i++}
          className="rounded-xs bg-code px-1 py-0.5 font-mono text-[0.85em] text-ink"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={i++} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={i++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    } else {
      nodes.push(
        <a
          key={i++}
          href={token}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline decoration-accent/40 underline-offset-2"
        >
          {token}
        </a>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderText(block: string): ReactNode {
  const lines = block.split("\n");
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="my-2 ms-5 list-disc space-y-1">
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  lines.forEach((line, idx) => {
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      list.push(bullet[1]);
      return;
    }
    flushList();
    if (heading) {
      const Tag = (`h${heading[1].length + 2}` as unknown) as "h3";
      out.push(
        <Tag
          key={`h-${idx}`}
          className="mt-3 mb-1 font-semibold tracking-tight text-ink"
        >
          {inline(heading[2])}
        </Tag>,
      );
      return;
    }
    if (line.trim() === "") {
      out.push(<div key={`br-${idx}`} className="h-2" />);
      return;
    }
    out.push(
      <p key={`p-${idx}`} className="leading-relaxed">
        {inline(line)}
      </p>,
    );
  });
  flushList();
  return out;
}

function CodeBlock({ lang, value, copyLabel, copiedLabel }: {
  lang: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative my-3 overflow-hidden rounded-lg bg-ink text-cream">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-mono text-xs uppercase tracking-wide text-biscuit-deep">
          {lang || "code"}
        </span>
        <button
          type="button"
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs",
            "text-cream/80 transition-colors duration-150 hover:bg-white/10 hover:text-cream",
          )}
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[0.8125rem] leading-relaxed">
        <code>{value}</code>
      </pre>
    </div>
  );
}

export function Markdown({
  text,
  copyLabel,
  copiedLabel,
}: {
  text: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const segs = splitFences(text);
  return (
    <div className="min-w-0">
      {segs.map((seg, i) =>
        seg.type === "code" ? (
          <CodeBlock
            key={i}
            lang={seg.lang}
            value={seg.value}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
          />
        ) : (
          <div key={i}>{renderText(seg.value)}</div>
        ),
      )}
    </div>
  );
}
