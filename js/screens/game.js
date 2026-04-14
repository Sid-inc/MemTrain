import { GameConfig } from "../config.js";
import { State } from "../state.js";
import { GameState } from "../game-state.js";
import { GameScreen } from "../base/game-screen.js";
import { ShapeRenderer } from "../game-objects/shapes.js";
import { Timer } from "../game-objects/timer.js";
import { ResultPanel } from "../game-objects/result-panel.js";
import { ColorPalette } from "../game-objects/color-palette.js";
import { Instruction } from "../ui-components/Instruction.js"

export class Game extends GameScreen {
  constructor(ctx, state, gameManager) {
    super(ctx, state);

    this.gameManager = gameManager;
    this.availableArea = {
      width: GameConfig.WIDTH,
      height: GameConfig.HEIGHT
    };

    this.timer = null;

    this.colorPalette = null;
    this.instruction = null;
    this.resultPanel = null;
    this.init();
  }

  init() {
    this.timer = new Timer(this.ctx, "секунд");
    this.colorPalette = new ColorPalette(this.ctx);
    this.instruction = new Instruction(this.ctx);
    this.resultPanel = new ResultPanel(this.ctx, this.gameManager.levelId);

    this.gameManager.colorPalette = this.colorPalette;
    this.gameManager.resultPanel = this.resultPanel;
  }

  update() {
    this.gameManager.update();
  }

  render() {
    this.update();
    const { state, config } = this.gameManager.getGameData();
    if (!state) return;

    // Рисуем таймер только на фазе показа
    if (state.currentPhase === GameState.GamePhases.SHOWING) {
      this.timer.render(this.availableArea, state.timeLeft, config.timeSeconds);
    }

    // Рисуем фигуры
    this.renderGameBoard(state);

    // Инструкция для игрока
    this.renderInstructiun(state.currentPhase, state.timeLeft);

    // Если фаза угадывания и выбрана фигура, рисуем палитру рядом с ней
    if (state.currentPhase === GameState.GamePhases.RECALL && state.selectedShape) {
      this.colorPalette.render(state, this.availableArea);
    }

    // Если фаза результата, рисуем результат
    if (state.currentPhase === GameState.GamePhases.RESULT && state.result) {
      this.resultPanel.render(state.result, this.availableArea);
    }
  }

  renderGameBoard(state) {
    const { shapes, currentPhase, availableColors, userColors, selectedShape } = state;

    shapes.forEach((shape, index) => {
      const isSelected = selectedShape && selectedShape.compositeIndex === index ? { shapeType: selectedShape.shapeType } : null;
      const selectedNestedShapeIndex = selectedShape?.nestedShapeIndex;

      ShapeRenderer.drawCompositeShape(
        this.ctx,
        shape,
        currentPhase,
        availableColors,
        userColors[index].colorsSequence,
        isSelected,
        selectedNestedShapeIndex
      );
    });
  }

  renderInstructiun(currentPhase, timeLeft) {
    let instruction = "";
    let emoji = "";

    if (currentPhase === GameState.GamePhases.SHOWING) {
      if (timeLeft > 10) {
        instruction = "Запомни цвета фигур!";
        emoji = "👀";
      } else if (timeLeft > 5) {
        instruction = "Быстрее, запоминай!";
        emoji = "⏱️";
      } else {
        instruction = "Скоро время закончится!";
        emoji = "🔥";
      }
    } else if (currentPhase === GameState.GamePhases.RECALL) {
      instruction = "Нажми на фигуру и выбери цвет!";
      emoji = "🎨";
    } else if (currentPhase === GameState.GamePhases.RESULT) {
      return; // Не показываем инструкцию на результате
    }
    
    this.instruction.render(instruction, emoji, this.availableArea.width);
  }

  handleMouseClick(x, y) {
    const result = this.gameManager.handleGameClick(x, y);
    if(result)
    {
      console.log("result.type");
      console.log(result.type);
      if (result.type === "RETURN_TO_MENU")
        this.state.setState(State.UIStates.MENU);
      if (result.type === "NEXT_LEVEL")
        this.state.setState(State.UIStates.GAME, this.gameManager.levelId + 1);
      if (result.type === "GIVE_REWARD_THEN_MENU" || result.type === "GIVE_REWARD_THEN_NEXT")
      {
        var levelId = result.type !== "GIVE_REWARD_THEN_MENU" ? this.gameManager.levelId + 1 : undefined;
        this.state.setState(State.UIStates.REWARD, levelId);
      }
    }
  }
}
