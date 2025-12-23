import { Button } from "../ui-components/button.js";
import { GameConfig } from "../config.js";
import { GameScreen } from "../base/game-screen.js";
import { State } from "../state.js";
import { Title } from "../ui-components/title.js";
import { Decorations } from "../ui-components/decorations.js";

export class Menu extends GameScreen {
  constructor(ctx, state) {
    super(ctx, state);
    
    this.buttons = [];
    this.title = null;
    this.decorations = null;
    this.init();
  }
  
  init()
  {
    this.createButtons();
    this.createTitle();
    this.createDecorations();
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

  createTitle(){
    this.title = new Title(this.ctx, "Memory Train", "Развивающая игра для детей");
  }

  createDecorations()
  {
    this.decorations = new Decorations(this.ctx);
  }

  update() {
    // Обновляем время
    this.time = Date.now();
    const buttonWidth = Math.max(320, GameConfig.WIDTH / 6);
    const buttonHeight = Math.max(60, GameConfig.WIDTH / 18);
    const startX = (GameConfig.WIDTH - buttonWidth) / 2;
    const startY = GameConfig.HEIGHT / 2 - 100;

    // Обновляем каждую кнопку
    this.buttons.forEach((button, index) => {
      button.update(index, this.time, startX, startY + (buttonHeight + 20) * index, buttonWidth, buttonHeight);
    });
  }

  render() {
    this.update();

    // Рисуем заголовок игры
    this.title.render();

    this.buttons.forEach(button => {
      button.render(this.ctx);
    });

    // Рисуем декор
    this.decorations.render(this.time);
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