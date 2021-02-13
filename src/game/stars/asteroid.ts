import type { AsteroidItem } from '../data/maps';
import type { Stage } from '../engine/stage';
import { StellarObject } from './stellar';

export class Asteroid extends StellarObject {
    constructor(stage: Stage, stats: AsteroidItem) {
        super(stage, stats);
    }

    update(): { x: number; y: number } {
        return { x: 0, y: 0 };
    }
}
