import { GameScreen } from "../base/game-screen.js";
import { GameConfig } from "../config.js";
import { State } from "../state.js";

export class Loading extends GameScreen {
  constructor(ctx, state, rewardManager, soundManager) {
    super(ctx, state);
    this.rewardManager = rewardManager;
    this.soundManager = soundManager;
    this.progress = 0;
    this.loaded = 0;
    this.total = 0;
    this.isComplete = false;
    this.message = "Загрузка...";

    this.init();
  }

  async init(){
    await this.initSounds();
    this.rewardManager.initialize();
    this.updateProgress(100, 0, 0);
  }

  async initSounds(){
    const soundList = [
      { name: 'click', url: './sounds/click.mp3' },
      { name: 'win',   url: './sounds/win.mp3' },
      { name: 'setColor', url: './sounds/color.mp3' },
      { name: 'lose', url: './sounds/lose.mp3' }
    ];
    let loadedSounds = 0;
    const totalSounds = soundList.length;
    // Обновляем прогресс по мере загрузки звуков
    for (const s of soundList) {
      await this.soundManager.load(s.name, s.url);
      loadedSounds++;
      const soundProgress = (loadedSounds / totalSounds) * 30; // 30% от прогресса на звуки
      // предположим, rewardManager даёт прогресс 0..70, прибавим звуки
      // но лучше управлять прогрессом вручную
      this.updateProgress(soundProgress + 0, 0, 0); // упрощённо
    }
  }

  updateProgress(progress, loaded, total) {
    this.progress = progress;
    this.loaded = loaded;
    this.total = total;
    
    if (progress >= 100 && !this.isComplete) {
      this.isComplete = true;
    }
  }

  render() {
    const {progress, loaded, total} = this.rewardManager.getProgress()
    this.updateProgress(progress, loaded, total);

    const { ctx } = this;
    const width = GameConfig.WIDTH;
    const height = GameConfig.HEIGHT;
    
    // Заголовок
    ctx.fillStyle = '#68004e';
    ctx.textAlign = 'center';
    ctx.font = '24px "Comic Sans MS"';
    ctx.fillText(this.message, width / 2, height / 2 - 40);
    
    // Прогресс-бар фон
    const barWidth = width * 0.6;
    const barHeight = 30;
    const barX = (width - barWidth) / 2;
    const barY = height / 2;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Прогресс
    const progressWidth = (barWidth * this.progress) / 100;
    const gradient = ctx.createLinearGradient(barX, barY, barX + progressWidth, barY);
    gradient.addColorStop(0, '#f893c6');
    gradient.addColorStop(1, '#f84961');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY, progressWidth, barHeight);

    
    if (this.isComplete) {
      this.state.setState(State.UIStates.MENU);
    }
  }
}