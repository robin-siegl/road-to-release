import { App } from './App';
import { AssetMgr } from './AssetMgr';
import { GameClock } from './GameClock';
import { ObjectMgr } from './ObjectMgr';
import { Player } from './Player';
import { UI } from './UI';

export enum GameState {
  Idle,
  Running,
  Paused,
  GameOver,
}

export class Game {
  public static readonly CANVAS_ID = 'game-screen';
  private readonly assetMgr = new AssetMgr();
  private readonly ui: UI;
  private canvas?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D;
  private clock?: GameClock;
  private player?: Player;
  private objectMgr?: ObjectMgr;
  private animationFrameId: number | null = null;
  private resizeFrameId: number | null = null;
  private logicalWidth = 0;
  private logicalHeight = 0;
  private state = GameState.Idle;
  private ready = false;

  public constructor() {
    this.ui = new UI(this);
    this.ui.showMenu(false);
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.assetMgr.loadAssets();
      this.createCanvas();
      window.addEventListener('resize', this.onResize, { passive: true });
      window.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('visibilitychange', this.onVisibilityChange);
      this.ready = true;
      this.ui.showMenu(true);
      this.draw();
    } catch (error) {
      console.error(error);
      this.ui.showLoadError();
    }
  }

  private readonly onResize = (): void => {
    if (this.resizeFrameId !== null) return;
    this.resizeFrameId = requestAnimationFrame(() => {
      this.resizeFrameId = null;
      this.resizeCanvas();
      if (this.player) this.player.y = this.player.groundY;
      this.draw();
    });
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.code !== 'KeyP' || event.repeat) return;
    if (this.state === GameState.Running) this.pauseGame();
    else if (this.state === GameState.Paused) this.unPauseGame();
  };

  private readonly onVisibilityChange = (): void => {
    if (!document.hidden) this.clock?.sync(performance.now());
  };

  private readonly onCanvasPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    event.preventDefault();
    this.player?.jump();
  };

  private readonly animate = (time: DOMHighResTimeStamp): void => {
    this.animationFrameId = null;
    if (this.state === GameState.Idle || this.state === GameState.GameOver) return;

    if (this.state === GameState.Paused) {
      this.clock?.sync(time);
      return;
    }

    const delta = this.clock?.getDelta(time) ?? 0;
    this.player?.update(delta);
    this.objectMgr?.update(delta);

    if (this.player && this.objectMgr?.isPlayerColliding(this.player.x, this.player.y)) {
      this.endGame();
    }

    this.ui.update(this.gameTime);
    this.draw();
    if (this.state === GameState.Running) this.requestNextFrame();
  };

  private requestNextFrame(): void {
    if (this.animationFrameId === null) this.animationFrameId = requestAnimationFrame(this.animate);
  }

  public startGame(): void {
    if (!this.ready) return;
    this.stopLoop();
    this.player?.cleanup();
    this.objectMgr?.cleanup();
    this.clock = new GameClock();
    this.player = new Player(this);
    this.objectMgr = new ObjectMgr(this);
    this.ui.createUI();
    this.ui.showGameControls();
    this.state = GameState.Running;
    this.draw();
    this.requestNextFrame();
  }

  private stopLoop(): void {
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  public pauseGame(): void {
    if (this.state !== GameState.Running) return;
    this.state = GameState.Paused;
    this.ui.hideGameControls();
    this.ui.showPause();
  }

  public unPauseGame(): void {
    if (this.state !== GameState.Paused) return;
    this.ui.hidePause();
    this.clock?.sync(performance.now());
    this.state = GameState.Running;
    this.ui.showGameControls();
    this.requestNextFrame();
  }

  public endGame(): void {
    if (this.state !== GameState.Running) return;
    this.state = GameState.GameOver;
    this.ui.hideGameControls();
    this.ui.showGameOver();
  }

  public restartGame(): void {
    this.stopLoop();
    this.state = GameState.Idle;
    this.player?.cleanup();
    this.objectMgr?.cleanup();
    this.player = undefined;
    this.objectMgr = undefined;
    this.clock = undefined;
    this.ui.hidePause();
    this.ui.hideGameOver();
    this.ui.hideGameControls();
    this.ui.showMenu(true);
    this.draw();
  }

  public get gameState(): GameState { return this.state; }
  public get AssetManager(): AssetMgr { return this.assetMgr; }
  public get UI(): UI { return this.ui; }
  public get gameTime(): number { return this.clock?.time ?? 0; }
  public get height(): number { return this.logicalHeight; }
  public get width(): number { return this.logicalWidth; }
  public get groundY(): number { return this.height * 0.75; }

  public get ctx(): CanvasRenderingContext2D {
    if (!this.canvasCtx) throw new Error('Canvas context is not ready');
    return this.canvasCtx;
  }

  public draw(): void {
    if (!this.canvasCtx) return;
    this.canvasCtx.fillStyle = '#87d8fd';
    this.canvasCtx.fillRect(0, 0, this.width, this.height);
    this.drawGround();
    this.objectMgr?.draw();
    this.player?.draw();
  }

  private drawGround(): void {
    const ctx = this.ctx;
    const layers: ReadonlyArray<[number, string]> = [
      [0, '#000000'], [1, '#4ca03b'], [18, '#241908'], [48, '#1f160a'], [96, '#1b130a'], [153, '#161009'],
    ];
    for (const [offset, color] of layers) {
      ctx.fillStyle = color;
      ctx.fillRect(0, this.groundY + offset, this.width, this.height);
    }
  }

  private createCanvas(): void {
    document.getElementById(Game.CANVAS_ID)?.remove();
    this.canvas = document.createElement('canvas');
    this.canvas.id = Game.CANVAS_ID;
    this.canvas.setAttribute('aria-label', 'Road to Release game');
    this.canvas.addEventListener('pointerdown', this.onCanvasPointerDown);
    this.canvasCtx = this.canvas.getContext('2d', { alpha: false }) ?? undefined;
    if (!this.canvasCtx) throw new Error('Canvas 2D is not supported');
    App.Container.prepend(this.canvas);
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    if (!this.canvas || !this.canvasCtx) return;
    const bounds = App.Container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.logicalWidth = Math.max(1, Math.round(bounds.width));
    this.logicalHeight = Math.max(1, Math.round(bounds.height));
    this.canvas.width = Math.round(this.logicalWidth * dpr);
    this.canvas.height = Math.round(this.logicalHeight * dpr);
    this.canvas.style.width = `${this.logicalWidth}px`;
    this.canvas.style.height = `${this.logicalHeight}px`;
    this.canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.canvasCtx.imageSmoothingEnabled = false;
  }
}
