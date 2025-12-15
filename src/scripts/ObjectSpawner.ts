import { WorldObjectType } from "./WorldObject";

/**
 * Object Spawner Util
 */
export class ObjectSpawner {

  /**
   * Get Random Value based on weight
   * @param entries to pick from
   * @returns random World Object Type
   */
  static pickWeighted<T>(entries: { value: T; weight: number }[]): T {
    const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
    const r = Math.random() * totalWeight;

    let acc = 0;
    for (const e of entries) {
      acc += e.weight;
      if (r <= acc) {
        return e.value;
      }
    }

    // Fallback
    return entries[entries.length - 1].value;
  }

  /**
   * Get Random World Object Type based on time the game is already running
   * @param time animation time
   * @returns World Object Type
   */
  static getRandomType(time: number): WorldObjectType {
    let weights: Array<{ value: WorldObjectType; weight: number }>;

    // Early game
    if (time <= 30) {
      weights = [
        { value: WorldObjectType.Wall, weight: 70 },
        { value: WorldObjectType.Bugs, weight: 30 },
      ];
    }
    // Mid game
    else if (time <= 60) {
      weights = [
        { value: WorldObjectType.Wall, weight: 40 },
        { value: WorldObjectType.Bugs, weight: 30 },
        { value: WorldObjectType.Requirements, weight: 30 },
      ];
    }
    // Late game
    else {
      weights = [
        { value: WorldObjectType.Wall, weight: 20 },
        { value: WorldObjectType.Bugs, weight: 30 },
        { value: WorldObjectType.Requirements, weight: 30 },
        { value: WorldObjectType.BigCheese, weight: 20 },
      ];
    }

    return ObjectSpawner.pickWeighted<WorldObjectType>(weights);
  }
}