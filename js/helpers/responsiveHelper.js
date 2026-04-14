import { GameConfig } from "../config.js";

export class ResponsiveHelper
{
  static getTitleSize() {
    if (GameConfig.WIDTH >= 1280)
      return 68;
    if (GameConfig.WIDTH >= 1024)
      return 42;
    if (GameConfig.WIDTH >= 820)
      return 32;
    if (GameConfig.WIDTH >= 768)
      return 32;
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

    return 140;
  }

  static getModalWidth() {
    if (GameConfig.WIDTH >= 1280)
      return 800;
    if (GameConfig.WIDTH >= 1024)
      return 800;
    if (GameConfig.WIDTH >= 820)
      return 600;

    return 600;
  }

  static getActualColumnShapesSpace() {
    if (GameConfig.HEIGHT >= 1180)
      return 60;
    if (GameConfig.HEIGHT >= 1024)
      return 40;

    return 80;
  }
}