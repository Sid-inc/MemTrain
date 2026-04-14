import { GameEngine } from "./game-objects/engine.js";
import { GameState } from "./game-state.js";
import { UserStorage } from "./user-data/user-storage.js";
import { Levels, GameConfig } from "./config.js";

export class GameManager {
  constructor(levelId, rewardManager) {
    this.rewardManager = rewardManager;
    this.engine = null;
    this.gameLoopId = null;
    this.gameState = null;
    this.levelId = levelId;

    this.colorPalette = null;
    this.resultPanel = null;

    this.startLevel(levelId);
  }

  startLevel(levelId) {
    const levelConfig = Levels.find(level => level.id === levelId) || Levels[0];
    const availableArea = {
      width: GameConfig.WIDTH,
      height: GameConfig.HEIGHT
    };

    this.engine = new GameEngine(levelConfig);
    this.gameState = this.engine.initialize(availableArea);
    
    this.engine.onPhaseChange = (phase) => {
      console.log(`Фаза изменилась на: ${phase}`);
    };
    
    this.engine.onResult = (result) => {
      console.log("Результат уровня:", result);
      UserStorage.saveLevelResult(levelId, result);
      UserStorage.updateStats(result);

          //TODO: сделать после showLevelResults
      if (result.percentage === 100 && 
          !this.rewardManager.hasUnlockedRewardForLevel(levelConfig.id)) {
        
        const reward = this.rewardManager.getRandomUnlockedReward(levelConfig.id);
        
        if (reward) {
          this.rewardManager.unlockReward(reward.id, levelConfig.id);
          

          this.rewardManager.setReward({reward, result});
        }
      }
    };
  }

  update()
  {
    this.engine.update();
  }

  handleGameClick(x, y) {
    if (!this.engine) return null;
    
    // Проверяем клик по палитре цветов
    const colorIndex = this.colorPalette.isColorClicked(x, y);
    
    if (colorIndex !== -1) {
      const result = this.engine.selectColor(colorIndex);
      this.colorPalette.hide();
      return result;
    }
    
    // Проверяем клик по фигуре
    const clickResult = this.engine.handleClick(x, y);
    if (clickResult && clickResult.type === "SHAPE_SELECTED") {
      return clickResult;
    }
    
    if (this.resultPanel.isMenuButtonClicked(x, y)) {
      this.resetEngine();
      const nextStep = this.rewardManager.needToGiaveReward ? "GIVE_REWARD_THEN_MENU" : "RETURN_TO_MENU"
      return { type: nextStep };
    }

    if (this.resultPanel.isNextButtonClicked(x, y)) {
      this.resetEngine();
      const nextStep = this.rewardManager.needToGiaveReward ? "GIVE_REWARD_THEN_NEXT" : "NEXT_LEVEL"
      return { type: nextStep };
    }
    
    if (this.gameState.selectedShape)
      this.gameState.clearSelection();

    return null;
  }

  resetEngine() {
    if (this.engine) {
      this.engine.reset();
    }
    
    this.engine = null;
  }

  getGameData() {
    if (!this.engine) return null;

    const gameData = this.engine.getGameData();

    if (gameData.state && gameData.state.currentPhase === GameState.GamePhases.RESULT) {
      const savedResult = UserStorage.getLevelResult(gameData.state.levelConfig.id);
      if (savedResult) {
        gameData.savedResult = savedResult;
      }
    }

    return gameData;
  }
}