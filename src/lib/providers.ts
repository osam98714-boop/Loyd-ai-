export type ProviderId = "gemini" | "deepseek" | "groq" | "openai" | "grok";

export type ProviderDef = {
  id: ProviderId;
  label: string;
  needsKey: boolean;
  models: { id: string; label: string }[];
  keyHint: string;
};

export const PROVIDERS: ProviderDef[] = [
  {
    id: "gemini",
    label: "Gemini",
    needsKey: true,
    models: [
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    ],
    keyHint: "Google AI Studio key",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    needsKey: true,
    models: [
      { id: "deepseek-chat", label: "DeepSeek Chat" },
      { id: "deepseek-reasoner", label: "DeepSeek Reasoner" },
    ],
    keyHint: "sk-…",
  },
  {
    id: "groq",
    label: "Groq",
    needsKey: true,
    models: [
      { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
      { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
    ],
    keyHint: "gsk_…",
  },
  {
    id: "openai",
    label: "OpenAI",
    needsKey: true,
    models: [
      { id: "gpt-4o-mini", label: "GPT-4o mini" },
      { id: "gpt-4o", label: "GPT-4o" },
    ],
    keyHint: "sk-proj-… or sk-…",
  },
  {
    id: "grok",
    label: "Grok",
    needsKey: false,
    models: [{ id: "grok-4.5", label: "Grok 4.5" }],
    keyHint: "Built-in xAI",
  },
];

export const DEFAULT_MODELS: Record<ProviderId, string> = {
  gemini: "gemini-2.5-flash",
  deepseek: "deepseek-chat",
  groq: "llama-3.3-70b-versatile",
  openai: "gpt-4o-mini",
  grok: "grok-4.5",
};

export type PersonaId = "default" | "coder" | "researcher" | "assistant" | "custom";

export const PERSONA_PROMPTS: Record<Exclude<PersonaId, "custom">, { en: string; ar: string }> = {
  default: {
    en: "You are Loyd AI, a personal multi-model assistant. Be clear, warm, and precise. Match the user's language. Use markdown for structure. When writing code, include the language tag and keep examples complete enough to run.",
    ar: "أنت Loyd AI، مساعد شخصي متعدد النماذج. كن واضحاً ودافئاً ودقيقاً. جاوب بلغة المستخدم. استخدم ماركداون للتنظيم. عند كتابة الكود، ضع وسم اللغة واجعل الأمثلة قابلة للتشغيل.",
  },
  coder: {
    en: "You are Loyd AI in Expert Coder mode. Prefer working code, name tradeoffs, and call out bugs. Use fenced code blocks with language tags. Keep explanations tight and technical.",
    ar: "أنت Loyd AI في وضع المبرمج الخبير. فضّل الكود العامل، اذكر المفاضلات، ونبّه للأخطاء. استخدم كتل كود مع وسم اللغة. اجعل الشرح موجزاً وتقنياً.",
  },
  researcher: {
    en: "You are Loyd AI in Deep Researcher mode. Structure answers with findings, caveats, and open questions. Separate facts from inference. Be thorough but scannable.",
    ar: "أنت Loyd AI في وضع الباحث المتعمق. نظّم الإجابة إلى نتائج وتحفظات وأسئلة مفتوحة. افصل الوقائع عن الاستنتاج. كن شاملاً وسهل المسح.",
  },
  assistant: {
    en: "You are Loyd AI in Personal Assistant mode. Draft, plan, and organize. Offer next steps, checklists, and concise options. Be practical and respectful of the user's time.",
    ar: "أنت Loyd AI في وضع المساعد الشخصي. صغ وخطط ونظّم. قدّم خطوات تالية وقوائم خيارات موجزة. كن عملياً واحترم وقت المستخدم.",
  },
};

export function providerById(id: ProviderId) {
  const found = PROVIDERS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown provider: ${id}`);
  return found;
}
