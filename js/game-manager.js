import { GameEngine } from "./game-objects/engine.js";
import { Levels, GameConfig } from "./config.js";

export class GameManager {
  constructor(levelId) {
    this.engine = null;
    this.gameLoopId = null;
    this.gameState = null;

    this.colorPalette = null;
    this.resultPanel = null;

    this.startLevel(levelId);
  }

  startLevel(levelId) {
    const levelConfig = Levels.find(level => level.id === levelId) || Levels[0];
    const availableArea = {
      width: GameConfig.WIDTH,
      height: GameConfig.HEIGHT
    };

    this.engine = new GameEngine(levelConfig);
    this.gameState = this.engine.initialize(availableArea);
    
    this.engine.onPhaseChange = (phase) => {
      console.log(`Фаза изменилась на: ${phase}`);
    };
    
    this.engine.onResult = (result) => {
      console.log("Результат уровня:", result);
    };


  }

  update()
  {
    this.engine.update();
  }

  handleGameClick(x, y) {
    console.log(`handled click x:${x} y:${y}`);
    if (!this.engine) return null;
    
    // Проверяем клик по палитре цветов
    const colorIndex = this.colorPalette.isColorClicked(x, y);
    
    if (colorIndex !== -1) {
      const result = this.engine.selectColor(colorIndex);
      return result;
    }
    
    // Проверяем клик по фигуре
    const clickResult = this.engine.handleClick(x, y);
    console.log("shape check result");
    console.log(clickResult);
    if (clickResult && clickResult.type === "SHAPE_SELECTED") {
      return clickResult;
    }
    
    // Проверяем клик по кнопке возврата
    if (this.resultPanel.isReturnButtonClicked(x, y)) {
      this.returnToMenu();
      return { type: "RETURN_TO_MENU" };
    }
    
    return null;
  }

  returnToMenu() {
    if (this.engine) {
      this.engine.reset();
    }
    
    this.engine = null;
  }

  getGameData() {
    return this.engine.getGameData();
  }
}