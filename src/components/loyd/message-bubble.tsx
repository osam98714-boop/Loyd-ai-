import { Markdown } from "@/lib/markdown";
import type { ChatMessage } from "@/lib/store";
import { useLoyd } from "@/lib/store";
import { PROVIDERS } from "@/lib/providers";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const t = useLoyd((s) => s.t());
  const isUser = message.role === "user";
  const providerLabel = PROVIDERS.find((p) => p.id === message.provider)?.label;

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[min(100%,40rem)] rounded-xl px-4 py-3",
          isUser
            ? "rounded-ee-sm bg-user text-ink shadow-[var(--shadow-soft)]"
            : "rounded-es-sm bg-bg text-fg shadow-[var(--shadow-soft)]",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <>
            {providerLabel ? (
              <p className="mb-1.5 text-[0.7rem] font-medium tracking-wide text-muted uppercase">
                {providerLabel}
                {message.model ? ` · ${message.model}` : ""}
              </p>
            ) : null}
            {message.content ? (
              <Markdown
                text={message.content}
                copyLabel={t.copyCode}
                copiedLabel={t.copied}
              />
            ) : (
              <Thinking />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Thinking() {
  const t = useLoyd((s) => s.t());
  return (
    <div className="flex items-center gap-2 text-sm text-muted" aria-live="polite">
      <span className="inline-flex gap-1" aria-hidden>
        <span className="size-1.5 animate-pulse rounded-full bg-accent" />
        <span className="size-1.5 animate-pulse rounded-full bg-accent" />
        <span className="size-1.5 animate-pulse rounded-full bg-accent" />
      </span>
      {t.thinking}
    </div>
  );
}
