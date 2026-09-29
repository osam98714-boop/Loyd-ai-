import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, l as Slot, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as Settings, c as Eye, d as Check, f as ArrowUp, i as Square, l as EyeOff, o as MessageSquarePlus, r as Trash2, s as Menu, t as X, u as Copy } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { t as Root$1 } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BbKniggD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
function truncate(text, max = 42) {
	const cleaned = text.replace(/\s+/g, " ").trim();
	if (cleaned.length <= max) return cleaned;
	return `${cleaned.slice(0, max).trim()}…`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			biscuit: "bg-biscuit text-ink hover:bg-biscuit-deep",
			outline: "border border-border bg-bg text-fg hover:bg-biscuit/70",
			ghost: "text-fg hover:bg-biscuit/80",
			danger: "bg-danger text-white hover:bg-danger/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5",
			icon: "size-11",
			iconSm: "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function splitFences(input) {
	const parts = [];
	const re = /```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)```/g;
	let last = 0;
	let match;
	while (match = re.exec(input)) {
		if (match.index > last) parts.push({
			type: "text",
			value: input.slice(last, match.index)
		});
		parts.push({
			type: "code",
			lang: match[1] || "",
			value: match[2].replace(/\n$/, "")
		});
		last = match.index + match[0].length;
	}
	if (last < input.length) parts.push({
		type: "text",
		value: input.slice(last)
	});
	return parts;
}
function inline(text) {
	const nodes = [];
	const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s)]+)/g;
	let last = 0;
	let match;
	let i = 0;
	while (match = re.exec(text)) {
		if (match.index > last) nodes.push(text.slice(last, match.index));
		const token = match[0];
		if (token.startsWith("`")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-xs bg-code px-1 py-0.5 font-mono text-[0.85em] text-ink",
			children: token.slice(1, -1)
		}, i++));
		else if (token.startsWith("**")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-ink",
			children: token.slice(2, -2)
		}, i++));
		else if (token.startsWith("*")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: "italic",
			children: token.slice(1, -1)
		}, i++));
		else nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: token,
			target: "_blank",
			rel: "noreferrer",
			className: "text-accent underline decoration-accent/40 underline-offset-2",
			children: token
		}, i++));
		last = match.index + token.length;
	}
	if (last < text.length) nodes.push(text.slice(last));
	return nodes;
}
function renderText(block) {
	const lines = block.split("\n");
	const out = [];
	let list = [];
	const flushList = () => {
		if (!list.length) return;
		out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "my-2 ms-5 list-disc space-y-1",
			children: list.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(item) }, i))
		}, `ul-${out.length}`));
		list = [];
	};
	lines.forEach((line, idx) => {
		const heading = /^(#{1,3})\s+(.+)$/.exec(line);
		const bullet = /^[-*]\s+(.+)$/.exec(line);
		if (bullet) {
			list.push(bullet[1]);
			return;
		}
		flushList();
		if (heading) {
			const Tag = `h${heading[1].length + 2}`;
			out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				className: "mt-3 mb-1 font-semibold tracking-tight text-ink",
				children: inline(heading[2])
			}, `h-${idx}`));
			return;
		}
		if (line.trim() === "") {
			out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2" }, `br-${idx}`));
			return;
		}
		out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "leading-relaxed",
			children: inline(line)
		}, `p-${idx}`));
	});
	flushList();
	return out;
}
function CodeBlock({ lang, value, copyLabel, copiedLabel }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative my-3 overflow-hidden rounded-lg bg-ink text-cream",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-white/10 px-3 py-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs uppercase tracking-wide text-biscuit-deep",
				children: lang || "code"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cn("inline-flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs", "text-cream/80 transition-colors duration-150 hover:bg-white/10 hover:text-cream"),
				onClick: async () => {
					await navigator.clipboard.writeText(value);
					setCopied(true);
					window.setTimeout(() => setCopied(false), 1400);
				},
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? copiedLabel : copyLabel]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto p-3 font-mono text-[0.8125rem] leading-relaxed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: value })
		})]
	});
}
function Markdown({ text, copyLabel, copiedLabel }) {
	const segs = splitFences(text);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-w-0",
		children: segs.map((seg, i) => seg.type === "code" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
			lang: seg.lang,
			value: seg.value,
			copyLabel,
			copiedLabel
		}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderText(seg.value) }, i))
	});
}
var copy = {
	en: {
		appName: "Loyd AI",
		tagline: "Your personal multi-model assistant",
		newChat: "New chat",
		chats: "Chats",
		settings: "Settings",
		language: "Language",
		systemPrompt: "System prompt",
		persona: "Persona",
		customPersona: "Custom",
		personas: {
			default: "Loyd",
			coder: "Expert Coder",
			researcher: "Deep Researcher",
			assistant: "Personal Assistant",
			custom: "Custom"
		},
		personaHints: {
			default: "Warm, precise, and adaptable.",
			coder: "Writes clean code, explains tradeoffs.",
			researcher: "Cites reasoning, digs into sources.",
			assistant: "Organizes, drafts, and follows up.",
			custom: "Your own instructions."
		},
		models: "Models",
		apiKeys: "API keys",
		apiKeysHint: "Keys stay on this device in localStorage. They are sent only to the selected provider when you chat.",
		savedLocally: "Saved on this device",
		saveKeys: "Save keys",
		keyPlaceholder: "Paste API key",
		grokNoKey: "Uses the built-in xAI connection — no key needed.",
		grokUnavailable: "Grok is not available in this environment.",
		missingKey: "Add an API key in Settings to use this model.",
		send: "Send",
		stop: "Stop",
		composerPlaceholder: "Message Loyd AI…",
		emptyTitle: "How can Loyd help?",
		emptyBody: "Pick a model, set a persona, and start a conversation.",
		suggestions: [
			"Explain this React bug like I am new",
			"Research the latest on multimodal models",
			"Draft a concise professional email",
			"Review this function and suggest tests"
		],
		copy: "Copy",
		copied: "Copied",
		copyCode: "Copy code",
		thinking: "Loyd is thinking",
		deleteChat: "Delete chat",
		close: "Close",
		menu: "Menu",
		english: "English",
		arabic: "العربية",
		noChats: "No conversations yet",
		errorGeneric: "Something went wrong. Try again.",
		errorNoKey: "This provider needs an API key.",
		you: "You",
		clear: "Clear",
		modelLabel: "Model"
	},
	ar: {
		appName: "Loyd AI",
		tagline: "مساعدك الشخصي متعدد النماذج",
		newChat: "محادثة جديدة",
		chats: "المحادثات",
		settings: "الإعدادات",
		language: "اللغة",
		systemPrompt: "موجه النظام",
		persona: "الشخصية",
		customPersona: "مخصص",
		personas: {
			default: "لويد",
			coder: "مبرمج خبير",
			researcher: "باحث متعمق",
			assistant: "مساعد شخصي",
			custom: "مخصص"
		},
		personaHints: {
			default: "دافئ، دقيق، ومتكيّف.",
			coder: "يكتب كوداً نظيفاً ويشرح المفاضلات.",
			researcher: "يستند إلى التفكير ويغوص في المصادر.",
			assistant: "ينظّم ويصيغ ويتابع.",
			custom: "تعليماتك الخاصة."
		},
		models: "النماذج",
		apiKeys: "مفاتيح الواجهة",
		apiKeysHint: "تُحفظ المفاتيح على هذا الجهاز في localStorage، وتُرسل فقط إلى المزود المختار عند المحادثة.",
		savedLocally: "محفوظ على هذا الجهاز",
		saveKeys: "حفظ المفاتيح",
		keyPlaceholder: "الصق مفتاح الواجهة",
		grokNoKey: "يستخدم اتصال xAI المدمج — دون الحاجة لمفتاح.",
		grokUnavailable: "غروك غير متاح في هذه البيئة.",
		missingKey: "أضف مفتاح واجهة من الإعدادات لاستخدام هذا النموذج.",
		send: "إرسال",
		stop: "إيقاف",
		composerPlaceholder: "اكتب رسالة إلى Loyd AI…",
		emptyTitle: "كيف يمكن للويد أن يساعد؟",
		emptyBody: "اختر نموذجاً، حدّد شخصية، وابدأ المحادثة.",
		suggestions: [
			"اشرح هذا الخطأ في React وكأني مبتدئ",
			"ابحث لي عن أحدث ما يتعلق بالنماذج متعددة الوسائط",
			"صغ بريداً مهنياً موجزاً",
			"راجع هذه الدالة واقترح اختبارات"
		],
		copy: "نسخ",
		copied: "تم النسخ",
		copyCode: "نسخ الكود",
		thinking: "لويد يفكر",
		deleteChat: "حذف المحادثة",
		close: "إغلاق",
		menu: "القائمة",
		english: "English",
		arabic: "العربية",
		noChats: "لا محادثات بعد",
		errorGeneric: "حدث خطأ. حاول مرة أخرى.",
		errorNoKey: "هذا المزود يحتاج مفتاح واجهة.",
		you: "أنت",
		clear: "مسح",
		modelLabel: "النموذج"
	}
};
var PROVIDERS = [
	{
		id: "gemini",
		label: "Gemini",
		needsKey: true,
		models: [
			{
				id: "gemini-2.5-flash",
				label: "Gemini 2.5 Flash"
			},
			{
				id: "gemini-2.0-flash",
				label: "Gemini 2.0 Flash"
			},
			{
				id: "gemini-2.5-pro",
				label: "Gemini 2.5 Pro"
			}
		],
		keyHint: "Google AI Studio key"
	},
	{
		id: "deepseek",
		label: "DeepSeek",
		needsKey: true,
		models: [{
			id: "deepseek-chat",
			label: "DeepSeek Chat"
		}, {
			id: "deepseek-reasoner",
			label: "DeepSeek Reasoner"
		}],
		keyHint: "sk-…"
	},
	{
		id: "groq",
		label: "Groq",
		needsKey: true,
		models: [{
			id: "llama-3.3-70b-versatile",
			label: "Llama 3.3 70B"
		}, {
			id: "llama-3.1-8b-instant",
			label: "Llama 3.1 8B Instant"
		}],
		keyHint: "gsk_…"
	},
	{
		id: "openai",
		label: "OpenAI",
		needsKey: true,
		models: [{
			id: "gpt-4o-mini",
			label: "GPT-4o mini"
		}, {
			id: "gpt-4o",
			label: "GPT-4o"
		}],
		keyHint: "sk-proj-… or sk-…"
	},
	{
		id: "grok",
		label: "Grok",
		needsKey: false,
		models: [{
			id: "grok-4.5",
			label: "Grok 4.5"
		}],
		keyHint: "Built-in xAI"
	}
];
var DEFAULT_MODELS = {
	gemini: "gemini-2.5-flash",
	deepseek: "deepseek-chat",
	groq: "llama-3.3-70b-versatile",
	openai: "gpt-4o-mini",
	grok: "grok-4.5"
};
var PERSONA_PROMPTS = {
	default: {
		en: "You are Loyd AI, a personal multi-model assistant. Be clear, warm, and precise. Match the user's language. Use markdown for structure. When writing code, include the language tag and keep examples complete enough to run.",
		ar: "أنت Loyd AI، مساعد شخصي متعدد النماذج. كن واضحاً ودافئاً ودقيقاً. جاوب بلغة المستخدم. استخدم ماركداون للتنظيم. عند كتابة الكود، ضع وسم اللغة واجعل الأمثلة قابلة للتشغيل."
	},
	coder: {
		en: "You are Loyd AI in Expert Coder mode. Prefer working code, name tradeoffs, and call out bugs. Use fenced code blocks with language tags. Keep explanations tight and technical.",
		ar: "أنت Loyd AI في وضع المبرمج الخبير. فضّل الكود العامل، اذكر المفاضلات، ونبّه للأخطاء. استخدم كتل كود مع وسم اللغة. اجعل الشرح موجزاً وتقنياً."
	},
	researcher: {
		en: "You are Loyd AI in Deep Researcher mode. Structure answers with findings, caveats, and open questions. Separate facts from inference. Be thorough but scannable.",
		ar: "أنت Loyd AI في وضع الباحث المتعمق. نظّم الإجابة إلى نتائج وتحفظات وأسئلة مفتوحة. افصل الوقائع عن الاستنتاج. كن شاملاً وسهل المسح."
	},
	assistant: {
		en: "You are Loyd AI in Personal Assistant mode. Draft, plan, and organize. Offer next steps, checklists, and concise options. Be practical and respectful of the user's time.",
		ar: "أنت Loyd AI في وضع المساعد الشخصي. صغ وخطط ونظّم. قدّم خطوات تالية وقوائم خيارات موجزة. كن عملياً واحترم وقت المستخدم."
	}
};
var emptyKeys = () => ({
	gemini: "",
	deepseek: "",
	groq: "",
	openai: "",
	grok: ""
});
function freshChat() {
	const now = Date.now();
	return {
		id: uid(),
		title: "",
		messages: [],
		createdAt: now,
		updatedAt: now
	};
}
var useLoyd = create()(persist((set, get) => ({
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
		const next = { lang };
		if (persona !== "custom") next.systemPrompt = PERSONA_PROMPTS[persona][lang];
		else if (!systemPrompt.trim()) next.systemPrompt = PERSONA_PROMPTS.default[lang];
		set(next);
		if (typeof document !== "undefined") {
			document.documentElement.lang = lang;
			document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
		}
	},
	setProvider: (id) => {
		const current = get();
		set({
			provider: id,
			model: current.provider === id ? current.model : DEFAULT_MODELS[id]
		});
	},
	setModel: (model) => set({ model }),
	setPersona: (id) => {
		const lang = get().lang;
		if (id === "custom") {
			set({ persona: id });
			return;
		}
		set({
			persona: id,
			systemPrompt: PERSONA_PROMPTS[id][lang]
		});
	},
	setSystemPrompt: (systemPrompt) => set({
		systemPrompt,
		persona: "custom"
	}),
	setKeys: (partial) => set({ keys: {
		...get().keys,
		...partial
	} }),
	setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
	setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
	setStreaming: (streaming) => set({ streaming }),
	setGrokAvailable: (grokAvailable) => set({ grokAvailable }),
	newChat: () => {
		const chat = freshChat();
		set((s) => ({
			conversations: [chat, ...s.conversations],
			activeId: chat.id,
			sidebarOpen: false
		}));
		return chat.id;
	},
	selectChat: (id) => set({
		activeId: id,
		sidebarOpen: false
	}),
	deleteChat: (id) => set((s) => {
		const conversations = s.conversations.filter((c) => c.id !== id);
		return {
			conversations,
			activeId: s.activeId === id ? conversations[0]?.id ?? null : s.activeId
		};
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
					const title = c.title || (msg.role === "user" ? truncate(msg.content) : c.title);
					return {
						...c,
						title,
						updatedAt: createdAt,
						messages: [...c.messages, {
							...msg,
							id,
							createdAt
						}]
					};
				})
			};
		});
		return id;
	},
	patchMessage: (id, content) => set((s) => ({ conversations: s.conversations.map((c) => {
		if (c.id !== s.activeId) return c;
		return {
			...c,
			updatedAt: Date.now(),
			messages: c.messages.map((m) => m.id === id ? {
				...m,
				content
			} : m)
		};
	}) })),
	t: () => copy[get().lang],
	activeChat: () => get().conversations.find((c) => c.id === get().activeId),
	needsKey: () => {
		const { provider, keys, grokAvailable } = get();
		if (provider === "grok") return !grokAvailable;
		return !keys[provider]?.trim();
	}
}), {
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
		activeId: s.activeId
	})
}));
function MessageBubble({ message }) {
	const t = useLoyd((s) => s.t());
	const isUser = message.role === "user";
	const providerLabel = PROVIDERS.find((p) => p.id === message.provider)?.label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex w-full", isUser ? "justify-end" : "justify-start"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("max-w-[min(100%,40rem)] rounded-xl px-4 py-3", isUser ? "rounded-ee-sm bg-user text-ink shadow-[var(--shadow-soft)]" : "rounded-es-sm bg-bg text-fg shadow-[var(--shadow-soft)]"),
			children: isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap leading-relaxed",
				children: message.content
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [providerLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-1.5 text-[0.7rem] font-medium tracking-wide text-muted uppercase",
				children: [providerLabel, message.model ? ` · ${message.model}` : ""]
			}) : null, message.content ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
				text: message.content,
				copyLabel: t.copyCode,
				copiedLabel: t.copied
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thinking, {})] })
		})
	});
}
function Thinking() {
	const t = useLoyd((s) => s.t());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 text-sm text-muted",
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex gap-1",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 animate-pulse rounded-full bg-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 animate-pulse rounded-full bg-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 animate-pulse rounded-full bg-accent" })
			]
		}), t.thinking]
	});
}
function Composer({ onSend, onStop }) {
	const t = useLoyd((s) => s.t());
	const streaming = useLoyd((s) => s.streaming);
	const needsKey = useLoyd((s) => s.needsKey());
	const setSettingsOpen = useLoyd((s) => s.setSettingsOpen);
	const ref = (0, import_react.useRef)(null);
	function submit(e) {
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
	function onKeyDown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "mx-auto w-full max-w-3xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2",
		children: [needsKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setSettingsOpen(true),
			className: "mb-2 w-full rounded-md bg-biscuit px-3 py-2 text-start text-sm text-ink",
			children: t.missingKey
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-end gap-2 rounded-xl bg-bg p-2 shadow-[var(--shadow-lift)]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				ref,
				rows: 1,
				onKeyDown,
				onInput: (e) => {
					const el = e.currentTarget;
					el.style.height = "auto";
					el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
				},
				placeholder: t.composerPlaceholder,
				className: "max-h-44 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "icon",
				variant: streaming ? "biscuit" : "default",
				"aria-label": streaming ? t.stop : t.send,
				className: "shrink-0",
				children: streaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
			})]
		})]
	});
}
function LoydMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8 shrink-0", className),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "32",
			height: "32",
			rx: "10",
			fill: "currentColor",
			className: "text-biscuit"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M11 8.5v15h11",
			fill: "none",
			stroke: "currentColor",
			className: "text-accent",
			strokeWidth: "2.4",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})]
	});
}
function ChatView({ onSend, onStop }) {
	const t = useLoyd((s) => s.t());
	const messages = useLoyd((s) => s.activeChat())?.messages ?? [];
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ block: "end" });
	}, [messages, messages.at(-1)?.content]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6",
					children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, { message: m }, m.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
				})
			}),
			messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-3 flex w-full max-w-3xl flex-wrap justify-center gap-2 px-4",
				children: t.suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onSend(s),
					className: "max-w-full rounded-full bg-biscuit px-3 py-2 text-start text-sm text-ink shadow-[var(--shadow-soft)] transition-transform duration-150 hover:bg-biscuit-deep active:scale-[0.96]",
					children: s
				}, s))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
				onSend,
				onStop
			})
		]
	});
}
function EmptyState() {
	const t = useLoyd((s) => s.t());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-64 flex-col items-center justify-center px-6 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoydMark, { className: "size-14" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 text-2xl font-semibold tracking-tight text-ink",
				children: t.emptyTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-muted",
				children: t.emptyBody
			})
		]
	});
}
function ModelPicker() {
	const provider = useLoyd((s) => s.provider);
	const model = useLoyd((s) => s.model);
	const keys = useLoyd((s) => s.keys);
	const grokAvailable = useLoyd((s) => s.grokAvailable);
	const setProvider = useLoyd((s) => s.setProvider);
	const setModel = useLoyd((s) => s.setModel);
	const t = useLoyd((s) => s.t());
	const current = PROVIDERS.find((p) => p.id === provider);
	function hasKey(id) {
		if (id === "grok") return grokAvailable;
		return Boolean(keys[id]?.trim());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "tablist",
			"aria-label": t.models,
			className: "flex max-w-full gap-1 overflow-x-auto rounded-lg bg-cream p-1 shadow-[var(--shadow-soft)]",
			children: PROVIDERS.map((p) => {
				const active = p.id === provider;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": active,
					onClick: () => setProvider(p.id),
					className: cn("h-11 shrink-0 rounded-md px-3 text-sm font-medium transition-[background-color,color,opacity] duration-150", active ? "bg-biscuit text-ink shadow-[var(--shadow-soft)]" : "text-muted hover:bg-biscuit/60 hover:text-ink", !active && !hasKey(p.id) && "opacity-70"),
					children: p.label
				}, p.id);
			})
		}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex min-w-0 items-center gap-2 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: t.modelLabel
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: model,
				onChange: (e) => setModel(e.target.value),
				className: "h-9 max-w-full rounded-md border border-border bg-bg px-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
				children: current.models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: m.id,
					children: m.label
				}, m.id))
			})]
		}) : null]
	});
}
var Dialog = Dialog$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-ink/30 data-[state=open]:animate-in data-[state=closed]:animate-out", "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2", "rounded-xl bg-bg p-5 shadow-[var(--shadow-lift)] outline-none", "data-[state=open]:animate-in data-[state=closed]:animate-out", "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "max-h-screen overflow-y-auto", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
			className: "absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-sm text-muted hover:bg-biscuit hover:text-ink",
			"aria-label": "Close",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1 pe-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-semibold tracking-tight text-ink", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-ink", "placeholder:text-muted outline-none transition-[box-shadow,border-color] duration-150", "focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-ring/30", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-sm font-medium text-ink", className),
		...props
	});
}
function SettingsDialog() {
	const open = useLoyd((s) => s.settingsOpen);
	const setOpen = useLoyd((s) => s.setSettingsOpen);
	const keys = useLoyd((s) => s.keys);
	const setKeys = useLoyd((s) => s.setKeys);
	const grokAvailable = useLoyd((s) => s.grokAvailable);
	const t = useLoyd((s) => s.t());
	const [draft, setDraft] = (0, import_react.useState)(keys);
	const [visible, setVisible] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (open) setDraft(keys);
	}, [open, keys]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t.settings }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t.apiKeysHint })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit: (e) => {
				e.preventDefault();
				setKeys({
					gemini: draft.gemini.trim(),
					deepseek: draft.deepseek.trim(),
					groq: draft.groq.trim(),
					openai: draft.openai.trim(),
					grok: ""
				});
				setOpen(false);
			},
			children: [PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: `key-${p.id}`,
					children: p.label
				}), p.id === "grok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: grokAvailable ? t.grokNoKey : t.grokUnavailable
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `key-${p.id}`,
						autoComplete: "off",
						spellCheck: false,
						type: visible[p.id] ? "text" : "password",
						placeholder: p.keyHint,
						value: draft[p.id],
						onChange: (e) => setDraft((d) => ({
							...d,
							[p.id]: e.target.value
						})),
						className: "pe-11 font-mono"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute end-1 top-1 inline-flex size-9 items-center justify-center rounded-sm text-muted hover:text-ink",
						onClick: () => setVisible((v) => ({
							...v,
							[p.id]: !v[p.id]
						})),
						"aria-label": visible[p.id] ? "Hide" : "Show",
						children: visible[p.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
					})]
				})]
			}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: t.savedLocally
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: t.saveKeys
				})]
			})]
		})] })
	});
}
function Separator({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink", "placeholder:text-muted outline-none transition-[box-shadow,border-color] duration-150", "focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-ring/30", className),
		...props
	});
}
var PERSONAS = [
	"default",
	"coder",
	"researcher",
	"assistant",
	"custom"
];
function Sidebar() {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col bg-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoydMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold tracking-tight text-ink",
						children: t.appName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-xs text-muted",
						children: t.tagline
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					onClick: () => newChat(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "size-4" }), t.newChat]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium tracking-wide text-muted uppercase",
						children: t.persona
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: PERSONAS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPersona(id),
							className: cn("h-8 rounded-full px-3 text-xs font-medium transition-colors duration-150", persona === id ? "bg-biscuit text-ink shadow-[var(--shadow-soft)]" : "bg-bg text-muted hover:bg-biscuit/70 hover:text-ink"),
							children: t.personas[id]
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: t.personaHints[persona]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "system-prompt",
					children: t.systemPrompt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "system-prompt",
					value: systemPrompt,
					onChange: (e) => setSystemPrompt(e.target.value),
					className: "mt-1.5 min-h-28 bg-bg"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 text-xs font-medium tracking-wide text-muted uppercase",
				children: t.chats
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-3",
				children: conversations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 py-6 text-sm text-muted",
					children: t.noChats
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: conversations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "group relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => selectChat(c.id),
							className: cn("flex h-11 w-full items-center rounded-md px-3 pe-10 text-start text-sm", "transition-colors duration-150", c.id === activeId ? "bg-biscuit text-ink" : "text-fg hover:bg-biscuit/60"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: c.title || t.newChat
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute end-1 top-1 inline-flex size-9 items-center justify-center rounded-sm text-muted opacity-0 hover:bg-bg hover:text-danger group-hover:opacity-100 focus:opacity-100",
							"aria-label": t.deleteChat,
							onClick: () => deleteChat(c.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					}, c.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-md bg-bg p-1 shadow-[var(--shadow-soft)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setLang("en"),
						className: cn("h-11 flex-1 rounded-sm text-sm font-medium", lang === "en" ? "bg-biscuit text-ink" : "text-ink/70 hover:text-ink"),
						children: t.english
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setLang("ar"),
						className: cn("h-11 flex-1 rounded-sm text-sm font-medium", lang === "ar" ? "bg-biscuit text-ink" : "text-ink/70 hover:text-ink"),
						children: t.arabic
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "mt-2 w-full md:hidden",
					onClick: () => setSidebarOpen(false),
					children: t.close
				})]
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus = createServerFn({ method: "POST" }).handler(createSsrRpc("d3a4c9d86645e56cf9474e434a5a59fc2cc797952f0fefd36898b21370eda9ed"));
function AppShell() {
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
	const abortRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useLoyd.persist.rehydrate()).then(() => {
			const state = useLoyd.getState();
			document.documentElement.lang = state.lang;
			document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
			setHydrated(true);
		});
		getAiStatus().then((s) => setGrokAvailable(s.grok));
	}, [setGrokAvailable, setHydrated]);
	async function send(text) {
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
		appendMessage({
			role: "user",
			content: trimmed
		});
		const assistantId = appendMessage({
			role: "assistant",
			content: "",
			provider: state.provider,
			model: state.model
		});
		setStreaming(true);
		const history = (useLoyd.getState().activeChat()?.messages ?? []).filter((m) => m.id !== assistantId).map((m) => ({
			role: m.role,
			content: m.content
		}));
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
					messages: history
				})
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
						const json = JSON.parse(payload);
						if (json.error) {
							assembled = assembled || json.error;
							patchMessage(assistantId, assembled);
						} else if (json.delta) {
							assembled += json.delta;
							patchMessage(assistantId, assembled);
						}
					} catch {}
				}
			}
			if (!assembled) patchMessage(assistantId, state.t().errorGeneric);
		} catch (err) {
			if (err.name === "AbortError") {
				if (!useLoyd.getState().activeChat()?.messages.find((m) => m.id === assistantId)?.content) patchMessage(assistantId, "—");
			} else patchMessage(assistantId, state.t().errorGeneric);
		} finally {
			setStreaming(false);
		}
	}
	function stop() {
		abortRef.current?.abort();
		setStreaming(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-bg text-fg",
		dir: lang === "ar" ? "rtl" : "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-72 shrink-0 border-e border-border md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {})
			}),
			sidebarOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-ink/30",
					"aria-label": t.close,
					onClick: () => setSidebarOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-y-0 start-0 w-72 max-w-full bg-cream shadow-[var(--shadow-lift)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center gap-2 border-b border-border px-3 py-2.5 md:px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "iconSm",
							className: "md:hidden",
							"aria-label": t.menu,
							onClick: () => setSidebarOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex-1 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "iconSm",
							"aria-label": t.settings,
							onClick: () => setSettingsOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatView, {
					onSend: send,
					onStop: stop
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
