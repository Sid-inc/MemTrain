import { ShapeRenderer } from "./game/shapes.js";
import { GameConfig } from "../config.js";
import { GameScreen } from "../base/game-screen.js";

export class Game extends GameScreen {
  constructor(ctx) {
    super();
    this.ctx = ctx;
    this.availableArea = {
      width: GameConfig.WIDTH,
      height: GameConfig.HEIGHT
    };

    this.colorPalettePosition = null;
    this.returnButtonRect = null;
  }

  render(gameData) {
    const { state, config } = gameData;
    if (!state) return;

    this.clear();

    // Рисуем таймер только на фазе показа
    if (state.currentPhase === "SHOWING") {
      this.drawTimer(state.timeLeft, config.timeSeconds);
    }

    // Рисуем фигуры
    this.drawShapes(state);

    // Инструкция для игрока
    this.drawInstructions(state.currentPhase, state.timeLeft);

    // Если фаза угадывания и выбрана фигура, рисуем палитру рядом с ней
    if (state.currentPhase === "RECALL" && state.selectedShape) {
      this.drawColorPalette(state);
    }

    // Если фаза результата, рисуем результат
    if (state.currentPhase === "RESULT" && state.result) {
      this.drawResult(state.result);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.availableArea.width, this.availableArea.height);
  }

  drawTimer(timeLeft, totalTime) {
    const ctx = this.ctx;
    const centerX = this.availableArea.width / 2;
    const y = 40;
    const width = 400;
    const height = 40;

    // Фон таймера
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "#4a6fa5";
    ctx.lineWidth = 4;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.roundRect(centerX - width / 2, y, width, height, 20);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";

    // Заполненная часть (прогресс)
    const progress = timeLeft / totalTime;
    const fillWidth = width * progress;

    const gradient = ctx.createLinearGradient(
      centerX - width / 2, y,
      centerX - width / 2 + fillWidth, y
    );
    gradient.addColorStop(0, progress > 0.5 ? "#4ECDC4" : "#FFD166");
    gradient.addColorStop(1, progress > 0.5 ? "#06D6A0" : "#FF6B8B");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(centerX - width / 2, y, fillWidth, height, 20);
    ctx.fill();

    // Текст таймера
    ctx.fillStyle = "#333333";
    ctx.font = 'bold 24px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `⏱️ ${Math.ceil(timeLeft)} секунд`,
      centerX,
      y + height / 2
    );

    // Мигающая анимация, когда время заканчивается
    if (timeLeft < 3) {
      const pulse = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
      ctx.strokeStyle = `rgba(255, 0, 0, ${pulse})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(centerX - width / 2, y, width, height, 20);
      ctx.stroke();
    }
  }

  drawShapes(state) {
    const { shapes, currentPhase, availableColors, userColors, selectedShape } = state;

    shapes.forEach((shape, index) => {
      const isSelected = selectedShape &&
        selectedShape.compositeIndex === index ?
        { shapeType: selectedShape.shapeType } : null;

      ShapeRenderer.drawCompositeShape(
        this.ctx,
        shape,
        currentPhase,
        availableColors,
        userColors[index],
        isSelected
      );
    });
  }

  drawColorPalette(state) {
    if (!state.selectedShape) return;

    const selectedShape = state.shapes[state.selectedShape.compositeIndex];
    const buttonSize = 60;
    const spacing = 15;

    // Позиция палитры справа от выбранной фигуры
    let paletteX = selectedShape.position.x + selectedShape.size / 2 + 50;
    let paletteY = selectedShape.position.y - buttonSize;

    // Если палитра не помещается справа, показываем слева
    if (paletteX + buttonSize * 2 + spacing + 60 > this.availableArea.width) {
      paletteX = selectedShape.position.x - selectedShape.size / 2 - buttonSize * 2 - spacing - 80;
    }

    // Если палитра не помещается по Y, корректируем
    if (paletteY < 20) paletteY = 20;
    const maxY = this.availableArea.height -
      (Math.ceil(state.availableColors.length / 2) * (buttonSize + spacing) + 60);
    if (paletteY > maxY) paletteY = maxY;

    this.colorPalettePosition = {
      x: paletteX,
      y: paletteY,
      buttonSize,
      spacing
    };

    ShapeRenderer.drawColorPalette(
      this.ctx,
      state.availableColors,
      this.colorPalettePosition,
      buttonSize
    );
  }

  drawInstructions(phase, timeLeft) {
    const centerX = this.availableArea.width / 2;
    const y = 120; // Ниже таймера

    let instruction = "";
    let emoji = "";

    if (phase === "SHOWING") {
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
    } else if (phase === "RECALL") {
      instruction = "Нажми на фигуру и выбери цвет!";
      emoji = "🎨";
    } else if (phase === "RESULT") {
      return; // Не показываем инструкцию на результате
    }

    const ctx = this.ctx;
    ctx.save();

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "#4ECDC4";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 5;

    ctx.beginPath();
    ctx.roundRect(centerX - 200, y - 25, 400, 50, 15);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = "#333333";
    ctx.font = 'bold 24px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${emoji} ${instruction}`, centerX, y);

    ctx.restore();
  }

  drawResult(result) {
    const ctx = this.ctx;
    const centerX = this.availableArea.width / 2;
    const centerY = this.availableArea.height / 2;

    // Фон результата
    ctx.fillStyle = "rgba(255, 255, 255, 0.97)";
    ctx.strokeStyle = result.passed ? "#06D6A0" : "#FF6B8B";
    ctx.lineWidth = 6;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    ctx.beginPath();
    ctx.roundRect(centerX - 300, centerY - 250, 600, 500, 30);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";

    // Эмодзи результата
    const emoji = result.passed ? "🎉🎊✨" : "😢💪🌟";
    ctx.fillStyle = result.passed ? "#06D6A0" : "#FF6B8B";
    ctx.font = 'bold 64px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.fillText(emoji, centerX, centerY - 170);

    // Заголовок
    ctx.fillStyle = "#333333";
    ctx.font = 'bold 48px "Comic Sans MS"';
    ctx.fillText(
      result.passed ? "Отлично!" : "Хорошая попытка!",
      centerX,
      centerY - 90
    );

    // Результат
    ctx.fillStyle = "#666666";
    ctx.font = "bold 36px Arial";
    ctx.fillText(
      `Правильных ответов: ${result.correct} из ${result.total}`,
      centerX,
      centerY
    );

    // Процент
    const percentageColor = result.percentage >= 80 ? "#06D6A0" :
      result.percentage >= 60 ? "#FFD166" : "#FF6B8B";
    ctx.fillStyle = percentageColor;
    ctx.font = 'bold 96px "Comic Sans MS"';
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 10;
    ctx.fillText(`${result.percentage}%`, centerX, centerY + 100);
    ctx.shadowColor = "transparent";

    // Кнопка возврата
    this.drawReturnButton(centerX, centerY + 200);
  }

  drawReturnButton(x, y) {
    const ctx = this.ctx;
    const buttonWidth = 250;
    const buttonHeight = 70;

    const gradient = ctx.createLinearGradient(
      x - buttonWidth / 2, y - buttonHeight / 2,
      x - buttonWidth / 2, y + buttonHeight / 2
    );
    gradient.addColorStop(0, "#4ECDC4");
    gradient.addColorStop(1, "#06D6A0");

    ctx.fillStyle = gradient;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.roundRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 20);
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 32px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🏠 В главное меню", x, y);

    ctx.beginPath();
    ctx.roundRect(x - buttonWidth / 2 + 10, y - buttonHeight / 2 + 10,
      buttonWidth - 20, buttonHeight / 2 - 10, 10);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fill();

    this.returnButtonRect = {
      x: x - buttonWidth / 2,
      y: y - buttonHeight / 2,
      width: buttonWidth,
      height: buttonHeight
    };
  }

  // Методы для обработки кликов
  isColorClicked(x, y) {
    if (!this.colorPalettePosition) return -1;

    const { x: paletteX, y: paletteY, buttonSize, spacing } = this.colorPalettePosition;

    const colorsPerRow = 2;
    const maxColors = 10; // Максимум 10 цветов

    for (let i = 0; i < maxColors; i++) {
      const row = Math.floor(i / colorsPerRow);
      const col = i % colorsPerRow;
      const buttonX = paletteX + col * (buttonSize + spacing);
      const buttonY = paletteY + row * (buttonSize + spacing);

      const distance = Math.sqrt(
        Math.pow(x - (buttonX + buttonSize / 2), 2) +
        Math.pow(y - (buttonY + buttonSize / 2), 2)
      );

      if (distance <= buttonSize / 2) {
        return i;
      }
    }

    return -1;
  }

  isReturnButtonClicked(x, y) {
    if (!this.returnButtonRect) return false;

    return x >= this.returnButtonRect.x &&
      x <= this.returnButtonRect.x + this.returnButtonRect.width &&
      y >= this.returnButtonRect.y &&
      y <= this.returnButtonRect.y + this.returnButtonRect.height;
  }
}
