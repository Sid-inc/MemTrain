import { State } from "../state.js";
import { Button } from "../ui-components/button.js";
import { Stars } from "../ui-components/stars.js";
import { Levels, GameConfig } from "../config.js";

export class ResultPanel {
  constructor(ctx, levelId) {
    this.ctx = ctx;
    this.returnButtonRect = null;
    this.stars = null;
    this.buttons = [];
    this.init(levelId);
  }

  init(levelId)
  {
    this.stars = new Stars(this.ctx);
    var existNextLevel = this.checkExistLevel(levelId + 1);
    
    const buttonWidth = 225;
    const buttonHeight = 70;
    let centerX = GameConfig.WIDTH  / 2;
    const centerY = GameConfig.HEIGHT / 2 + 250;

    centerX = existNextLevel ? centerX - 225 : centerX - buttonWidth / 2;

    this.buttons.push(
      new Button(
        centerX, centerY - buttonHeight / 2, buttonWidth, buttonHeight,
        "menu",
        "В меню",
        {
          bgColor: '#4e7acd',
          hoverBgColor: '#0906d6',
          textColor: "#FFFFFF",
          font: 'bold 24px "Comic Sans MS"',
          cornerRadius: 15,
          borderWidth: 3,
          onClick: () => this.state.setState(State.UIStates.MENU)
        }
      )
    );

    if (existNextLevel)
      this.buttons.push(
        new Button(
          centerX + 250, centerY - buttonHeight / 2, buttonWidth, buttonHeight,
          "next",
          "Продолжить",
          {
            bgColor: '#4ECDC4',
            hoverBgColor: '#06D6A0',
            textColor: "#FFFFFF",
            font: 'bold 24px "Comic Sans MS"',
            cornerRadius: 15,
            borderWidth: 3,
            onClick: () => this.state.setState(State.UIStates.MENU)
          }
        )
      );
  }

  checkExistLevel(levelId)
  {
    return Levels.some(x => x.id === levelId);
  }

  render(result, availableArea) {
    const ctx = this.ctx;
    const centerX = availableArea.width / 2;
    const centerY = availableArea.height / 2;

    const gradeConfig = State.getGradeConfig(result.grade);

    // Фон результата
    ctx.fillStyle = "rgba(255, 255, 255, 0.97)";
    ctx.strokeStyle = gradeConfig.color;
    ctx.lineWidth = 6;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    ctx.beginPath();
    ctx.roundRect(centerX - 300, centerY - 250, 600, 500, 30);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";

    // Эмодзи результата
    ctx.fillStyle = gradeConfig.color;
    ctx.font = 'bold 64px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.fillText(gradeConfig.emoji, centerX, centerY - 170);

    // Заголовок
    ctx.fillStyle = gradeConfig.color;
    ctx.font = 'bold 48px "Comic Sans MS"';
    ctx.fillText(gradeConfig.title, centerX, centerY - 90);

    // Подзаголовок
    ctx.fillStyle = "#666666";
    ctx.font = 'italic 28px "Comic Sans MS"';
    ctx.fillText(gradeConfig.subtitle, centerX, centerY - 40);

    // Результат
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 36px "Comic Sans MS"';
    ctx.fillText(
      `Правильных ответов: ${result.correct} из ${result.total}`,
      centerX,
      centerY + 10
    );

    // Процент
    ctx.fillStyle = gradeConfig.color;
    ctx.font = 'bold 96px "Comic Sans MS"';
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 10;
    ctx.fillText(`${result.percentage}%`, centerX, centerY + 100);
    ctx.shadowColor = "transparent";

    this.stars.render(ctx, centerX, centerY + 170, result.grade);

    this.renderButtons();
  }

  renderButtons()
  {
    this.buttons.forEach(button => {
      button.render(this.ctx);
    });
  }

  isMenuButtonClicked(x, y) {
    var menuButton = this.buttons.find(x => x.value === "menu");
    return menuButton.containsPoint(x, y);
  }

  isNextButtonClicked(x, y) {
    var nextButton = this.buttons.find(x => x.value === "next");
    return nextButton.containsPoint(x, y);
  }
}