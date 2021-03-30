import type { AsteroidItem, PlanetItem, StarItem } from '@data/types';
import { Circle } from '@lib/circle';
import type { Stage } from '@lib/stage';

export class StellarObject {
    sprite: Circle;
    mass: number;

    constructor(stage: Stage, { diameter, color }) {
        this.sprite = new Circle((diameter as number) / 2, color, { color: '', thickness: 0 });

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
