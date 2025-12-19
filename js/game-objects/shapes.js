import { GameState } from "../game-state.js";

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
      
      if (phase === GameState.GamePhases.SHOWING) {
        const outerColor = availableColors[outerColorIndex];
        this.drawShinyCircle(ctx, position, radius, outerColor);
      } else if (phase === GameState.GamePhases.RECALL) {
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
      
      if (phase === GameState.GamePhases.SHOWING) {
        const innerColor = availableColors[innerColorIndex];
        this.drawShinyTriangle(ctx, position, innerRadius, innerColor);
      } else if (phase === GameState.GamePhases.RECALL) {
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
}