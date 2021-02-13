import type { PlanetItem } from '../data/maps';
import type { Stage } from '../engine/stage';
import { StellarObject } from './stellar';

export class Planet extends StellarObject {
    constructor(stage: Stage, stats: PlanetItem) {
        super(stage, stats);
    }

    update(): { x: number; y: number } {
        return { x: 0, y: 0 };
    }
}