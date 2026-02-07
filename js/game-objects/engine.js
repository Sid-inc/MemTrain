import { GameState } from "../game-state.js";
import { LevelGenerator } from "../level-generator.js";
import { ShapeTypes } from "../config.js";

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
    const laidOutShapes = LevelGenerator.calculateLayout(shapes, availableArea);

    this.gameState.shapes = laidOutShapes;
    this.gameState.userColors = laidOutShapes.map(() => ({ colorsSequence: Array(this.levelConfig.shapeSequence.length).fill(null) }));

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

  isPointInSphere(x, y, shape, radiusValue) {
    const distanceToCenter = Math.sqrt(
      Math.pow(x - shape.position.x, 2) + Math.pow(y - shape.position.y, 2)
    );

    // Используем радиус с учетом масштаба
    const actualRadius = (shape.size / 2) * radiusValue;

    return distanceToCenter <= actualRadius;
  }

  isPointInTriangle(x, y, shape, radiusValue) {
    const { position, size } = shape;
    const radius = (size / 2) * radiusValue; // Учитываем масштаб

    const vertices = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
      vertices.push({
        x: position.x + radius * Math.cos(angle),
        y: position.y + radius * Math.sin(angle)
      });
    }

    return this.isPointInTriangleByVertices(x, y, vertices[0], vertices[1], vertices[2]);
  }

  isPointInSquare(x, y, shape, radiusValue) {
    const { position, size } = shape;
    const radius = (size / 2) * radiusValue; // Учитываем масштаб

    // Вычисляем 4 вершины квадрата, повернутого на 45 градусов
    const vertices = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * 2 * Math.PI / 4) - Math.PI / 4;
      vertices.push({
        x: position.x + radius * Math.cos(angle),
        y: position.y + radius * Math.sin(angle)
      });
    }

    // Проверяем, находится ли точка внутри квадрата
    return this.isPointInTriangleByVertices(x, y, vertices[0], vertices[1], vertices[2]) ||
      this.isPointInTriangleByVertices(x, y, vertices[0], vertices[2], vertices[3]);
  }

  isPointInRectangle(x, y, shape, radiusValue) {
    const { position, size } = shape;
    const radius = (size / 2) * radiusValue; // Учитываем масштаб

    const width = radius * 1.4;
    const height = radius;

    // Проверяем, находится ли точка внутри прямоугольника (без поворота)
    return (x >= position.x - width / 2 && x <= position.x + width / 2 &&
      y >= position.y - height / 2 && y <= position.y + height / 2);
  }

  isPointInTriangleByVertices(x, y, v0, v1, v2) {
    const vec0 = { x: v2.x - v0.x, y: v2.y - v0.y };
    const vec1 = { x: v1.x - v0.x, y: v1.y - v0.y };
    const vec2 = { x: x - v0.x, y: y - v0.y };

    const dot00 = vec0.x * vec0.x + vec0.y * vec0.y;
    const dot01 = vec0.x * vec1.x + vec0.y * vec1.y;
    const dot02 = vec0.x * vec2.x + vec0.y * vec2.y;
    const dot11 = vec1.x * vec1.x + vec1.y * vec1.y;
    const dot12 = vec1.x * vec2.x + vec1.y * vec2.y;

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return (u >= 0) && (v >= 0) && (u + v < 1);
  }

  handleClick(x, y) {
    if (!this.isInRecallPhase()) return null;

    const clickedShape = this.findClickedShape(x, y);
    if (!clickedShape) return null;

    return this.processShapeClick(clickedShape, x, y);
  }

  isInRecallPhase() {
    return this.gameState &&
      this.gameState.currentPhase === GameState.GamePhases.RECALL;
  }

  findClickedShape(x, y) {
    for (let i = 0; i < this.gameState.shapes.length; i++) {
      const shape = this.gameState.shapes[i];
      if (this.isPointInOuterCircle(x, y, shape)) {
        return { index: i, shape };
      }
    }
    return null;
  }

  isPointInOuterCircle(x, y, shape) {
    const distanceToCenter = this.calculateDistance(
      x, y,
      shape.position.x, shape.position.y
    );
    return distanceToCenter <= shape.size / 2;
  }

  calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  processShapeClick(clickedShape, x, y) {
    const { index, shape } = clickedShape;

    const deepestNestedIndex = this.findDeepestNestedShape(x, y, shape);

    if (deepestNestedIndex !== -1) {
      return this.handleInnerShapeClick(index, shape, deepestNestedIndex);
    } else {
      return this.handleOuterShapeClick(index, shape);
    }
  }

  findDeepestNestedShape(x, y, shape) {
    const { shapeSequence } = shape;
    let deepestIndex = -1;

    for (let i = 0; i < shapeSequence.length; i++) {
      const shapeType = shapeSequence[i];
      const radiusValue = this.calculateRadiusValue(i);

      if (this.isPointInShape(x, y, shape, shapeType, radiusValue)) {
        deepestIndex = i;
      } else {
        break;
      }
    }

    return deepestIndex;
  }

  isPointInShape(x, y, shape, shapeType, radiusValue) {
    const shapeCheckers = {
      [ShapeTypes.SPHERE]: (rv) => this.isPointInSphere(x, y, shape, rv),
      [ShapeTypes.TRIANGLE]: (rv) => this.isPointInTriangle(x, y, shape, rv),
      [ShapeTypes.RECTANGLE]: (rv) => this.isPointInRectangle(x, y, shape, rv),
      [ShapeTypes.SQUARE]: (rv) => this.isPointInSquare(x, y, shape, rv),
    };

    const checker = shapeCheckers[shapeType];
    return checker ? checker(radiusValue) : false;
  }

  calculateRadiusValue(index, decreasePercentage = 0.3) {
    return Math.pow(1 - decreasePercentage, index);
  }

  handleInnerShapeClick(shapeIndex, shape, nestedShapeIndex) {
    this.gameState.selectShape(shapeIndex, "inner", nestedShapeIndex);
    return {
      type: "SHAPE_SELECTED",
      compositeIndex: shapeIndex,
      shapeType: "inner",
      shape,
      nestedShapeIndex
    };
  }

  handleOuterShapeClick(shapeIndex, shape) {
    console.log("outer clicked");
    this.gameState.selectShape(shapeIndex, "outer", -1);

    return {
      type: "SHAPE_SELECTED",
      compositeIndex: shapeIndex,
      shapeType: "outer",
      shape
    };
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