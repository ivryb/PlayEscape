import { openai } from "@ai-sdk/openai";

export const model = openai("gpt-4o-mini", {
  apiKey: process.env.OPENAI_API_KEY,
});
