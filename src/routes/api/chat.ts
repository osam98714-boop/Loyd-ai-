import { createFileRoute } from "@tanstack/react-router";
import { streamChat, validateProxyRequest } from "@/lib/chat-proxy.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = validateProxyRequest(raw);
        if (typeof parsed === "string") {
          return Response.json({ error: parsed }, { status: 400 });
        }
        return streamChat(parsed);
      },
    },
  },
});
