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
  <div>
    <div ref="canvas"></div>
    <!-- fog of war -->
    <div class="absolute inset-0 fog-of-war"></div>
  </div>
</template>

<style scoped>
.fog-of-war {
  background: radial-gradient(
    circle,
    transparent,
    transparent 50%,
    rgba(0, 0, 0, 0.7),
    black
  );
}
</style>
