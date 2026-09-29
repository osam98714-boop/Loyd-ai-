import { useEffect, useRef } from "react";
import { Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatView } from "@/components/loyd/chat-view";
import { ModelPicker } from "@/components/loyd/model-picker";
import { SettingsDialog } from "@/components/loyd/settings-dialog";
import { Sidebar } from "@/components/loyd/sidebar";
import { getAiStatus } from "@/lib/ai-status";
import { useLoyd } from "@/lib/store";

export function AppShell() {
  const setHydrated = useLoyd((s) => s.setHydrated);
  const setGrokAvailable = useLoyd((s) => s.setGrokAvailable);
  const lang = useLoyd((s) => s.lang);
  const sidebarOpen = useLoyd((s) => s.sidebarOpen);
  const setSidebarOpen = useLoyd((s) => s.setSidebarOpen);
  const setSettingsOpen = useLoyd((s) => s.setSettingsOpen);
  const setStreaming = useLoyd((s) => s.setStreaming);
  const appendMessage = useLoyd((s) => s.appendMessage);
  const patchMessage = useLoyd((s) => s.patchMessage);
  const t = useLoyd((s) => s.t());
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    void Promise.resolve(useLoyd.persist.rehydrate()).then(() => {
      const state = useLoyd.getState();
      document.documentElement.lang = state.lang;
      document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
      setHydrated(true);
    });
    void getAiStatus().then((s) => setGrokAvailable(s.grok));
  }, [setGrokAvailable, setHydrated]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const state = useLoyd.getState();
    if (state.streaming) return;
    if (state.needsKey()) {
      state.setSettingsOpen(true);
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    appendMessage({ role: "user", content: trimmed });
    const assistantId = appendMessage({
      role: "assistant",
      content: "",
      provider: state.provider,
      model: state.model,
    });
    setStreaming(true);

    const history = (useLoyd.getState().activeChat()?.messages ?? [])
      .filter((m) => m.id !== assistantId)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify({
          provider: state.provider,
          model: state.model,
          apiKey: state.keys[state.provider],
          systemPrompt: state.systemPrompt,
          messages: history,
        }),
      });
      if (!res.body) throw new Error(state.t().errorGeneric);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          try {
            const json = JSON.parse(payload) as {
              delta?: string;
              error?: string;
              done?: boolean;
            };
            if (json.error) {
              assembled = assembled || json.error;
              patchMessage(assistantId, assembled);
            } else if (json.delta) {
              assembled += json.delta;
              patchMessage(assistantId, assembled);
            }
          } catch {
            /* skip */
          }
        }
      }
      if (!assembled) {
        patchMessage(assistantId, state.t().errorGeneric);
      }
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") {
        const current = useLoyd
          .getState()
          .activeChat()
          ?.messages.find((m) => m.id === assistantId)?.content;
        if (!current) patchMessage(assistantId, "—");
      } else {
        patchMessage(assistantId, state.t().errorGeneric);
      }
    } finally {
      setStreaming(false);
    }
  }

  function stop() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  return (
    <div className="flex min-h-dvh bg-bg text-fg" dir={lang === "ar" ? "rtl" : "ltr"}>
      <aside className="hidden w-72 shrink-0 border-e border-border md:block">
        <Sidebar />
      </aside>
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/30"
            aria-label={t.close}
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-72 max-w-full bg-cream shadow-[var(--shadow-lift)]">
            <Sidebar />
          </div>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-border px-3 py-2.5 md:px-4">
          <Button
            variant="ghost"
            size="iconSm"
            className="md:hidden"
            aria-label={t.menu}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1 overflow-x-auto">
            <ModelPicker />
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            aria-label={t.settings}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="size-5" />
          </Button>
        </header>
        <ChatView onSend={send} onStop={stop} />
      </div>
      <SettingsDialog />
    </div>
  );
}
