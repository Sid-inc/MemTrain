export const GameConfig = {
  get WIDTH() {
    return window.innerWidth;
  },
  get HEIGHT() {
    return window.innerHeight;
  },
};

export const Levels = [
  {
    id: 1,
    order: 1,
    difficulty: 1,
    shapeSequence: ["sphere", "triangle"],
    colorCount: 3,
    timeSeconds: 5,
  },
  {
    id: 2,
    order: 2,
    difficulty: 1,
    shapeSequence: ["sphere", "triangle"],
    colorCount: 3,
    timeSeconds: 15,
  }
];