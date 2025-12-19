import { GameConfig } from "./config.js";
import { Background } from "./background.js";
// import { Menu } from "./screens/menu.js";
// import { GameRenderer } from "./screens/game.js";

export class Renderer {
  constructor(ctx, state) {
    this.ctx = ctx;
    this.state = state;
    this.background = new Background(ctx);
    // this.gameRenderer = null;
    this.gameData = null;
  }

  render() {
    this.clearCanvas();
    this.renderBackground();
    this.renderActiveScreen();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, GameConfig.WIDTH, GameConfig.HEIGHT);
  }

  renderBackground()
  {
    this.background.render(this.ctx);
  }

  renderActiveScreen()
  {
    this.state.activeScreen.render();
  }

  setGameData(gameData) {
    this.gameData = gameData;
  }
}