import type { ShipStatObject } from '../data/ships';
import type { Stage } from '../engine/stage';
import { Ship } from './ship';

export class Player extends Ship {
    constructor(stage: Stage, stats: ShipStatObject) {
        super(stage, stats);
    }
}
