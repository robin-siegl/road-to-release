import type { Game } from "./Game";
import { ObjectSpawner } from "./ObjectSpawner";
import { WorldObject } from "./WorldObject";

/**
 * Object Manager Service
 */
export class ObjectMgr {
  /** Interval of world object spawning in seconds */
  static SPAWN_INTERVAL = 5;
  /** Game Service Class Reference */
  private game: Game;
  /** List of current Objects in Game */
  private objList: Array<WorldObject> | undefined;
  /** seconds since last spawn */
  private timeSinceLastSpawn = 0;

  constructor(game: Game) {
    this.game = game;
    this.objList = []
  }

  /**
   * Get calculated spawn time
   */
  private get spawnTime(): number {
    const interval = Math.max(((this.game.gameTime / 60) * 0.75), 1);
    return ObjectMgr.SPAWN_INTERVAL / interval;
  }

  /**
   * Get info if player is colliding with world object
   * @param x position
   * @param y position
   */
  public isPlayerColliding(x: number, y: number): boolean {
    // No objects to check for
    if (typeof this.objList === 'undefined') {
      return false;
    }

    let isColliding = false;

    for (const obj of this.objList) {
      if (obj.isPlayerColliding(x, y)) {
        isColliding = true;
        break;
      }
    }

    return isColliding;
  }

  /**
   * Animate World Objects
   * Handles spawning/de-spawning of world objects
   * @param delta time
   */
  public animate(delta: number): void {
    if (typeof this.game === 'undefined' || typeof this.objList === 'undefined') {
      return;
    }

    this.timeSinceLastSpawn += delta;

    if (this.timeSinceLastSpawn >= this.spawnTime) {
      this.timeSinceLastSpawn -= this.spawnTime;

      this.objList.push(
        new WorldObject(
          this.game,
          ObjectSpawner.getRandomType(this.game.gameTime)
        )
      );
    }

    const newObjList = [];

    for (const obj of this.objList) {
      // Remove Object
      if (obj.left < 0) {
        obj.remove();
        continue;
      }

      newObjList.push(obj);
    }

    this.objList = newObjList;

    // Re-Draw Objects
    for (const obj of this.objList) {
      obj.draw();
    }
  }

  /**
   * Cleanup Object Manager
   */
  public cleanup(): void {
    // Remove World objects
    for (const obj of (this.objList ?? [])) {
      obj.remove();
    }

    // Reset variables
    this.objList = void 0;
    (this.game as any) = void 0;
    this.objList = void 0;
    (this.timeSinceLastSpawn as any) = void 0;
  }
}