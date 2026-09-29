import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoyd } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Composer({
  onSend,
  onStop,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
}) {
  const t = useLoyd((s) => s.t());
  const streaming = useLoyd((s) => s.streaming);
  const needsKey = useLoyd((s) => s.needsKey());
  const setSettingsOpen = useLoyd((s) => s.setSettingsOpen);
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    if (streaming) {
      onStop();
      return;
    }
    if (needsKey) {
      setSettingsOpen(true);
      return;
    }
    const value = ref.current?.value.trim() ?? "";
    if (!value) return;
    onSend(value);
    if (ref.current) {
      ref.current.value = "";
      ref.current.style.height = "auto";
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-3xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
    >
      {needsKey ? (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="mb-2 w-full rounded-md bg-biscuit px-3 py-2 text-start text-sm text-ink"
        >
          {t.missingKey}
        </button>
      ) : null}
      <div
        className={cn(
          "flex items-end gap-2 rounded-xl bg-bg p-2 shadow-[var(--shadow-lift)]",
        )}
      >
        <textarea
          ref={ref}
          rows={1}
          onKeyDown={onKeyDown}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
          }}
          placeholder={t.composerPlaceholder}
          className="max-h-44 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted"
        />
        <Button
          type="submit"
          size="icon"
          variant={streaming ? "biscuit" : "default"}
          aria-label={streaming ? t.stop : t.send}
          className="shrink-0"
        >
          {streaming ? <Square className="size-4" /> : <ArrowUp className="size-4" />}
        </Button>
      </div>
    </form>
  );
}
