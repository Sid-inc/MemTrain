export class ColorPalette {
  constructor(ctx) {
    this.ctx = ctx;
    this.colorPalettePosition = null;
    this.currentColorCount = 0;
    this.buttonSize = 60;
  }

  render(state, availableArea) {
    if (!state.selectedShape) {
      this.colorPalettePosition = null;
      return;
    }

    this.updatePaleteSettings(state, availableArea);
    this.renderColorPalette(state.availableColors);
  }

  updatePaleteSettings(state, availableArea) {
    if (!state.selectedShape) {
      this.colorPalettePosition = null;
      return;
    }

    const selectedShape = state.shapes[state.selectedShape.compositeIndex];
    const spacing = 15;
    const colorsCount = state.availableColors.length;

    // 1. ТОЧНЫЙ РАСЧЕТ РАЗМЕРОВ ПАЛИТРЫ
    const columns = Math.ceil(colorsCount / 4);
    const paletteWidth = spacing + this.buttonSize * columns + spacing * columns; // Ширина фона (кнопки + отступы)
    const rows = colorsCount >= 4 ? 4 : colorsCount;
    const paletteHeight = (rows * (this.buttonSize + spacing)) + spacing; // Высота: кнопки + заголовок + отступы

    // 2. БАЗОВАЯ ПОЗИЦИЯ (справа от фигуры)
    let paletteX = selectedShape.position.x + selectedShape.size / 2 + 30;
    let paletteY = selectedShape.position.y - paletteHeight / 2; // Центрируем по вертикали относительно фигуры

    // 3. ГОРИЗОНТАЛЬНАЯ КОРРЕКЦИЯ
    // Если палитра выходит за правую границу
    if (paletteX + paletteWidth > availableArea.width) {
      // Пытаемся поместить слева от фигуры
      paletteX = selectedShape.position.x - selectedShape.size / 2 - paletteWidth - 30;

      // Если не помещается слева - прижимаем к левому краю
      if (paletteX < 20) {
        paletteX = 20;
      }
    }

    // Если базовая позиция слева (изначально не помещалась справа)
    if (paletteX < 20) {
      paletteX = 20;
    }

    // 4. ВЕРТИКАЛЬНАЯ КОРРЕКЦИЯ
    // Верхняя граница
    if (paletteY < 30) {
      paletteY = 30;
    }

    // Нижняя граница
    if (paletteY + paletteHeight > availableArea.height - 30) {
      paletteY = availableArea.height - paletteHeight - 30;
    }

    // 5. ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА ДЛЯ КРАЙНИХ СЛУЧАЕВ
    // Если палитра все еще не помещается по высоте (маленькое окно)
    if (paletteHeight > availableArea.height - 60) {
      paletteY = 30;
    }

    this.colorPalettePosition = {
      x: paletteX,
      y: paletteY,
      width: paletteWidth,
      height: paletteHeight,
      spacing: spacing
    };
  }

  renderColorPalette(colors) {
    if (!this.colorPalettePosition) return;

    const { x: startX, y: startY, width, height, spacing } = this.colorPalettePosition;
    const ctx = this.ctx;
    const buttonSize = this.buttonSize;
    this.currentColorCount = colors.length;

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
      startX, 
      startY, 
      width, 
      height, 
      25
    );
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";

    // Кнопки цветов
    colors.forEach((color, index) => {
      const row = index % 4;
      const col = Math.floor(index / 4);
      const x = startX + spacing + col * (buttonSize + spacing);
      const y = startY + spacing + row * (buttonSize + spacing);

      // Фон кнопки с градиентом
      const buttonGradient = ctx.createRadialGradient(
        x + buttonSize / 2, y + buttonSize / 2, 0,
        x + buttonSize / 2, y + buttonSize / 2, buttonSize / 2
      );
      buttonGradient.addColorStop(0, "#FFFFFF");
      buttonGradient.addColorStop(0.5, color);
      buttonGradient.addColorStop(1, this.darkenColor(color, 30));

      ctx.fillStyle = buttonGradient;
      ctx.beginPath();
      ctx.arc(x + buttonSize / 2, y + buttonSize / 2, buttonSize / 2, 0, Math.PI * 2);
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

      // Блик на кнопке
      ctx.beginPath();
      ctx.arc(x + buttonSize / 3, y + buttonSize / 3, buttonSize / 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fill();
    });

    ctx.restore();
  }

  darkenColor(color, percent) {
    // Упрощенная функция для затемнения цвета
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);

    return `#${(R * 0x10000 + G * 0x100 + B).toString(16).padStart(6, "0")}`;
  }

  isColorClicked(x, y) {
    if (!this.colorPalettePosition || this.currentColorCount === 0) return -1;

    const { x: paletteX, y: paletteY, spacing } = this.colorPalettePosition;

    const colorsPerRow = 4;
    const maxColors = this.currentColorCount || 0;

    for (let i = 0; i < maxColors; i++) {
      const row = i % colorsPerRow;
      const col = Math.floor(i / colorsPerRow);
      const buttonX = paletteX + spacing + col * (this.buttonSize + spacing);
      const buttonY = paletteY + spacing + row * (this.buttonSize + spacing);

      const distance = Math.sqrt(
        Math.pow(x - (buttonX + this.buttonSize / 2), 2) +
        Math.pow(y - (buttonY + this.buttonSize / 2), 2)
      );

      if (distance <= this.buttonSize / 2) {
        return i;
      }
    }

    return -1;
  }

  hide()
  {
    this.colorPalettePosition = null;
  }
}