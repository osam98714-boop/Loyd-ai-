import { cn } from "@/lib/utils";

export function LoydMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8 shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="10" fill="currentColor" className="text-biscuit" />
      <path
        d="M11 8.5v15h11"
        fill="none"
        stroke="currentColor"
        className="text-accent"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoydWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <LoydMark />
      <div className="min-w-0 leading-tight">
        <div className="font-semibold tracking-tight text-ink">Loyd AI</div>
        {compact ? null : (
          <div className="truncate text-xs text-muted">Loyd AI</div>
        )}
      </div>
    </div>
  );
}
