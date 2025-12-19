import { GameState } from "../game-state.js";
import { LevelGenerator } from "../level-generator.js";

export class GameEngine {
  constructor(levelConfig) {
    this.levelConfig = levelConfig;
    this.gameState = null;
    this.lastUpdateTime = null;
    this.onPhaseChange = null;
    this.onTimerUpdate = null;
    this.onResult = null;
  }

  initialize(availableArea) {
    const availableColors = LevelGenerator.generateColors(this.levelConfig.colorCount);
    this.gameState = new GameState(this.levelConfig, availableColors);
    
    const shapes = LevelGenerator.generateShapesSettings(this.levelConfig);
    const laidOutShapes = LevelGenerator.calculateLayout(shapes, availableArea, true);
    
    this.gameState.shapes = laidOutShapes;
    this.gameState.userColors = laidOutShapes.map(() => ({ outer: null, inner: null }));
    
    // Начинаем с фазы показа с таймером
    this.gameState.changePhase(GameState.GamePhases.SHOWING);
    this.gameState.startTimer();
    
    this.lastUpdateTime = Date.now();
    
    return this.gameState;
  }

  update() {
    if (!this.gameState) return;

    const currentTime = Date.now();
    const deltaSeconds = (currentTime - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = currentTime;

    // Обновляем таймер только на фазе показа
    if (this.gameState.currentPhase === GameState.GamePhases.SHOWING && this.gameState.timerActive) {
      const timeEnded = this.gameState.updateTime(deltaSeconds);
      
      if (this.onTimerUpdate) {
        this.onTimerUpdate(this.gameState.timeLeft);
      }

      // Когда время показа закончилось, переходим к фазе ответа
      if (timeEnded) {
        this.gameState.changePhase(GameState.GamePhases.RECALL);
        
        if (this.onPhaseChange) {
          this.onPhaseChange(GameState.GamePhases.RECALL);
        }
      }
    }
  }

  isPointInTriangle(x, y, shape) {
    const { position, size, rotation } = shape;
    const radius = size / 2 * 0.7;
    
    const vertices = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
      vertices.push({
        x: position.x + radius * Math.cos(angle + rotation),
        y: position.y + radius * Math.sin(angle + rotation)
      });
    }
    
    const v0 = { x: vertices[2].x - vertices[0].x, y: vertices[2].y - vertices[0].y };
    const v1 = { x: vertices[1].x - vertices[0].x, y: vertices[1].y - vertices[0].y };
    const v2 = { x: x - vertices[0].x, y: y - vertices[0].y };
    
    const dot00 = v0.x * v0.x + v0.y * v0.y;
    const dot01 = v0.x * v1.x + v0.y * v1.y;
    const dot02 = v0.x * v2.x + v0.y * v2.y;
    const dot11 = v1.x * v1.x + v1.y * v1.y;
    const dot12 = v1.x * v2.x + v1.y * v2.y;
    
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    
    return (u >= 0) && (v >= 0) && (u + v < 1);
  }

  handleClick(x, y) {
    if (!this.gameState || this.gameState.currentPhase !== GameState.GamePhases.RECALL) return null;

    const { shapes } = this.gameState;
    
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      const distanceToCenter = Math.sqrt(
        Math.pow(x - shape.position.x, 2) + Math.pow(y - shape.position.y, 2)
      );
      
      // Проверяем клик по внешней фигуре (кругу)
      if (distanceToCenter <= shape.size / 2) {
        // Проверяем, не кликнули ли по внутреннему треугольнику
        if (this.isPointInTriangle(x, y, shape)) {
          this.gameState.selectShape(i, "inner");
          return {
            type: "SHAPE_SELECTED",
            compositeIndex: i,
            shapeType: "inner",
            shape
          };
        } else {
          this.gameState.selectShape(i, "outer");
          return {
            type: "SHAPE_SELECTED",
            compositeIndex: i,
            shapeType: "outer",
            shape
          };
        }
      }
    }
    
    return null;
  }

  selectColor(colorIndex) {
    if (!this.gameState || !this.gameState.selectedShape) return null;

    this.gameState.applyColorToShape(colorIndex);
    
    if (this.gameState.areAllShapesColored()) {
      this.completeLevel();
    }
    
    return {
      type: "COLOR_APPLIED",
      selectedShape: this.gameState.selectedShape,
      colorIndex
    };
  }

  completeLevel() {
    if (!this.gameState) return;

    this.gameState.changePhase(GameState.GamePhases.RESULT);
    const result = this.gameState.calculateResult();
    
    if (this.onPhaseChange) {
      this.onPhaseChange(GameState.GamePhases.RESULT);
    }
    
    if (this.onResult) {
      this.onResult(result);
    }
  }

  reset() {
    this.gameState = null;
    this.lastUpdateTime = null;
  }

  getGameData() {
    return {
      state: this.gameState,
      config: this.levelConfig
    };
  }
}