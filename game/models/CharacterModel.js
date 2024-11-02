import { characterStates, characterAngles, getAngle } from "./constants";

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
    this.lastAngle = "";
    this.defaultTexture = `${name}_idle_135`;
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

  getAnimationFromMovement(up, down, left, right) {
    const isMoving = left || right || up || down;
    const state = isMoving ? "walk" : "idle";
    const angle = isMoving
      ? getAngle(up, down, left, right)
      : this.lastAngle || "180";

    this.lastAngle = angle;

    return `${this.name}_${state}_${angle}`;
  }

  createShadow(scene) {
    const shadowTextureKey = `shadowTexture_${this.name}_${Date.now()}`;

    // Calculate shadow dimensions based on hitbox
    const shadowWidth = this.hitBoxSize * 2.5;
    const shadowHeight = this.hitBoxSize * 2.5;
    const centerX = shadowWidth / 2;
    const centerY = shadowHeight / 2;
    const radius = shadowWidth / 2;

    // Create shadow
    const shadowTexture = scene.textures.createCanvas(
      shadowTextureKey,
      shadowWidth,
      shadowHeight
    );
    const context = shadowTexture.getContext();
    const gradient = context.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, "rgba(0,0,0,0.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, shadowWidth, shadowHeight);
    shadowTexture.refresh();

    return scene.add.image(0, 0, shadowTextureKey);
  }
}
