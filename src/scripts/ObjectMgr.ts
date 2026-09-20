import type { Game } from './Game';
import { ObjectSpawner } from './ObjectSpawner';
import { WorldObject } from './WorldObject';

export class ObjectMgr {
  private static readonly BASE_SPAWN_INTERVAL = 5;
  private readonly objects: WorldObject[] = [];
  private timeSinceLastSpawn = 0;

  public constructor(private readonly game: Game) {}

  private get spawnTime(): number {
    const difficulty = Math.max((this.game.gameTime / 60) * 1.4, 1);
    return ObjectMgr.BASE_SPAWN_INTERVAL / difficulty;
  }

  public isPlayerColliding(x: number, y: number): boolean {
    return this.objects.some((object) => object.isPlayerColliding(x, y));
  }

  public update(delta: number): void {
    this.timeSinceLastSpawn += delta;
    if (this.timeSinceLastSpawn >= this.spawnTime) {
      this.timeSinceLastSpawn %= this.spawnTime;
      this.objects.push(new WorldObject(this.game, ObjectSpawner.getRandomType(this.game.gameTime)));
    }

    for (const object of this.objects) object.update(delta);

    let writeIndex = 0;
    for (const object of this.objects) {
      if (object.left < 0) {
        this.game.UI.addScore(object.points);
      } else {
        this.objects[writeIndex++] = object;
      }
    }
    this.objects.length = writeIndex;
  }

  public draw(): void {
    for (const object of this.objects) object.draw();
  }

  public cleanup(): void {
    this.objects.length = 0;
    this.timeSinceLastSpawn = 0;
  }
}
