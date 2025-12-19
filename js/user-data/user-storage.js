export class UserStorage {
  static STORAGE_KEY = 'memory_train_game_data';
  
  static saveLevelResult(levelId, result) {
    try {
      const data = this.loadGameData();
      
      if (!data.levels) {
        data.levels = {};
      }
      
      data.levels[levelId] = {
        result,
        timestamp: Date.now(),
        bestGrade: this.getBestGrade(data.levels[levelId]?.result, result)
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving level result:', error);
      return false;
    }
  }
  
  static getLevelResult(levelId) {
    try {
      const data = this.loadGameData();
      return data.levels?.[levelId] || null;
    } catch (error) {
      console.error('Error loading level result:', error);
      return null;
    }
  }
  
  static getAllLevelResults() {
    try {
      const data = this.loadGameData();
      return data.levels || {};
    } catch (error) {
      console.error('Error loading all level results:', error);
      return {};
    }
  }
  
  static getBestGrade(previousResult, newResult) {
    if (!previousResult) return newResult.grade;
    
    const gradeOrder = {
      'failed': 0,
      'satisfactory': 1,
      'good': 2,
      'excellent': 3
    };
    
    return gradeOrder[newResult.grade] > gradeOrder[previousResult.grade] 
      ? newResult.grade 
      : previousResult.grade;
  }
  
  static loadGameData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {
        levels: {},
        settings: {},
        stats: {
          totalGames: 0,
          totalCorrect: 0,
          averageScore: 0
        }
      };
    } catch (error) {
      console.error('Error loading game data:', error);
      return {
        levels: {},
        settings: {},
        stats: {
          totalGames: 0,
          totalCorrect: 0,
          averageScore: 0
        }
      };
    }
  }
  
  static saveGameData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving game data:', error);
      return false;
    }
  }
  
  static updateStats(result) {
    try {
      const data = this.loadGameData();
      
      if (!data.stats) {
        data.stats = {
          totalGames: 0,
          totalCorrect: 0,
          totalPoints: 0
        };
      }
      
      data.stats.totalGames++;
      data.stats.totalCorrect += result.correct;
      data.stats.totalPoints += result.percentage;
      data.stats.averageScore = Math.round(data.stats.totalPoints / data.stats.totalGames);
      
      this.saveGameData(data);
      return data.stats;
    } catch (error) {
      console.error('Error updating stats:', error);
      return null;
    }
  }
  
  static clearData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing game data:', error);
      return false;
    }
  }
  
  static getStats() {
    try {
      const data = this.loadGameData();
      return data.stats || {
        totalGames: 0,
        totalCorrect: 0,
        averageScore: 0
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalGames: 0,
        totalCorrect: 0,
        averageScore: 0
      };
    }
  }
}