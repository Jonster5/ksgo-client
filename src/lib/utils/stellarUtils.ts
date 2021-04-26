import type { Circle } from '@lib/api/circle';

export interface SpawnObject {
    x: number;
    y: number;
    size: number;

    getCoords(): { x: number; y: number };
}

export interface StellarObject {
    sprite: Circle;
    mass: number;
}

export abstract class StellarUtils {
    sprite: Circle;
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
