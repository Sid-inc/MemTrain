export class Timer {
  constructor(ctx, text) {
    this.ctx = ctx;
    this.text = text;
  }

  render(availableArea, timeLeft, totalTime) {
    const ctx = this.ctx;
    const centerX = availableArea.width / 2;
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
      `⏱️ ${Math.ceil(timeLeft)} ${this.text}`,
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
}