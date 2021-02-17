import type { PlanetItem } from '../data/maps';
import { Circle } from '../engine/circle';
import type { Stage } from '../engine/stage';
import type { Star } from './star';
import { StellarObject } from './stellar';

export class Planet extends StellarObject {
    constructor(stage: Stage, stats: PlanetItem) {
        const { x, y, vx, vy, mass, diameter, color } = stats;
        super(stage, { diameter, color });

        this.sprite.x = x as number;
        this.sprite.y = y as number;
        this.sprite.vx = vx as number;
        this.sprite.vy = vy as number;

        this.mass = (mass as number) / 10;
    }

    update_grav(stars: Array<Star>, planets: Array<Planet>) {
        const gravity_modifier = { x: 0, y: 0 };

        if (stars.length > 0) {
            for (let star of stars) {
                let vx = star.x - this.x,
                    vy = star.y - this.y;

                console.assert(!isNaN(vx));
                console.assert(!isNaN(vy));

                let m = Math.sqrt(vx * vx + vy * vy);

                console.assert(!isNaN(m));

                let dx = vx / m,
                    dy = vy / m;

                console.assert(!isNaN(dx));
                console.assert(!isNaN(dy));

                gravity_modifier.x += (dx * (star.mass * this.mass)) / m;
                gravity_modifier.y += (dy * (star.mass * this.mass)) / m;

                console.assert(!isNaN(gravity_modifier.x));
                console.assert(!isNaN(gravity_modifier.y));
            }
        }
        // if (planets.length > 0) {
        //     for (let planet of planets) {
        //         let vx = planet.x - this.x,
        //             vy = planet.y - this.y;

        //         let m = Math.sqrt(vx * vx + vy * vy);

        //         let dx = vx / m,
        //             dy = vy / m;

        //         gravity_modifier.x += (dx * (planet.mass * this.mass)) / m;
        //         gravity_modifier.y += (dy * (planet.mass * this.mass)) / m;
        //     }
        // }

        this.vx += gravity_modifier.x;
        this.vy += gravity_modifier.y;
    }
}
