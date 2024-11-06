import sharp from "sharp";
import fs from "fs/promises";

import { characters } from "~/characters/characters.json";

// This script extracts character previews from the spritesheets.
// It takes one single frame from the spritesheet
// and removes the transparent background.

async function generateCharacterPreviews() {
  try {
    const spritesDir = `./public/game/characters`;

    // Get all sprite files
    for (const character of characters) {
      const characterName = character.name;

      const spritePath = `${spritesDir}/${characterName}/idle/225.png`;

      const tmpPath = `${spritesDir}/${characterName}/tmp.png`;
      const previewPath = `${spritesDir}/${characterName}/preview.png`;

      // Get dimensions from character config or use defaults
      const frameWidth = character.frameWidth || 256;
      const frameHeight = character.frameHeight || 256;

      await sharp(spritePath)
        .extract({
          left: 0,
          top: 0,
          width: frameWidth,
          height: frameHeight,
        })
        .png()
        .toFile(tmpPath);

      await sharp(tmpPath).trim().png().toFile(previewPath);

      await fs.rm(tmpPath);

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
