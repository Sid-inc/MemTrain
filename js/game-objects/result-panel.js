import { GameState } from "../game-state.js";

export class ResultPanel {
  constructor(ctx) {
    this.ctx = ctx;

    this.returnButtonRect = null;
  }

  render(result, availableArea) {
    const ctx = this.ctx;
    const centerX = availableArea.width / 2;
    const centerY = availableArea.height / 2;

    const gradeConfig = this.getGradeConfig(result.grade);

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

    this.renderStars(centerX, centerY + 170, result.grade);

    // Кнопка возврата
    this.drawReturnButton(centerX, centerY + 250);
  }

  getGradeConfig(grade) {
    switch (grade) {
      case GameState.GradeLevels.EXCELLENT:
        return {
          title: 'ОТЛИЧНО!',
          subtitle: 'Идеальный результат!',
          emoji: '🎉🎊✨',
          color: '#FFD700',
          stars: 3
        };
      case GameState.GradeLevels.GOOD:
        return {
          title: 'ХОРОШО!',
          subtitle: 'Отличная работа!',
          emoji: '👍🌟😊',
          color: '#4ECDC4',
          stars: 2
        };
      case GameState.GradeLevels.SATISFACTORY:
        return {
          title: 'УДОВЛЕТВОРИТЕЛЬНО',
          subtitle: 'Можно лучше!',
          emoji: '👏💪',
          color: '#FF6B8B',
          stars: 1
        };
      case GameState.GradeLevels.FAILED:
        return {
          title: 'ПОПРОБУЙТЕ ЕЩЁ',
          subtitle: 'Не сдавайтесь!',
          emoji: '😢💪🌟',
          color: '#888888',
          stars: 0
        };
      default:
        return {
          title: 'РЕЗУЛЬТАТ',
          subtitle: '',
          emoji: '🎯',
          color: '#4a6fa5',
          stars: 0
        };
    }
  }

  renderStars(centerX, y, grade) {
    const ctx = this.ctx;
    const starCount = this.getGradeConfig(grade).stars;
    const starSpacing = 70;
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
      this.drawStar(ctx, x, y, 30, 15, 5);
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

  drawReturnButton(x, y) {
    const ctx = this.ctx;
    const buttonWidth = 350;
    const buttonHeight = 70;

    const gradient = ctx.createLinearGradient(
      x - buttonWidth / 2, y - buttonHeight / 2,
      x - buttonWidth / 2, y + buttonHeight / 2
    );
    gradient.addColorStop(0, "#4ECDC4");
    gradient.addColorStop(1, "#06D6A0");

    ctx.fillStyle = gradient;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.roundRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 20);
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 32px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🏠 В главное меню", x, y);

    ctx.beginPath();
    ctx.roundRect(x - buttonWidth / 2 + 10, y - buttonHeight / 2 + 10,
      buttonWidth - 20, buttonHeight / 2 - 10, 10);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fill();

    this.returnButtonRect = {
      x: x - buttonWidth / 2,
      y: y - buttonHeight / 2,
      width: buttonWidth,
      height: buttonHeight
    };
  }

    isReturnButtonClicked(x, y) {
    if (!this.returnButtonRect) return false;

    return x >= this.returnButtonRect.x &&
      x <= this.returnButtonRect.x + this.returnButtonRect.width &&
      y >= this.returnButtonRect.y &&
      y <= this.returnButtonRect.y + this.returnButtonRect.height;
  }
}