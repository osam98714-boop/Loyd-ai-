import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/loyd/message-bubble";
import { Composer } from "@/components/loyd/composer";
import { LoydMark } from "@/components/loyd/logo";
import { useLoyd } from "@/lib/store";

export function ChatView({
  onSend,
  onStop,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
}) {
  const t = useLoyd((s) => s.t());
  const chat = useLoyd((s) => s.activeChat());
  const messages = chat?.messages ?? [];
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, messages.at(-1)?.content]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      {messages.length === 0 ? (
        <div className="mx-auto mb-3 flex w-full max-w-3xl flex-wrap justify-center gap-2 px-4">
          {t.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSend(s)}
              className="max-w-full rounded-full bg-biscuit px-3 py-2 text-start text-sm text-ink shadow-[var(--shadow-soft)] transition-transform duration-150 hover:bg-biscuit-deep active:scale-[0.96]"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
      <Composer onSend={onSend} onStop={onStop} />
    </div>
  );
}

function EmptyState() {
  const t = useLoyd((s) => s.t());
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
      <LoydMark className="size-14" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
        {t.emptyTitle}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">{t.emptyBody}</p>
    </div>
  );
}
