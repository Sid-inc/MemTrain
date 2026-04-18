import { State } from "./state.js";
import { Renderer } from "./renderer.js"
import { GameConfig } from "./config.js";

export class UI {
  constructor(soundManager) {
    this.canvas = null;
    this.ctx = null;
    this.state = null;
    this.renderer = null;
    this.soundManager = soundManager;

    this.mouseX = 0;
    this.mouseY = 0;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  init() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.state = new State(this.ctx, this.soundManager);
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

    const unlockAudio = async () => {
        await this.soundManager.unlock();
        // можно воспроизвести короткий тестовый звук (если загружен)
        this.soundManager.play('click'); // например
        document.body.removeEventListener('touchstart', unlockAudio);
        document.body.removeEventListener('click', unlockAudio);
    };
    document.body.addEventListener('touchstart', unlockAudio);
    document.body.addEventListener('click', unlockAudio);
  }

  handleMouseMove(e) {
    const { x, y } = this.getCanvasCoordinates(e.clientX, e.clientY);
    this.state.activeScreen.handleMouseMove(x, y);
  }

  handleMouseClick(e) {
    const { x, y } = this.getCanvasCoordinates(e.clientX, e.clientY);
    this.state.activeScreen.handleMouseClick(x, y);
  }

  getCanvasCoordinates(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();

    // Масштабные коэффициенты
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  handleResize() {
    this.canvas.width = GameConfig.WIDTH;
    this.canvas.height = GameConfig.HEIGHT;

    this.renderer.render();
  }

  renderLoop() {
    this.renderer.render();
    requestAnimationFrame(() => this.renderLoop());
  }
}