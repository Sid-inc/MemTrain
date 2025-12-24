export class ShapeNode {
  constructor(type, colorIndex, options = {}) {
    this.type = type;
    this.colorIndex = colorIndex;
    this.position = options.position || { x: 0, y: 0 };
    this.size = options.size || 100;
    this.rotation = options.rotation || 0;
    this.children = options.children || [];
    this.parent = null;
    this.level = options.level || 0;
    this.id = options.id || Math.random().toString(36).substr(2, 9);
    
    // Пока не используем, но готовим структуру
    this.isComposite = Array.isArray(type);
    this.layout = options.layout || 'vertical';
  }
}