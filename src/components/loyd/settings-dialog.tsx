import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROVIDERS, type ProviderId } from "@/lib/providers";
import { useLoyd } from "@/lib/store";

export function SettingsDialog() {
  const open = useLoyd((s) => s.settingsOpen);
  const setOpen = useLoyd((s) => s.setSettingsOpen);
  const keys = useLoyd((s) => s.keys);
  const setKeys = useLoyd((s) => s.setKeys);
  const grokAvailable = useLoyd((s) => s.grokAvailable);
  const t = useLoyd((s) => s.t());
  const [draft, setDraft] = useState(keys);
  const [visible, setVisible] = useState<Partial<Record<ProviderId, boolean>>>({});

  useEffect(() => {
    if (open) setDraft(keys);
  }, [open, keys]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.settings}</DialogTitle>
          <DialogDescription>{t.apiKeysHint}</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setKeys({
              gemini: draft.gemini.trim(),
              deepseek: draft.deepseek.trim(),
              groq: draft.groq.trim(),
              openai: draft.openai.trim(),
              grok: "",
            });
            setOpen(false);
          }}
        >
          {PROVIDERS.map((p) => (
            <div key={p.id} className="space-y-1.5">
              <Label htmlFor={`key-${p.id}`}>{p.label}</Label>
              {p.id === "grok" ? (
                <p className="text-sm text-muted">
                  {grokAvailable ? t.grokNoKey : t.grokUnavailable}
                </p>
              ) : (
                <div className="relative">
                  <Input
                    id={`key-${p.id}`}
                    autoComplete="off"
                    spellCheck={false}
                    type={visible[p.id] ? "text" : "password"}
                    placeholder={p.keyHint}
                    value={draft[p.id]}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [p.id]: e.target.value }))
                    }
                    className="pe-11 font-mono"
                  />
                  <button
                    type="button"
                    className="absolute end-1 top-1 inline-flex size-9 items-center justify-center rounded-sm text-muted hover:text-ink"
                    onClick={() =>
                      setVisible((v) => ({ ...v, [p.id]: !v[p.id] }))
                    }
                    aria-label={visible[p.id] ? "Hide" : "Show"}
                  >
                    {visible[p.id] ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-xs text-muted">{t.savedLocally}</p>
            <Button type="submit">{t.saveKeys}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
