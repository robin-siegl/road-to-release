import { WorldObjectType } from './WorldObject';

export class ObjectSpawner {
  public static pickWeighted<T>(entries: ReadonlyArray<{ value: T; weight: number }>): T {
    if (entries.length === 0) throw new Error('At least one weighted entry is required');
    const totalWeight = entries.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);
    if (totalWeight <= 0) throw new Error('The total weight must be greater than zero');

    const target = Math.random() * totalWeight;
    let accumulated = 0;
    for (const entry of entries) {
      accumulated += Math.max(0, entry.weight);
      if (target < accumulated) return entry.value;
    }
    return entries.at(-1)!.value;
  }

  public static getRandomType(time: number): WorldObjectType {
    if (time <= 30) {
      return this.pickWeighted([
        { value: WorldObjectType.Wall, weight: 70 },
        { value: WorldObjectType.Bugs, weight: 30 },
      ]);
    }
    if (time <= 60) {
      return this.pickWeighted([
        { value: WorldObjectType.Wall, weight: 40 },
        { value: WorldObjectType.Bugs, weight: 30 },
        { value: WorldObjectType.Requirements, weight: 30 },
      ]);
    }
    return this.pickWeighted([
      { value: WorldObjectType.Wall, weight: 20 },
      { value: WorldObjectType.Bugs, weight: 30 },
      { value: WorldObjectType.Requirements, weight: 30 },
      { value: WorldObjectType.BigCheese, weight: 20 },
    ]);
  }
}
