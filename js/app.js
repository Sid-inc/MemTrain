import { UI } from "./ui.js";
import { GameConfig } from "./config.js";
import { SoundManager } from "./sound-manager.js";

export class App {
  constructor() {
    this.ui = null;
    this.soundManager = new SoundManager();
  }

  async initialize() {
    const canvas = document.querySelector("canvas");
    canvas.width = GameConfig.WIDTH;
    canvas.height = GameConfig.HEIGHT;

    this.initializeUI();
  }

  initializeUI() {
    this.ui = new UI(this.soundManager);
    this.ui.init();
  }
}