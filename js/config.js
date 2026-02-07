export const GameConfig = {
  get WIDTH() {
    return window.innerWidth;
  },
  get HEIGHT() {
    return window.innerHeight;
  },
};

export const ShapeTypes = {
  SPHERE: "SPHERE",
  TRIANGLE: "TRIANGLE",
  SQUARE: "SQUARE",
  RECTANGLE: "RECTANGLE"
};

export const Levels = [
  {
    id: 1,
    order: 1,
    difficulty: 1,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.SPHERE],
    colorCount: 3,
    timeSeconds: 15,
  },
  {
    id: 2,
    order: 2,
    difficulty: 1,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.TRIANGLE],
    colorCount: 3,
    timeSeconds: 15,
  },
  {
    id: 3,
    order: 3,
    difficulty: 1,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.SQUARE],
    colorCount: 3,
    timeSeconds: 15,
  },
  {
    id: 4,
    order: 4,
    difficulty: 1,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.RECTANGLE],
    colorCount: 4,
    timeSeconds: 15,
  },
  {
    id: 5,
    order: 5,
    difficulty: 1,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.SPHERE, ShapeTypes.SPHERE],
    colorCount: 3,
    timeSeconds: 15,
  },
  {
    id: 6,
    order: 6,
    difficulty: 2,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.TRIANGLE, ShapeTypes.SPHERE],
    colorCount: 3,
    timeSeconds: 10,
  },
  {
    id: 7,
    order: 7,
    difficulty: 2,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.SQUARE, ShapeTypes.SPHERE],
    colorCount: 3,
    timeSeconds: 10,
  },
  {
    id: 8,
    order: 8,
    difficulty: 2,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.RECTANGLE, ShapeTypes.SPHERE],
    colorCount: 3,
    timeSeconds: 10,
  },
  {
    id: 9,
    order: 9,
    difficulty: 2,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.TRIANGLE, ShapeTypes.SQUARE],
    colorCount: 3,
    timeSeconds: 10,
  },
  {
    id: 10,
    order: 10,
    difficulty: 2,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.RECTANGLE, ShapeTypes.SQUARE],
    colorCount: 3,
    timeSeconds: 10,
  },
  {
    id: 11,
    order: 11,
    difficulty: 3,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.SQUARE, ShapeTypes.TRIANGLE, ShapeTypes.SQUARE],
    colorCount: 4,
    timeSeconds: 7,
  },
  {
    id: 12,
    order: 12,
    difficulty: 3,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.SPHERE, ShapeTypes.SQUARE, ShapeTypes.TRIANGLE],
    colorCount: 4,
    timeSeconds: 7,
  },
  {
    id: 13,
    order: 13,
    difficulty: 3,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.SQUARE, ShapeTypes.SPHERE, ShapeTypes.TRIANGLE],
    colorCount: 4,
    timeSeconds: 7,
  },
  {
    id: 14,
    order: 14,
    difficulty: 3,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.TRIANGLE, ShapeTypes.SQUARE, ShapeTypes.SPHERE],
    colorCount: 4,
    timeSeconds: 7,
  },
  {
    id: 15,
    order: 15,
    difficulty: 3,
    shapeSequence: [ShapeTypes.SPHERE, ShapeTypes.SPHERE, ShapeTypes.SPHERE, ShapeTypes.SPHERE, ShapeTypes.SPHERE],
    colorCount: 5,
    timeSeconds: 7,
  }
];