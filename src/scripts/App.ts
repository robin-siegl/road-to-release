/**
 * App Service
 */
export class App {
  /**
   * App Entry Container
   */
  public static get Container(): HTMLDivElement {
    return document.getElementById('app') as HTMLDivElement;
  }
}