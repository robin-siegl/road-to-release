import type { Game } from "./Game";

/**
 * Enum of different available World Object Types
 */
export enum WorldObjectType {
  /** The Famous Wall of Text */
  Wall = 'Wall',
  /** Requirement changes */
  Requirements = 'Requirements',
  /** Increasing Bugs are never good */
  Bugs = 'Bugs',
  /** Big Cheese always has good new feature ideas */
  BigCheese = 'BigCheese',
}

/**
 * World Object
 */
export class WorldObject {
  /** Default Object movement speed */
  static SPEED = 2;

  /** Game reference */
  private game: Game;
  /** Object Type */
  private type: WorldObjectType;

  /** Object x position */
  private x: number;

  /** Animation slide id */
  private animationId = 0;
  /** Animation Slides */
  private animation: Array<HTMLImageElement>;

  constructor(game: Game, type: WorldObjectType) {
    this.game = game;
    this.type = type;
    this.animation = this.game.AssetManager.getAnimationWorldObjects(type);
    this.x = this.game.width;
  }

  /**
   * Get points you get by type
   */
  public get points(): number {
    switch(this.type) {
      case WorldObjectType.Wall:
        return 5;
      case WorldObjectType.Bugs:
        return 10;
      case WorldObjectType.Requirements:
        return 25;
      case WorldObjectType.BigCheese:
        return 60;
    }
  }

  /**
   * Get current x space left to 0 coordinate
   */
  public get left(): number {
    return this.x + this.width;
  }

  /**
   * Get World Object y position by type
   */
  public get y(): number {
    return (this.game.height * 0.75) - this.height;
  }

  /**
   * Get World Object height by type
   */
  public get height(): number {
    switch(this.type) {
      case WorldObjectType.Wall:
      case WorldObjectType.Requirements:
        return 32;
      case WorldObjectType.Bugs:
      case WorldObjectType.BigCheese:
        return 64;
    }
  }

  /**
   * Get World Object width by type
   */
  public get width(): number {
    switch(this.type) {
      case WorldObjectType.Bugs:
        return 16;
      case WorldObjectType.Wall:
        return 32
      case WorldObjectType.Requirements:
      case WorldObjectType.BigCheese:
        return 64;
    }
  }

  /**
   * Get movement speed of world object
   */
  public get speed(): number {
    const minutes = this.game.gameTime / 60;
    const multiplier = Math.min(4.5, 1 + minutes * 0.15);

    return WorldObject.SPEED * multiplier;
  }

  /**
   * Draw World Object Sprite by type
   */
  private drawSprite(): void {
    // If max reached -> reset to 0
    if (Math.floor(this.animationId) >= this.animation.length) {
      this.animationId = 0;
    }

    // Draw running animation slide
    this.game.ctx.drawImage(this.animation[Math.floor(this.animationId)], this.x, this.y);

    // Update running animation slide id
    this.animationId += 0.03;
  }

  /**
   * Clear World Object Sprite
   */
  private clearSprite(): void {
    this.game.ctx.clearRect(this.x - 0.75, this.y - 0.75, this.width + 1.5, this.height + 1.5);
  }

  public isPlayerColliding(x: number, y: number): boolean {
    const radius = 13;

    // Circle center player
    const cx = x + 16;
    const cy = y + 16;

    // Rectangle bounds object
    const rx = this.x;
    const ry = this.y;
    const rw = this.width;
    const rh = this.height;

    // Clamp circle center to rectangle
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));

    // Distance from circle center to closest point
    const dx = cx - closestX;
    const dy = cy - closestY;

    return (dx * dx + dy * dy) <= radius * radius;
  }

  /**
   * Draw World Object with movement
   */
  public draw(): void {
    // Clear existing drawing
    this.clearSprite();

    // Move
    this.x -= this.speed;

    // Draw new
    this.drawSprite();
  }

  /**
   * Remove World Object Sprite
   */
  public remove(): void {
    this.clearSprite();

    // Update score
    if (this.game.UI) {
      this.game.UI.score = this.points;
    }
  }
}