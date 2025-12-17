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

    // Выбираем случайные уникальные цвета из палитры
    const selected = [];
    const available = [...palette];

    for (let i = 0; i < count; i++) {
      if (available.length === 0) {
        // Генерируем случайные яркие цвета
        const hue = Math.floor(Math.random() * 360);
        const saturation = 80 + Math.random() * 20;
        const lightness = 50 + Math.random() * 20;
        selected.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      } else {
        const randomIndex = Math.floor(Math.random() * available.length);
        selected.push(available.splice(randomIndex, 1)[0]);
      }
    }

    return selected;
  }

  static generateShapes(levelConfig, availableArea) {
    const { colorCount, shapeSequence } = levelConfig;
    const shapes = [];
    const shapeCount = 3;

    // Генерируем уникальные комбинации цветов
    const usedCombinations = new Set();
    
    for (let i = 0; i < shapeCount; i++) {
      let outerColor, innerColor;
      let combinationKey;
      
      do {
        outerColor = Math.floor(Math.random() * colorCount);
        innerColor = Math.floor(Math.random() * colorCount);
        combinationKey = `${outerColor}-${innerColor}`;
      } while (usedCombinations.has(combinationKey) || outerColor === innerColor);
      
      usedCombinations.add(combinationKey);

      shapes.push({
        id: i,
        type: "composite",
        outerShape: shapeSequence[0],
        innerShape: shapeSequence[1],
        outerColorIndex: outerColor,
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
    
    // Увеличиваем минимальный размер фигур для детей
    const minShapeSize = 150; // Было 100
    const shapeSpacing = 80; // Было 50
    
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