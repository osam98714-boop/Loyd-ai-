import { createServerFn } from "@tanstack/react-start";

export const getAiStatus = createServerFn({ method: "POST" }).handler(async () => {
  return { grok: Boolean(process.env.XAI_API_KEY) };
});
