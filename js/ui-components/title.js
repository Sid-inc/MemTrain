import { GameConfig } from "../config.js";
import { ResponsiveHelper } from "../helpers/responsiveHelper.js";

export class Title {
  constructor(ctx, title, subtitle) {
    this.ctx = ctx;

    this.title = title;
    this.subtitle = subtitle;
    this.titleSize = ResponsiveHelper.getTitleSize();
  }

  render() {
    const ctx = this.ctx;

    // Большой яркий заголовок
    const title = this.title;
    const subtitle = this.subtitle;

    // Тень заголовка
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Градиент для текста
    const gradient = ctx.createLinearGradient(
      GameConfig.WIDTH / 2 - 200, 50,
      GameConfig.WIDTH / 2 + 200, 150
    );
    gradient.addColorStop(0, "#FF6B8B");
    gradient.addColorStop(0.5, "#4ECDC4");
    gradient.addColorStop(1, "#FFD166");

    ctx.fillStyle = gradient;
    ctx.font = `bold ${this.titleSize}px "Comic Sans MS", cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.fillText(title, GameConfig.WIDTH / 2, 80);

    // Контур заголовка
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = this.titleSize / 17;
    ctx.strokeText(title, GameConfig.WIDTH / 2, 80);

    // Подзаголовок
    ctx.font = 'italic 28px "Comic Sans MS", cursive';
    ctx.fillStyle = "#118AB2";
    ctx.fillText(subtitle, GameConfig.WIDTH / 2, 160);

    ctx.restore();
  }
}
