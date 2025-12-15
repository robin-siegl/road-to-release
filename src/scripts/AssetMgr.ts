import { WorldObjectType } from "./WorldObject";

// Sprites Wall
import Wall1 from '../assets/wall/wall_1.png';
// Sprites Bug
import Bugs1 from '../assets/bugs/bugs_1.png';
import Bugs2 from '../assets/bugs/bugs_2.png';
import Bugs3 from '../assets/bugs/bugs_3.png';
import Bugs4 from '../assets/bugs/bugs_4.png';
// Sprites Requirements
import Requirements1 from '../assets/requirements/requirements_1.png';
import Requirements2 from '../assets/requirements/requirements_2.png';
import Requirements3 from '../assets/requirements/requirements_3.png';
import Requirements4 from '../assets/requirements/requirements_4.png';
// Sprites BigCheese
import BigCheese1 from '../assets/big-cheese/big-cheese_1.png';
// Sprites Player
import Yoshi1 from '../assets/player/yoshi_1.png';
import Yoshi2 from '../assets/player/yoshi_2.png';
import Yoshi3 from '../assets/player/yoshi_3.png';
import Yoshi4 from '../assets/player/yoshi_4.png';

/**
 * Asset Manager
 */
export class AssetMgr {
  public static playerAnimation = [Yoshi1, Yoshi2, Yoshi3, Yoshi4]
  public static worldObjectAnimation = {
    [WorldObjectType.Wall]: [Wall1],
    [WorldObjectType.Bugs]: [Bugs1, Bugs2, Bugs3, Bugs4],
    [WorldObjectType.Requirements]: [Requirements1, Requirements2, Requirements3, Requirements4],
    [WorldObjectType.BigCheese]: [BigCheese1],
  }

  private playerImages: Array<HTMLImageElement> = [];
  private worldObjectImages: Record<WorldObjectType, Array<HTMLImageElement>> = {
    [WorldObjectType.Wall]: [],
    [WorldObjectType.Bugs]: [],
    [WorldObjectType.Requirements]: [],
    [WorldObjectType.BigCheese]: [],
  };

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((r) => {
      let i = new Image();
      i.onload = (() => r(i));
      i.src = src;
    });
  }

  /**
   * Load available assets
   */
  public async loadAssets(): Promise<void> {
    // Load Player Images
    for (const src of AssetMgr.playerAnimation) {
      this.playerImages.push(await this.loadImage(src));
    }

    // Load World Object Images
    for (const key in AssetMgr.worldObjectAnimation) {
      if (Object.hasOwn(AssetMgr.worldObjectAnimation, key)) {
        for (const src of AssetMgr.worldObjectAnimation[key as WorldObjectType]) {
          this.worldObjectImages[key as WorldObjectType].push(await this.loadImage(src));
        }
      }
    }
  }

  /**
   * Get animation slides for Player
   */
  public getAnimationPlayer(): Array<HTMLImageElement> {
    return this.playerImages;
  }

  /**
   * Get animation slides for World Objects
   */
  public getAnimationWorldObjects(type: WorldObjectType): Array<HTMLImageElement> {
    return this.worldObjectImages[type];
  }
}