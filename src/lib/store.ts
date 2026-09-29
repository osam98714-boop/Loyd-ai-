import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { copy, type Lang } from "@/lib/i18n";
import {
  DEFAULT_MODELS,
  PERSONA_PROMPTS,
  type PersonaId,
  type ProviderId,
} from "@/lib/providers";
import { truncate, uid } from "@/lib/utils";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  provider?: ProviderId;
  model?: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

type Keys = Record<ProviderId, string>;

type LoydState = {
  hydrated: boolean;
  lang: Lang;
  provider: ProviderId;
  model: string;
  persona: PersonaId;
  systemPrompt: string;
  keys: Keys;
  conversations: Conversation[];
  activeId: string | null;
  sidebarOpen: boolean;
  settingsOpen: boolean;
  streaming: boolean;
  grokAvailable: boolean;
  setHydrated: (v: boolean) => void;
  setLang: (lang: Lang) => void;
  setProvider: (id: ProviderId) => void;
  setModel: (model: string) => void;
  setPersona: (id: PersonaId) => void;
  setSystemPrompt: (prompt: string) => void;
  setKeys: (keys: Partial<Keys>) => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setStreaming: (v: boolean) => void;
  setGrokAvailable: (v: boolean) => void;
  newChat: () => string;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  appendMessage: (msg: Omit<ChatMessage, "id" | "createdAt"> & { id?: string }) => string;
  patchMessage: (id: string, content: string) => void;
  t: () => (typeof copy)[Lang];
  activeChat: () => Conversation | undefined;
  needsKey: () => boolean;
};

const emptyKeys = (): Keys => ({
  gemini: "",
  deepseek: "",
  groq: "",
  openai: "",
  grok: "",
});

function freshChat(): Conversation {
  const now = Date.now();
  return { id: uid(), title: "", messages: [], createdAt: now, updatedAt: now };
}

export const useLoyd = create<LoydState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      lang: "en",
      provider: "grok",
      model: DEFAULT_MODELS.grok,
      persona: "default",
      systemPrompt: PERSONA_PROMPTS.default.en,
      keys: emptyKeys(),
      conversations: [],
      activeId: null,
      sidebarOpen: false,
      settingsOpen: false,
      streaming: false,
      grokAvailable: true,
      setHydrated: (hydrated) => set({ hydrated }),
      setLang: (lang) => {
        const { persona, systemPrompt } = get();
        const next: Partial<LoydState> = { lang };
        if (persona !== "custom") {
          next.systemPrompt = PERSONA_PROMPTS[persona][lang];
        } else if (!systemPrompt.trim()) {
          next.systemPrompt = PERSONA_PROMPTS.default[lang];
        }
        set(next);
        if (typeof document !== "undefined") {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        }
      },
      setProvider: (id) => {
        const current = get();
        const nextModel =
          current.provider === id ? current.model : DEFAULT_MODELS[id];
        set({ provider: id, model: nextModel });
      },
      setModel: (model) => set({ model }),
      setPersona: (id) => {
        const lang = get().lang;
        if (id === "custom") {
          set({ persona: id });
          return;
        }
        set({ persona: id, systemPrompt: PERSONA_PROMPTS[id][lang] });
      },
      setSystemPrompt: (systemPrompt) => set({ systemPrompt, persona: "custom" }),
      setKeys: (partial) =>
        set({ keys: { ...get().keys, ...partial } }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
      setStreaming: (streaming) => set({ streaming }),
      setGrokAvailable: (grokAvailable) => set({ grokAvailable }),
      newChat: () => {
        const chat = freshChat();
        set((s) => ({
          conversations: [chat, ...s.conversations],
          activeId: chat.id,
          sidebarOpen: false,
        }));
        return chat.id;
      },
      selectChat: (id) => set({ activeId: id, sidebarOpen: false }),
      deleteChat: (id) =>
        set((s) => {
          const conversations = s.conversations.filter((c) => c.id !== id);
          const activeId =
            s.activeId === id ? (conversations[0]?.id ?? null) : s.activeId;
          return { conversations, activeId };
        }),
      appendMessage: (msg) => {
        const id = msg.id ?? uid();
        const createdAt = Date.now();
        set((s) => {
          let conversations = s.conversations;
          let activeId = s.activeId;
          if (!activeId || !conversations.some((c) => c.id === activeId)) {
            const chat = freshChat();
            conversations = [chat, ...conversations];
            activeId = chat.id;
          }
          return {
            activeId,
            conversations: conversations.map((c) => {
              if (c.id !== activeId) return c;
              const title =
                c.title ||
                (msg.role === "user" ? truncate(msg.content) : c.title);
              return {
                ...c,
                title,
                updatedAt: createdAt,
                messages: [...c.messages, { ...msg, id, createdAt }],
              };
            }),
          };
        });
        return id;
      },
      patchMessage: (id, content) =>
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== s.activeId) return c;
            return {
              ...c,
              updatedAt: Date.now(),
              messages: c.messages.map((m) => (m.id === id ? { ...m, content } : m)),
            };
          }),
        })),
      t: () => copy[get().lang],
      activeChat: () => get().conversations.find((c) => c.id === get().activeId),
      needsKey: () => {
        const { provider, keys, grokAvailable } = get();
        if (provider === "grok") return !grokAvailable;
        return !keys[provider]?.trim();
      },
    }),
    {
      name: "loyd-ai",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        lang: s.lang,
        provider: s.provider,
        model: s.model,
        persona: s.persona,
        systemPrompt: s.systemPrompt,
        keys: s.keys,
        conversations: s.conversations,
        activeId: s.activeId,
      }),
    },
  ),
);
