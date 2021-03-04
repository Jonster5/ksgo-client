import type { ShipStatObject } from '../data/ships';
import { Sprite } from '../engine/sprite';
import type { Stage } from '../engine/stage';

export class Ship {
    sprite: Sprite;

    thrusters: Array<{
        sprite: Sprite;
    }>;
    weapons: Array<{}>;

    constructor(stage: Stage, stats: ShipStatObject) {
        const img = new Image(stats.width * 5, stats.height * 5);
        img.src = stats.image;

        this.sprite = new Sprite([img], stats.width, stats.height);

        stage.add(this.sprite);
    }

    get x(): number {
        return this.sprite.x;
    }
    set x(val: number) {
        this.sprite.x = val;
    }

    get y(): number {
        return this.sprite.y;
    }
    set y(val: number) {
        this.sprite.y = val;
    }

    get vx(): number {
        return this.sprite.vx;
    }
    set vx(val: number) {
        this.sprite.vx = val;
    }

    get vy(): number {
        return this.sprite.vy;
    }
    set vy(val: number) {
        this.sprite.vy = val;
    }
}
