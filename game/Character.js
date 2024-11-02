import { CharacterModelsManager } from "./CharacterModelsManager.js";

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

    useDev(() => {
      console.log("new Character", this);
    });
  }

  async init(spawnPosition) {
    await this.characterModel.init(this.scene);

    const shadowTextureKey = `shadowTexture_${this.modelName}_${Date.now()}`;

    // Create shadow
    const shadowTexture = this.scene.textures.createCanvas(
      shadowTextureKey,
      100,
      60
    );
    const context = shadowTexture.getContext();
    const gradient = context.createRadialGradient(50, 30, 0, 50, 30, 40);
    gradient.addColorStop(0, "rgba(0,0,0,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 100, 60);
    shadowTexture.refresh();

    this.shadow = this.scene.add.image(0, 0, shadowTextureKey);
    this.shadow.setOrigin(0.5, 0.5);
    this.shadow.setScale(1, 1); // Adjust scale to match previous ellipse size

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
}
