import fs from "fs";
import { generateText } from "ai";

import charactersData from "../game/models/characters.json" assert { type: "json" };

import { model } from "~/ai/models/openai.js";

async function generateCharacterDescriptions() {
  try {
    const updatedCharacters = [];

    // Process each character from the characters array inside the object
    for (const character of charactersData.characters) {
      console.log(`Generating description for character: ${character.name}`);

      // Read the character's preview image
      const previewPath = `./public/game/characters/${character.name}/preview.png`;
      const imageData = fs.readFileSync(previewPath);

      // Generate description using Vertex AI
      const { text } = await generateText({
        model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Generate a brief description (2-3 sentences) for this game character. Don't make up name or story, just describe this characters appearance as if you were telling a friend how it looks.",
              },
              {
                type: "image",
                image: imageData,
              },
            ],
          },
        ],
      });

      const description = text.trim();
      const updatedCharacter = {
        ...character,
        description,
      };

      updatedCharacters.push(updatedCharacter);
      console.log(
        `Generated description for ${character.name}: ${description}`
      );
    }

    // Save the updated characters data
    fs.writeFileSync(
      "./game/models/characters.json",
      JSON.stringify(
        { ...charactersData, characters: updatedCharacters },
        null,
        2
      )
    );

    console.log("Character descriptions generated and saved successfully!");
  } catch (error) {
    console.error("Error generating character descriptions:", error);
  }
}

// Run the generator
generateCharacterDescriptions();
