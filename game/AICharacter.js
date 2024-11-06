import { Character } from "./Character";
import { convertFreeAngle } from "~/characters/constants";

const black = 0x000000;
const white = 0xffffff;
const brown = 0xab835a;
const green = 0x00ff00;
const yellow = 0xffff00;

const circleStrokeWidth = 8;
const circleAlpha = 0.1;
const circleStrokeAlpha = 0.2;
const circleActiveColor = green;
const circleInactiveColor = white;

const talkRadius = 150;
const lookRadius = 350;

export class AICharacter {
  constructor(scene, modelName) {
    this.scene = scene;
    this.modelName = modelName;

    this.character = new Character(scene, modelName);

    this.id = `ai-${modelName}-${Math.random().toString(36).substring(2, 15)}`;
    this.displayName = this.character.characterModel.displayName;

    this.distanceToPlayer = 0;
    this.isInTalkRadius = false;
  }

  async init(spawnPosition) {
    await this.character.init(spawnPosition);

    this.initTalkRadiusCircle();
  }

  updateDistanceToPlayer() {
    const player = this.scene.player.character;

    const dx = player.body.x - this.character.body.x;
    const dy = (player.body.y - this.character.body.y) * 2; // x2 for isometric perspective

    this.distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
    this.isInTalkRadius = this.distanceToPlayer <= talkRadius;
  }

  initTalkRadiusCircle() {
    this.talkRadiusCircle = this.scene.add.ellipse(
      0,
      0,
      talkRadius * 2,
      talkRadius,
      circleInactiveColor,
      circleAlpha
    );

    this.talkRadiusCircle.setDepth(3);

    this.setTalkCircleInactive();
  }

  setTalkCircleActive() {
    this.talkRadiusCircle.setFillStyle(circleActiveColor, circleAlpha);
    this.talkRadiusCircle.setStrokeStyle(
      circleStrokeWidth,
      circleActiveColor,
      circleStrokeAlpha
    );
  }

  setTalkCircleInactive() {
    this.talkRadiusCircle.setFillStyle(circleInactiveColor, circleAlpha);
    this.talkRadiusCircle.setStrokeStyle(
      circleStrokeWidth,
      circleInactiveColor,
      circleStrokeAlpha
    );
  }

  updateTalkCircle() {
    this.talkRadiusCircle.setPosition(
      this.character.body.x,
      this.character.body.y
    );

    if (this.scene.closestCharacter === this) {
      this.setTalkCircleActive();
    } else {
      this.setTalkCircleInactive();
    }
  }

  lookAtPlayer() {
    if (this.distanceToPlayer <= lookRadius) {
      const player = this.scene.player.character;
      const dx = player.body.x - this.character.body.x;
      const dy = player.body.y - this.character.body.y;
      const angle = convertFreeAngle(Math.atan2(dy, dx) * (180 / Math.PI) + 90);

      this.character.setDirection(angle);
    }
  }

  update() {
    this.updateDistanceToPlayer();

    this.updateTalkCircle();
    this.lookAtPlayer();

    this.character.update();
  }
}
