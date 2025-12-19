export class ResultPanel {
  constructor(ctx) {
    this.ctx = ctx;

    this.returnButtonRect = null;
  }

  render(result, availableArea) {
    const ctx = this.ctx;
    const centerX = availableArea.width / 2;
    const centerY = availableArea.height / 2;

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
    const buttonWidth = 350;
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

    isReturnButtonClicked(x, y) {
    if (!this.returnButtonRect) return false;

    return x >= this.returnButtonRect.x &&
      x <= this.returnButtonRect.x + this.returnButtonRect.width &&
      y >= this.returnButtonRect.y &&
      y <= this.returnButtonRect.y + this.returnButtonRect.height;
  }
}