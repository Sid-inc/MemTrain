import { UI } from "./ui.js";
import { GameConfig } from "./config.js";

export class App {
  constructor() {
    this.ui = null;
  }

  async initialize() {
    const canvas = document.querySelector("canvas");
    canvas.width = GameConfig.WIDTH;
    canvas.height = GameConfig.HEIGHT;

    this.initializeUI();
  }

  initializeUI() {
    this.ui = new UI();
    this.ui.init();
  }
}