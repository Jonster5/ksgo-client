import type { Direction } from '@data/types';
import type { Rectangle } from '../api/rectangle';
import type { ShipObject } from '@lib/ship';
import type { Point } from '../api/vec';

export interface Weapon {
    damage: number;
    sprite: Rectangle;
    firing: boolean;

    direction: Direction;

    on(ship: ShipObject): void;
    off(ship: ShipObject): void;
    fire(ship: ShipObject): void;

    x: number;
    y: number;
    r: number;
    length: number;
}

export interface Laser {
    points: [Point, Point];
}

export abstract class WeaponUtils {
    sprite: Rectangle;
    get x(): number {
        return this.sprite.x;
    }

    set x(v: number) {
        this.sprite.x = v;
    }

    get y(): number {
        return this.sprite.y;
    }

    set y(v: number) {
        this.sprite.y = v;
    }

    get r(): number {
        return this.sprite.r;
    }

    set r(v: number) {
        this.sprite.r = v;
    }
}
