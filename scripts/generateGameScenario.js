import fs from "fs";
import { generateText } from "ai";

import { characters } from "../game/models/characters.json";

import { model } from "~/ai/models/openai.js";

async function generateGameScenario() {
  const { text } = await generateText({
    model,
    messages: [{ role: "user", content: "Hello, world!" }],
  });
}
