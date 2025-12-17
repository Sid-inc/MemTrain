export class Button {
  constructor(x, y, width, height, value, text, options = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.value = value;
    this.text = text;
    this.isHovered = false;
    this.isPressed = false;
    this.pulse = 0;

    // Яркие детские цвета
    this.colors = options.colors || [
      { bg: "#FF6B8B", hover: "#FF8FA8" },  // Розовый
      { bg: "#4ECDC4", hover: "#7CDFD7" },  // Бирюзовый
      { bg: "#FFD166", hover: "#FFDD8F" },  // Желтый
      { bg: "#06D6A0", hover: "#38E0B8" },  // Зеленый
      { bg: "#118AB2", hover: "#2AA0CC" },  // Синий
      { bg: "#EF476F", hover: "#F56B8E" },  // Красный
      { bg: "#9D4EDD", hover: "#B16FE5" }   // Фиолетовый
    ];

    // Выбираем случайный цвет из палитры
    const colorIndex = Math.floor(Math.random() * this.colors.length);
    this.bgColor = options.bgColor || this.colors[colorIndex].bg;
    this.hoverBgColor = options.hoverBgColor || this.colors[colorIndex].hover;

    // Дополнительные стили
    this.textColor = options.textColor || "#FFFFFF";
    this.font = options.font || 'bold 28px "Comic Sans MS", cursive, sans-serif';
    this.cornerRadius = options.cornerRadius || 25;
    this.borderColor = options.borderColor || "#FFFFFF";
    this.borderWidth = options.borderWidth || 4;
    this.shadowColor = options.shadowColor || "rgba(0, 0, 0, 0.2)";
    this.shadowBlur = options.shadowBlur || 8;
    this.shadowOffset = options.shadowOffset || 4;
    this.sparkles = options.sparkles !== false; // Блестки по умолчанию включены

    // Блестки - фиксированные позиции и состояние
    this.sparkleData = [];
    this.initSparkles();

    // Callback
    this.onClick = options.onClick || (() => { });
  }

  containsPoint(x, y) {
    return x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height;
  }

  initSparkles() {
    // Создаем фиксированные блестки в разных позициях
    this.sparkleData = [];
    const numSparkles = 6;

    for (let i = 0; i < numSparkles; i++) {
      this.sparkleData.push({
        x: Math.random() * 0.8 + 0.1, // Относительная позиция внутри кнопки (10%-90%)
        y: Math.random() * 0.6 + 0.2, // Центрируем по вертикали
        size: Math.random() * 3 + 2,  // Размер 2-5px
        speed: Math.random() * 0.03 + 0.01, // Скорость мерцания
        phase: Math.random() * Math.PI * 2, // Начальная фаза
        active: false
      });
    }
  }

  update(time) {
    // Пульсация кнопки
    this.pulse = Math.sin(time * 0.002) * 0.05;

    // Обновляем блестки только если кнопка в hover
    if (this.isHovered) {
      this.sparkleData.forEach(sparkle => {
        sparkle.active = true;
        sparkle.phase += sparkle.speed;
      });
    } else {
      // Плавно выключаем блестки
      this.sparkleData.forEach(sparkle => {
        if (sparkle.phase > 0) {
          sparkle.phase -= 0.1;
          if (sparkle.phase <= 0) {
            sparkle.active = false;
            sparkle.phase = 0;
          }
        }
      });
    }
  }

  render(ctx) {
    ctx.save();

    // Пульсирующий эффект при наведении
    const pulseScale = this.isHovered ? 1 + this.pulse : 1;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.translate(centerX, centerY);
    ctx.scale(pulseScale, pulseScale);
    ctx.translate(-centerX, -centerY);

    // Эффект нажатия
    const pressOffset = this.isPressed ? 3 : 0;

    // Основная тень
    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = this.shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = pressOffset + this.shadowOffset;

    // Фон кнопки с градиентом
    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x, this.y + this.height
    );
    gradient.addColorStop(0, this.isHovered ? this.hoverBgColor : this.bgColor);
    gradient.addColorStop(1, this.darkenColor(this.isHovered ? this.hoverBgColor : this.bgColor, 20));

    // Рисуем фон
    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Скругленные углы с дополнительным радиусом для детского стиля
    const actualRadius = Math.min(this.cornerRadius, this.height / 2, this.width / 2);
    this.roundRect(ctx, this.x, this.y + pressOffset, this.width, this.height, actualRadius);
    ctx.fill();

    // Контур кнопки
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = this.borderWidth;
    ctx.stroke();

    // Внутренняя подсветка
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const innerGradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x, this.y + this.height / 2
    );
    innerGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    innerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = innerGradient;
    ctx.beginPath();
    this.roundRect(
      ctx,
      this.x + 2,
      this.y + 2 + pressOffset,
      this.width - 4,
      this.height / 2,
      actualRadius - 2
    );
    ctx.fill();

    // Блестки (только при наведении и с плавным мерцанием)
    if (this.sparkles) {
      this.drawSparkles(ctx, this.x, this.y + pressOffset, this.width, this.height);
    }

    // Текст с контуром
    ctx.fillStyle = this.textColor;
    ctx.font = this.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Контур текста
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 3;
    ctx.strokeText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2 + pressOffset
    );

    // Основной текст
    ctx.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2 + pressOffset
    );

    // Маленькая тень под текстом для объемности
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillText(
      this.text,
      this.x + this.width / 2 + 2,
      this.y + this.height / 2 + pressOffset + 2
    );

    ctx.restore();
  }

  // Вспомогательная функция для скругленных прямоугольников
  roundRect(ctx, x, y, width, height, radius) {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
    }
  }

  // Функция для затемнения цвета
  darkenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;

    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  }

  // Рисуем блестки с плавным мерцанием
  drawSparkles(ctx, x, y, width, height) {
    ctx.save();

    this.sparkleData.forEach(sparkle => {
      if (!sparkle.active) return;

      // Плавное мерцание с использованием синуса
      const alpha = 0.3 + Math.sin(sparkle.phase) * 0.3;
      if (alpha <= 0) return;

      // Абсолютные координаты
      const absX = x + sparkle.x * width;
      const absY = y + sparkle.y * height;
      const size = sparkle.size * (0.8 + Math.sin(sparkle.phase * 1.5) * 0.2);

      // Основная блестка
      ctx.beginPath();
      ctx.arc(absX, absY, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      // Небольшие лучики (рисуем не всегда, а с вероятностью)
      if (Math.sin(sparkle.phase * 2) > 0.5) {
        ctx.beginPath();
        ctx.moveTo(absX - size * 1.5, absY);
        ctx.lineTo(absX + size * 1.5, absY);
        ctx.moveTo(absX, absY - size * 1.5);
        ctx.lineTo(absX, absY + size * 1.5);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  // Для анимации нажатия
  press() {
    this.isPressed = true;
    setTimeout(() => {
      this.isPressed = false;
    }, 150);
  }
}