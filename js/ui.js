import { State } from "./state.js";
import { Renderer } from "./renderer.js"
import { GameConfig } from "./config.js";
// import { GameManager } from "./screens/game-manager.js";

export class UI {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.state = null;
    this.renderer = null;
    this.gameManager = null;

    this.mouseX = 0;
    this.mouseY = 0;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  init() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.state = new State(this.ctx);
    this.renderer = new Renderer(this.ctx, this.state);

    this.setupEventListeners();
    this.renderLoop();
  }

  setupEventListeners() {
    // Обработка движения мыши
    this.canvas.addEventListener("mousemove", this.handleMouseMove);

    // Обработка кликов
    this.canvas.addEventListener("click", this.handleMouseClick);

    // Обработка изменения размера окна
    window.addEventListener("resize", this.handleResize);

    // Для touch устройств
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMouseClick({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    });
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;

    this.state.activeScreen.handleMouseMove(this.mouseX, this.mouseY);
  }

  handleMouseClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.state.activeScreen.handleMouseClick(x, y);
  }

  handleResize() {
    this.canvas.width = GameConfig.WIDTH;
    this.canvas.height = GameConfig.HEIGHT;

    this.renderer.render();
  }

  // updateActiveScreenHover(x, y) {
  //   switch (this.state.activeScreen) {
  //     case this.state.UIStates.MENU:
  //       if (this.renderer.menu && this.renderer.menu.buttons) {
  //         this.renderer.menu.buttons.forEach(button => {
  //           button.isHovered = button.containsPoint(x, y);
  //         });
  //       }
  //       break;
  //     // Добавьте обработку для других экранов
  //     case this.state.UIStates.LEVELS:
  //       // Обработка для экрана уровней
  //       break;
  //     case this.state.UIStates.GALARY:
  //       // Обработка для галереи
  //       break;
  //   }
  // }

  // handleActiveScreenClick(x, y) {
  //   switch (this.state.activeScreen) {
  //     case this.state.UIStates.MENU:
  //       if (this.renderer.menu && this.renderer.menu.buttons) {
  //         this.renderer.menu.buttons.forEach(button => {
  //           if (button.containsPoint(x, y)) {
  //             switch (button.value) {
  //               case "start":
  //                 this.startGame();
  //                 break;
  //               case "levels":
  //                 this.state.setState(this.state.UIStates.LEVELS);
  //                 console.log("Переходим к уровням");
  //                 break;
  //               case "gallery":
  //                 this.state.setState(this.state.UIStates.GALARY);
  //                 console.log("Переходим к наградам/галерее");
  //                 break;
  //             }
  //           }
  //         });
  //       }
  //       break;
  //     case this.state.UIStates.GAME:
  //       this.handleGameClick(x, y);
  //       break;
  //     // Добавьте обработку для других экранов
  //     case this.state.UIStates.LEVELS:
  //       // Обработка кликов для экрана уровней
  //       break;
  //     case this.state.UIStates.GALARY:
  //       // Обработка кликов для галереи
  //       break;
  //   }
  // }

  // startGame() {
  //   this.state.setState(this.state.UIStates.GAME);
  //   this.gameManager.startLevel(1); // Начинаем с первого уровня
  // }

  // handleGameClick(x, y) {
  //   if (this.gameManager) {
  //     this.gameManager.handleGameClick(x, y);
  //   }
  // }

  renderLoop() {
    this.renderer.render();
    requestAnimationFrame(() => this.renderLoop());
  }
}