import { PROVIDERS, type ProviderId } from "@/lib/providers";
import { useLoyd } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ModelPicker() {
  const provider = useLoyd((s) => s.provider);
  const model = useLoyd((s) => s.model);
  const keys = useLoyd((s) => s.keys);
  const grokAvailable = useLoyd((s) => s.grokAvailable);
  const setProvider = useLoyd((s) => s.setProvider);
  const setModel = useLoyd((s) => s.setModel);
  const t = useLoyd((s) => s.t());
  const current = PROVIDERS.find((p) => p.id === provider);

  function hasKey(id: ProviderId) {
    if (id === "grok") return grokAvailable;
    return Boolean(keys[id]?.trim());
  }

  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
      <div
        role="tablist"
        aria-label={t.models}
        className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-cream p-1 shadow-[var(--shadow-soft)]"
      >
        {PROVIDERS.map((p) => {
          const active = p.id === provider;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setProvider(p.id)}
              className={cn(
                "h-11 shrink-0 rounded-md px-3 text-sm font-medium transition-[background-color,color,opacity] duration-150",
                active
                  ? "bg-biscuit text-ink shadow-[var(--shadow-soft)]"
                  : "text-muted hover:bg-biscuit/60 hover:text-ink",
                !active && !hasKey(p.id) && "opacity-70",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      {current ? (
        <label className="flex min-w-0 items-center gap-2 text-sm text-muted">
          <span className="hidden sm:inline">{t.modelLabel}</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="h-9 max-w-full rounded-md border border-border bg-bg px-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {current.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
