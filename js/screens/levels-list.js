import { Levels } from "../config.js";
import { GameScreen } from "../base/game-screen.js";
import { GameConfig } from "../config.js";
import { UserStorage } from "../user-data/user-storage.js";
import { Button } from "../ui-components/button.js";
import { Title } from "../ui-components/title.js";
import { State } from "../state.js";
import { ResponsiveHelper } from "../helpers/responsiveHelper.js";

export class LevelsList extends GameScreen {
  constructor(ctx, state, soundManager) {
    super(ctx, state);
    this.buttons = [];
    this.title = null;
    this.levelButtons = [];
    this.soundManager = soundManager;
    this.init();
  }

  init() {
    this.createTitle();
    this.createLevelButtons();
    this.createBackButton();
  }

  createTitle() {
    this.title = new Title(this.ctx, "Выбор уровня", "Собери звёзды!");
  }

  createLevelButtons() {
    const allLevels = Levels;
    const userResults = UserStorage.getAllLevelResults();

    const buttonWidth = ResponsiveHelper.getLevesButtonsSize();
    const buttonHeight = buttonWidth;
    const spacing = 25;
    const perRow = ResponsiveHelper.getLevesRowsCount();
    
    this.levelButtons = [];
    
    allLevels.forEach((level, index) => {
      const fontSize = ResponsiveHelper.getLevelButtonsFontSize();
      const row = Math.floor(index / perRow);
      const col = index % perRow;
      
      const x = (GameConfig.WIDTH - (perRow * (buttonWidth + spacing))) / 2 + 
                col * (buttonWidth + spacing);
      const y = GameConfig.HEIGHT / 2 - 250 + row * (buttonHeight + spacing);
      
      const savedResult = userResults[level.id];
      
      let levelText = `${level.id}`;

      var grade = savedResult ? savedResult.bestGrade || savedResult.result?.grade : null;

      const button = new Button(
        x, y, buttonWidth, buttonHeight,
        `${level}`,
        levelText,
        {
          bgColor: this.getBackground(level),
          hoverBgColor: this.getLevelHoverColor(level),
          textColor: "#FFFFFF",
          font: `bold ${fontSize}px "Comic Sans MS"`,
          cornerRadius: 25,
          borderWidth: 4,
          badgePosition: 'bottom',
          showStars: true,
          starsGrade: grade,
          onClick: this.levelButtonHnadler(level.id)
        }
      );
      
      this.levelButtons.push(button);
    });
  }

  getBackground(level) {
    if (level?.difficulty) {
      switch(level.difficulty) {
        case 1:
          return '#4ECDC4';
        case 2:
          return '#9D4EDD';
        case 3:
          return '#FF6B8B';
      }
    }

    return '#4ECDC4';
  }

  getLevelHoverColor(level) {
    if (level?.difficulty) {
      switch(level.difficulty) {
        case 1:
          return '#4ECDD7';
        case 2:
          return '#9D4EEF';
        case 3:
          return '#FF6BAF';
      }
    }

    return '#4ECDC4';
  }

  createBackButton() {
    const buttonWidth = Math.max(320, GameConfig.WIDTH / 6);
    const buttonHeight = Math.max(60, GameConfig.HEIGHT / 18);
    const startX = (GameConfig.WIDTH - buttonWidth) / 2;

    const lastLevelButton = this.levelButtons[this.levelButtons.length - 1]
    const startY = lastLevelButton.y + lastLevelButton.height + 60;

    const button = new Button(
      startX, startY, buttonWidth, buttonHeight,
      "back",
      "← Назад",
      {
        bgColor: '#888888',
        hoverBgColor: '#AAAAAA',
        textColor: "#FFFFFF",
        font: 'bold 24px "Comic Sans MS"',
        cornerRadius: 15,
        borderWidth: 3,
        onClick: () => this.state.setState(State.UIStates.MENU)
      }
    );
    
    this.buttons = [button];
  }


  levelButtonHnadler(levelId){
    const state = this.state;
    return function buttonHnadler()
    {
      state.setState(State.UIStates.GAME, levelId);
    }
  }

  update() { 
    this.time = Date.now();

    this.levelButtons.forEach((levelButton, index) => {
      levelButton.update(index, this.time, levelButton.x, levelButton.y, levelButton.width, levelButton.height);
    });

    this.buttons.forEach((button, index) => {
      button.update(index, this.time, button.x, button.y, button.width, button.height);
    });
  }

  render() { 
    this.update();

    this.title.render();
    
    this.levelButtons.forEach(button => {
      button.render(this.ctx);
    });
    
    this.buttons.forEach(button => {
      button.render(this.ctx);
    });
  }

  handleMouseMove(x, y) {
    this.levelButtons.forEach(button => {
      button.isHovered = button.containsPoint(x, y);
    });

    this.buttons.forEach(button => {
      button.isHovered = button.containsPoint(x, y);
    });
  }

  handleMouseClick(x, y) {
    this.levelButtons.forEach(button => {
      if (button.containsPoint(x, y) && button.onClick) {
        button.onClick();
      }
    });

    this.buttons.forEach(button => {
      if (button.containsPoint(x, y) && button.onClick) {
        this.soundManager.play('click');
        button.onClick();
      }
    });
  }
}