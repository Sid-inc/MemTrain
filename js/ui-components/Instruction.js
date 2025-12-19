export class Instruction {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(instruction, emoji, availablWidth) {
    const y = 120; // Ниже таймера

    const ctx = this.ctx;
    ctx.save();

    ctx.font = 'bold 24px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const text = `${emoji} ${instruction}`;
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;

    const padding = 40; // Отступы слева и справа (по 20px с каждой стороны)
    const minWidth = 150; // Минимальная ширина для короткого текста
    const maxWidth = availablWidth - 40;

    let blockWidth = textWidth + padding;
    blockWidth = Math.max(blockWidth, minWidth); // Не меньше минимальной
    blockWidth = Math.min(blockWidth, maxWidth);

    const centerX = availablWidth / 2;
    const x = centerX - blockWidth / 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "#4ECDC4";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 5;

    ctx.beginPath();
    ctx.roundRect(x, y - 25, blockWidth, 50, 15);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = "#333333";
    ctx.fillText(text, centerX, y);

    ctx.restore();
  }
}