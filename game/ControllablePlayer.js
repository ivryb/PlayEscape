const bodyForcePower = 0.4;

import { Character } from "./models/Character.js";

import { getPlayerDynamicDepth } from "./depthSorting.js";

export class ControllablePlayer extends Character {
  constructor(scene, modelName) {
    super(scene, modelName);

    this.cursors = scene.input.keyboard.addKeys("w,a,s,d,up,down,left,right");
  }

  update() {
    if (!this.isLoaded) return;

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

    const power =
      (up || down) && (left || right) ? bodyForcePower * 0.55 : bodyForcePower;

    // Adjust x and y components for isometric movement
    // For a typical isometric angle of about 26.57 degrees (2:1 pixel ratio)
    let forceX = 0;
    let forceY = 0;

    if (left && (up || down))
      forceX -= power * 1.4142; // sqrt(2) to maintain consistent speed
    else if (left) forceX -= power;

    if (right && (up || down))
      forceX += power * 1.4142; // sqrt(2) to maintain consistent speed
    else if (right) forceX += power;

    if (up) forceY -= power * 0.7071; // sqrt(2)/2 for isometric Y component

    if (down) forceY += power * 0.7071;

    this.body.applyForce({
      x: forceX,
      y: forceY,
    });

    const currentDirection = this.characterModel.getAnimationFromMovement(
      up,
      down,
      left,
      right
    );

    if (this.lastDirection !== currentDirection) {
      this.sprite.play(currentDirection);

      this.lastDirection = currentDirection;
    }

    this.body.setDepth(getPlayerDynamicDepth(this.body));
  }
}
