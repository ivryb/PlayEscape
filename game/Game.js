import Phaser from "phaser";
import { MainScene } from "~/game/MainScene";

export function createGame(canvas, width, height) {
  return new Phaser.Game({
    width: width,
    height: height,
    parent: canvas,
    scene: MainScene,
    physics: {
      default: "matter",
      matter: {
        // debug: true,
      },
    },
  });
}

export function resizeGame(game, width, height) {
  game.scale.resize(width, height);
}
