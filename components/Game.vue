<script setup>
import { useWindowSize } from "@vueuse/core";
import { createGame, resizeGame } from "~/game/Game.js";

const { width, height } = useWindowSize();

const canvas = ref(null);
let game = null;

onMounted(() => {
  game = createGame(canvas.value, width.value, height.value);
});

watch([width, height], ([newWidth, newHeight]) => {
  if (game) {
    resizeGame(game, newWidth, newHeight);
  }
});
</script>

<template>
  <div>
    <div ref="canvas"></div>
    <!-- fog of war -->
    <div class="absolute inset-0 fog-of-war"></div>
    <ChatUI />
  </div>
</template>

<style scoped>
.fog-of-war {
  background: radial-gradient(
    circle,
    transparent,
    transparent,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.8)
  );
}
</style>
