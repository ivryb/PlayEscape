import Phaser from "phaser";
import { shuffle } from "lodash-es";
import { CharacterModelsManager } from "./models/CharacterModelsManager";
import { ControllablePlayer } from "./ControllablePlayer";
import { AICharacter } from "./AICharacter";

import { makeDynamicDepthLayer } from "./utils/depthSorting";
import { convertObjectCoordinates } from "./utils/tiled";

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
  }

  async create() {
    this.initMap();
    this.initPhysics();
    this.initSpawnPoints();
    this.initModels();
    this.initCamera();
    await this.initAICharacters();
    await this.initPlayer();

    this.isLoaded = true;

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
    this.fpsText = this.add.text(
      this.playerSpawnPoint.x,
      this.playerSpawnPoint.y,
      "",
      {
        fontSize: 20,
      }
    );

    this.fpsText.setDepth(this.map.heightInPixels + 1000);
  }

  initCamera() {
    useDev(() => console.log("Camera", this.cameras.main));

    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(
      this.playerSpawnPoint.x,
      this.playerSpawnPoint.y
    );
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

  async initPlayer() {
    this.player = new ControllablePlayer(this, this.playerModel);

    await this.player.init(this.playerSpawnPoint);

    this.cameras.main.startFollow(this.player.body);
  }

  initModels() {
    const availableModels = CharacterModelsManager.getCharacters().map(
      (item) => item.name
    );

    this.playerModel = availableModels[0];
    this.availableAiModels = shuffle(availableModels.slice(1));
  }

  async initAICharacters() {
    console.log("Available spawn points: ", this.aiSpawnPoints.length);
    console.log("Available models: ", this.availableAiModels.length);

    this.aiCharacters = this.availableAiModels.map((model) => {
      return new AICharacter(this, model);
    });

    let i = 0;
    for (const aiCharacter of this.aiCharacters) {
      await aiCharacter.init(this.aiSpawnPoints[i++]);
    }
  }

  initSpawnPoints() {
    const layer = this.map.getObjectLayer("spawns");
    const spawnPoints = layer.objects.map(convertObjectCoordinates);

    this.playerSpawnPoint = spawnPoints.find(
      (spawnPoint) => spawnPoint.name === "player"
    );

    this.aiSpawnPoints = shuffle(
      spawnPoints.filter((item) => item.name !== "player")
    );
  }

  update(time, delta) {
    // Update controllable player
    if (this.player) {
      this.player.update();
    }

    if (this.aiCharacters) {
      for (const aiCharacter of this.aiCharacters) {
        aiCharacter.update();
      }
    }

    if (this.fpsText) {
      this.fpsText.setText(Math.floor(this.sys.game.loop.actualFps));
    }
  }
}
