import { Character } from "./models/Character.js";

function getAIConversationSummary(conversation) {}

export class Conversation {
  constructor(players) {
    this.id = Date.now();
    this.players = players;
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push(message);
  }

  summarize() {}
}

export class AIPlayer extends Character {
  constructor(
    scene,
    modelName,
    { name, characterInfo, avatar, history, position }
  ) {
    super(scene, modelName);

    this.name = name;
    this.characterInfo = characterInfo;
    this.avatar = avatar;
    this.history = history;
    this.position = position;

    this.scene.events.subscribe("talkToPlayer", this.talkToPlayer, this);
  }

  talkToPlayer() {
    this.scene.events.emit("chat", {
      name: this.name,
      avatar: this.avatar,
      message: "Hello, I am a NPC",
    });
  }

  speakAudio() {
    this.scene.sound.play("speak");
  }
}
