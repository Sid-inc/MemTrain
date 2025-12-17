import { Game } from "./screens/game.js";
import { Menu } from "./screens/menu.js";

export class State {
  constructor(ctx) {
    this.ctx = ctx;
    this.UIState = State.UIStates.MENU;
    this.activeScreen = new Menu(this.ctx, this);
  }

  static UIStates = {
    MENU: "MENU",
    LEVELS: "LEVELS",
    GALARY: "GALARY",
    GAME: "GAME"
  };

  setState(newState) {
    if (Object.values(State.UIStates).includes(newState)) {
      this.UIState = newState;

      switch (this.UIState)
      {
        case State.UIStates.MENU:
          this.activeScreen = new Menu(this.ctx, this);
          break;
        case State.UIStates.GAME:
          this.activeScreen = new Game(this.ctx, this);
          break;
        case State.UIStates.LEVELS:
          break;
        case State.UIStates.GALARY:
          break;
      }

      console.log(`State changed to: ${newState}`);
    }
  }
}