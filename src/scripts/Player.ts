import { GameState, type Game } from "./Game";

/**
 * Player class
 * Handles Player logic
 */
export class Player {
  /** Jump Duration in seconds */
  static JUMP_DURATION = 0.6;
  /** Max Jump Height */
  static MAX_JUMP = 128;

  /** Game Service Class Reference */
  private game: Game;

  /** Grounded state of player */
  private grounded = true;
  /** Elapsed jump time in seconds */
  private jumpElapsed = 0;

  /** Player Height */
  private height = 32;
  /** Player Width */
  private width = 32;
  /** Player y position */
  private posY = 0;

  /** Running Animation slide id */
  private runningId = 0;
  /** Running Animation Slides */
  private runningAnimation: Array<HTMLImageElement>;

  /** Key Press Event Handler reference */
  private keyPressHandler = this.onKeyPress.bind(this)

  constructor(game: Game) {
    this.game = game;
    this.posY = this.groundY;
    this.runningAnimation = this.game.AssetManager.getAnimationPlayer();

    // Add Event Listeners
    window.addEventListener('keypress', this.keyPressHandler)
  }

  /**
   * Key Press Event Handler
   * @param event KeyboardEvent
   */
  private onKeyPress(event: KeyboardEvent): void {
    // Trigger Jump if grounded, game is running and jump key pressed
    if (event.key === ' ' && this.isGrounded && this.game.gameState === GameState.Running) {
      this.isGrounded = false;
      this.jumpElapsed = 0;
    }
  }

  /**
   * Animate Player
   * @param delta delta time
   */
  public animate(delta: number): void {
    if (this.isGrounded) {
      this.drawRunning();
    }
    else {
      this.drawJump(delta);
    }

    // End game if we are colliding
    if (this.game.ObjectManager.isPlayerColliding(this.x, this.y)) {
      this.game.endGame();
    }
  }

  /**
   * Get player ground y position
   * Position where player is grounded
   */
  public get groundY(): number {
    return (this.game.height * 0.75) - this.height;
  }

  /**
   * Set player y position
   */
  public set y(value: number) {
    this.posY = value;
  }

  /**
   * Get player y position
   */
  public get y(): number {
    return this.posY;
  }

  /**
   * Get player x position
   */
  public get x(): number {
    return (this.game.width * 0.125) - this.width;
  }

  /**
   * Set State if player is grounded
   */
  private set isGrounded(value: boolean) {
    this.grounded = value;
  }

  /**
   * Get State if player is grounded
   */
  private get isGrounded(): boolean {
    return this.grounded;
  }

  /**
   * Draw Jump Sprite
   */
  private drawJumpSprite(): void {
    this.game.ctx.drawImage(this.runningAnimation[2], this.x, this.y);
  }

  /**
   * Draw Running Sprite
   */
  private drawRunningSprite(): void {
    // If max reached -> reset to 0
    if (Math.floor(this.runningId) >= this.runningAnimation.length) {
      this.runningId = 0;
    }

    // Draw running animation slide
    this.game.ctx.drawImage(this.runningAnimation[Math.floor(this.runningId)], this.x, this.y);

    // Update running animation slide id
    this.runningId += 0.05;
  }

  /**
   * Clear World Object Sprite
   */
  private clearSprite(): void {
    this.game.ctx.clearRect(this.x - 0.75, this.y - 0.75, this.width + 1.5, this.height + 1.5);
  }

  /**
   * Draw Player jumping animation
   */
  private drawJump(delta: number): void {
    // delta is ms since last frame -> accumulate it
    this.jumpElapsed += delta;

    // normalize to 0..1 over jump duration
    const t = Math.min(this.jumpElapsed / Player.JUMP_DURATION, 1);

    // sine curve: starts and ends at ground, peak in middle
    const height = Math.sin(t * Math.PI) * Player.MAX_JUMP;

    this.clearSprite();
    this.y = this.groundY - height;
    this.drawJumpSprite();

    // Jump done
    if (t >= 1) {
      this.y = this.groundY;
      this.isGrounded = true;
      this.jumpElapsed = 0;
    }
  }

  /**
   * Draw Player running animation
   */
  public drawRunning(): void {
    // Clear existing drawing
    this.clearSprite();

    // Draw new
    this.drawRunningSprite();
  }

  /**
   * Cleanup Player
   */
  public cleanup(): void {
    this.clearSprite();

    // Cleanup Event Listeners
    window.removeEventListener('keypress', this.keyPressHandler)
  }
}