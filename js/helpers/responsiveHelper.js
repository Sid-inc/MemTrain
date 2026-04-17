import { GameConfig } from "../config.js";

export class ResponsiveHelper {
  static getTitleSize() {
    if (GameConfig.WIDTH >= 1280)
      return 68;
    if (GameConfig.WIDTH >= 1024)
      return 42;
    if (GameConfig.WIDTH >= 820)
      return 32;
    if (GameConfig.WIDTH >= 768)
      return 32;
    if (GameConfig.WIDTH >= 430)
      return 18;
    if (GameConfig.WIDTH >= 390)
      return 18;
    return 18;
  }

  static getSubTitleSize() {
    if (GameConfig.WIDTH >= 430)
      return 28;
    if (GameConfig.WIDTH >= 390)
      return 20;
    return 20;
  }

  static getGalaryButtonSize() {
    if (GameConfig.WIDTH >= 1280)
      return 180;
    if (GameConfig.WIDTH >= 1024)
      return 172;
    if (GameConfig.WIDTH >= 820)
      return 136;
    if (GameConfig.WIDTH >= 768)
      return 120;
    if (GameConfig.WIDTH >= 430)
      return 60;
    if (GameConfig.WIDTH >= 390)
      return 60;
    return 60;
  }

  static getGalaryRowsCount() {
    if (GameConfig.WIDTH >= 430)
      return 5;
    if (GameConfig.WIDTH >= 390)
      return 4;
    return 4;
  }

  static getLevesButtonsSize() {
    if (GameConfig.WIDTH >= 1280)
      return 140;
    if (GameConfig.WIDTH >= 1024)
      return 132;
    if (GameConfig.WIDTH >= 820)
      return 124;
    if (GameConfig.WIDTH >= 768)
      return 112;
    if (GameConfig.WIDTH >= 430)
      return 60;
    if (GameConfig.WIDTH >= 390)
      return 60;

    return 60;
  }

  static getLevesRowsCount() {
    if (GameConfig.WIDTH >= 430)
      return 5;
    if (GameConfig.WIDTH >= 390)
      return 4;
    return 4;
  }

  static getModalWidth() {
    if (GameConfig.WIDTH >= 1280)
      return 800;
    if (GameConfig.WIDTH >= 1024)
      return 800;
    if (GameConfig.WIDTH >= 820)
      return 600;
    if (GameConfig.WIDTH >= 430)
      return 380;
    if (GameConfig.WIDTH >= 390)
      return 360;

    return 360;
  }

  static getActualColumnShapesSpace() {
    if (GameConfig.HEIGHT >= 1180)
      return 60;
    if (GameConfig.HEIGHT >= 1024)
      return 40;
    if (GameConfig.HEIGHT >= 932)
      return 25;
    if (GameConfig.HEIGHT >= 844)
      return 25;

    return 25;
  }

  static getLevelButtonsFontSize() {
    if (GameConfig.WIDTH >= 820)
      return 48;
    if (GameConfig.WIDTH >= 430)
      return 32;
    if (GameConfig.WIDTH >= 390)
      return 32;
    return 32;
  }

  static getInstructionFontSize() {
    if (GameConfig.WIDTH >= 820)
      return 24;
    if (GameConfig.WIDTH >= 430)
      return 20;
    if (GameConfig.WIDTH >= 390)
      return 18;
    return 18;
  }

  static getStarSize() {
    if (GameConfig.WIDTH >= 820)
      return 70;
    if (GameConfig.WIDTH >= 430)
      return 15;
    if (GameConfig.WIDTH >= 390)
      return 15;

    return 15;
  }

  static getResultPanelParams() {
    if (GameConfig.WIDTH >= 820)
      return {
        panelWidth: 600,
        statFontSize: 36,
        titleFontSize: 48,
        buttonWidth: 225,
        buttonHeight: 70
      };
    if (GameConfig.WIDTH >= 430)
      return {
        panelWidth: 380,
        statFontSize: 20,
        titleFontSize: 32,
        buttonWidth: 172,
        buttonHeight: 50
      };

    if (GameConfig.WIDTH >= 390)
      return {
        panelWidth: 360,
        statFontSize: 20,
        titleFontSize: 24,
        buttonWidth: 172,
        buttonHeight: 50
      };

    return {
      panelWidth: 360,
      statFontSize: 20,
      titleFontSize: 24,
      buttonWidth: 172,
      buttonHeight: 50
    };
  }

  static getTimerParams() {
    if (GameConfig.WIDTH >= 820)
      return {
        topOffset: 40,
        width: 400,
      };

    if (GameConfig.WIDTH >= 430)
      return {
        topOffset: 40,
        width: 400,
      };

    if (GameConfig.WIDTH >= 390)
      return {
        topOffset: 8,
        width: 380,
      };

    return {
      topOffset: 8,
      width: 360,
    };
  }

  static getShapesSize() {
    if (GameConfig.HEIGHT >= 844)
      return 220;
    if (GameConfig.HEIGHT >= 667)
      return 160;

    return 180;
  }
}