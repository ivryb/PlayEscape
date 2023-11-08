<script setup>
import Phaser from 'phaser';

import { useWindowSize } from '@vueuse/core';

import { MainScene } from './MainScene.js';

const { width, height } = useWindowSize();

const canvas = ref(null);

onMounted(() => {
  const game = new Phaser.Game({
    width: width.value,
    height: height.value,
    parent: canvas.value,
    scene: MainScene,
    physics: {
      default: 'matter',
      matter: {
        debug: true,
      },
    },
  });
});
</script>

<template>
  <div ref="canvas"></div>
</template>
