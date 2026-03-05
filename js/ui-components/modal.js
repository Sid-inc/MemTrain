import { GameConfig } from "../config.js";

export class Modal {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.title = options.title;
    this.subTitle = options.subTitle;
    this.image = options.image;
    this.primaryBtnShow = options.primaryBtnShow ?? false;
    this.secondaryBtnShow = options.secondaryBtnShow ?? false;
    this.closeBtnHandler = options.closeBtnHandler;
  }

  render()
  {
    const { ctx } = this;
    const width = GameConfig.WIDTH;
    const height = GameConfig.HEIGHT;

    const containerWidth = width * 0.4;
    const containerHeight = height * 0.7;
    const containerX = (width - containerWidth) / 2;
    const containerY = (height - containerHeight) / 2;

    const gradient = ctx.createLinearGradient(
      containerX, containerY,
      containerX, containerY + containerHeight
    );
    gradient.addColorStop(0, 'rgba(78, 205, 196, 0.6)');
    gradient.addColorStop(1, 'rgba(157, 78, 221, 0.6)');

    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 4;
    
    // Скругленные углы
    this.roundedRect(ctx, containerX, containerY, containerWidth, containerHeight, 20);
    ctx.fill();
    ctx.stroke();

    // Заголовок
    if (this.title) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px "Comic Sans MS"';
      ctx.textAlign = 'center';
      ctx.fillText(this.title, width / 2, containerY + 80);
    }
    
    if (this.subTitle) {
      // Подзаголовок
      ctx.font = '28px "Comic Sans MS"';
      ctx.fillText(this.subTitle, width / 2, containerY + 130);
    }

    if (this.image) {
      const imageContainerY = containerY + 180;
      const imgSize = 400;
      const imgX = width / 2 - imgSize / 2;
      const imgY = imageContainerY;
      
      // Рамка вокруг изображения
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(imgX - 10, imgY - 10, imgSize + 20, imgSize + 20, 15);
      ctx.stroke();
      
      // Само изображение
      ctx.drawImage(this.image, imgX, imgY, imgSize, imgSize);
    }

    if (this.closeBtnHandler)
      this.renderCloseButton();
  }

  renderCloseButton()
  {
    const { ctx } = this;
    const width = GameConfig.WIDTH;
    const height = GameConfig.HEIGHT;

    const containerWidth = width * 0.4;
    const containerHeight = height * 0.7;
    const containerX = (width - containerWidth) / 2;
    const containerY = (height - containerHeight) / 2;

    const btnSize = 40;
    const padding = 10;
    const btnX = containerX + containerWidth - btnSize - padding;
    const btnY = containerY + padding;

    // Сохраняем текущее состояние контекста
    ctx.save();

    // Рисуем круглую подложку
    ctx.beginPath();
    ctx.arc(btnX + btnSize / 2, btnY + btnSize / 2, btnSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(78, 205, 196)';
    ctx.lineWidth = 3;
    const margin = 12;
    ctx.moveTo(btnX + margin, btnY + margin);
    ctx.lineTo(btnX + btnSize - margin, btnY + btnSize - margin);
    ctx.moveTo(btnX + btnSize - margin, btnY + margin);
    ctx.lineTo(btnX + margin, btnY + btnSize - margin);
    ctx.stroke();

    ctx.restore();
  }

  containCloseButtonPoint(x, y) {
    if (!this.closeBtnHandler) 
      return false;

    const width = GameConfig.WIDTH;
    const height = GameConfig.HEIGHT;

    const containerWidth = width * 0.4;
    const containerHeight = height * 0.7;
    const containerX = (width - containerWidth) / 2;
    const containerY = (height - containerHeight) / 2;

    const btnSize = 40;
    const padding = 10;
    const btnX = containerX + containerWidth - btnSize - padding;
    const btnY = containerY + padding;

    const centerX = btnX + btnSize / 2;
    const centerY = btnY + btnSize / 2;
    const radius = btnSize / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= radius;
  }

  roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}