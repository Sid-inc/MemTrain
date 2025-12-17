import { Button } from "../ui-components/button.js";
import { GameConfig } from "../config.js";
import { GameScreen } from "../base/game-screen.js";
import { State } from "../state.js";

export class Menu extends GameScreen {
  constructor(ctx, state) {
    super();
    this.ctx = ctx;
    this.state = state;
    this.buttons = [];
    this.createButtons();
  }

  createButtons() {
    const buttonWidth = Math.max(320, GameConfig.WIDTH / 6);
    const buttonHeight = Math.max(60, GameConfig.WIDTH / 18);
    const startX = (GameConfig.WIDTH - buttonWidth) / 2;
    const startY = GameConfig.HEIGHT / 2 - 100;

    this.buttons = [];

    const buttonConfigs = [
      {
        value: "start",
        text: "🎮 ИГРАТЬ",
        colors: { bg: "#FF6B8B", hover: "#FF8FA8" },
        borderColor: "#FF8FA8",
        onClick: this.menuButtonHnadler(State.UIStates.GAME)
      },
      {
        value: "levels",
        text: "📚 УРОВНИ",
        colors: { bg: "#4ECDC4", hover: "#7CDFD7" },
        borderColor: "#7CDFD7",
        onClick: this.menuButtonHnadler(State.UIStates.LEVELS)
      },
      {
        value: "galary",
        text: "⭐ ГАЛЕРЕЯ",
        colors: { bg: "#9D4EDD", hover: "#B16FE5" },
        borderColor: "#B16FE5",
        onClick: this.menuButtonHnadler(State.UIStates.GALARY)
      }
    ];

    buttonConfigs.forEach((config, index) => {
      const button = new Button(
        startX,
        startY + (buttonHeight + 20) * index,
        buttonWidth,
        buttonHeight,
        config.value,
        config.text,
        {
          bgColor: config.colors.bg,
          hoverBgColor: config.colors.hover,
          borderColor: config.borderColor,
          textColor: "#FFFFFF",
          font: 'bold 32px "Comic Sans MS", "Marker Felt", "Chalkboard SE", cursive',
          cornerRadius: 35,
          borderWidth: 6,
          shadowBlur: 12,
          shadowOffset: 6,
          sparkles: true,
          onClick: config.onClick
        }
      );

      this.buttons.push(button);
    });
  }

  menuButtonHnadler(newState) {
    const state = this.state;
    return function buttonHnadler()
    {
      state.setState(newState);
    }
  };

  update() {
    // Обновляем время
    this.time = Date.now();

    // Обновляем каждую кнопку
    this.buttons.forEach((button) => {
      button.update(this.time);
    });
  }


  render() {
    this.update();

    // Рисуем заголовок игры
    this.renderTitle();

    this.buttons.forEach(button => {
      button.render(this.ctx);
    });

    // Рисуем декор
    this.renderDecorations();
  }

  renderTitle() {
    const ctx = this.ctx;
    
    // Большой яркий заголовок
    const title = "Memory Train";
    const subtitle = "Развивающая игра для детей";
    
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
    ctx.font = 'bold 68px "Comic Sans MS", cursive';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    ctx.fillText(title, GameConfig.WIDTH / 2, 80);
    
    // Контур заголовка
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    ctx.strokeText(title, GameConfig.WIDTH / 2, 80);
    
    // Подзаголовок
    ctx.font = 'italic 28px "Comic Sans MS", cursive';
    ctx.fillStyle = "#118AB2";
    ctx.fillText(subtitle, GameConfig.WIDTH / 2, 160);
    
    ctx.restore();
  }

  renderDecorations() {
    const ctx = this.ctx;
    const time = this.time * 0.001;
    
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

  handleMouseMove(x, y) {
    this.buttons.forEach(button => {
      button.isHovered = button.containsPoint(x, y);
    });
  }

  handleMouseClick(x, y) {
    this.buttons.forEach(button => {
      if (button.containsPoint(x, y) && button.onClick) {
        button.onClick();
      }
    });
  }

}