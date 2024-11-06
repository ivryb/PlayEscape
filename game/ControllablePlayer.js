import { Character } from "./Character";
import { getAngleFromMovement } from "~/characters/constants";

export class ControllablePlayer {
  constructor(scene, modelName) {
    this.scene = scene;
    this.modelName = modelName;

    this.character = new Character(scene, modelName);
  }

  async init(spawnPosition) {
    await this.character.init(spawnPosition);

    this.cursors = this.scene.input.keyboard.addKeys(
      "w,a,s,d,up,down,left,right",
      false
    );
  }

  update() {
    if (!this.scene.isLoaded) return;

    this.updateMovement();

    this.character.update();
  }

  updateMovement() {
    const c = this.cursors;

    let up = c.up.isDown || c.w.isDown;
    let down = c.down.isDown || c.s.isDown;
    let left = c.left.isDown || c.a.isDown;
    let right = c.right.isDown || c.d.isDown;

    if (up && down) {
      up = false;
      down = false;
    }

    if (left && right) {
      left = false;
      right = false;
    }

    const bodyForcePower = 0.4;

    const power =
      (up || down) && (left || right) ? bodyForcePower * 0.55 : bodyForcePower;

    let forceX = 0;
    let forceY = 0;

    if (left) forceX -= power;

    if (right) forceX += power;

    // i don't know why it works
    if (up || down) {
      forceX *= 1.4142;
    }

    if (up) forceY -= power * 0.7071; // sqrt(2)/2 for isometric Y component

    if (down) forceY += power * 0.7071;

    this.character.body.applyForce({
      x: forceX,
      y: forceY,
    });

    const isMoving = left || right || up || down;

    const angle = isMoving
      ? getAngleFromMovement(up, down, left, right)
      : this.character.lastAngle;

    this.character.setDirection(angle, isMoving);
  }
}
