export class ColorPalette {
  constructor(ctx, text) {
    this.ctx = ctx;
    this.text = text;
    this.colorPalettePosition = null;
    this.buttonSize = 60;
  }

  render(state, availableArea) {
    this.updatePaleteSettings(state, availableArea);
    this.renderColorPalette(state.availableColors);
  }

  updatePaleteSettings(state, availableArea) {
    if (!state.selectedShape) return;

    const selectedShape = state.shapes[state.selectedShape.compositeIndex];
    const spacing = 15;

    // Позиция палитры справа от выбранной фигуры
    let paletteX = selectedShape.position.x + selectedShape.size / 2 + 50;
    let paletteY = selectedShape.position.y - this.buttonSize;

    // Если палитра не помещается справа, показываем слева
    if (paletteX + this.buttonSize * 2 + spacing + 60 > availableArea.width) {
      paletteX = selectedShape.position.x - selectedShape.size / 2 - this.buttonSize * 2 - spacing - 80;
    }

    // Если палитра не помещается по Y, корректируем
    if (paletteY < 20) paletteY = 20;
    const maxY = availableArea.height -
      (Math.ceil(state.availableColors.length / 2) * (this.buttonSize + spacing) + 60);
    if (paletteY > maxY) paletteY = maxY;

    this.colorPalettePosition = {
      x: paletteX,
      y: paletteY,
      spacing
    };
  }

  renderColorPalette(colors) {
    const ctx = this.ctx;
    const position = this.colorPalettePosition;
    const buttonSize = this.buttonSize;
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
      startX - 50, 
      startY - 40, 
      buttonSize * 2 + spacing + 100, 
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
    ctx.fillText(this.text, startX + buttonSize + spacing/2, startY - 10);
    
    // Кнопки цветов
    colors.forEach((color, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = startX + col * (buttonSize + spacing);
      const y = startY + 10 + row * (buttonSize + spacing);
      
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
      
      // Блик на кнопке
      ctx.beginPath();
      ctx.arc(x + buttonSize/3, y + buttonSize/3, buttonSize/5, 0, Math.PI * 2);
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
    if (!this.colorPalettePosition) return -1;

    const { x: paletteX, y: paletteY, spacing } = this.colorPalettePosition;

    const colorsPerRow = 2;
    const maxColors = 10; // Максимум 10 цветов

    for (let i = 0; i < maxColors; i++) {
      const row = Math.floor(i / colorsPerRow);
      const col = i % colorsPerRow;
      const buttonX = paletteX + col * (this.buttonSize + spacing);
      const buttonY = paletteY + row * (this.buttonSize + spacing);

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
}