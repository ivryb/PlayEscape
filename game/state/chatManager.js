export const useChatManager = defineStore("chatManager", () => {
  const isChatOpened = ref(false);
  const closestCharacter = shallowRef(null);

  function setClosestCharacter(character) {
    closestCharacter.value = character;
  }

  function openChat() {
    isChatOpened.value = true;
  }

  function closeChat() {
    isChatOpened.value = false;
  }

  return { closestCharacter, setClosestCharacter, openChat, closeChat };
});
