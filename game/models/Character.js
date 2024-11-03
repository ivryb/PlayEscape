import { getPlayerDynamicDepth } from "~/game/utils/depthSorting";
import { CharacterModelsManager } from "./CharacterModelsManager";

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
    this.shadow = this.characterModel.createShadow(this.scene);
    this.shadow.setOrigin(0.5, 0.5);
    this.shadow.setScale(1, 1);

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
    if (!this.body) return;

    this.body.setDepth(getPlayerDynamicDepth(this.body));
  }

  setDirection(angle, isMoving) {
    if (this.lastIsMoving !== isMoving || this.lastAngle !== angle) {
      this.sprite.play(this.characterModel.getAnimationName(angle, isMoving));

      this.lastAngle = angle;
      this.lastIsMoving = isMoving;
    }
  }
}
