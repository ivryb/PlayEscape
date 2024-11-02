<script setup>
import Phaser from "phaser";

import { useWindowSize } from "@vueuse/core";

import { MainScene } from "~/game/MainScene.js";

const { width, height } = useWindowSize();

const canvas = ref(null);
const game = ref(null);

onMounted(() => {
  game.value = new Phaser.Game({
    width: width.value,
    height: height.value,
    parent: canvas.value,
    scene: MainScene,
    physics: {
      default: "matter",
      matter: {
        // debug: true,
      },
    },
  });
});

watch([width, height], ([newWidth, newHeight]) => {
  if (game.value) {
    game.value.scale.resize(newWidth, newHeight);
  }
});
</script>

<template>
  <div ref="canvas"></div>
</template>
