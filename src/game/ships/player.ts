import type { ShipStatObject } from '../data/ships';
import type { Stage } from '../engine/stage';
import type { Asteroid } from '../stars/asteroid';
import type { Planet } from '../stars/planet';
import type { Star } from '../stars/star';
import { Ship } from './ship';

export class Player extends Ship {
    mass: number;
    isAlive: boolean;

    constructor(stage: Stage, stats: ShipStatObject) {
        super(stage, stats);

        this.isAlive = true;

        this.mass = stats.mass;
    }

    updateGravity(stars: Array<Star>, planets: Array<Planet>, asteroids: Array<Asteroid>) {
        const gravity_modifier = { x: 0, y: 0 };

        if (stars.length > 0) {
            for (let star of stars) {
                let vx = star.x - this.x,
                    vy = star.y - this.y;

                let m = Math.sqrt(vx * vx + vy * vy);

                let dx = vx / m,
                    dy = vy / m;

                gravity_modifier.x += (dx * (star.mass * this.mass)) / m;
                gravity_modifier.y += (dy * (star.mass * this.mass)) / m;
            }
        }
        if (planets.length > 0) {
            for (let planet of planets) {
                let vx = planet.x - this.x,
                    vy = planet.y - this.y;

                let m = Math.sqrt(vx * vx + vy * vy);

                let dx = vx / m,
                    dy = vy / m;

                gravity_modifier.x += (dx * (planet.mass * this.mass)) / m;
                gravity_modifier.y += (dy * (planet.mass * this.mass)) / m;
            }
        }

        if (asteroids.length > 0) {
            for (let asteroid of asteroids) {
                let vx = asteroid.x - this.x,
                    vy = asteroid.y - this.y;

                let m = Math.sqrt(vx * vx + vy * vy);

                let dx = vx / m,
                    dy = vy / m;

                gravity_modifier.x += (dx * (asteroid.mass * this.mass)) / m;
                gravity_modifier.y += (dy * (asteroid.mass * this.mass)) / m;
            }
        }

        this.vx += gravity_modifier.x;
        this.vy += gravity_modifier.y;
    }

    update() {}
}
