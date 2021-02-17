import type { AsteroidItem } from '../data/maps';
import { Circle } from '../engine/circle';
import type { Stage } from '../engine/stage';
import { StellarObject } from './stellar';

export class Asteroid extends StellarObject {
    constructor(stage: Stage, stats: AsteroidItem) {
        const { x, y, vx, vy, mass, diameter, color } = stats;
        super(stage, { diameter, color });

        this.sprite.x = x as number;
        this.sprite.y = y as number;
        this.sprite.vx = vx as number;
        this.sprite.vy = vy as number;

        this.mass = (mass as number) / 10;
    }

    update(): { x: number; y: number } {
        return { x: 0, y: 0 };
    }
}
