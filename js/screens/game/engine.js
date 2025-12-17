import { GameState } from "./state.js";
import { LevelGenerator } from "./level-generator.js";

export class GameEngine {
  constructor(levelConfig) {
    this.levelConfig = levelConfig;
    this.state = null;
    this.lastUpdateTime = null;
    this.onPhaseChange = null;
    this.onTimerUpdate = null;
    this.onResult = null;
  }

  initialize(availableArea) {
    const availableColors = LevelGenerator.generateColors(this.levelConfig.colorCount);
    
    this.state = new GameState(this.levelConfig);
    this.state.availableColors = availableColors;
    
    const shapes = LevelGenerator.generateShapes(this.levelConfig, availableArea);
    const laidOutShapes = LevelGenerator.calculateLayout(shapes, availableArea, true);
    
    this.state.shapes = laidOutShapes;
    this.state.userColors = laidOutShapes.map(() => ({ outer: null, inner: null }));
    
    // Начинаем с фазы показа с таймером
    this.state.changePhase("SHOWING");
    this.state.startTimer();
    
    this.lastUpdateTime = Date.now();
    
    return this.state;
  }

  update() {
    if (!this.state) return;

    const currentTime = Date.now();
    const deltaSeconds = (currentTime - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = currentTime;

    // Обновляем таймер только на фазе показа
    if (this.state.currentPhase === "SHOWING" && this.state.timerActive) {
      const timeEnded = this.state.updateTime(deltaSeconds);
      
      if (this.onTimerUpdate) {
        this.onTimerUpdate(this.state.timeLeft);
      }

      // Когда время показа закончилось, переходим к фазе ответа
      if (timeEnded) {
        this.state.changePhase("RECALL");
        
        if (this.onPhaseChange) {
          this.onPhaseChange("RECALL");
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
    if (!this.state || this.state.currentPhase !== "RECALL") return null;

    const { shapes } = this.state;
    
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      const distanceToCenter = Math.sqrt(
        Math.pow(x - shape.position.x, 2) + Math.pow(y - shape.position.y, 2)
      );
      
      // Проверяем клик по внешней фигуре (кругу)
      if (distanceToCenter <= shape.size / 2) {
        // Проверяем, не кликнули ли по внутреннему треугольнику
        if (this.isPointInTriangle(x, y, shape)) {
          this.state.selectShape(i, "inner");
          return {
            type: "SHAPE_SELECTED",
            compositeIndex: i,
            shapeType: "inner",
            shape
          };
        } else {
          this.state.selectShape(i, "outer");
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
    if (!this.state || !this.state.selectedShape) return null;

    this.state.applyColorToShape(colorIndex);
    
    if (this.state.areAllShapesColored()) {
      this.completeLevel();
    }
    
    return {
      type: "COLOR_APPLIED",
      selectedShape: this.state.selectedShape,
      colorIndex
    };
  }

  completeLevel() {
    if (!this.state) return;

    this.state.changePhase("RESULT");
    const result = this.state.calculateResult();
    
    if (this.onPhaseChange) {
      this.onPhaseChange("RESULT");
    }
    
    if (this.onResult) {
      this.onResult(result);
    }
  }

  reset() {
    this.state = null;
    this.lastUpdateTime = null;
  }

  getGameData() {
    return {
      state: this.state,
      config: this.levelConfig
    };
  }
}