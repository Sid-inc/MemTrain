import { State } from "../state.js";

export class Stars {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(centerX, y, grade, starSpacing = 70) {
    const ctx = this.ctx;
    const starCount = State.getGradeConfig(grade).stars ?? 0;
    const totalWidth = 3 * starSpacing;
    const startX = centerX - totalWidth / 2 + starSpacing / 2;

    for (let i = 0; i < 3; i++) {
      const x = startX + i * starSpacing;
      const isFilled = i < starCount;

      // Тень звезды
      ctx.shadowColor = isFilled ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      // Звезда
      ctx.fillStyle = isFilled ? '#FFD700' : '#CCCCCC';
      this.drawStar(ctx, x, y, starSpacing / 1.4, starSpacing / 3, 5);
      ctx.fill();

      // Контур звезды
      ctx.strokeStyle = isFilled ? '#FF9800' : '#999999';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.shadowColor = 'transparent';
    }
  }

  drawStar(ctx, cx, cy, outerRadius, innerRadius, points) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / points) * i;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
  }
}