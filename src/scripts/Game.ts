import { App } from "./App";
import { AssetMgr } from "./AssetMgr";
import { GameClock } from "./GameClock";
import { ObjectMgr } from "./ObjectMgr";
import { Player } from "./Player";
import { UI } from "./UI";

export enum GameState {
  /** Main Menu -> before starting game */
  Idle,
  /** Game is running */
  Running,
  /** Paused game */
  Paused,
  /** Game Over */
  GameOver,
}

/**
 * Game Service
 */
export class Game {
  /** ID for Canvas Element */
  static CANVAS_ID = 'game-screen';

  /** Game Canvas Element */
  private canvas: HTMLCanvasElement | null | undefined = void 0;
  /** Canvas Context */
  private canvasCtx: CanvasRenderingContext2D | null | undefined = void 0;

  /** Current Asset Manager */
  private assetMgr: AssetMgr;

  /** Current Clock Service class */
  private clock: GameClock | undefined = void 0;
  /** Current Player class */
  private player: Player | undefined = void 0;
  /** Object Manager */
  private objectMgr: ObjectMgr | undefined = void 0;
  /** UI Class */
  private ui: UI | undefined = void 0;

  /** Current game state */
  private state = GameState.Idle;

  /** Resize Event Handler reference */
  private resizeHandler = this.onResize.bind(this)
  /** Key Press Event Handler reference */
  private keyPressHandler = this.onKeyPress.bind(this)

  constructor() {
    this.assetMgr = new AssetMgr();

    this.ui = new UI(this);
    this.ui.showMenu();

    this.assetMgr.loadAssets().then(() => {
      // Setup Clean Game Screen
      this.cleanupCanvas();
      this.createCanvas();

      // Setup Game Screen Canvas
      this.setupGround();

      // Add Event Listeners
      window.addEventListener('resize', this.resizeHandler);
      window.addEventListener('keypress', this.keyPressHandler);
    });
  }

  /**
   * Window Resize Handler
   */
  private onResize(): void {
    // Clear canvas and redraw lightbox and ground
    if (this.canvasCtx && this.canvas) {
      // Update Canvas Size
      const clientRects = document.body.getBoundingClientRect();
      this.canvas.width = clientRects.width;
      this.canvas.height = clientRects.height;

      // Clear Canvas
      this.canvasCtx.clearRect(0, 0, this.width, this.height);

      // Update Player y position from new is grounded position
      if (this.player) {
        this.player.y = this.player.groundY;
      }
    }
  }

  /**
   * Window Resize Handler
   */
  private onKeyPress(event: KeyboardEvent): void {
    switch (event.key.toLowerCase()) {
      // Pause Logic
      case 'p': {
        // Pause game when running
        if (this.state === GameState.Running) {
          this.pauseGame();
        }
        // Un-Pause game when paused
        else if (this.state === GameState.Paused) {
          this.unPauseGame();
        }
        break;
      }
    }
  }

  /**
   * Main Animation Loop
   * @param time requestAnimationFrame time
   */
  private animate(time: number) {
    if (this.gameState === GameState.GameOver || this.gameState === GameState.Idle) {
      return;
    }

    // Game Not running -> skip game logic
    if (this.gameState !== GameState.Running) {
      this.clock?.sync(time);
      requestAnimationFrame(this.animate.bind(this));
      return;
    }

    const delta = this.clock?.getDelta(time) ?? 0;

    // Sub Animation Updates
    this.player?.animate(delta);
    this.objectMgr?.animate(delta);
    this.ui?.animate(delta);

    // Draw Main Scene
    this.draw();

    // Request new Loop
    requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Start Game Loop
   */
  private startLoop(): void {
    // Create Game Clock
    this.clock = new GameClock();

    // Create Player
    this.player = new Player(this);

    // Create new Game Object Manager
    this.objectMgr = new ObjectMgr(this);

    // Setup Game Running State
    this.gameState = GameState.Running;

    if (this.ui) {
      this.ui.createUI();
    }
    else {
      this.ui = new UI(this);
    }

    // Start main animation loop
    this.animate(0);
  }

  /**
   * Start New Game - Start Game
   */
  public startGame(): void {
    this.clock?.cleanup();
    this.player?.cleanup();
    this.objectMgr?.cleanup();
    this.ui?.cleanup();

    this.startLoop();
  }

  /**
   * Pause Game
   */
  public pauseGame(): void {
    this.UI.showPause();
    this.state = GameState.Paused
  }

  /**
   * Resume Game form Pause
   */
  public unPauseGame(): void {
    this.UI.hidePause();
    this.state = GameState.Running
  }

  /**
   * Game Over - End Game
   */
  public endGame(): void {
    this.state = GameState.GameOver;
    this.UI.showGameOver();
  }

  /**
   * Go back to main menu - Restart Game
   */
  public restartGame(): void {
    this.state = GameState.Idle;
    this.clock?.cleanup();
    this.objectMgr?.cleanup();
    this.UI.hidePause();
    this.UI.hideGameOver();
    this.UI.showMenu();
  }

  /**
   * Get current game state
   */
  public get gameState(): GameState {
    return this.state;
  }

  /**
   * Set current game state
   */
  public set gameState(state: GameState) {
    this.state = state;
  }

  /**
   * Get Asset Manager
   */
  public get AssetManager(): AssetMgr {
    return this.assetMgr;
  }

  /**
   * Get World Object Manager
   */
  public get ObjectManager(): ObjectMgr {
    return this.objectMgr!;
  }

  /**
   * Get UI Service
   */
  public get UI(): UI {
    return this.ui!;
  }

  /**
   * Get Time the game is already running
   */
  public get gameTime(): number {
    return (this.clock?.time ?? 0);
  }

  /**
   * Get Game Screen height
   */
  public get height(): number {
    return this.canvas?.clientHeight ?? 0;
  }

  /**
   * Get Game Screen width
   */
  public get width(): number {
    return this.canvas?.clientWidth ?? 0;
  }

  /**
   * Get Canvas Context
   */
  public get ctx(): CanvasRenderingContext2D {
    return this.canvasCtx!;
  }

  /**
   * Draw Main Scene
   */
  public draw(): void {
    this.setupGround();
  }

  /**
   * Setup ground in canvas
   */
  public setupGround(): void {
    this.canvasCtx!.fillStyle = 'rgba(0, 0, 0, 1)';
    this.canvasCtx!.fillRect(0, this.height * 0.75, this.width + 1, this.height);
    this.canvasCtx!.fillStyle = 'rgba(76, 160, 59, 1)';
    this.canvasCtx!.fillRect(0, (this.height + 1) * 0.75, this.width + 1, this.height);
    this.canvasCtx!.fillStyle = 'rgba(36, 25, 8, 1)';
    this.canvasCtx!.fillRect(0, (this.height + 24) * 0.75, this.width + 1, this.height);
    this.canvasCtx!.fillStyle = 'rgba(31, 22, 10, 1)';
    this.canvasCtx!.fillRect(0, (this.height + 64) * 0.75, this.width + 1, this.height);
    this.canvasCtx!.fillStyle = 'rgba(27, 19, 10, 1)';
    this.canvasCtx!.fillRect(0, (this.height + 128) * 0.75, this.width + 1, this.height);
    this.canvasCtx!.fillStyle = 'rgba(22, 16, 9, 1)';
    this.canvasCtx!.fillRect(0, (this.height + 204) * 0.75, this.width + 1, this.height);
  }

  /**
   * Create Canvas Element and append it to container
   */
  private createCanvas(): void {
    // Create Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = Game.CANVAS_ID;

    const clientRects = document.body.getBoundingClientRect();
    this.canvas.width = clientRects.width;
    this.canvas.height = clientRects.height;

    // Get Canvas Context
    this.canvasCtx = this.canvas.getContext('2d');

    // Append Canvas to dom
    App.Container.appendChild(this.canvas);
  }

  /**
   * Cleanup Canvas Element
   */
  public cleanupCanvas(): void {
    const canvasTempElem = document.getElementById(Game.CANVAS_ID);

    // Remove Element if in dom
    if (canvasTempElem) {
      canvasTempElem.remove();
    }

    // Cleanup Event Listeners
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('keypress', this.keyPressHandler);

    // Cleanup context variable
    this.canvasCtx = void 0;
    // Cleanup canvas variable
    this.canvas = void 0;
  }
}