export class GameClock {
  private static readonly MAX_DELTA_SECONDS = 0.1;
  private lastTime: DOMHighResTimeStamp | null = null;
  private elapsed = 0;

  public get time(): number {
    return this.elapsed;
  }

  public getDelta(time: DOMHighResTimeStamp): number {
    if (this.lastTime === null) {
      this.lastTime = time;
      return 0;
    }

    const delta = Math.min(
      Math.max((time - this.lastTime) / 1_000, 0),
      GameClock.MAX_DELTA_SECONDS,
    );
    this.lastTime = time;
    this.elapsed += delta;
    return delta;
  }

  public sync(time: DOMHighResTimeStamp): void {
    this.lastTime = time;
  }

  public reset(): void {
    this.lastTime = null;
    this.elapsed = 0;
  }
}
