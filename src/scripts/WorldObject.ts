import type { Game } from './Game';

export enum WorldObjectType {
  Wall = 'Wall',
  Requirements = 'Requirements',
  Bugs = 'Bugs',
  BigCheese = 'BigCheese',
}

export class WorldObject {
  private static readonly BASE_SPEED = 280;
  private static readonly ANIMATION_FPS = 5;
  private readonly animation: readonly HTMLImageElement[];
  private x: number;
  private previousX: number;
  private animationTime = 0;

  public constructor(private readonly game: Game, private readonly type: WorldObjectType) {
    this.animation = game.AssetManager.getAnimationWorldObjects(type);
    this.x = game.width;
    this.previousX = this.x;
  }

  public get points(): number {
    const values: Record<WorldObjectType, number> = {
      [WorldObjectType.Wall]: 5,
      [WorldObjectType.Bugs]: 10,
      [WorldObjectType.Requirements]: 25,
      [WorldObjectType.BigCheese]: 60,
    };
    return values[this.type];
  }

  public get left(): number {
    return this.x + this.width;
  }

  public get y(): number {
    return this.game.groundY - this.height;
  }

  public get height(): number {
    return this.type === WorldObjectType.Bugs || this.type === WorldObjectType.BigCheese ? 64 : 32;
  }

  public get width(): number {
    if (this.type === WorldObjectType.Bugs) return 16;
    if (this.type === WorldObjectType.Wall) return 32;
    return 64;
  }

  private get speed(): number {
    return WorldObject.BASE_SPEED * Math.min(4.5, 1 + (this.game.gameTime / 60) * 0.15);
  }

  public update(delta: number): void {
    this.previousX = this.x;
    this.x -= this.speed * delta;
    this.animationTime += delta;
  }

  public draw(): void {
    if (this.animation.length === 0) return;
    const frame = Math.floor(this.animationTime * WorldObject.ANIMATION_FPS) % this.animation.length;
    const image = this.animation[frame];
    if (image) this.game.ctx.drawImage(image, Math.round(this.x), Math.round(this.y));
  }

  public isPlayerColliding(x: number, y: number): boolean {
    const radius = 13;
    const centerX = x + 16;
    const centerY = y + 16;
    // Include the distance travelled during this frame so fast, narrow objects
    // cannot skip through the player between two rendered frames.
    const collisionX = Math.min(this.x, this.previousX);
    const collisionWidth = this.width + Math.abs(this.previousX - this.x);
    const closestX = Math.max(collisionX, Math.min(centerX, collisionX + collisionWidth));
    const closestY = Math.max(this.y, Math.min(centerY, this.y + this.height));
    const deltaX = centerX - closestX;
    const deltaY = centerY - closestY;
    return deltaX * deltaX + deltaY * deltaY <= radius * radius;
  }
}
