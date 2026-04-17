import { GameScreen } from "../base/game-screen.js";
import { GameConfig } from "../config.js";
import { Button } from "../ui-components/button.js";
import { Levels } from "../config.js";
import { Title } from "../ui-components/title.js";
import { State } from "../state.js";
import { Modal } from "../ui-components/modal.js";
import { ResponsiveHelper } from "../helpers/responsiveHelper.js";

export class Galary extends GameScreen {
  constructor(ctx, state) {
    super(ctx, state);
    this.buttons = [];
    this.title = null;
    this.rewardButtons = [];
    this.unlockedRewards = [];
    this.init();
  }

  init() {
    if (this.state.rewardManager) 
      this.unlockedRewards = this.state.rewardManager.getAllUnlockedRewards();

    this.createTitle();
    this.createRewardButtons();
    this.createBackButton();
  }

  createTitle() {
    this.title = new Title(this.ctx, "Галерея наград за прохождение уровней", "Собери все!");
  }

  createRewardButtons() {
    const allLevels = Levels;

    const buttonWidth = ResponsiveHelper.getGalaryButtonSize();
    const buttonHeight = buttonWidth;
    const spacing = 20;
    const perRow = ResponsiveHelper.getGalaryRowsCount();

    this.rewardButtons = [];

    allLevels.forEach((level, index) => {
      const row = Math.floor(index / perRow);
      const col = index % perRow;

      const x = (GameConfig.WIDTH - (perRow * (buttonWidth + spacing))) / 2 +
        col * (buttonWidth + spacing);
      const y = GameConfig.HEIGHT / 2 - 250 + row * (buttonHeight + spacing);

      const levelId = `${level.id}`;
      const levelReward = this.unlockedRewards[levelId];

      const bgImage = levelReward ? this.state.rewardManager?.loadedImages.get(levelReward.id) : undefined;

      let clickHandler;
      if (bgImage)
        clickHandler = () => this.initModal(bgImage);

      const button = new Button(
        x, y, buttonWidth, buttonHeight,
        `level${level}`,
        levelId,
        {
          bgColor: "#d8d8d8",
          hoverBgColor: "#d8d8d8",
          font: 'bold 48px "Comic Sans MS"',
          cornerRadius: 25,
          borderWidth: 4,
          disabled: !levelReward,
          bgImage: bgImage,
          onClick: clickHandler
        }
      );

      this.rewardButtons.push(button);
    });
  }

  initModal(image) {
    if (this.modal)
      return;

    this.modal = new Modal(this.ctx, {
      image, 
      closeBtnHandler: () => this.closeModal()
    });
  }

  closeModal() {
    this.modal = undefined;
  }

  createBackButton() {
    const buttonWidth = Math.max(320, GameConfig.WIDTH / 6);
    const buttonHeight = Math.max(60, GameConfig.HEIGHT / 18);
    const startX = (GameConfig.WIDTH - buttonWidth) / 2;

    const lastLevelButton = this.rewardButtons[this.rewardButtons.length - 1]
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

  update() { 
    this.time = Date.now();

    this.rewardButtons.forEach((rewardButton, index) => {
      rewardButton.update(index, this.time, rewardButton.x, rewardButton.y, rewardButton.width, rewardButton.height);
    });

    this.buttons.forEach((button, index) => {
      button.update(index, this.time, button.x, button.y, button.width, button.height);
    });
  }

  render() { 
    this.update();

    this.title.render();
    
    this.rewardButtons.forEach(button => {
      button.render(this.ctx);
    });
    
    this.buttons.forEach(button => {
      button.render(this.ctx);
    });

    if (this.modal)
      this.modal.render();
  }

  handleMouseMove(x, y) {
    this.rewardButtons.forEach(button => {
      button.isHovered = button.containsPoint(x, y);
    });

    this.buttons.forEach(button => {
      button.isHovered = button.containsPoint(x, y);
    });
  }

  handleMouseClick(x, y) {
    this.rewardButtons.forEach(button => {
      if (button.containsPoint(x, y) && button.onClick) {
        button.onClick();
      }
    });

    this.buttons.forEach(button => {
      if (button.containsPoint(x, y) && button.onClick) {
        button.onClick();
      }
    });

    if(this.modal && this.modal.closeBtnHandler && this.modal.containCloseButtonPoint(x, y))
      this.modal.closeBtnHandler();
  }
}