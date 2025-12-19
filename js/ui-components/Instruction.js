export class Instruction {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(instruction, emoji, availablWidth) {
    const centerX = availablWidth / 2;
    const y = 120; // Ниже таймера

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
}