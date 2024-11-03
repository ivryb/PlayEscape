import sharp from "sharp";

import charactersJson from "~/game/models/characters.json";

const { characters } = charactersJson;

async function generateCharacterPreviews() {
  try {
    const spritesDir = `./public/game/characters`;

    // Get all sprite files
    for (const character of characters) {
      const characterName = character.name;

      const spritePath = `${spritesDir}/${characterName}/idle/225.png`;

      const previewPath = `${spritesDir}/${characterName}/preview.png`;

      // Get dimensions from character config or use defaults
      const frameWidth = character.frameWidth || 256;
      const frameHeight = character.frameHeight || 256;

      // Load the sprite image
      const image = sharp(spritePath);

      // Extract the first frame from the front-facing row (index 2)
      await image
        .extract({
          left: 0,
          top: 0,
          width: frameWidth,
          height: frameHeight,
        })
        .png()
        .toFile(previewPath);

      console.log(
        `Generated preview for ${characterName} (${frameWidth}x${frameHeight})`
      );
    }

    console.log("All character previews generated successfully!");
  } catch (error) {
    console.error("Error generating previews:", error);
  }
}

// Run the function
generateCharacterPreviews();
