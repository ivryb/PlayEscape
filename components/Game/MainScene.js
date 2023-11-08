import Phaser from 'phaser';
import { CharacterModelsManager } from './CharacterModels.ts';
import { ControllablePlayer } from './ControllablePlayer.js';

import {
  getMatterBodyDepth,
  getTileDefaultDynamicDepth,
  getTileDynamicDepth,
  makeDynamicDepthLayer,
} from './depthSorting.js';

const spawnPosition = { x: 1283, y: 1922 };

export class MainScene extends Phaser.Scene {
  preload() {
    this.load.image('Dungeon', '/game/Tilesets/dungeon.png');
    this.load.image('Farm', '/game/Tilesets/farm.png');
    this.load.image('Library', '/game/Tilesets/library.png');

    this.load.spritesheet('Dungeon_sprite', '/game/Tilesets/dungeon.png', {
      frameWidth: 256,
      frameHeight: 512,
    });

    this.load.spritesheet('Farm_sprite', '/game/Tilesets/farm.png', {
      frameWidth: 256,
      frameHeight: 512,
    });

    this.load.spritesheet('Library_sprite', '/game/Tilesets/library.png', {
      frameWidth: 256,
      frameHeight: 512,
    });

    this.load.tilemapTiledJSON('tilemap', '/game/TiledMap.json');

    CharacterModelsManager.preload(this);
  }

  create() {
    CharacterModelsManager.createAnimations(this);

    this.initMap();
    this.initPhysics();
    this.initPlayer();
    this.initCamera();

    // this.initFpsMeter();

    this.input.addListener('pointerdown', (event) => {
      if (event.event.metaKey) {
        console.log(this.player.body.bounds.max);
      }
    });
  }

  initMap() {
    this.TILE_W = 256;
    this.TILE_H = 128;

    this.map = this.add.tilemap('tilemap');

    console.log('Map', this.map);

    this.tilesets = [
      this.map.addTilesetImage('Dungeon'),
      this.map.addTilesetImage('Farm'),
      this.map.addTilesetImage('Library'),
    ];

    this.groundLayer = this.map.createLayer('Ground', this.tilesets, 0, 0);

    this.worldLayer = this.map.createLayer(
      'World_objects',
      this.tilesets,
      0,
      0
    );

    this.decorLayer = this.map.createLayer(
      'World_objects_decor',
      this.tilesets,
      0,
      0
    );

    this.floor2Layer = this.map.createLayer('Floor_2', this.tilesets, 0, 0);

    this.floor2DecorLayer = this.map.createLayer(
      'Floor_2_decor',
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

    console.log('map.heightInPixels', this.map.heightInPixels);
  }

  initFpsMeter() {
    this.fpsText = this.add.text(spawnPosition.x, spawnPosition.y, '', {
      fontSize: 20,
    });

    this.fpsText.setDepth(this.map.heightInPixels + 1000);
  }

  initCamera() {
    console.log('Camera', this.cameras.main);

    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.player.body);
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

  initPlayer() {
    this.player = new ControllablePlayer(this, 'hell_beast', spawnPosition);
  }

  update(time, delta) {
    this.player.update();

    if (this.fpsText) {
      this.fpsText.setText(Math.floor(this.sys.game.loop.actualFps));
    }
  }
}
