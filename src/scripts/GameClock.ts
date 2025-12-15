
/**
 * Game Clock Service
 */
export class GameClock {
  /** Last Time running in seconds */
  private lastTime = 0;
  /** Elapsed Game Time */
  private elapsed = 0;

  /**
   * Get elapsed Time Running
   */
  public get time(): number {
    return this.elapsed;
  }

  /**
   * Get and Update Delta in seconds
   * @param time requestAnimationFrame time
   * @returns delta time in seconds
   */
  public getDelta(time: DOMHighResTimeStamp): number {
    if (this.lastTime === 0) {
      this.lastTime = time;
      return 0;
    }

    const delta = (time - this.lastTime) / 1_000;
    this.lastTime = time;

    this.elapsed += delta;

    return delta;
  }

  /**
   * Sync time while paused so resume doesn’t include the paused gap
   * @param time requestAnimationFrame time
   */
  public sync(time: DOMHighResTimeStamp): void {
    this.lastTime = time;
  }

  /**
   * Cleanup Game Clock
   */
  public cleanup(): void {
    this.lastTime = 0;
    this.elapsed = 0;
  }
}