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
    const shapes = [];
    const usedInnerColors = [];
    const shapeCount = 3;
    let outerColorIndexes = [];

    outerColorIndexes = Array.from({ length: colorCount }, (_, i) => i)
      .reduce((shuffled, _, i) => {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        return shuffled;
      }, Array.from({ length: colorCount }, (_, i) => i));

    for (let i = 0; i < shapeCount; i++) {
      let innerColor;

      for (let candidate = 0; candidate < colorCount; candidate++) {
        if (candidate !== outerColorIndexes[i] && !usedInnerColors.includes(candidate)) {
          innerColor = candidate;
          break;
        }
      }
      if (innerColor === undefined) {
        innerColor = (outerColorIndexes[i] + 1) % colorCount;
      }

      usedInnerColors.push(innerColor);
      shapes.push({
        id: i,
        type: "composite",
        outerShape: shapeSequence[0],
        innerShape: shapeSequence[1],
        outerColorIndex: outerColorIndexes[i],
        innerColorIndex: innerColor,
        position: { x: 0, y: 0 },
        size: 0,
        rotation: Math.random() * Math.PI * 2 // Случайный поворот для разнообразия
      });
    }

    return shapes;
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