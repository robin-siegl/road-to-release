import { WorldObjectType } from './WorldObject';
import Wall1 from '../assets/wall/wall_1.png';
import Bugs1 from '../assets/bugs/bugs_1.png';
import Bugs2 from '../assets/bugs/bugs_2.png';
import Bugs3 from '../assets/bugs/bugs_3.png';
import Bugs4 from '../assets/bugs/bugs_4.png';
import Requirements1 from '../assets/requirements/requirements_1.png';
import Requirements2 from '../assets/requirements/requirements_2.png';
import Requirements3 from '../assets/requirements/requirements_3.png';
import Requirements4 from '../assets/requirements/requirements_4.png';
import BigCheese1 from '../assets/big-cheese/big-cheese_1.png';
import Yoshi1 from '../assets/player/yoshi_1.png';
import Yoshi2 from '../assets/player/yoshi_2.png';
import Yoshi3 from '../assets/player/yoshi_3.png';
import Yoshi4 from '../assets/player/yoshi_4.png';

const PLAYER_SOURCES = [Yoshi1, Yoshi2, Yoshi3, Yoshi4] as const;
const WORLD_SOURCES: Record<WorldObjectType, readonly string[]> = {
  [WorldObjectType.Wall]: [Wall1],
  [WorldObjectType.Bugs]: [Bugs1, Bugs2, Bugs3, Bugs4],
  [WorldObjectType.Requirements]: [Requirements1, Requirements2, Requirements3, Requirements4],
  [WorldObjectType.BigCheese]: [BigCheese1],
};

export class AssetMgr {
  private playerImages: HTMLImageElement[] = [];
  private worldObjectImages: Record<WorldObjectType, HTMLImageElement[]> = {
    [WorldObjectType.Wall]: [],
    [WorldObjectType.Bugs]: [],
    [WorldObjectType.Requirements]: [],
    [WorldObjectType.BigCheese]: [],
  };

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image), { once: true });
      image.addEventListener('error', () => reject(new Error(`Could not load asset: ${src}`)), { once: true });
      image.src = src;
    });
  }

  public async loadAssets(): Promise<void> {
    const playerPromise = Promise.all(PLAYER_SOURCES.map((src) => this.loadImage(src)));
    const worldPromises = Object.values(WorldObjectType).map(async (type) => {
      const images = await Promise.all(WORLD_SOURCES[type].map((src) => this.loadImage(src)));
      return [type, images] as const;
    });

    const [playerImages, worldEntries] = await Promise.all([
      playerPromise,
      Promise.all(worldPromises),
    ]);
    this.playerImages = playerImages;
    this.worldObjectImages = Object.fromEntries(worldEntries) as Record<WorldObjectType, HTMLImageElement[]>;
  }

  public getAnimationPlayer(): readonly HTMLImageElement[] {
    return this.playerImages;
  }

  public getAnimationWorldObjects(type: WorldObjectType): readonly HTMLImageElement[] {
    return this.worldObjectImages[type];
  }
}
