import { ShapeType } from "../game-objects/shape-types";

export class ShapeRendererBase {
  static darkenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return `#${(R * 0x10000 + G * 0x100 + B).toString(16).padStart(6, "0")}`;
  }

  static lightenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min((num >> 16) + amt, 255);
    const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
    const B = Math.min((num & 0x0000FF) + amt, 255);
    return `#${(R * 0x10000 + G * 0x100 + B).toString(16).padStart(6, "0")}`;
  }
  
  static getDefaultColor(type) {
    switch(type) {
      case ShapeType.SPHERE:
        return "#CCCCCC";
      case ShapeType.TRIANGLE:
        return "#AAAAAA";
      case ShapeType.SQUARE:
        return "#BBBBBB";
      case ShapeType.RECTANGLE:
        return "#999999";
      default:
        return "#DDDDDD";
    }
  }
}