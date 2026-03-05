import { GameScreen } from "../base/game-screen.js";
import { Button } from "../ui-components/button.js";
import { GameConfig } from "../config.js";

export class Reward extends GameScreen {
  constructor(ctx, state, rewardData) {
    super(ctx, state);
    this.reward = rewardData.reward;
    this.result = rewardData.result;
    this.onContinue = rewardData.onContinue;
    this.rewardImage = null;
    this.continueButton = null;
    this.particles = [];
    this.init();
  }

  init() {
    // Получаем предзагруженное изображение
    if (this.state.rewardManager) {
      this.rewardImage = this.state.rewardManager.loadedImages.get(this.reward.id);
    }
    
    // Кнопка "Продолжить"
    this.continueButton = new Button(
      GameConfig.WIDTH / 2 - 100,
      GameConfig.HEIGHT - 120,
      200, 60,
      "continue",
      "Продолжить",
      {
        bgColor: '#4ECDC4',
        hoverBgColor: '#3DBBB3',
        textColor: "#FFFFFF",
        font: 'bold 24px "Comic Sans MS"',
        cornerRadius: 15,
        borderWidth: 3,
        onClick: () => this.onContinue()
      }
    );
    
    // Создаем частицы для эффекта
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * GameConfig.WIDTH,
        y: Math.random() * GameConfig.HEIGHT,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4,
        color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`,
        alpha: Math.random() * 0.5 + 0.5
      });
    }
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Отскок от границ
      if (particle.x < 0 || particle.x > GameConfig.WIDTH) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > GameConfig.HEIGHT) particle.speedY *= -1;
    });
  }

  render() {
    const { ctx } = this;
    const width = GameConfig.WIDTH;
    const height = GameConfig.HEIGHT;
    
    // Анимированные частицы
    this.updateParticles();
    this.particles.forEach(particle => {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    
    // Основной контейнер
    const containerWidth = width * 0.4;
    const containerHeight = height * 0.7;
    const containerX = (width - containerWidth) / 2;
    const containerY = (height - containerHeight) / 2;
    
    // Градиентный фон контейнера
    const gradient = ctx.createLinearGradient(
      containerX, containerY,
      containerX, containerY + containerHeight
    );
    gradient.addColorStop(0, 'rgba(78, 205, 196, 0.2)');
    gradient.addColorStop(1, 'rgba(157, 78, 221, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 4;
    
    // Скругленные углы
    this.roundedRect(ctx, containerX, containerY, containerWidth, containerHeight, 20);
    ctx.fill();
    ctx.stroke();
    
    // Заголовок
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px "Comic Sans MS"';
    ctx.textAlign = 'center';
    ctx.fillText("🎉 Поздравляем! 🎉", width / 2, containerY + 80);
    
    // Подзаголовок
    ctx.font = '28px "Comic Sans MS"';
    ctx.fillText("Вы прошли уровень на 100%!", width / 2, containerY + 130);
    
    // Контейнер для награды
    const rewardContainerY = containerY + 180;
    
    // Изображение награды
    if (this.rewardImage) {
      const imgSize = 400;
      const imgX = width / 2 - imgSize / 2;
      const imgY = rewardContainerY;
      
      // Рамка вокруг изображения
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(imgX - 10, imgY - 10, imgSize + 20, imgSize + 20, 15);
      ctx.stroke();
      
      // Само изображение
      ctx.drawImage(this.rewardImage, imgX, imgY, imgSize, imgSize);
    } else {
      // Запасной вариант если изображение не загружено
      ctx.fillStyle = '#9D4EDD';
      ctx.fillRect(width / 2 - 90, rewardContainerY, 400, 400);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px "Comic Sans MS"';
      ctx.fillText("🎁", width / 2, rewardContainerY + 100);
    }
    
    // Описание
    ctx.font = '22px "Comic Sans MS"';
    ctx.fillText("Награда добавлена в вашу коллекцию", width / 2, rewardContainerY + 450);
    
    // Кнопка "Продолжить"
    this.continueButton.render(ctx);
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

  handleMouseMove(x, y) {
    if (this.continueButton) {
      this.continueButton.isHovered = this.continueButton.containsPoint(x, y);
    }
  }

  handleMouseClick(x, y) {
    if (this.continueButton && this.continueButton.containsPoint(x, y) && this.continueButton.onClick) {
      this.continueButton.onClick();
      return true;
    }
    return false;
  }
}
