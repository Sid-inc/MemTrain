import { GameScreen } from "../base/game-screen.js";
import { GameConfig } from "../config.js";
import { Modal } from "../ui-components/modal.js";
import { State } from "../state.js";

export class Reward extends GameScreen {
  constructor(ctx, state, rewardData, levelId) {
    super(ctx, state);
    this.reward = rewardData.reward;
    this.result = rewardData.result;
    this.onContinue = rewardData.onContinue;
    this.levelId = levelId;
    this.rewardImage = null;
    this.modal = null;
    this.particles = [];
    this.init();
  }

  init() {
    // Получаем предзагруженное изображение
    if (this.state.rewardManager) {
      this.rewardImage = this.state.rewardManager.loadedImages.get(this.reward.id);
    }

    this.modal = new Modal(this.ctx, {
      image: this.rewardImage,
      title: "🎉 Поздравляем! 🎉",
      subTitle: "Вы прошли уровень на 100%!",
      primaryBtnText: "Продолжить",
      primaryBtnHandler: this.getContinueHndler()
    });
    
    // Создаем частицы для эффекта
    this.createParticles();
  }

  getContinueHndler() {
    return () => {
      if (this.levelId)
        this.state.setState(State.UIStates.GAME, this.levelId);
      else
        this.state.setState(State.UIStates.MENU);
    }
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
    
    if (this.modal)
      this.modal.render();
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
    if (this.modal.primaryButton) {
      this.modal.primaryButton.isHovered = this.modal.primaryButton.containsPoint(x, y);
    }
  }

  handleMouseClick(x, y) {
    if (this.modal && this.modal.primaryButton.containsPoint(x, y) && this.modal.primaryBtnHandler) {
      this.modal.primaryButton.onClick();
      return true;
    }
    return false;
  }
}
