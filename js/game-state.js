export class GameState {
  constructor(levelConfig, availableColors) {
    this.levelConfig = levelConfig;
    this.currentPhase = GameState.GamePhases.PREPARATION; // PREPARATION, SHOWING, RECALL, RESULT
    this.shapes = []; // Массив фигур
    this.selectedShape = null;
    this.userColors = []; // Цвета, выбранные игроком
    this.result = null; // { correct: number, total: number, percentage: number }
    this.availableColors = availableColors; // Доступные цвета для уровня
    this.timeLeft = levelConfig.timeSeconds;
    this.timerActive = false;
    this.isShowingPhase = true;
  }

  static GamePhases = {
    PREPARATION: "PREPARATION",
    SHOWING: "SHOWING",
    RECALL: "RECALL",
    RESULT: "RESULT"
  };

  static GradeLevels = {
    EXCELLENT: 'excellent',  // 100%
    GOOD: 'good',           // 80-99%
    SATISFACTORY: 'satisfactory', // 60-79%
    FAILED: 'failed'        // <60%
  };

  startTimer() {
    this.timerActive = true;
  }

  stopTimer() {
    this.timerActive = false;
  }

  updateTime(delta) {
    if (this.timerActive && this.timeLeft > 0) {
      this.timeLeft = Math.max(0, this.timeLeft - delta);
      if (this.timeLeft <= 0) {
        this.timerActive = false;
        this.isShowingPhase = false;
        return true;
      }
    }
    return false;
  }

  selectShape(compositeIndex, shapeType) {
    this.selectedShape = { compositeIndex, shapeType };
  }

  clearSelection() {
    this.selectedShape = null;
  }

  applyColorToShape(colorIndex) {
    if (this.selectedShape) {
      const { compositeIndex, shapeType } = this.selectedShape;

      if (!this.userColors[compositeIndex]) {
        this.userColors[compositeIndex] = { outer: null, inner: null };
      }

      this.userColors[compositeIndex][shapeType] = colorIndex;
      this.clearSelection();
    }
  }

  areAllShapesColored() {
    return this.userColors.every(colors =>
      colors && colors.outer !== null && colors.inner !== null
    );
  }

  calculateResult() {
    const total = this.shapes.length * 2;
    let correct = 0;

    this.shapes.forEach((shape, index) => {
      const userColors = this.userColors[index];

      if (userColors) {
        if (userColors.outer === shape.outerColorIndex) {
          correct++;
        }

        if (userColors.inner === shape.innerColorIndex) {
          correct++;
        }
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const grade = this.getGrade(percentage);

    this.result = {
      correct,
      total,
      percentage,
      grade,
      passed: grade != GameState.GradeLevels.FAILED
    };

    return this.result;
  }

  getGrade(percentage) {
    if (percentage === 100) {
      return GameState.GradeLevels.EXCELLENT;
    } else if (percentage >= 80) {
      return GameState.GradeLevels.GOOD;
    } else if (percentage >= 60) {
      return GameState.GradeLevels.SATISFACTORY;
    } else {
      return GameState.GradeLevels.FAILED;
    } 
  }

  changePhase(newPhase) {
    this.currentPhase = newPhase;
    
    if (newPhase === GameState.GamePhases.RECALL) {
      this.stopTimer();
      this.isShowingPhase = false;
    }
  }
}