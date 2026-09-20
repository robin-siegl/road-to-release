import { Button } from '../components/Button';
import { Dialog } from '../components/Dialog';
import { App } from './App';
import type { Game } from './Game';
import Yoshi1 from '../assets/player/yoshi_1.png';
import Wall1 from '../assets/wall/wall_1.png';
import Bugs1 from '../assets/bugs/bugs_1.png';
import Requirements1 from '../assets/requirements/requirements_1.png';
import BigCheese1 from '../assets/big-cheese/big-cheese_1.png';

export class UI {
  private static readonly TIMER_ID = 'game-timer';
  private static readonly SCORE_ID = 'game-score';
  private static readonly MENU_ID = 'game-menu';
  private static readonly PAUSE_ID = 'game-pause';
  private static readonly GAME_OVER_ID = 'game-over';
  private static readonly ABOUT_ID = 'game-about';
  private static readonly PAUSE_CONTROL_ID = 'game-pause-control';
  private timerElem?: HTMLSpanElement;
  private scoreElem?: HTMLSpanElement;
  private menuElem?: HTMLDivElement;
  private pauseElem?: HTMLDivElement;
  private gameOverElem?: HTMLDivElement;
  private aboutElem?: HTMLDivElement;
  private pauseControl?: HTMLButtonElement;
  private scoreValue = 0;
  private displayedSecond = -1;

  public constructor(private readonly game: Game) {
    this.createUI();
  }

  public createUI(): void {
    this.cleanup();
    this.scoreValue = 0;
    this.displayedSecond = -1;
    this.scoreElem = this.createLabel(UI.SCORE_ID, '0');
    this.timerElem = this.createLabel(UI.TIMER_ID, '0 sec');
    this.menuElem = this.createDialog(UI.MENU_ID);
    this.pauseElem = this.createDialog(UI.PAUSE_ID);
    this.gameOverElem = this.createDialog(UI.GAME_OVER_ID);
    this.aboutElem = this.createDialog(UI.ABOUT_ID);
    this.pauseControl = Button.create('secondary', 'Pause', () => this.game.pauseGame());
    this.pauseControl.id = UI.PAUSE_CONTROL_ID;
    this.pauseControl.hidden = true;
    this.pauseControl.setAttribute('aria-label', 'Pause game');
    App.Container.append(this.pauseControl);
  }

  public update(time: number): void {
    const second = Math.floor(time);
    if (second === this.displayedSecond || !this.timerElem) return;
    this.displayedSecond = second;
    this.timerElem.textContent = `${second} sec`;
  }

  public addScore(points: number): void {
    this.scoreValue += points;
    if (this.scoreElem) this.scoreElem.textContent = String(this.scoreValue);
  }

  public showMenu(ready: boolean): void {
    if (!this.menuElem) return;
    const content = this.getDialogContent(this.menuElem);
    content.replaceChildren();
    const headline = document.createElement('span');
    headline.className = 'ui-headline';
    headline.textContent = 'Road to Release';
    const actions = document.createElement('div');
    actions.className = 'dialog-actions';
    actions.append(
      Button.create('primary', ready ? 'New Game' : 'Loading…', () => this.game.startGame(), !ready),
      Button.create('secondary', 'About', () => { this.hideMenu(); this.showAbout(); }),
    );
    const controls = document.createElement('p');
    controls.className = 'game-instructions';
    controls.textContent = window.matchMedia('(pointer: coarse)').matches
      ? 'Tap anywhere to jump'
      : 'Press Space to jump';
    content.append(headline, actions, controls);
    this.menuElem.classList.add('visible');
  }

  public showLoadError(): void {
    if (!this.menuElem) return;
    const content = this.getDialogContent(this.menuElem);
    content.replaceChildren();
    const headline = document.createElement('span');
    headline.className = 'ui-headline';
    headline.textContent = 'Could not load the game';
    const message = document.createElement('p');
    message.textContent = 'Please reload the page and try again.';
    content.append(headline, message);
    this.menuElem.classList.add('visible');
  }

  public hideMenu(): void { this.menuElem?.classList.remove('visible'); }

  public showGameControls(): void {
    if (this.pauseControl) this.pauseControl.hidden = false;
  }

  public hideGameControls(): void {
    if (this.pauseControl) this.pauseControl.hidden = true;
  }

  public showPause(): void {
    this.renderResultDialog(this.pauseElem, 'Paused', 'Continue', () => this.game.unPauseGame());
  }
  public hidePause(): void { this.pauseElem?.classList.remove('visible'); }

  public showGameOver(): void {
    this.renderResultDialog(this.gameOverElem, 'Game Over', 'New Game', () => this.game.startGame());
  }
  public hideGameOver(): void { this.gameOverElem?.classList.remove('visible'); }

  private renderResultDialog(
    element: HTMLDivElement | undefined,
    title: string,
    primaryLabel: string,
    primaryAction: () => void,
  ): void {
    if (!element) return;
    const content = this.getDialogContent(element);
    content.replaceChildren();
    const stats = document.createElement('div');
    stats.className = 'dialog-stats';
    stats.append(this.makeLabel(`${this.scoreValue} Points`), this.makeLabel(`${Math.floor(this.game.gameTime)} sec`));
    const headline = document.createElement('span');
    headline.className = 'ui-headline';
    headline.textContent = title;
    const actions = document.createElement('div');
    actions.className = 'dialog-actions';
    actions.append(
      Button.create('primary', primaryLabel, primaryAction),
      Button.create('secondary', 'Main Menu', () => this.game.restartGame()),
    );
    content.append(stats, headline, actions);
    element.classList.add('visible');
  }

  private showAbout(): void {
    if (!this.aboutElem) return;
    const content = this.getDialogContent(this.aboutElem);
    content.replaceChildren();
    const headline = document.createElement('span');
    headline.className = 'ui-label';
    headline.textContent = 'About';
    const cards = document.createElement('div');
    cards.className = 'card-container';
    const items: ReadonlyArray<[string, string, string]> = [
      [Yoshi1, 'Alex', 'Bravely jumping toward a release deadline that keeps moving.'],
      [Wall1, 'Teams', 'A powerful slowdown mechanism, activated by asking just one more question.'],
      [Bugs1, 'Bugs', 'Each one has the power to delay a release indefinitely.'],
      [Requirements1, 'Requirements', 'Great for planning — until they change after work has started.'],
      [BigCheese1, 'Big Cheese', 'Master of last-minute ideas and “It’s a small change.”'],
    ];
    for (const [src, title, description] of items) cards.append(this.createCard(src, title, description));
    const actions = document.createElement('div');
    actions.className = 'dialog-actions';
    actions.append(Button.create('primary', 'Main Menu', () => { this.hideAbout(); this.showMenu(true); }));
    content.append(headline, cards, actions);
    this.aboutElem.classList.add('visible');
  }

  private hideAbout(): void { this.aboutElem?.classList.remove('visible'); }

  private createCard(src: string, title: string, description: string): HTMLElement {
    const card = document.createElement('article');
    card.className = 'img-card';
    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    const text = document.createElement('div');
    text.className = 'card-text-content';
    const name = document.createElement('span');
    name.textContent = title;
    const copy = document.createElement('span');
    copy.textContent = description;
    text.append(name, copy);
    card.append(image, text);
    return card;
  }

  private createLabel(id: string, text: string): HTMLSpanElement {
    const element = this.makeLabel(text);
    element.id = id;
    App.Container.append(element);
    return element;
  }

  private makeLabel(text: string): HTMLSpanElement {
    const element = document.createElement('span');
    element.className = 'ui-label';
    element.textContent = text;
    return element;
  }

  private createDialog(id: string): HTMLDivElement {
    const element = Dialog.create(document.createElement('div'));
    element.id = id;
    App.Container.append(element);
    return element;
  }

  private getDialogContent(dialog: HTMLDivElement): HTMLElement {
    const content = dialog.querySelector<HTMLElement>('.dialog-panel > div');
    if (!content) throw new Error('Dialog content is missing');
    return content;
  }

  public cleanup(): void {
    for (const id of [UI.SCORE_ID, UI.TIMER_ID, UI.MENU_ID, UI.PAUSE_ID, UI.GAME_OVER_ID, UI.ABOUT_ID, UI.PAUSE_CONTROL_ID]) {
      document.getElementById(id)?.remove();
    }
    this.scoreElem = undefined;
    this.timerElem = undefined;
    this.menuElem = undefined;
    this.pauseElem = undefined;
    this.gameOverElem = undefined;
    this.aboutElem = undefined;
    this.pauseControl = undefined;
  }
}
