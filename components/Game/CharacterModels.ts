import Phaser from 'phaser';

export const characterStates = ['walk', 'idle'];

export const characterAngles = [
  '000',
  '045',
  '090',
  '135',
  '180',
  '225',
  '270',
  '315',
];

const getAngle = (up, down, left, right) => {
  if (up && right) return '045';
  if (up && left) return '315';
  if (down && right) return '135';
  if (down && left) return '225';
  if (up) return '000';
  if (down) return '180';
  if (left) return '270';
  if (right) return '090';
  return '180';
};

export class CharacterModel {
  name: string;
  frameWidth: number;
  frameHeight: number;
  frameRateWalk: number;
  frameRateIdle: number;
  scale: number;
  hitBoxSize: number;
  hitBoxShift: number;
  defaultTexture: string;

  // move it to other class
  lastAngle: string;

  constructor({
    name,
    frameWidth = 256,
    frameHeight = 256,
    frameRateWalk = 30,
    frameRateIdle = 15,
    scale = 1,
    hitBoxSize = 30,
    hitBoxShift = 30,
  }) {
    this.name = name;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameRateWalk = frameRateWalk;
    this.frameRateIdle = frameRateIdle;
    this.scale = scale;
    this.hitBoxSize = hitBoxSize;
    this.hitBoxShift = hitBoxShift;

    // move somewhere
    this.lastAngle = '';

    this.defaultTexture = `${name}_idle_180`;
  }

  preload(scene: Phaser.Scene) {
    for (const state of characterStates) {
      for (const angle of characterAngles) {
        const animationName = `${this.name}_${state}_${angle}`;

        scene.load.spritesheet(
          animationName,
          `/game/Characters/${this.name}/${state}/${angle}.png`,
          {
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight,
          }
        );
      }
    }
  }

  createAnimations(scene: Phaser.Scene) {
    for (const state of characterStates) {
      for (const angle of characterAngles) {
        const animationName = `${this.name}_${state}_${angle}`;

        scene.anims.create({
          key: animationName,
          frames: scene.anims.generateFrameNumbers(animationName),
          frameRate: state === 'idle' ? this.frameRateIdle : this.frameRateWalk,
          repeat: -1,
        });
      }
    }
  }

  getAnimationFromMovement(up, down, left, right) {
    const isMoving = left || right || up || down;
    const state = isMoving ? 'walk' : 'idle';
    const angle = isMoving
      ? getAngle(up, down, left, right)
      : this.lastAngle || '180';

    this.lastAngle = angle;

    return `${this.name}_${state}_${angle}`;
  }
}

class CCharacterModelsManager {
  characters: CharacterModel[];

  constructor() {
    this.characters = [
      new CharacterModel({
        name: 'halberd_warrior',
        frameWidth: 320,
        frameHeight: 320,
        scale: 1.1,
      }),
      new CharacterModel({
        name: 'medieval_woman',
        hitBoxShift: 35,
        scale: 0.9,
      }),
      new CharacterModel({
        name: 'cool_thief_girl',
        scale: 0.95,
      }),
      new CharacterModel({
        name: 'mechanoid',
        frameWidth: 320,
        frameHeight: 320,
        hitBoxSize: 50,
        hitBoxShift: 60,
      }),
      new CharacterModel({
        name: 'medusa',
        hitBoxShift: 25,
      }),
      new CharacterModel({
        name: 'crocodile',
        frameWidth: 320,
        frameHeight: 320,
        hitBoxSize: 40,
        hitBoxShift: 50,
      }),
      new CharacterModel({
        name: 'reptiloid',
        scale: 1.1,
        hitBoxSize: 40,
        hitBoxShift: 45,
      }),
      new CharacterModel({
        name: 'hell_beast',
        scale: 1.1,
        hitBoxSize: 50,
        hitBoxShift: 50,
      }),
      new CharacterModel({
        name: 'ice_beast',
        scale: 1.1,
        hitBoxSize: 45,
        hitBoxShift: 45,
      }),
      new CharacterModel({
        name: 'three_head_dragon',
        scale: 1.35,
        hitBoxSize: 50,
        hitBoxShift: 50,
      }),
      new CharacterModel({
        name: 'blue_spider',
        scale: 1.35,
        hitBoxSize: 50,
        hitBoxShift: 45,
      }),
      new CharacterModel({
        name: 'brown_spider',
        scale: 1.25,
        hitBoxSize: 50,
        hitBoxShift: 40,
      }),
      new CharacterModel({
        name: 'tough_warrior',
        frameWidth: 320,
        frameHeight: 320,
        scale: 1,
        hitBoxSize: 40,
        hitBoxShift: 40,
      }),
    ];
  }

  preload(scene) {
    this.characters.map((character) => {
      character.preload(scene);
    });
  }

  createAnimations(scene) {
    this.characters.map((character) => {
      character.createAnimations(scene);
    });
  }

  getCharacter(name: string) {
    return this.characters.find((item) => item.name === name);
  }
}

export const CharacterModelsManager = new CCharacterModelsManager();
