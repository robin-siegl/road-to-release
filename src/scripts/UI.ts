import { Button } from "../components/Button";
import { Dialog } from "../components/Dialog";
import { App } from "./App";
import { type Game } from "./Game";

import Yoshi1 from '../assets/player/yoshi_1.png';
import Wall1 from '../assets/wall/wall_1.png';
import Bugs1 from '../assets/bugs/bugs_1.png';
import Requirements1 from '../assets/requirements/requirements_1.png';
import BigCheese1 from '../assets/big-cheese/big-cheese_1.png';

/**
 * UI Service
 */
export class UI {
  /** ID for Timer Element */
  static TIMER_ID = 'game-timer';
  /** ID for Score Element */
  static SCORE_ID = 'game-score';
  /** ID for Menu Element */
  static MENU_ID = 'game-menu';
  /** ID for Pause Element */
  static PAUSE_ID = 'game-pause';
  /** ID for Over Element */
  static GAME_OVER_ID = 'game-over';
  /** ID for About Element */
  static GAME_ABOUT_ID = 'game-about';

  /** Game Service Class Reference */
  private game: Game | undefined;

  /** Element for displaying timer */
  private timerElem: HTMLSpanElement | undefined = void 0;
  /** Element for displaying score */
  private scoreElem: HTMLSpanElement | undefined = void 0;
  /** Element for displaying menu */
  private menuElem: HTMLDivElement | undefined = void 0;
  /** Element for displaying game over */
  private gameOverElem: HTMLDivElement | undefined = void 0;
  /** Element for displaying pause */
  private pauseElem: HTMLDivElement | undefined = void 0;
  /** Element for displaying about */
  private gameAboutElem: HTMLDivElement | undefined = void 0;
  /** Current Score */
  private scoreValue = 0;

  constructor(game: Game) {
    this.game = game;
    this.createUI();
  }

  public createUI(): void {
    this.scoreValue = 0;

    // Setup Clean Game Score
    this.cleanupScore();
    this.createScore();

    // Setup Clean Game Timer
    this.cleanupTimer();
    this.createTimer();

    // Setup Clean Game Menu
    this.cleanupMenu();
    this.createMenu();

    // Setup Clean Game Pause
    this.cleanupPause();
    this.createPause();

    // Setup Clean Game Pause
    this.cleanupGameOver();
    this.createGameOver();

    // Setup Clean Game About
    this.cleanupGameAbout();
    this.createGameAbout();
  }

  /**
   * Animate UI Objects
   * @param delta time
   */
  public animate(_delta: number): void {
    this.timerElem!.textContent = `${this.game?.gameTime?.toFixed(0)} sec`;
  }

  /**
   * Show Menu UI
   */
  public showMenu(): void {
    if (this.menuElem) {
      this.menuElem.children[0].children[0].innerHTML = `
        <div>
          <span class='ui-headline'>Road to Release</span>
        </div>
      `;
      const content = document.createElement('div');
      content.appendChild(Button.create('primary', 'New Game', () => this.game?.startGame()));
      content.appendChild(Button.create('secondary', 'About', () => {
        this.hideMenu();
        this.showAbout();
      }));
      this.menuElem.children[0].children[0].appendChild(content);
      this.menuElem.classList.add('visible');
    }
  }

  /**
   * Hide Menu UI
   */
  public hideMenu(): void {
    if (this.menuElem) {
      this.menuElem.classList.remove('visible');
    }
  }

  /**
   * Show Pause UI
   */
  public showPause(): void {
    if (this.pauseElem) {
      this.pauseElem.children[0].children[0].innerHTML = `
        <div>
          <span class='ui-label'>${this.scoreValue} Points</span>
          <span class='ui-label'>${this.game?.gameTime?.toFixed(0)} sec</span>
        </div>
        <div>
          <span class='ui-headline'>Paused</span>
        </div>
      `;
      const content = document.createElement('div');
      content.appendChild(Button.create('primary', 'Continue', () => this.game?.unPauseGame()));
      content.appendChild(Button.create('secondary', 'Main Menu', () => this.game?.restartGame()));
      this.pauseElem.children[0].children[0].appendChild(content);
      this.pauseElem.classList.add('visible');
    }
  }

  /**
   * Hide Pause UI
   */
  public hidePause(): void {
    if (this.pauseElem) {
      this.pauseElem.classList.remove('visible');
    }
  }

  /**
   * Show Game Over UI
   */
  public showGameOver(): void {
    if (this.gameOverElem) {
      this.gameOverElem.children[0].children[0].innerHTML = `
        <div>
          <span class='ui-label'>${this.scoreValue} Points</span>
          <span class='ui-label'>${this.game?.gameTime?.toFixed(0)} sec</span>
        </div>
        <div>
          <span class='ui-headline'>Game Over</span>
        </div>
      `;
      const content = document.createElement('div');
      content.appendChild(Button.create('primary', 'New Game', () => this.game?.startGame()));
      content.appendChild(Button.create('secondary', 'Main Menu', () => this.game?.restartGame()));
      this.gameOverElem.children[0].children[0].appendChild(content);
      this.gameOverElem.classList.add('visible');
    }
  }

  /**
   * Hide Game Over UI
   */
  public hideGameOver(): void {
    if (this.gameOverElem) {
      this.gameOverElem.classList.remove('visible');
    }
  }

  /**
   * Show Game About UI
   */
  public showAbout(): void {
    if (this.gameAboutElem) {
      this.gameAboutElem.children[0].children[0].innerHTML = `
        <span class='ui-label'>About</span>
        <div class="card-container">
          <div class="img-card">
            <div class="card-img-content">
              <img src="${Yoshi1}" />
            </div>
            <div class="card-text-content">
              <span>Alex</span>
              <span>The mighty Alex, bravely jumping toward a release deadline that keeps moving.</span>
            </div>
          </div>
          <div class="img-card">
            <div class="card-img-content">
              <img src="${Wall1}" />
            </div>
            <div class="card-text-content">
              <span>Teams</span>
              <span>A powerful slowdown mechanism, activated by asking just one more question.</span>
            </div>
          </div>
          <div class="img-card">
            <div class="card-img-content">
              <img src="${Bugs1}" />
            </div>
            <div class="card-text-content">
              <span>Bugs</span>
              <span>They may look harmless, but each one has the power to delay a release indefinitely.</span>
            </div>
          </div>
          <div class="img-card">
            <div class="card-img-content">
              <img src="${Requirements1}" />
            </div>
            <div class="card-text-content">
              <span>Requirements</span>
              <span>Great for planning ... terrible when they change after you already started.</span>
            </div>
          </div>
          <div class="img-card">
            <div class="card-img-content">
              <img src="${BigCheese1}" />
            </div>
            <div class="card-text-content">
              <span>Big Cheese</span>
              <span>Master of last-minute ideas. Champion of “It’s a small change.” Big Cheese always has one more feature.</span>
            </div>
          </div>
        </div>
      `;
      const content = document.createElement('div');
      content.appendChild(Button.create('primary', 'Main Menu', () => {
        this.hideAbout();
        this.game?.restartGame();
      }));
      this.gameAboutElem.children[0].children[0].appendChild(content);
      this.gameAboutElem.classList.add('visible');
    }
  }

  /**
   * Hide Game About UI
   */
  public hideAbout(): void {
    if (this.gameAboutElem) {
      this.gameAboutElem.classList.remove('visible');
    }
  }

  /**
   * Set Game Score
   * Also updates score display value
   */
  public set score(val: number) {
    this.scoreValue += val;
    this.scoreElem!.textContent = `${this.scoreValue}`;
  }

  /**
   * Get Game Score
   */
  public get score(): number {
    return this.scoreValue;
  }

  /**
   * Create Score Element and append it to container
   */
  private createScore(): void {
    this.scoreElem = document.createElement('span');
    this.scoreElem.className = 'ui-label';
    this.scoreElem.id = UI.SCORE_ID;
    this.scoreElem.textContent = '0';
    App.Container.appendChild(this.scoreElem);
  }

  /**
   * Cleanup Score Element
   */
  private cleanupScore(): void {
    const scoreTempElem = document.getElementById(UI.SCORE_ID);

    // Remove Element if in dom
    if (scoreTempElem) {
      scoreTempElem.remove();
    }

    // Cleanup related variables
    this.scoreElem = void 0;
    this.scoreValue = 0;
  }

  /**
   * Create Timer Element and append it to container
   */
  private createTimer(): void {
    this.timerElem = document.createElement('span');
    this.timerElem.className = 'ui-label';
    this.timerElem.id = UI.TIMER_ID;
    this.timerElem.textContent = '0';
    App.Container.appendChild(this.timerElem);
  }

  /**
   * Cleanup Timer Element
   */
  private cleanupTimer(): void {
    const timerTempElem = document.getElementById(UI.TIMER_ID);

    // Remove Element if in dom
    if (timerTempElem) {
      timerTempElem.remove();
    }

    // Cleanup related variables
    this.timerElem = void 0;
  }

  /**
   * Create Menu Element and append it to container
   */
  private createMenu(): void {
    this.menuElem = Dialog.create(document.createElement('div'));
    this.menuElem.id = UI.MENU_ID;
    App.Container.appendChild(this.menuElem);
  }

  /**
   * Cleanup Menu Element
   */
  private cleanupMenu(): void {
    const menuTempElem = document.getElementById(UI.MENU_ID);

    // Remove Element if in dom
    if (menuTempElem) {
      menuTempElem.remove();
    }

    // Cleanup related variables
    this.menuElem = void 0;
  }

  /**
   * Create Pause Element and append it to container
   */
  private createPause(): void {
    this.pauseElem = Dialog.create(document.createElement('div'));
    this.pauseElem.id = UI.PAUSE_ID;
    App.Container.appendChild(this.pauseElem);
  }

  /**
   * Cleanup Pause Element
   */
  private cleanupPause(): void {
    const pauseTempElem = document.getElementById(UI.PAUSE_ID);

    // Remove Element if in dom
    if (pauseTempElem) {
      pauseTempElem.remove();
    }

    // Cleanup related variables
    this.pauseElem = void 0;
  }

  /**
   * Create Game Over Element and append it to container
   */
  private createGameOver(): void {
    this.gameOverElem = Dialog.create(document.createElement('div'));
    this.gameOverElem.id = UI.GAME_OVER_ID;
    App.Container.appendChild(this.gameOverElem);
  }

  /**
   * Cleanup Game Over Element
   */
  private cleanupGameOver(): void {
    const gameOverTempElem = document.getElementById(UI.GAME_OVER_ID);

    // Remove Element if in dom
    if (gameOverTempElem) {
      gameOverTempElem.remove();
    }

    // Cleanup related variables
    this.gameOverElem = void 0;
  }

  /**
   * Create Game About Element and append it to container
   */
  private createGameAbout(): void {
    this.gameAboutElem = Dialog.create(document.createElement('div'));
    this.gameAboutElem.id = UI.GAME_ABOUT_ID;
    App.Container.appendChild(this.gameAboutElem);
  }

  /**
   * Cleanup Game About Element
   */
  private cleanupGameAbout(): void {
    const gameAboutTempElem = document.getElementById(UI.GAME_ABOUT_ID);

    // Remove Element if in dom
    if (gameAboutTempElem) {
      gameAboutTempElem.remove();
    }

    // Cleanup related variables
    this.gameAboutElem = void 0;
  }

  /**
   * Cleanup UI Elements
   */
  public cleanup(): void {
    this.cleanupScore();
    this.cleanupTimer();
    this.cleanupMenu();
    this.cleanupPause();
    this.cleanupGameOver();
    this.cleanupGameAbout();
  }
}