import { getPlayerDynamicDepth } from "~/game/utils/depthSorting";
import { CharacterModelsManager } from "~/characters/CharacterModelsManager";

export class Character {
  constructor(scene, modelName) {
    this.scene = scene;

    this.modelName = modelName;
    this.lastDirection = null;

    this.characterModel = CharacterModelsManager.getCharacter(modelName);
    this.sprite = null;
    this.container = null;
    this.body = null;
    this.shadow = null;

    this.isLoaded = false;

    this.lastAngle = "180";
    this.lastIsMoving = false;

    useDev(() => {
      console.log("new Character", this);
    });
  }

  async init(spawnPosition) {
    await this.characterModel.init(this.scene);

    // Get shadow from character model
    this.shadow = this.createShadow();

    this.sprite = this.scene.add.sprite(
      0,
      -(this.characterModel.hitBoxSize + this.characterModel.hitBoxShift),
      this.characterModel.defaultTexture
    );

    this.sprite.setScale(this.characterModel.scale);

    this.container = this.scene.add.container(
      spawnPosition.x,
      spawnPosition.y,
      [this.shadow, this.sprite]
    );

    this.container.setSize(
      this.characterModel.hitBoxSize,
      this.characterModel.hitBoxSize
    );

    this.body = this.scene.matter.add.gameObject(this.container, {
      shape: "circle",
    });

    this.body.setFixedRotation();

    this.body.setFriction(1);
    this.body.setMass(55);
    this.body.setBounce(0);
    this.body.setFrictionAir(0.5);
    this.body.setDepth(2);

    this.sprite.play(this.characterModel.defaultTexture);

    this.isLoaded = true;

    useDev(() => {
      console.log("Character loaded", this);
    });

    return this;
  }

  update() {
    if (!this.isLoaded) return;

    this.body.setDepth(getPlayerDynamicDepth(this.body));
  }

  setDirection(angle, isMoving) {
    if (this.lastIsMoving !== isMoving || this.lastAngle !== angle) {
      this.sprite.play(this.characterModel.getAnimationName(angle, isMoving));

      this.lastAngle = angle;
      this.lastIsMoving = isMoving;
    }
  }

  createShadow() {
    const shadowTextureKey = `shadowTexture_${
      this.characterModel.name
    }_${Date.now()}`;

    // Calculate shadow dimensions based on hitbox
    const shadowWidth = this.characterModel.hitBoxSize * 2.5;
    const shadowHeight = shadowWidth / 2;
    const centerX = shadowWidth / 2;
    const centerY = shadowHeight / 2;

    // Create shadow
    const shadowTexture = this.scene.textures.createCanvas(
      shadowTextureKey,
      shadowWidth,
      shadowHeight
    );
    const context = shadowTexture.getContext();

    // Scale context to create elliptical gradient for isometric perspective
    context.scale(1, 0.5);

    const gradient = context.createRadialGradient(
      centerX,
      centerY * 2,
      0,
      centerX,
      centerY * 2,
      shadowWidth / 2
    );

    gradient.addColorStop(0, "rgba(0,0,0,0.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, shadowWidth, shadowHeight * 2);

    context.setTransform(1, 0, 0, 1, 0, 0);

    shadowTexture.refresh();

    const shadow = this.scene.add.image(0, 0, shadowTextureKey);

    shadow.setOrigin(0.5, 0.5);
    shadow.setScale(1, 1);

    return shadow;
  }
}
