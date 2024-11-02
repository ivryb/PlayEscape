const bodyForcePower = 0.4;

import { Character } from './Character.js';

import { getPlayerDynamicDepth } from './depthSorting.js';

export class ControllablePlayer extends Character {
  constructor(scene, modelName) {
    super(scene, modelName);

    this.cursors = scene.input.keyboard.addKeys('w,a,s,d,up,down,left,right');
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
      (up || down) && (left || right) ? bodyForcePower * 0.7 : bodyForcePower;

    this.body.applyForce({
      x: left ? -power : right ? power : 0,
      y: up ? -power : down ? power : 0,
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
