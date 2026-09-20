import { GameState, type Game } from './Game';

export class Player {
  private static readonly JUMP_DURATION = 0.6;
  private static readonly MAX_JUMP = 128;
  private static readonly ANIMATION_FPS = 3;
  private readonly height = 32;
  private readonly width = 32;
  private readonly runningAnimation: readonly HTMLImageElement[];
  private grounded = true;
  private jumpElapsed = 0;
  private animationTime = 0;
  private posY = 0;

  public constructor(private readonly game: Game) {
    this.posY = this.groundY;
    this.runningAnimation = game.AssetManager.getAnimationPlayer();
    window.addEventListener('keydown', this.onKeyDown);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if ((event.code === 'Space' || event.key === ' ') && this.grounded && this.game.gameState === GameState.Running) {
      event.preventDefault();
      this.grounded = false;
      this.jumpElapsed = 0;
    }
  };

  public get groundY(): number {
    return this.game.groundY - this.height;
  }

  public get y(): number {
    return this.posY;
  }

  public set y(value: number) {
    this.posY = value;
  }

  public get x(): number {
    return this.game.width * 0.125 - this.width;
  }

  public update(delta: number): void {
    this.animationTime += delta;
    if (this.grounded) {
      this.posY = this.groundY;
      return;
    }

    this.jumpElapsed += delta;
    const progress = Math.min(this.jumpElapsed / Player.JUMP_DURATION, 1);
    this.posY = this.groundY - Math.sin(progress * Math.PI) * Player.MAX_JUMP;
    if (progress >= 1) {
      this.posY = this.groundY;
      this.grounded = true;
      this.jumpElapsed = 0;
    }
  }

  public draw(): void {
    if (this.runningAnimation.length === 0) return;
    const frame = this.grounded
      ? Math.floor(this.animationTime * Player.ANIMATION_FPS) % this.runningAnimation.length
      : Math.min(2, this.runningAnimation.length - 1);
    const image = this.runningAnimation[frame];
    if (image) this.game.ctx.drawImage(image, Math.round(this.x), Math.round(this.y));
  }

  public cleanup(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }
}
