import { Game } from "./screens/game.js";
import { Menu } from "./screens/menu.js";
import { GameManager } from "./game-manager.js";
import { UserStorage } from "./user-data/user-storage.js";
import { Levels } from "./config.js";
import { LevelsList } from "./screens/levels-list.js";
import { RewardManager } from "./reward-manager.js";
import { Loading } from "./screens/loading.js";
import { Reward } from "./screens/reward.js";
import { Galary } from "./screens/galary.js";

export class State {
  constructor(ctx, soundManager) {
    this.ctx = ctx;
    this.UIState = State.UIStates.LOADING;
    this.soundManager = soundManager;
    this.rewardManager = new RewardManager();
    this.activeScreen = new Loading(this.ctx, this, this.rewardManager, this.soundManager);
  }

  static UIStates = {
    LOADING: "LOADING",
    MENU: "MENU",
    LEVELS: "LEVELS",
    GALARY: "GALARY",
    GAME: "GAME",
    REWARD: "REWARD"
  };

  static GradeLevels = {
    EXCELLENT: 'excellent',       // 100%
    GOOD: 'good',                 // 80-99%
    SATISFACTORY: 'satisfactory', // 60-79%
    FAILED: 'failed'              // <60%
  };


  setState(newState, levelId) {
    if (Object.values(State.UIStates).includes(newState)) {
      this.UIState = newState;

      switch (this.UIState) {
        case State.UIStates.LOADING:
          this.activeScreen = new Loading(this.ctx, this, this.rewardManager, this.soundManager);
          break;
        case State.UIStates.MENU:
          this.activeScreen = new Menu(this.ctx, this, this.soundManager);
          break;
        case State.UIStates.GAME:
          var id = levelId ?? this.getRelevantLevelId();
          const gameManager = new GameManager(id, this.rewardManager, this.soundManager);
          this.activeScreen = new Game(this.ctx, this, gameManager);
          break;
        case State.UIStates.LEVELS:
          this.activeScreen = new LevelsList(this.ctx, this, this.soundManager);
          break;
        case State.UIStates.REWARD:
          this.activeScreen = new Reward(this.ctx, this, this.rewardManager.givingReward, levelId);
          break;
        case State.UIStates.GALARY:
          this.activeScreen = new Galary(this.ctx, this, this.soundManager);
          break;
      }

      console.log(`State changed to: ${newState}`);
    }
  }

  static getGradeConfig(grade) {
    switch (grade) {
      case State.GradeLevels.EXCELLENT:
        return {
          title: 'ОТЛИЧНО!',
          subtitle: 'Идеальный результат!',
          emoji: '🎉🎊✨',
          color: '#FFD700',
          stars: 3
        };
      case State.GradeLevels.GOOD:
        return {
          title: 'ХОРОШО!',
          subtitle: 'Отличная работа!',
          emoji: '👍🌟😊',
          color: '#4ECDC4',
          stars: 2
        };
      case State.GradeLevels.SATISFACTORY:
        return {
          title: 'УДОВЛЕТВОРИТЕЛЬНО',
          subtitle: 'Можно лучше!',
          emoji: '👏💪',
          color: '#FF6B8B',
          stars: 1
        };
      case State.GradeLevels.FAILED:
        return {
          title: 'ПОПРОБУЙТЕ ЕЩЁ',
          subtitle: 'Не сдавайтесь!',
          emoji: '😢💪🌟',
          color: '#888888',
          stars: 0
        };
      default:
        return {
          title: 'РЕЗУЛЬТАТ',
          subtitle: '',
          emoji: '🎯',
          color: '#4a6fa5',
          stars: 0
        };
    }
  }

  getRelevantLevelId() {
    const results = UserStorage.getAllLevelResults();
    return results ? this.calculateLevelId(results) : 1;
  }

  calculateLevelId(results) {
    const nextLevel = this.getNextUncompletedLevel(results);
    if (nextLevel) return nextLevel;

    const notPerfectLevel = this.getNotPerfectLevel(results);
    return notPerfectLevel || 1;
  }

  getNextUncompletedLevel(results) {
    const completedIds = Object.keys(results).map(Number);
    if (completedIds.length === 0) return null;

    const maxCompleted = Math.max(...completedIds);
    const maxLevelId = Math.max(...Levels.map(x => x.id));
    const nextLevel = maxCompleted + 1;

    return nextLevel <= maxLevelId ? nextLevel : null;
  }

  getNotPerfectLevel(results) {
    const entry = Object.entries(results)
      .find(([, result]) => result.bestGrade !== State.GradeLevels.EXCELLENT.toLowerCase());
    return entry ? parseInt(entry[0]) : null;
  }
}