import { GameConfig } from "./config.js";

export class Background {
  constructor() {
    this.spots = [];
    this.initSpots();
  }

  initSpots() {
    this.spots = [];
    const spotCount = Math.floor((GameConfig.WIDTH * GameConfig.HEIGHT) / 40000);
    for (let i = 0; i < spotCount; i++) {
      this.spots.push(this.createSpot());
    }
  }

  createSpot() {
    const colors = [
      "rgba(255, 200, 230)",
      "rgba(200, 220, 255)"
    ];
    const coeff = 8000;
    const radius = GameConfig.WIDTH * GameConfig.HEIGHT / coeff;

    return {
      x: Math.random() * GameConfig.WIDTH,
      y: Math.random() * GameConfig.HEIGHT,
      radius: Math.random() * radius + radius * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3
    };
  }

  render(ctx) {
    this.moveStots();

    this.spots.forEach(spot => {
      // Создаем радиальный градиент для размытого эффекта
      const gradient = ctx.createRadialGradient(
        spot.x, spot.y, 0,
        spot.x, spot.y, spot.radius
      );

      gradient.addColorStop(0, spot.color);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }

  moveStots() {
    this.spots.forEach(spot => {
      spot.x += spot.speedX;
      spot.y += spot.speedY;

      // Возвращаем на экран, если ушли за границы
      if (spot.x < -spot.radius) spot.x = GameConfig.WIDTH + spot.radius;
      if (spot.x > GameConfig.WIDTH + spot.radius) spot.x = -spot.radius;
      if (spot.y < -spot.radius) spot.y = GameConfig.HEIGHT + spot.radius;
      if (spot.y > GameConfig.HEIGHT + spot.radius) spot.y = -spot.radius;
    });
  }
}