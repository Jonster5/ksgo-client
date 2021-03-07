import type { MapItem } from '../data/maps';
import type { ShipStatObject } from '../data/ships';
import { Sprite } from '../engine/sprite';
import type { Stage } from '../engine/stage';

export interface Assets {
    maps: MapItem[];
    ships: ShipStatObject[];
    ionthrust: HTMLImageElement[];
}

export class Ship {
    sprite: Sprite;

    thrusters: Array<{
        sprite: Sprite;
        energy: number;
        thrust: number;
        direction: string;
    }>;
    weapons: Array<{}>;

    constructor(stage: Stage, stats: ShipStatObject, assets: Assets) {
        const img = new Image(stats.width * 5, stats.height * 5);
        img.src = stats.image;

        this.sprite = new Sprite([img], stats.width, stats.height);
        this.thrusters = [];

        stats.thrusters.forEach(({ size, x, y, direction, thrust, energy }) => {
            // const sprite = new Rectangle(size / 2, size, 'red', { color: '', thickness: 0 }, x, y);
            const sprite = new Sprite([...assets.ionthrust], size / 2, size, x, y);
            sprite.r =
                direction === 'forward'
                    ? 0
                    : direction === 'reverse'
                    ? Math.PI
                    : direction === 'right'
                    ? Math.PI / 2
                    : direction === 'left'
                    ? -Math.PI / 2
                    : Math.PI;

            this.thrusters.push({ sprite, energy, thrust, direction });

            sprite.visible = false;
        });

        this.sprite.add(...this.thrusters.map((t) => t.sprite));
        stage.add(this.sprite);
    }

    get rotation(): number {
        return this.sprite.r;
    }
    set rotation(value: number) {
        this.sprite.r = value;
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
