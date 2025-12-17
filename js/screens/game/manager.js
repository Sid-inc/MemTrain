import { GameEngine } from "./engine.js";
import { Levels, GameConfig } from "../../config.js";

export class GameManager {
  constructor(renderer, ui) {
    this.renderer = renderer;
    this.ui = ui;
    this.engine = null;
    this.gameLoopId = null;
  }

  startLevel(levelId = 1) {
    const levelConfig = Levels.find(level => level.id === levelId) || Levels[0];
    
    this.engine = new GameEngine(levelConfig);
    
    // Передаем обновления таймера
    this.engine.onTimerUpdate = (timeLeft) => {
      // Можно обновлять UI, если нужно
    };
    
    this.engine.onPhaseChange = (phase) => {
      console.log(`Фаза изменилась на: ${phase}`);
    };
    
    this.engine.onResult = (result) => {
      console.log("Результат уровня:", result);
    };
    
    const availableArea = {
      width: GameConfig.WIDTH,
      height: GameConfig.HEIGHT
    };
    
    const gameState = this.engine.initialize(availableArea);
    
    this.renderer.initializeGameRenderer();
    this.renderer.setGameData(this.engine.getGameData());
    
    this.startGameLoop();
  }

  startGameLoop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
    
    const gameLoop = () => {
      if (this.engine) {
        this.engine.update();
        this.renderer.setGameData(this.engine.getGameData());
      }
      
      this.gameLoopId = requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
  }

  handleGameClick(x, y) {
    if (!this.engine) return null;
    
    // Проверяем клик по палитре цветов
    const colorIndex = this.renderer.gameRenderer.isColorClicked(x, y);
    
    if (colorIndex !== -1) {
      const result = this.engine.selectColor(colorIndex);
      return result;
    }
    
    // Проверяем клик по фигуре
    const clickResult = this.engine.handleClick(x, y);
    
    if (clickResult && clickResult.type === "SHAPE_SELECTED") {
      return clickResult;
    }
    
    // Проверяем клик по кнопке возврата
    if (this.renderer.gameRenderer?.isReturnButtonClicked(x, y)) {
      this.returnToMenu();
      return { type: "RETURN_TO_MENU" };
    }
    
    return null;
  }

  returnToMenu() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    
    if (this.engine) {
      this.engine.reset();
    }
    
    this.engine = null;
    this.renderer.gameRenderer = null;
    this.renderer.gameData = null;
    this.ui.state.setState(this.ui.state.UIStates.MENU);
  }

  stop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    
    if (this.engine) {
      this.engine.reset();
    }
    
    this.engine = null;
  }
}