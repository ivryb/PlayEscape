import { CharacterModel } from "./CharacterModel";
import characterConfigs from "~/characters/characters.json";

class CCharacterModelsManager {
  constructor() {
    this.characters = characterConfigs.characters.map(
      (config) => new CharacterModel(config)
    );
  }

  preload(scene) {
    this.characters.map((character) => {
      character.preload(scene);
    });
  }

  createAnimations(scene) {
    this.characters.map((character) => {
      character.createAnimations(scene);
    });
  }

  getCharacter(name) {
    return this.characters.find((item) => item.name === name);
  }

  getCharacters() {
    return this.characters;
  }
}

export const CharacterModelsManager = new CCharacterModelsManager();
