import Phaser from "phaser";
import { CharacterModelsManager } from "./CharacterModelsManager";
import { ControllablePlayer } from "./ControllablePlayer";

import { makeDynamicDepthLayer } from "./depthSorting";

const spawnPosition = { x: 894, y: 1962 };

export class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("Dungeon", "/game/Tilesets/dungeon.png");
    this.load.image("Farm", "/game/Tilesets/farm.png");
    this.load.image("Library", "/game/Tilesets/library.png");
    this.load.image("Bases", "/game/Tilesets/bases.png");

    this.load.spritesheet("Dungeon_sprite", "/game/Tilesets/dungeon.png", {
      frameWidth: 256,
      frameHeight: 512,
    });

    this.load.spritesheet("Farm_sprite", "/game/Tilesets/farm.png", {
      frameWidth: 256,
      frameHeight: 512,
    });

    this.load.spritesheet("Library_sprite", "/game/Tilesets/library.png", {
      frameWidth: 256,
      frameHeight: 512,
    });

    this.load.tilemapTiledJSON("tilemap", "/game/TiledMap.json");

    // CharacterModelsManager.preload(this);
  }

  create() {
    // CharacterModelsManager.createAnimations(this);

    this.initMap();
    this.initPhysics();
    this.initPlayers();
    this.initCamera();

    // this.initFpsMeter();

    this.input.addListener("pointerdown", (event) => {
      if (event.event.metaKey) {
        useDev(() => {
          const { floor } = Math;

          console.log(
            `{ x: ${floor(event.worldX)}, y: ${floor(event.worldY)} }`
          );
        });
      }
    });
  }

  initMap() {
    this.TILE_W = 256;
    this.TILE_H = 128;

    this.map = this.add.tilemap("tilemap");

    useDev(() => console.log("Map", this.map));

    this.tilesets = [
      this.map.addTilesetImage("Dungeon"),
      this.map.addTilesetImage("Farm"),
      this.map.addTilesetImage("Library"),
      this.map.addTilesetImage("Bases"),
    ];

    this.groundLayer = this.map.createLayer("Ground", this.tilesets, 0, 0);

    this.worldLayer = this.map.createLayer(
      "World_objects",
      this.tilesets,
      0,
      0
    );

    this.decorLayer = this.map.createLayer(
      "World_objects_decor",
      this.tilesets,
      0,
      0
    );

    this.floor2Layer = this.map.createLayer("Floor_2", this.tilesets, 0, 0);

    this.floor2DecorLayer = this.map.createLayer(
      "Floor_2_decor",
      this.tilesets,
      0,
      0
    );

    this.layers = [
      this.groundLayer,
      this.worldLayer,
      this.decorLayer,
      this.floor2Layer,
      this.floor2DecorLayer,
    ];

    this.layers.map((layer, i) => {
      layer.setCullPadding(10, 10);
    });

    this.groundLayer.setDepth(0);
    this.worldLayer.setDepth(1);
    this.floor2Layer.setDepth(this.map.heightInPixels + 999);
  }

  initFpsMeter() {
    this.fpsText = this.add.text(spawnPosition.x, spawnPosition.y, "", {
      fontSize: 20,
    });

    this.fpsText.setDepth(this.map.heightInPixels + 1000);
  }

  initCamera() {
    useDev(() => console.log("Camera", this.cameras.main));

    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(spawnPosition.x, spawnPosition.y);
  }

  initPhysics() {
    this.layers.slice(1).map((layer) => {
      layer.setCollisionFromCollisionGroup(true);
      this.matter.world.convertTilemapLayer(layer);
    });

    this.matter.world.disableGravity();

    makeDynamicDepthLayer(this, this.decorLayer);
    makeDynamicDepthLayer(this, this.floor2DecorLayer);

    this.decorLayer.destroy();
    this.floor2DecorLayer.destroy();
  }

  async initPlayers() {
    const allAvailalbeCharacters = CharacterModelsManager.getCharacters();
    const playerModels = allAvailalbeCharacters.map((character) => {
      return character.name;
    });
    this.players = [];

    for (const model of playerModels) {
      const player = new ControllablePlayer(this, model);
      await player.init(spawnPosition);
      this.players.push(player);
    }

    if (this.players.length > 0) {
      this.cameras.main.startFollow(this.players[0].body);
    }
  }

  update(time, delta) {
    for (const player of this.players) {
      player.update();
    }

    if (this.fpsText) {
      this.fpsText.setText(Math.floor(this.sys.game.loop.actualFps));
    }
  }
}
