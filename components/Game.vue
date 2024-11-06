<script setup>
import { useWindowSize } from "@vueuse/core";
import { createGame, resizeGame } from "~/game/Game.js";
import { useChatManager } from "~/game/state/chatManager";

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

const chatManager = useChatManager();
</script>

<template>
  <div class="overflow-hidden absolute top-0 left-0 w-full h-full">
    <div ref="canvas"></div>
    <!-- fog of war -->
    <div class="absolute inset-0 vignette"></div>
    <Transition name="slide-fade">
      <ChatUI
        v-if="chatManager.closestCharacter"
        :key="chatManager.closestCharacter.id"
        :character="chatManager.closestCharacter"
      />
    </Transition>
  </div>
</template>

<style scoped>
.vignette {
  background: radial-gradient(
    circle,
    transparent,
    transparent,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.8)
  );
}
</style>
