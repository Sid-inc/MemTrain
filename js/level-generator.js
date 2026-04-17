import { ResponsiveHelper } from "./helpers/responsiveHelper.js";

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

    const shapesInSequenceCount = shapeSequence.flat(1).length;
    if (shapesInSequenceCount > colorCount) {
      console.warn(`Количество цветов ${colorCount} недостаточно для генерации ${shapesInSequenceCount} фигур.`);
      return;
    }

    if (shapeCount > colorCount) {
      console.warn(`Количество последовательностей (${shapeCount}) превышает количество доступных цветов (${colorCount}).`);
      return;
    }

    const colorCombinations = this.generateUniqueColorCombinations(shapeCount, colorCount, shapesInSequenceCount);
    if (colorCombinations.count === 0) {
      console.warn("Генерация цветов не удалась");
      return;
    }

    const shapes = colorCombinations.map((combo, i) => ({
      id: i,
      type: "composite",
      shapeSequence: shapeSequence,
      colorIndexesSequence: combo,
      position: { x: 0, y: 0 },
      size: 0,
    }));

    return shapes;
  }

  static generateUniqueColorCombinations(shapeCount, colorCount, shapesInSequenceCount) {
    try {
      // Пробуем быстрый алгоритм
      return this.fastGeneration(shapeCount, colorCount, shapesInSequenceCount);
    } catch (e) {
      // Если не получилось, используем надежный алгоритм с возвратом
      console.log('Быстрый алгоритм не сработал, используем перебор с возвратом');
      return this.backtrackGeneration(shapeCount, colorCount, shapesInSequenceCount);
    }
    // const allColors = Array.from({ length: colorCount }, (_, i) => i);

    // const combinations = [];

    // for (let i = 0; i < shapeCount; i++) {
    //   const sequence = [];
    //   for (let j = 0; j < shapesInSequenceCount; j++) {
    //     let generatedIndex;
    //     let attempts = 0;
    //     const maxAttempts = colorCount * 10;

    //     do {
    //       generatedIndex = this.generateIndex(allColors.length);
    //       attempts++;

    //       if (attempts >= maxAttempts) {
    //         break;
    //       }
    //     } while (sequence.includes(generatedIndex) || this.anySequenceContainIndex(combinations, j, generatedIndex))

    //     sequence.push(generatedIndex);
    //   }
    //   combinations.push(sequence);
    // }

    // return combinations;
  }

  static fastGeneration(shapeCount, colorCount, shapesInSequenceCount) {
    const combinations = [];
    const availablePositions = {};

    // Инициализируем доступные цвета для каждой позиции
    for (let pos = 0; pos < shapesInSequenceCount; pos++) {
      availablePositions[pos] = Array.from({ length: colorCount }, (_, i) => i);
      // Перемешиваем
      availablePositions[pos].sort(() => Math.random() - 0.5);
    }

    for (let shape = 0; shape < shapeCount; shape++) {
      const sequence = [];
      const usedColors = new Set();

      for (let pos = 0; pos < shapesInSequenceCount; pos++) {
        let found = false;

        for (let i = 0; i < availablePositions[pos].length; i++) {
          const color = availablePositions[pos][i];

          if (!usedColors.has(color)) {
            // Проверяем, не используется ли этот цвет на этой позиции в других последовательностях
            let conflict = false;
            for (const existing of combinations) {
              if (existing[pos] === color) {
                conflict = true;
                break;
              }
            }

            if (!conflict) {
              sequence.push(color);
              usedColors.add(color);
              availablePositions[pos].splice(i, 1);
              found = true;
              break;
            }
          }
        }

        if (!found) {
          throw new Error('Не удалось найти подходящий цвет');
        }
      }

      combinations.push(sequence);
    }

    return combinations;
  }

  static backtrackGeneration(shapeCount, colorCount, shapesInSequenceCount) {
    // Проверки остаются те же

    const allColors = Array.from({ length: colorCount }, (_, i) => i);

    // Рекурсивная функция с возвратом
    function backtrack(currentShapeIndex, currentCombinations) {
      // Если заполнили все последовательности - успех
      if (currentShapeIndex === shapeCount) {
        return [...currentCombinations.map(seq => [...seq])];
      }

      // Генерируем все возможные последовательности для текущей формы
      const possibleSequences = generatePossibleSequences(
        allColors,
        shapesInSequenceCount,
        currentCombinations
      );

      // Перемешиваем для случайности
      shuffleArray(possibleSequences);

      for (const sequence of possibleSequences) {
        currentCombinations.push(sequence);

        const result = backtrack(currentShapeIndex + 1, currentCombinations);
        if (result) {
          return result;
        }

        // Возврат - убираем последнюю последовательность
        currentCombinations.pop();
      }

      return null;
    }

    function generatePossibleSequences(colors, length, existingCombinations) {
      const result = [];

      // Генерируем все перестановки цветов нужной длины
      function generatePermutations(current, usedColors) {
        if (current.length === length) {
          // Проверяем, подходит ли последовательность
          if (isSequenceValid(current, existingCombinations)) {
            result.push([...current]);
          }
          return;
        }

        for (const color of colors) {
          if (!usedColors.has(color)) {
            current.push(color);
            usedColors.add(color);
            generatePermutations(current, usedColors);
            current.pop();
            usedColors.delete(color);
          }
        }
      }

      generatePermutations([], new Set());
      return result;
    }

    function isSequenceValid(sequence, existingCombinations) {
      // Проверяем каждую позицию
      for (let pos = 0; pos < sequence.length; pos++) {
        const color = sequence[pos];
        // Проверяем, есть ли этот цвет на этой позиции в других последовательностях
        for (const existing of existingCombinations) {
          if (existing[pos] === color) {
            return false;
          }
        }
      }
      return true;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    const result = backtrack(0, []);
    return result || [];
  }

  static generateIndex(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }

  static anySequenceContainIndex(sequence, currentIndex, generatedIndex) {
    for (const element of sequence) {
      if (element[currentIndex] == generatedIndex)
        return true;
    }

    return false;
  }

  static calculateLayout(shapes, availableArea) {
    const shapeCount = shapes.length;

    // Минимальный размер фигур
    let minShapeSize = 220;
    let shapeSpacing = 80;

    const effectiveWidth = availableArea.width;

    const neededWidth = shapeCount * (minShapeSize + shapeSpacing);
    const useHorizontal = effectiveWidth >= neededWidth;

    if (useHorizontal) {
      // Располагаем в строку
      const shapeSize = Math.min(
        minShapeSize,
        (effectiveWidth - (shapeCount + 1) * shapeSpacing) / shapeCount
      );
      
      const startX = ((effectiveWidth - (shapeCount * shapeSize + (shapeCount - 1) * shapeSpacing)) / 2) + shapeSize / 2;
      const centerY = availableArea.height / 2;

      shapes.forEach((shape, index) => {
        shape.position = {
          x: startX + index * (shapeSize + shapeSpacing),
          y: centerY
        };
        shape.size = shapeSize;
      });
    } else {
      // Располагаем в столбик
      minShapeSize = ResponsiveHelper.getShapesSize();
      shapeSpacing = ResponsiveHelper.getActualColumnShapesSpace();
      const shapeSize = Math.min(
        minShapeSize,
        (availableArea.height - (shapeCount + 1) * shapeSpacing) / shapeCount
      );

      const centerX = effectiveWidth / 2;
      const startY = ((availableArea.height - (shapeCount * (shapeSize + shapeSpacing))) / 2) + 40;

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