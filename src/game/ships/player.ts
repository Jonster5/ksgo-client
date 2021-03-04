import type { ShipStatObject } from '../data/ships';
import type { Sprite } from '../engine/sprite';
import type { Stage } from '../engine/stage';
import type { Asteroid } from '../stars/asteroid';
import type { Planet } from '../stars/planet';
import type { Star } from '../stars/star';
import { Ship } from './ship';

export class Player extends Ship {
    mass: number;
    isAlive: boolean;

    boost: boolean;
    forward: boolean;
    reverse: boolean;
    left: boolean;
    right: boolean;
    strafe: boolean;

    primary: boolean;

    maxEnergy: number;
    energy: number;
    energyGain: number;

    constructor(stage: Stage, stats: ShipStatObject) {
        super(stage, stats);
        this.isAlive = true;
        this.mass = stats.mass;

        this.boost = false;
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;
        this.strafe = false;
        this.primary = false;

        this.sprite.parent.parent.element.addEventListener('keydown', (e: KeyboardEvent) => {
            e.preventDefault();

            switch (e.key) {
                case 'W':
                    this.boost = true;
                case 'w':
                    this.forward = true;
                    break;
                case 's':
                case 'S':
                    this.reverse = true;
                    break;
                case 'A':
                    this.strafe = true;
                case 'a':
                    this.left = true;
                    break;
                case 'D':
                    this.strafe = true;
                case 'd':
                    this.right = true;
                    break;
                case 'Shift':
                    this.boost = true;
                    this.strafe = true;
                    break;
            }
        });

        this.sprite.parent.parent.element.addEventListener('keyup', (e: KeyboardEvent) => {
            e.preventDefault();

            switch (e.key) {
                case 'W':
                    this.boost = false;
                case 'w':
                    this.forward = false;
                    break;
                case 's':
                case 'S':
                    this.reverse = false;
                    break;
                case 'A':
                    this.strafe = false;
                case 'a':
                    this.left = false;
                    break;
                case 'D':
                    this.strafe = false;
                case 'd':
                    this.right = false;
                    break;
                case 'Shift':
                    this.boost = false;
                    this.strafe = false;
                    break;
            }
        });
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

    update() {
        let cost = -this.energyGain;
    }
}
