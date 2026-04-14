import { GameState } from "../game-state.js";
import { ShapeTypes } from "../config.js";

export class ShapeRenderer {
  static drawCompositeShape(ctx, shape, phase, availableColors, userColors, isSelected, nestedShapeIndex) {
    const { position, size, shapeSequence, colorIndexesSequence } = shape;
    const radius = size / 2;

    // Создаем все фигуры для отрисовки
    const shapesToDraw = this.prepareShapesToDraw(
      shapeSequence,
      colorIndexesSequence,
      userColors,
      isSelected,
      nestedShapeIndex
    );

    // Отрисовываем каждую фигуру
    shapesToDraw.forEach((shapeConfig, index) => {
      const radiusValue = this.calculateRadiusValue(index, this.getScaleDecrease(index, shape.shapeSequence));
      const shapeSettings = this.createShapeSettings({
        phase,
        availableColors,
        radius,
        position,
        ...shapeConfig,
        radiusValue
      });

      this.drawShape(ctx, shapeSettings);
    });
  }

  static getScaleDecrease(index, shapeSequence)
  {
    switch(shapeSequence[index]) {
      case ShapeTypes.SPHERE:
        if (index > 1 && shapeSequence[index - 1] !== ShapeTypes.SPHERE)
          return 0.4;
        return 0.3;
      case ShapeTypes.TRIANGLE:
        if (index >= 3) return 0.35;
        if (index > 1 && shapeSequence[index - 1] === ShapeTypes.SQUARE)
          return 0.3;
        return 0.25;
      case ShapeTypes.SQUARE:
        if (index > 1 && (shapeSequence[index - 1] === ShapeTypes.TRIANGLE) || (shapeSequence[index - 1] === ShapeTypes.RECTANGLE))
          return 0.35;
        return 0.2;
      case ShapeTypes.RECTANGLE:
        return 0.15;
      default:
        return 0.3;
    }
  }

  static calculateRadiusValue(index, decreasePercentage) {
    // Первая фигура (index 0) = 100%
    // Вторая фигура (index 1) = 70% (100% - 30%)
    // Третья фигура (index 2) = 49% (70% - 30% от 70%)
    // и т.д.
    return Math.pow(1 - decreasePercentage, index);
  }

  // Подготавливает конфигурации всех фигур для отрисовки
  static prepareShapesToDraw(shapeSequence, colorIndexesSequence, userColors, isSelected, selectedIndex) {
    // Клонируем массивы, чтобы не изменять оригиналы
    const shapes = [...shapeSequence];
    const colors = [...colorIndexesSequence];

    return shapes.map((shapeType, index) => {
      const isShapeSelected = isSelected &&
        (selectedIndex === -1 ? index === 0 : index === selectedIndex);

      return {
        shapeType,
        colorIndex: colors[index],
        userColor: userColors[index],
        isSelected: isShapeSelected
      };
    });
  }

  // Создает единый объект настроек для отрисовки фигуры
  static createShapeSettings({
    phase,
    availableColors,
    userColor,
    isSelected,
    shapeType,
    colorIndex,
    radius,
    radiusValue,
    position
  }) {
    return {
      phase,
      availableColors,
      userColor,
      isSelected,
      nestedShapeType: shapeType,
      nestedShapeColorIndex: colorIndex,
      radius,
      radiusValue,
      position
    };
  }

  // Универсальный метод отрисовки любой фигуры
  static drawShape(ctx, shapeSettings) {
    switch (shapeSettings.nestedShapeType) {
      case ShapeTypes.SPHERE:
        this.drawSphere(ctx, shapeSettings);
        break;
      case ShapeTypes.TRIANGLE:
        this.drawTriangle(ctx, shapeSettings);
        break;
      case ShapeTypes.SQUARE:
        this.drawSquare(ctx, shapeSettings);
        break;
      case ShapeTypes.RECTANGLE:
        this.drawRectangle(ctx, shapeSettings);
        break;
      default:
        console.warn(`Unknown shape type: ${shapeSettings.nestedShapeType}`);
    }
  }
  
  static drawSphere(ctx, shapeSettings) {
    const { phase, availableColors, userColor, isSelected, nestedShapeColorIndex, radius, radiusValue, position } = shapeSettings;
    const innerRadius = radius * radiusValue;

    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.arc(position.x, position.y, innerRadius, 0, Math.PI * 2);

    if (phase === GameState.GamePhases.SHOWING) {
      const outerColor = availableColors[nestedShapeColorIndex];
      this.drawShinyCircle(ctx, position, innerRadius, outerColor);
    } else if (phase === GameState.GamePhases.RECALL) {
      if (userColor !== null) {
        const color = availableColors[userColor];
        this.drawShinyCircle(ctx, position, innerRadius, color);
      } else {
        this.drawShinyCircle(ctx, position, innerRadius, "#CCCCCC", false);
      }
    }

    // Сбрасываем тень
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Если внешняя фигура выбрана, рисуем подсветку
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(position.x, position.y, innerRadius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowColor = "transparent";
    }
  }

  static drawTriangle(ctx, shapeSettings) {
    const { phase, availableColors, userColor, isSelected, nestedShapeColorIndex, radius, radiusValue, position } = shapeSettings;
    const innerRadius = radius * radiusValue;

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
      const innerColor = availableColors[nestedShapeColorIndex];
      this.drawShinyTriangle(ctx, position, innerRadius, innerColor);
    } else if (phase === GameState.GamePhases.RECALL) {
      if (userColor !== null) {
        const color = availableColors[userColor];
        this.drawShinyTriangle(ctx, position, innerRadius, color);
      } else {
        this.drawShinyTriangle(ctx, position, innerRadius, "#AAAAAA", false);
      }
    }

    // Сбрасываем тень
    ctx.shadowColor = "transparent";

    // Если внутренняя фигура выбрана, рисуем подсветку
    if (isSelected) {
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

  static drawSquare(ctx, shapeSettings) {
    const { phase, availableColors, userColor, isSelected, nestedShapeColorIndex, radius, radiusValue, position } = shapeSettings;
    const innerRadius = radius * radiusValue;

    // Создаем квадрат (повернутый на 45 градусов для единообразия с треугольником)
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * 2 * Math.PI / 4) - Math.PI / 4; // -45° чтобы квадрат стоял на угле
      const x = position.x + innerRadius * Math.cos(angle);
      const y = position.y + innerRadius * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Тень для квадрата
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    if (phase === GameState.GamePhases.SHOWING) {
      const innerColor = availableColors[nestedShapeColorIndex];
      this.drawShinySquare(ctx, position, innerRadius, innerColor);
    } else if (phase === GameState.GamePhases.RECALL) {
      if (userColor !== null) {
        const color = availableColors[userColor];
        this.drawShinySquare(ctx, position, innerRadius, color);
      } else {
        this.drawShinySquare(ctx, position, innerRadius, "#AAAAAA", false);
      }
    }

    // Сбрасываем тень
    ctx.shadowColor = "transparent";

    // Если квадрат выбран, рисуем подсветку
    if (isSelected) {
      ctx.beginPath();
      const highlightRadius = innerRadius + 8;
      for (let i = 0; i < 4; i++) {
        const angle = (i * 2 * Math.PI / 4) - Math.PI / 4;
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

  static drawRectangle(ctx, shapeSettings) {
    const { phase, availableColors, userColor, isSelected, nestedShapeColorIndex, radius, radiusValue, position } = shapeSettings;
    const innerRadius = radius * radiusValue;

    const width = innerRadius * 1.4;
    const height = innerRadius;

    // Создаем прямоугольник
    ctx.beginPath();
    // Верхний левый -> верхний правый -> нижний правый -> нижний левый
    ctx.moveTo(position.x - width / 2, position.y - height / 2);
    ctx.lineTo(position.x + width / 2, position.y - height / 2);
    ctx.lineTo(position.x + width / 2, position.y + height / 2);
    ctx.lineTo(position.x - width / 2, position.y + height / 2);
    ctx.closePath();

    // Тень для прямоугольника
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    if (phase === GameState.GamePhases.SHOWING) {
      const innerColor = availableColors[nestedShapeColorIndex];
      this.drawShinyRectangle(ctx, position, width, height, innerColor);
    } else if (phase === GameState.GamePhases.RECALL) {
      if (userColor !== null) {
        const color = availableColors[userColor];
        this.drawShinyRectangle(ctx, position, width, height, color);
      } else {
        this.drawShinyRectangle(ctx, position, width, height, "#AAAAAA", false);
      }
    }

    // Сбрасываем тень
    ctx.shadowColor = "transparent";

    // Если прямоугольник выбран, рисуем подсветку
    if (isSelected) {
      ctx.beginPath();
      const highlightWidth = width + 12;
      const highlightHeight = height + 8;
      ctx.moveTo(position.x - highlightWidth / 2, position.y - highlightHeight / 2);
      ctx.lineTo(position.x + highlightWidth / 2, position.y - highlightHeight / 2);
      ctx.lineTo(position.x + highlightWidth / 2, position.y + highlightHeight / 2);
      ctx.lineTo(position.x - highlightWidth / 2, position.y + highlightHeight / 2);
      ctx.closePath();
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowColor = "transparent";
    }
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

  static drawShinySquare(ctx, position, radius, color, shiny = true) {
    // Градиент для квадрата (вертикальный, как у треугольника)
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

    // Обводка квадрата
    ctx.strokeStyle = this.darkenColor(color, 40);
    ctx.lineWidth = 3;
    ctx.stroke();

    // Блик на квадрате
    if (shiny) {
      ctx.beginPath();
      // Маленький квадрат для блика
      const highlightRadius = radius * 0.4;
      for (let i = 0; i < 4; i++) {
        const angle = (i * 2 * Math.PI / 4) - Math.PI / 4;
        const x = position.x + highlightRadius * Math.cos(angle) * 0.6;
        const y = position.y + highlightRadius * Math.sin(angle) * 0.6 - radius * 0.15;

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

  static drawShinyRectangle(ctx, position, width, height, color, shiny = true) {
    // Градиент для прямоугольника (вертикальный)
    const gradient = ctx.createLinearGradient(
      position.x,
      position.y - height / 2,
      position.x,
      position.y + height / 2
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

    // Рисуем прямоугольник
    ctx.beginPath();
    ctx.moveTo(position.x - width / 2, position.y - height / 2);
    ctx.lineTo(position.x + width / 2, position.y - height / 2);
    ctx.lineTo(position.x + width / 2, position.y + height / 2);
    ctx.lineTo(position.x - width / 2, position.y + height / 2);
    ctx.closePath();
    ctx.fill();

    // Обводка прямоугольника
    ctx.strokeStyle = this.darkenColor(color, 40);
    ctx.lineWidth = 3;
    ctx.stroke();

    // Блик на прямоугольнике
    if (shiny) {
      ctx.beginPath();
      // Маленький прямоугольник для блика (40% от размера)
      const highlightWidth = width * 0.4;
      const highlightHeight = height * 0.4;
      const highlightX = position.x - highlightWidth / 2;
      const highlightY = position.y - height / 2 * 0.7; // Смещаем вверх

      ctx.moveTo(highlightX, highlightY);
      ctx.lineTo(highlightX + highlightWidth, highlightY);
      ctx.lineTo(highlightX + highlightWidth, highlightY + highlightHeight);
      ctx.lineTo(highlightX, highlightY + highlightHeight);
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