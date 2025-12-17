export class ShapeRenderer {
  static drawCompositeShape(ctx, shape, phase, availableColors, userColors, isSelected) {
    const { position, size, outerShape, innerShape, outerColorIndex, innerColorIndex, rotation } = shape;
    const radius = size / 2;
    
    // Сохраняем контекст для трансформаций
    ctx.save();
    
    // Применяем вращение к фигуре
    ctx.translate(position.x, position.y);
    ctx.rotate(rotation);
    ctx.translate(-position.x, -position.y);
    
    // Рисуем внешнюю фигуру (круг)
    if (outerShape === "sphere") {
      // Тень
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      
      ctx.beginPath();
      ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
      
      if (phase === "SHOWING") {
        const outerColor = availableColors[outerColorIndex];
        this.drawShinyCircle(ctx, position, radius, outerColor);
      } else if (phase === "RECALL") {
        if (userColors && userColors.outer !== null) {
          const color = availableColors[userColors.outer];
          this.drawShinyCircle(ctx, position, radius, color);
        } else {
          this.drawShinyCircle(ctx, position, radius, "#CCCCCC", false);
        }
      }
      
      // Сбрасываем тень
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Если внешняя фигура выбрана, рисуем подсветку
      if (isSelected && isSelected.shapeType === "outer") {
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 6;
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowColor = "transparent";
      }
    }
    
    // Рисуем внутреннюю фигуру (треугольник)
    if (innerShape === "triangle") {
      const innerRadius = radius * 0.7; // Увеличили отступ до 30%
      
      // Создаем треугольник
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
        const x = position.x + innerRadius * Math.cos(angle);
        const y = position.y + innerRadius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      // Тень для треугольника
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      if (phase === "SHOWING") {
        const innerColor = availableColors[innerColorIndex];
        this.drawShinyTriangle(ctx, position, innerRadius, innerColor);
      } else if (phase === "RECALL") {
        if (userColors && userColors.inner !== null) {
          const color = availableColors[userColors.inner];
          this.drawShinyTriangle(ctx, position, innerRadius, color);
        } else {
          this.drawShinyTriangle(ctx, position, innerRadius, "#AAAAAA", false);
        }
      }
      
      // Сбрасываем тень
      ctx.shadowColor = "transparent";
      
      // Если внутренняя фигура выбрана, рисуем подсветку
      if (isSelected && isSelected.shapeType === "inner") {
        ctx.beginPath();
        const highlightRadius = innerRadius + 8;
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
          const x = position.x + highlightRadius * Math.cos(angle);
          const y = position.y + highlightRadius * Math.sin(angle);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowColor = "transparent";
      }
    }
    
    // Восстанавливаем контекст
    ctx.restore();
  }

  static drawShinyCircle(ctx, position, radius, color, shiny = true) {
    const gradient = ctx.createRadialGradient(
      position.x - radius * 0.3,
      position.y - radius * 0.3,
      0,
      position.x,
      position.y,
      radius
    );
    
    if (shiny) {
      gradient.addColorStop(0, "#FFFFFF");
      gradient.addColorStop(0.1, color);
      gradient.addColorStop(0.8, this.darkenColor(color, 20));
      gradient.addColorStop(1, this.darkenColor(color, 40));
    } else {
      gradient.addColorStop(0, this.lightenColor(color, 20));
      gradient.addColorStop(1, this.darkenColor(color, 20));
    }
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Блик на круге
    if (shiny) {
      ctx.beginPath();
      ctx.arc(
        position.x - radius * 0.15,
        position.y - radius * 0.15,
        radius * 0.25,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fill();
    }
  }

  static drawShinyTriangle(ctx, position, radius, color, shiny = true) {
    // Градиент для треугольника
    const gradient = ctx.createLinearGradient(
      position.x,
      position.y - radius,
      position.x,
      position.y + radius
    );
    
    if (shiny) {
      gradient.addColorStop(0, "#FFFFFF");
      gradient.addColorStop(0.1, color);
      gradient.addColorStop(0.8, this.darkenColor(color, 20));
    } else {
      gradient.addColorStop(0, this.lightenColor(color, 20));
      gradient.addColorStop(1, color);
    }
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Обводка треугольника
    ctx.strokeStyle = this.darkenColor(color, 40);
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Блик на треугольнике
    if (shiny) {
      ctx.beginPath();
      // Маленький треугольник для блика
      const highlightRadius = radius * 0.4;
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
        const x = position.x + highlightRadius * Math.cos(angle) * 0.5;
        const y = position.y + highlightRadius * Math.sin(angle) * 0.5 - radius * 0.2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fill();
    }
  }

  static drawColorPalette(ctx, colors, position, buttonSize = 60) {
    const spacing = 15;
    const startX = position.x;
    const startY = position.y;
    
    ctx.save();
    
    // Фон палитры с эффектом облака
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    
    ctx.beginPath();
    ctx.roundRect(
      startX - 30, 
      startY - 30, 
      buttonSize * 2 + spacing + 60, 
      Math.ceil(colors.length / 2) * (buttonSize + spacing) + 60, 
      25
    );
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";
    
    // Заголовок
    ctx.fillStyle = "#4a6fa5";
    ctx.font = 'bold 24px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.fillText("🎨 Выберите цвет", startX + buttonSize + spacing/2, startY - 10);
    
    // Кнопки цветов
    colors.forEach((color, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = startX + col * (buttonSize + spacing);
      const y = startY + row * (buttonSize + spacing);
      
      // Фон кнопки с градиентом
      const buttonGradient = ctx.createRadialGradient(
        x + buttonSize/2, y + buttonSize/2, 0,
        x + buttonSize/2, y + buttonSize/2, buttonSize/2
      );
      buttonGradient.addColorStop(0, "#FFFFFF");
      buttonGradient.addColorStop(0.5, color);
      buttonGradient.addColorStop(1, this.darkenColor(color, 30));
      
      ctx.fillStyle = buttonGradient;
      ctx.beginPath();
      ctx.arc(x + buttonSize/2, y + buttonSize/2, buttonSize/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Обводка кнопки
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // Тень кнопки
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowColor = "transparent";
      
      // Номер цвета
      ctx.fillStyle = "#FFFFFF";
      ctx.font = 'bold 20px "Comic Sans MS"';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${index + 1}`, x + buttonSize/2, y + buttonSize/2);
      
      // Блик на кнопке
      ctx.beginPath();
      ctx.arc(x + buttonSize/3, y + buttonSize/3, buttonSize/5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fill();
    });
    
    ctx.restore();
  }

  static drawInstructions(ctx, phase, position, width) {
    const { x, y } = position;
    
    ctx.save();
    
    // Фон инструкции
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "#4ECDC4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x - width/2, y - 30, width, 60, 15);
    ctx.fill();
    ctx.stroke();
    
    // Текст инструкции
    ctx.fillStyle = "#333333";
    ctx.font = 'bold 24px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    let text = "";
    let emoji = "";
    
    switch(phase) {
      case "SHOWING":
        text = "Запомните цвета фигур!";
        emoji = "👀";
        break;
      case "RECALL":
        text = "Нажмите на фигуру и выберите цвет!";
        emoji = "🎨";
        break;
      case "RESULT":
        text = "Молодец!";
        emoji = "🎉";
        break;
    }
    
    ctx.fillText(`${emoji} ${text}`, x, y);
    
    ctx.restore();
  }

  static darkenColor(color, percent) {
    // Упрощенная функция для затемнения цвета
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    
    return `#${(R * 0x10000 + G * 0x100 + B).toString(16).padStart(6, "0")}`;
  }

  static lightenColor(color, percent) {
    // Упрощенная функция для осветления цвета
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min((num >> 16) + amt, 255);
    const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
    const B = Math.min((num & 0x0000FF) + amt, 255);
    
    return `#${(R * 0x10000 + G * 0x100 + B).toString(16).padStart(6, "0")}`;
  }

  static drawTimer(ctx, timeLeft, totalTime, position, size) {
    const { x, y, width, height } = position;
    const progress = timeLeft / totalTime;

    // Фон полоски
    ctx.fillStyle = "#E0E0E0";
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, height / 2);
    ctx.fill();

    // Заполненная часть
    const fillWidth = width * progress;
    const gradient = ctx.createLinearGradient(x, y, x + fillWidth, y);
    gradient.addColorStop(0, progress > 0.5 ? "#4ECDC4" : "#FFD166");
    gradient.addColorStop(1, progress > 0.5 ? "#06D6A0" : "#FF6B8B");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, fillWidth, height, height / 2);
    ctx.fill();

    // Текст
    ctx.fillStyle = "#333333";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `${Math.ceil(timeLeft)} сек`,
      x + width / 2,
      y + height / 2
    );

    // Обводка
    ctx.strokeStyle = "#4a6fa5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, height / 2);
    ctx.stroke();
  }
}