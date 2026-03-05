import { UserStorage } from "./user-data/user-storage.js";
import { RewardsConfig } from "./config.js";

export class RewardManager {
  constructor() {
    this.availableRewards = [];
    this.unlockedRewards = new Set();
    this.loadedImages = new Map();
    this.isInitialized = false;
    this.loadProgress = 0; // 0-100
    this.totalToLoad = 0;
    this.loadedCount = 0;

    this.geavingReward = null;
    this.needToGiaveReward = false;
  }

  // Инициализация при загрузке игры
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.availableRewards = RewardsConfig.rewards;
      this.totalToLoad = this.availableRewards.length;
      
      const savedRewards = UserStorage.getUnlockedRewards() || [];
      this.unlockedRewards = new Set(savedRewards.map(r => r.id));
      
      await this.preloadRewardImages();
      
      this.isInitialized = true;
      console.log('RewardManager initialized');
    } catch (error) {
      console.error('Failed to initialize RewardManager:', error);
    }
  }

  async preloadRewardImages() {
    this.loadProgress = 0;
    this.loadedCount = 0;

    const preloadPromises = this.availableRewards.map(reward => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.loadedImages.set(reward.id, img);
          this.loadedCount++;
          this.loadProgress = Math.floor((this.loadedCount / this.totalToLoad) * 100);
          
          resolve(img);
        };
        img.onerror = () => {
          console.warn(`Failed to load reward image: ${reward.imagePath}`);
          this.loadedCount++;
          this.loadProgress = Math.floor((this.loadedCount / this.totalToLoad) * 100);
          resolve(null);
        };
        img.src = reward.imagePath;
      });
    });
    
    await Promise.all(preloadPromises);
  }

  getRandomUnlockedReward() {
    const unlockedForLevel = this.getUnlockedRewards();
    const availableRewards = this.availableRewards.filter(
      reward => !unlockedForLevel.has(reward.id)
    );
    
    if (availableRewards.length === 0) {
      return null; // Все награды уже получены
    }
    
    const randomIndex = Math.floor(Math.random() * availableRewards.length);
    return availableRewards[randomIndex];
  }

  getProgress() {
    return {
      progress: this.loadProgress,
      loaded: this.loadedCount,
      total: this.totalToLoad
    };
  }

  // Выдача награды за уровень
  unlockReward(rewardId, levelId) {
    const reward = this.availableRewards.find(r => r.id === rewardId);
    if (!reward) return false;
    
    this.unlockedRewards.add(rewardId);
    
    // Сохраняем информацию о выданной награде
    UserStorage.addUnlockedReward({
      id: rewardId,
      levelId: levelId,
      unlockedAt: new Date().toISOString(),
      name: reward.name,
      imagePath: reward.imagePath
    });
    
    return true;
  }

  // Получение всех полученных наград
  getAllUnlockedRewards() {
    return Array.from(this.unlockedRewards).map(id => 
      this.availableRewards.find(r => r.id === id)
    ).filter(Boolean);
  }

  // Получение наград для конкретного уровня
  getUnlockedRewardsForLevel(levelId) {
    const allUnlocked = UserStorage.getUnlockedRewards() || [];
    const levelRewards = allUnlocked
      .filter(reward => reward.levelId === levelId)
      .map(reward => reward.id);
    
    return new Set(levelRewards);
  }

  getUnlockedRewards() {
    const allUnlocked = UserStorage.getUnlockedRewards() || [];
    const levelRewards = allUnlocked
      .map(reward => reward.id);
    
    return new Set(levelRewards);
  }

  // Проверка, была ли уже выдана награда за этот уровень
  hasUnlockedRewardForLevel(levelId) {
    const levelRewards = this.getUnlockedRewardsForLevel(levelId);
    return levelRewards.size > 0;
  }
  
  setReward(reward)
  {
    this.geavingReward = reward;
    this.needToGiaveReward = true;
  }
}