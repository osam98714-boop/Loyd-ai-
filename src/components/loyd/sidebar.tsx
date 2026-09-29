import { MessageSquarePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { LoydMark } from "@/components/loyd/logo";
import type { PersonaId } from "@/lib/providers";
import { useLoyd } from "@/lib/store";
import { cn } from "@/lib/utils";

const PERSONAS: PersonaId[] = ["default", "coder", "researcher", "assistant", "custom"];

export function Sidebar() {
  const t = useLoyd((s) => s.t());
  const conversations = useLoyd((s) => s.conversations);
  const activeId = useLoyd((s) => s.activeId);
  const persona = useLoyd((s) => s.persona);
  const systemPrompt = useLoyd((s) => s.systemPrompt);
  const lang = useLoyd((s) => s.lang);
  const newChat = useLoyd((s) => s.newChat);
  const selectChat = useLoyd((s) => s.selectChat);
  const deleteChat = useLoyd((s) => s.deleteChat);
  const setPersona = useLoyd((s) => s.setPersona);
  const setSystemPrompt = useLoyd((s) => s.setSystemPrompt);
  const setLang = useLoyd((s) => s.setLang);
  const setSidebarOpen = useLoyd((s) => s.setSidebarOpen);

  return (
    <div className="flex h-full flex-col bg-cream">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <LoydMark />
        <div className="min-w-0">
          <div className="font-semibold tracking-tight text-ink">{t.appName}</div>
          <div className="truncate text-xs text-muted">{t.tagline}</div>
        </div>
      </div>
      <div className="px-3">
        <Button className="w-full" onClick={() => newChat()}>
          <MessageSquarePlus className="size-4" />
          {t.newChat}
        </Button>
      </div>
      <div className="mt-4 px-4">
        <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">
          {t.persona}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PERSONAS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPersona(id)}
              className={cn(
                "h-8 rounded-full px-3 text-xs font-medium transition-colors duration-150",
                persona === id
                  ? "bg-biscuit text-ink shadow-[var(--shadow-soft)]"
                  : "bg-bg text-muted hover:bg-biscuit/70 hover:text-ink",
              )}
            >
              {t.personas[id]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{t.personaHints[persona]}</p>
      </div>
      <div className="mt-4 px-4">
        <Label htmlFor="system-prompt">{t.systemPrompt}</Label>
        <Textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="mt-1.5 min-h-28 bg-bg"
        />
      </div>
      <Separator className="my-4" />
      <p className="px-4 text-xs font-medium tracking-wide text-muted uppercase">
        {t.chats}
      </p>
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {conversations.length === 0 ? (
          <p className="px-2 py-6 text-sm text-muted">{t.noChats}</p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id} className="group relative">
                <button
                  type="button"
                  onClick={() => selectChat(c.id)}
                  className={cn(
                    "flex h-11 w-full items-center rounded-md px-3 pe-10 text-start text-sm",
                    "transition-colors duration-150",
                    c.id === activeId
                      ? "bg-biscuit text-ink"
                      : "text-fg hover:bg-biscuit/60",
                  )}
                >
                  <span className="truncate">{c.title || t.newChat}</span>
                </button>
                <button
                  type="button"
                  className="absolute end-1 top-1 inline-flex size-9 items-center justify-center rounded-sm text-muted opacity-0 hover:bg-bg hover:text-danger group-hover:opacity-100 focus:opacity-100"
                  aria-label={t.deleteChat}
                  onClick={() => deleteChat(c.id)}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-auto border-t border-border p-3">
        <div className="flex rounded-md bg-bg p-1 shadow-[var(--shadow-soft)]">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "h-11 flex-1 rounded-sm text-sm font-medium",
              lang === "en" ? "bg-biscuit text-ink" : "text-ink/70 hover:text-ink",
            )}
          >
            {t.english}
          </button>
          <button
            type="button"
            onClick={() => setLang("ar")}
            className={cn(
              "h-11 flex-1 rounded-sm text-sm font-medium",
              lang === "ar" ? "bg-biscuit text-ink" : "text-ink/70 hover:text-ink",
            )}
          >
            {t.arabic}
          </button>
        </div>
        <Button
          variant="ghost"
          className="mt-2 w-full md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          {t.close}
        </Button>
      </div>
    </div>
  );
}
