export class LevelGenerator {
  static generateColors(count) {
    // Контрастные цвета для детей
    const palette = [
      "#FF0000", // Красный
      "#00FF00", // Зеленый
      "#0000FF", // Синий
      "#FFFF00", // Желтый
      "#FF00FF", // Розовый
      "#00FFFF", // Бирюзовый
      "#FF8800", // Оранжевый
      "#8800FF", // Фиолетовый
      "#008800", // Темно-зеленый
      "#0088FF"  // Голубой
    ];

    // Выбираем случайные цвета из палитры
    const selected = [];
    const available = [...palette];

    for (let i = 0; i < count; i++) {
      if (available.length < i) {
        // Генерируем случайные яркие цвета
        const hue = Math.floor(Math.random() * 360);
        const saturation = 80 + Math.random() * 20;
        const lightness = 50 + Math.random() * 20;
        selected.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      } else {
        selected.push(available[i]);
      }
    }

    return selected;
  }

  static generateShapesSettings(levelConfig) {
    const { colorCount, shapeSequence } = levelConfig;
    const shapeCount = 3;

    const colorCombinations = this.generateUniqueColorCombinations(
      colorCount,
      shapeCount,
      100 // Максимум 30 попыток
    );

    const shapes = colorCombinations.map((combo, i) => ({
      id: i,
      type: "composite",
      outerShape: shapeSequence[0],
      innerShape: shapeSequence[1],
      outerColorIndex: combo.outerColorIndex,
      innerColorIndex: combo.innerColorIndex,
      position: { x: 0, y: 0 },
      size: 0,
      rotation: Math.random() * Math.PI * 2 // Случайный поворот
    }));

    return shapes;
  }

  static generateUniqueColorCombinations(colorCount, shapeCount, maxAttempts = 30) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;

      try {
        const outerColors = this.generateUniqueColors(colorCount, shapeCount);
        const innerColors = this.generateInnerColors(outerColors, colorCount);

        if (this.areColorsUnique(innerColors)) {
          return outerColors.map((outer, i) => ({
            outerColorIndex: outer,
            innerColorIndex: innerColors[i]
          }));
        }
      } catch (e) {
        continue;
      }
    }

    console.warn(`Не удалось сгенерировать уникальные комбинации за ${maxAttempts} попыток. Используем резервный алгоритм.`);
    return this.generateFallbackColorCombinations(colorCount, shapeCount);
  }

  static generateUniqueColors(colorCount, count) {
    if (count > colorCount) {
      throw new Error(`Невозможно сгенерировать ${count} уникальных цветов из ${colorCount} доступных`);
    }

    const allColors = Array.from({ length: colorCount }, (_, i) => i);
    this.shuffleArray(allColors);

    return allColors.slice(0, count);
  }

  static generateInnerColors(outerColors, colorCount) {
    const innerColors = [];
    const usedInnerColors = new Set();

    outerColors.forEach(outerColor => {
      const candidates = [];
      for (let color = 0; color < colorCount; color++) {
        if (color !== outerColor && !usedInnerColors.has(color)) {
          candidates.push(color);
        }
      }

      if (candidates.length > 0) {
        this.shuffleArray(candidates);
        const selectedColor = candidates[0];
        innerColors.push(selectedColor);
        usedInnerColors.add(selectedColor);
      } else {
        throw new Error("Не удалось подобрать уникальный внутренний цвет");
      }
    });

    return innerColors;
  }

  static areColorsUnique(colors) {
    return new Set(colors).size === colors.length;
  }

  static generateFallbackColorCombinations(colorCount, shapeCount) {
    const combinations = [];
    const outerColors = this.generateUniqueColors(colorCount, shapeCount);

    outerColors.forEach((outerColor, i) => {
      let innerColor;
      const forbiddenColors = new Set([outerColor]);

      if (i > 0 && combinations.length < colorCount - 1) {
        combinations.forEach(combo => forbiddenColors.add(combo.innerColorIndex));
      }

      for (let color = 0; color < colorCount; color++) {
        if (!forbiddenColors.has(color)) {
          innerColor = color;
          break;
        }
      }

      if (innerColor === undefined) {
        innerColor = (outerColor + 1) % colorCount;
      }

      combinations.push({
        outerColorIndex: outerColor,
        innerColorIndex: innerColor
      });
    });

    return combinations;
  }

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  static calculateLayout(shapes, availableArea, hasSidePanel = false) {
    const shapeCount = shapes.length;

    // Минимальный размер фигур
    const minShapeSize = 150;
    const shapeSpacing = 80;

    const effectiveWidth = hasSidePanel ? availableArea.width * 0.6 : availableArea.width;

    const neededWidth = shapeCount * (minShapeSize + shapeSpacing);
    const useHorizontal = effectiveWidth >= neededWidth;

    if (useHorizontal) {
      // Располагаем в строку
      const shapeSize = Math.min(
        minShapeSize,
        (effectiveWidth - (shapeCount + 1) * shapeSpacing) / shapeCount
      );

      const startX = (availableArea.width - (shapeCount * (shapeSize + shapeSpacing))) / 2;
      const centerY = availableArea.height / 2;

      shapes.forEach((shape, index) => {
        shape.position = {
          x: startX + index * (shapeSize + shapeSpacing) + shapeSize / 2,
          y: centerY
        };
        shape.size = shapeSize;
      });
    } else {
      // Располагаем в столбик
      const shapeSize = Math.min(
        minShapeSize,
        (availableArea.height - (shapeCount + 1) * shapeSpacing) / shapeCount
      );

      const centerX = availableArea.width / 2;
      const startY = (availableArea.height - (shapeCount * (shapeSize + shapeSpacing))) / 2;

      shapes.forEach((shape, index) => {
        shape.position = {
          x: centerX,
          y: startY + index * (shapeSize + shapeSpacing) + shapeSize / 2
        };
        shape.size = shapeSize;
      });
    }

    return shapes;
  }
}