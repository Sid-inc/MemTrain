import { GameConfig } from "../config.js";

export class Decorations {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(currentTime) {
    const ctx = this.ctx;
    const time = currentTime * 0.001;
    
    // Рисуем летающие шарики вокруг (менее активные)
    for (let i = 0; i < 6; i++) {
      const angle = time * 0.5 + i * Math.PI / 3;
      const radius = 80 + Math.sin(time * 0.3 + i) * 20;
      const x = GameConfig.WIDTH / 2 + Math.cos(angle) * radius;
      const y = GameConfig.HEIGHT / 4 + Math.sin(angle) * radius;
      
      const colors = ["#FF6B8B", "#4ECDC4", "#FFD166", "#06D6A0"];
      const color = colors[i % colors.length];
      
      ctx.beginPath();
      ctx.arc(x, y, 12 + Math.sin(time * 1.5 + i) * 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Маленькая бликовочка на шарике
      ctx.beginPath();
      ctx.arc(x - 3, y - 3, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();
    }
  }
}
