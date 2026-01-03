import { GameState } from "../game-state.js";
import { ShapeTypes } from "../config.js";

export class ShapeRenderer {
  static drawCompositeShape(ctx, shape, phase, availableColors, userColors, isSelected, nestedShapeIndex) {
    const { position, size, shapeSequence, colorIndexesSequence } = shape;
    const radius = size / 2;

    // Клоны массивов для рендера, чтобы не затереть исходные.
    const renderShapeSequence = [...shapeSequence];
    const renderColorIndexesSequence = [...colorIndexesSequence];

    const outerShapeType = renderShapeSequence.shift();
    const outerColorIndex = renderColorIndexesSequence.shift();
    const outerRadiusValue = 1;
    const isSelectedOuterSHape = isSelected && nestedShapeIndex === -1;
    let shapeIndex = 0;

    const outerShapeSettings = {
      phase,
      availableColors,
      userColor: userColors[shapeIndex],
      isSelected: isSelectedOuterSHape,
      nestedShapeType: outerShapeType,
      nestedShapeColorIndex: outerColorIndex,
      radius,
      radiusValue: outerRadiusValue,
      position,
    }

    this.drawSphere(ctx, outerShapeSettings);
    shapeIndex++;

    const isSelectedInnerShape = isSelected && shapeIndex === nestedShapeIndex;
    if (renderShapeSequence.length != 0) {
      const nestedShapeType = renderShapeSequence.shift();
      const nestedShapeColorIndex = renderColorIndexesSequence.shift();
      const radiusValue = 0.7;
      const shapeSettings = {
        phase,
        availableColors,
        userColor: userColors[shapeIndex],
        isSelected: isSelectedInnerShape,
        nestedShapeType,
        nestedShapeColorIndex,
        radius,
        radiusValue,
        position
      }
      this.drawNestedShape(ctx, shapeSettings);
    }
  }

  static drawNestedShape(ctx, shapeSettings) {
    switch (shapeSettings.nestedShapeType) {
      case ShapeTypes.SPHERE:
        this.drawSphere(ctx, shapeSettings);
        break;
      case ShapeTypes.TRIANGLE:
        this.drawTriangle(ctx, shapeSettings);
        break;
      case ShapeTypes.RECTANGLE:
        break;
      case ShapeTypes.SQUARE:
        break;
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