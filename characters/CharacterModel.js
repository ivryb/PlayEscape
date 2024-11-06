import { characterStates, characterAngles } from "./constants";

export class CharacterModel {
  constructor({
    name,
    frameWidth = 256,
    frameHeight = 256,
    frameRateWalk = 30,
    frameRateIdle = 15,
    scale = 1,
    hitBoxSize = 30,
    hitBoxShift = 0,
  }) {
    this.name = name;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameRateWalk = frameRateWalk;
    this.frameRateIdle = frameRateIdle;
    this.scale = scale;
    this.hitBoxSize = hitBoxSize;
    this.hitBoxShift = hitBoxShift;

    this.isLoaded = false;
    this.defaultTexture = `${name}_idle_180`;
  }

  preload(scene) {
    for (const state of characterStates) {
      for (const angle of characterAngles) {
        const animationName = `${this.name}_${state}_${angle}`;

        scene.load.spritesheet(
          animationName,
          `/game/Characters/${this.name}/${state}/${angle}.png`,
          {
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight,
          }
        );
      }
    }
  }

  createAnimations(scene) {
    for (const state of characterStates) {
      for (const angle of characterAngles) {
        const animationName = `${this.name}_${state}_${angle}`;

        scene.anims.create({
          key: animationName,
          frames: scene.anims.generateFrameNumbers(animationName),
          frameRate: state === "idle" ? this.frameRateIdle : this.frameRateWalk,
          repeat: -1,
        });
      }
    }
  }

  async init(scene) {
    return new Promise((resolve) => {
      if (this.isLoaded) {
        resolve(this);
      } else {
        this.preload(scene);

        scene.load.once("complete", () => {
          this.createAnimations(scene);
          this.isLoaded = true;
          resolve(this);
        });

        scene.load.start();
      }
    });
  }

  getAnimationName(angle, isMoving) {
    const state = isMoving ? "walk" : "idle";

    return `${this.name}_${state}_${angle}`;
  }
}
