import type { Direction } from '@data/types';
import type { Sprite } from '../api/sprite';

export interface Thruster {
    sprite: Sprite;
    energy: number;
    thrust: number;
    direction: Direction;
    firing: boolean;

    on(d?: Direction): void;
    off(d?: Direction): void;
}

export abstract class ThrusterUtils {
    sprite: Sprite;
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
