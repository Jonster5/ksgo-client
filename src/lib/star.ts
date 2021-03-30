import type { StarItem } from '@data/types';
import { Circle } from '@lib/circle';
import type { Stage } from '@lib/stage';
import { StellarObject } from '@lib/stellar';

export class Star extends StellarObject {
    constructor(stage: Stage, stats: StarItem) {
        const { x, y, mass, diameter, color } = stats;

        super(stage, { diameter, color });

        this.sprite.x = x as number;
        this.sprite.y = y as number;

        this.mass = (mass as number) / 10;
    }
}
