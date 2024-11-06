import Phaser from "phaser";
import { shuffle } from "lodash-es";
import { CharacterModelsManager } from "~/characters/CharacterModelsManager";
import { ControllablePlayer } from "~/game/ControllablePlayer";
import { AICharacter } from "~/game/AICharacter";

import { makeDynamicDepthLayer } from "~/game/utils/depthSorting";
import { convertObjectCoordinates } from "~/game/utils/tiled";

import { useChatManager } from "./state/chatManager";

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

    this.isLoaded = false;

    this.closestCharacter = null;
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
  }

  initMap() {
    this.map = this.add.tilemap("tilemap");

    this.tilesets = [
      this.map.addTilesetImage("Dungeon"),
      this.map.addTilesetImage("Farm"),
      this.map.addTilesetImage("Library"),
      this.map.addTilesetImage("Bases"),
    ];

    this.groundLayer = this.map.createLayer("ground", this.tilesets, 0, 0);
    this.groundLayer.setDepth(0);

    this.underPlayerLayer = this.map.createLayer(
      "under_player",
      this.tilesets,
      0,
      0
    );
    this.underPlayerLayer.setDepth(2);

    this.dynamicDepthLayer1 = this.map.createLayer(
      "dynamic_depth_layer1",
      this.tilesets,
      0,
      0
    );

    this.dynamicDepthLayer2 = this.map.createLayer(
      "dynamic_depth_layer2",
      this.tilesets,
      0,
      0
    );

    this.overPlayerLayer = this.map.createLayer(
      "over_player",
      this.tilesets,
      0,
      0
    );
    this.overPlayerLayer.setDepth(this.map.heightInPixels + 999);

    this.layers = [
      this.groundLayer,
      this.underPlayerLayer,
      this.dynamicDepthLayer1,
      this.overPlayerLayer,
      this.dynamicDepthLayer2,
    ];

    this.layers.map((layer) => {
      layer.setCullPadding(10, 10);
    });
  }

  initCamera() {
    this.cameras.main.setZoom(1.25);
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

    makeDynamicDepthLayer(this, this.dynamicDepthLayer1);
    makeDynamicDepthLayer(this, this.dynamicDepthLayer2);

    this.dynamicDepthLayer1.destroy();
    this.dynamicDepthLayer2.destroy();
  }

  async initPlayer() {
    this.player = new ControllablePlayer(this, this.playerModel);

    await this.player.init(this.playerSpawnPoint);

    this.cameras.main.startFollow(this.player.character.body);
  }

  initModels() {
    const availableModels = shuffle(
      CharacterModelsManager.getCharacters().map((item) => item.name)
    );

    this.playerModel = availableModels[0];
    this.availableAiModels = availableModels.slice(1, 11);
  }

  async initAICharacters() {
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

  updateCharacters() {
    // We can talk only to one character at a time...
    let closestCharacter = null;
    let closestDistance = Infinity;

    for (const aiCharacter of this.aiCharacters) {
      aiCharacter.update();

      if (
        aiCharacter.isInTalkRadius &&
        aiCharacter.distanceToPlayer < closestDistance
      ) {
        closestDistance = aiCharacter.distanceToPlayer;
        closestCharacter = aiCharacter;
      }
    }

    if (closestCharacter !== this.closestCharacter) {
      useChatManager().setClosestCharacter(closestCharacter);
    }

    this.closestCharacter = closestCharacter;
  }

  update() {
    if (!this.isLoaded) return;

    this.player.update();

    this.updateCharacters();
  }
}
