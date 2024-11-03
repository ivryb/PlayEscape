import { Character } from "./models/Character";
import { getAngleString } from "./models/constants";

export class AICharacter extends Character {
  constructor(scene, modelName) {
    super(scene, modelName);
    this.lookRadius = 200; // Distance within which AI will look at player
  }

  update() {
    if (this.scene.isLoaded) {
      this.lookAtPlayer();
      super.update();
    }
  }

  init(params) {
    return super.init(params);
  }

  lookAtPlayer() {
    const player = this.scene.player;

    // Calculate distance to player using physics body coordinates
    const dx = player.body.x - this.body.x;
    const dy = player.body.y - this.body.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If player is within look radius, face them
    if (distance <= this.lookRadius) {
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      // Normalize angle to be between 0 and 360
      angle = Math.round(angle / 45) * 45;

      // Convert angle to closest 45-degree increment (0, 45, 90, 135, etc.)
      angle = ((angle % 360) + 360) % 360;

      // Update character's direction
      this.setDirection(getAngleString(angle));
    }
  }
}
