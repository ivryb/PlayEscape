class ChatManager {
  constructor() {
    this.currentCharacter = ref(null);
  }

  setCurrentCharacter(character) {
    this.currentCharacter.value = character;
  }
}

export const chatManager = new ChatManager();
