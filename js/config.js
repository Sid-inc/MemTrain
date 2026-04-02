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
    colorCount: 3,
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

export const RewardsConfig = {
  totalRewardsCount: 17,
  rewards: [
    { id: 1, imagePath: 'images/1770465822.png', name: 'Кот 1' },
    { id: 2, imagePath: 'images/1770465914.png', name: 'Кот 2' },
    { id: 3, imagePath: 'images/1770465950.png', name: 'Кот 3' },
    { id: 4, imagePath: 'images/1770466040.png', name: 'Кот 4' },
    { id: 5, imagePath: 'images/1770469448.png', name: 'Кот 5' },
    { id: 6, imagePath: 'images/1770469490.png', name: 'Кот 6' },
    { id: 7, imagePath: 'images/1770469560.png', name: 'Кот 7' },
    { id: 8, imagePath: 'images/1770469587.png', name: 'Кот 8' },
    { id: 9, imagePath: 'images/1770470644.png', name: 'Кот 9' },
    { id: 10, imagePath: 'images/1770470915.png', name: 'Кот 10' },
    { id: 11, imagePath: 'images/1770551280.png', name: 'Кот 11' },
    { id: 12, imagePath: 'images/1770552566.png', name: 'Собака 1' },
    { id: 13, imagePath: 'images/1770553680.png', name: 'Собака 2' },
    { id: 14, imagePath: 'images/1770553728.png', name: 'Собака 3' },
    { id: 15, imagePath: 'images/1770554080.png', name: 'Собака 4' },
    { id: 16, imagePath: 'images/1770554219.png', name: 'Собака 5' },
    { id: 17, imagePath: 'images/1770554450.png', name: 'Собака 6' },
    { id: 18, imagePath: 'images/177418145816ab.png', name: 'Собака 7' },
    { id: 19, imagePath: 'images/177418183333a6.png', name: 'Собака 8' },
    { id: 20, imagePath: 'images/1774104278735e.png', name: 'Собака 9' },
    { id: 21, imagePath: 'images/1774244436397c.png', name: 'Собака 10' },
    { id: 22, imagePath: 'images/17741039545418.png', name: 'Собака 11' },
    { id: 23, imagePath: 'images/17741040846343.png', name: 'Собака 12' },
    { id: 24, imagePath: 'images/17742442379465.png', name: 'Собака 13' },
  ]
};
