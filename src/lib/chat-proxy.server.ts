import type { ProviderId } from "@/lib/providers";

export type ProxyMessage = { role: "user" | "assistant"; content: string };

export type ProxyRequest = {
  provider: ProviderId;
  model: string;
  apiKey?: string;
  systemPrompt?: string;
  messages: ProxyMessage[];
};

const MAX_TOKENS = 2048;
const MAX_MESSAGES = 40;
const MAX_CHARS = 16_000;

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };
}

function encodeSse(obj: unknown) {
  return `data: ${JSON.stringify(obj)}\n\n`;
}

function sseError(message: string, status = 400) {
  return new Response(encodeSse({ error: message }), {
    status,
    headers: sseHeaders(),
  });
}

function parseProviderError(text: string, status: number) {
  try {
    const json = JSON.parse(text) as {
      error?: { message?: string } | string;
      message?: string;
    };
    if (typeof json.error === "string" && json.error) return json.error;
    if (json.error && typeof json.error === "object" && json.error.message) {
      return json.error.message;
    }
    if (json.message) return json.message;
  } catch {
    /* ignore */
  }
  const clipped = text.replace(/\s+/g, " ").trim().slice(0, 280);
  return clipped || `Provider error ${status}`;
}

function transformOpenAiSse(body: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  let buffer = "";
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      const encoder = new TextEncoder();
      const push = (obj: unknown) => controller.enqueue(encoder.encode(encodeSse(obj)));
      try {
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
            if (!payload || payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload) as {
                choices?: { delta?: { content?: string }; message?: { content?: string } }[];
                error?: { message?: string };
              };
              if (json.error?.message) {
                push({ error: json.error.message });
                continue;
              }
              const delta =
                json.choices?.[0]?.delta?.content ??
                json.choices?.[0]?.message?.content ??
                "";
              if (delta) push({ delta });
            } catch {
              /* skip malformed chunk */
            }
          }
        }
        push({ done: true });
      } catch (err) {
        push({
          error: err instanceof Error ? err.message : "Stream failed",
        });
      } finally {
        controller.close();
      }
    },
  });
}

function transformGeminiSse(body: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  let buffer = "";
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      const encoder = new TextEncoder();
      const push = (obj: unknown) => controller.enqueue(encoder.encode(encodeSse(obj)));
      try {
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
                candidates?: { content?: { parts?: { text?: string }[] } }[];
                error?: { message?: string };
              };
              if (json.error?.message) {
                push({ error: json.error.message });
                continue;
              }
              const text =
                json.candidates?.[0]?.content?.parts
                  ?.map((p) => p.text ?? "")
                  .join("") ?? "";
              if (text) push({ delta: text });
            } catch {
              /* skip */
            }
          }
        }
        push({ done: true });
      } catch (err) {
        push({
          error: err instanceof Error ? err.message : "Stream failed",
        });
      } finally {
        controller.close();
      }
    },
  });
}

async function proxyOpenAiCompatible(
  url: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: ProxyMessage[],
) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: MAX_TOKENS,
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return sseError(parseProviderError(text, res.status), 502);
  }
  if (!res.body) return sseError("Empty provider response", 502);
  return new Response(transformOpenAiSse(res.body), { headers: sseHeaders() });
}

async function proxyGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: ProxyMessage[],
) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      ...(systemPrompt
        ? { system_instruction: { parts: [{ text: systemPrompt }] } }
        : {}),
      contents,
      generationConfig: { maxOutputTokens: MAX_TOKENS },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return sseError(parseProviderError(text, res.status), 502);
  }
  if (!res.body) return sseError("Empty provider response", 502);
  return new Response(transformGeminiSse(res.body), { headers: sseHeaders() });
}

export function validateProxyRequest(raw: unknown): ProxyRequest | string {
  if (!raw || typeof raw !== "object") return "Invalid request";
  const body = raw as Partial<ProxyRequest>;
  const allowed: ProviderId[] = ["gemini", "deepseek", "groq", "openai", "grok"];
  if (!body.provider || !allowed.includes(body.provider)) return "Unknown provider";
  if (!body.model || typeof body.model !== "string") return "Missing model";
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return "Missing messages";
  }
  if (body.messages.length > MAX_MESSAGES) return "Too many messages";
  const messages: ProxyMessage[] = [];
  for (const m of body.messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return "Invalid message";
    if (typeof m.content !== "string" || !m.content.trim()) continue;
    if (m.content.length > MAX_CHARS) return "Message too long";
    messages.push({ role: m.role, content: m.content });
  }
  if (messages.length === 0) return "Missing messages";
  return {
    provider: body.provider,
    model: body.model.slice(0, 80),
    apiKey: typeof body.apiKey === "string" ? body.apiKey.trim() : "",
    systemPrompt:
      typeof body.systemPrompt === "string" ? body.systemPrompt.slice(0, 8000) : "",
    messages,
  };
}

export async function streamChat(req: ProxyRequest): Promise<Response> {
  const key = req.apiKey?.trim() ?? "";
  if (req.provider === "grok") {
    const grokKey = process.env.XAI_API_KEY;
    if (!grokKey) {
      return sseError("Grok is not available in this environment", 503);
    }
    return proxyOpenAiCompatible(
      "https://api.x.ai/v1/chat/completions",
      grokKey,
      req.model || "grok-4.5",
      req.systemPrompt ?? "",
      req.messages,
    );
  }
  if (!key) return sseError("This provider needs an API key");

  if (req.provider === "openai") {
    return proxyOpenAiCompatible(
      "https://api.openai.com/v1/chat/completions",
      key,
      req.model,
      req.systemPrompt ?? "",
      req.messages,
    );
  }
  if (req.provider === "groq") {
    return proxyOpenAiCompatible(
      "https://api.groq.com/openai/v1/chat/completions",
      key,
      req.model,
      req.systemPrompt ?? "",
      req.messages,
    );
  }
  if (req.provider === "deepseek") {
    return proxyOpenAiCompatible(
      "https://api.deepseek.com/chat/completions",
      key,
      req.model,
      req.systemPrompt ?? "",
      req.messages,
    );
  }
  return proxyGemini(key, req.model, req.systemPrompt ?? "", req.messages);
}
