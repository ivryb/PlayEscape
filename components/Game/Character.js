import Phaser from 'phaser';

import { CharacterModelsManager } from './CharacterModels.ts';

export class Character {
  constructor(scene, modelName, spawnPosition) {
    this.scene = scene;
    this.modelName = modelName;
    this.characterModel = CharacterModelsManager.getCharacter(modelName);

    this.sprite = scene.add.sprite(
      0,
      -this.characterModel.hitBoxShift,
      this.characterModel.defaultTexture
    );

    this.sprite.setScale(this.characterModel.scale);

    this.container = this.scene.add.container(
      spawnPosition.x,
      spawnPosition.y,
      [this.sprite]
    );

    this.container.setSize(
      this.characterModel.hitBoxSize,
      this.characterModel.hitBoxSize
    );

    this.body = this.scene.matter.add.gameObject(this.container, {
      shape: 'circle',
    });

    this.body.setFixedRotation();

    this.body.setFriction(1);
    this.body.setMass(50);
    this.body.setBounce(0);
    this.body.setFrictionAir(0.5);
    this.body.setDepth(2);

    this.sprite.play(this.characterModel.defaultTexture);

    console.log('new Character', this);
  }
}
