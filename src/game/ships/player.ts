import type { ShipStatObject } from '../data/ships';
import type { Sprite } from '../engine/sprite';
import type { Stage } from '../engine/stage';
import type { Asteroid } from '../stars/asteroid';
import type { Planet } from '../stars/planet';
import type { Star } from '../stars/star';
import { Ship } from './ship';
import type { Assets } from '../data/assets';

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

    constructor(stage: Stage, stats: ShipStatObject, assets: Assets) {
        super(stage, stats, assets);
        this.isAlive = true;
        this.mass = stats.mass;

        this.boost = false;
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;
        this.strafe = false;
        this.primary = false;

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            e.preventDefault();

            switch (e.key) {
                case 'W':
                    this.boost = true;
                case 'w':
                    this.forward = true;

                    this.thrusters
                        .filter(({ direction }) => direction === 'forward')
                        .forEach(({ sprite }) => {
                            sprite.visible = true;
                            sprite.start(50);
                        });
                    break;
                case 's':
                case 'S':
                    this.reverse = true;
                    break;
                case 'A':
                    this.strafe = true;
                case 'a':
                    this.thrusters
                        .filter(({ direction }) => direction === 'left')
                        .forEach(({ sprite }) => {
                            sprite.visible = true;
                            sprite.start(50);
                        });

                    this.left = true;
                    break;
                case 'D':
                    this.strafe = true;
                case 'd':
                    this.thrusters
                        .filter(({ direction }) => direction === 'right')
                        .forEach(({ sprite }) => {
                            sprite.visible = true;
                            sprite.start(50);
                        });
                    this.right = true;
                    break;
                case 'Shift':
                    this.boost = true;
                    this.strafe = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            e.preventDefault();

            switch (e.key) {
                case 'W':
                    this.boost = false;
                case 'w':
                    this.forward = false;

                    this.thrusters
                        .filter(({ direction }) => direction === 'forward')
                        .forEach(({ sprite }) => {
                            sprite.stop();
                            sprite.visible = false;
                        });
                    break;
                case 's':
                case 'S':
                    this.reverse = false;
                    break;
                case 'A':
                    this.strafe = false;
                case 'a':
                    this.thrusters
                        .filter(({ direction }) => direction === 'left')
                        .forEach(({ sprite }) => {
                            sprite.stop();
                            sprite.visible = false;
                        });

                    this.left = false;
                    break;
                case 'D':
                    this.strafe = false;
                case 'd':
                    this.thrusters
                        .filter(({ direction }) => direction === 'right')
                        .forEach(({ sprite }) => {
                            sprite.stop();
                            sprite.visible = false;
                        });

                    this.right = false;
                    break;
                case 'Shift':
                    this.boost = false;
                    this.strafe = false;
                    break;
            }
        });
    }

    update() {
        let cost = -this.energyGain;
        let forwardThrust = 0;

        let sideThrust = { l: 0, r: 0 };
        let turnThrust = { l: 0, r: 0 };

        if (this.forward) {
            this.thrusters
                .filter(({ direction }) => direction === 'forward')
                .forEach(({ energy, thrust }) => {
                    cost += energy;
                    forwardThrust += thrust;
                });
        }

        if (this.left) {
            this.thrusters
                .filter(({ direction }) => direction === 'left')
                .forEach(({ energy, thrust }) => {
                    cost += energy;

                    if (this.strafe) sideThrust.l += thrust;
                    else turnThrust.l += thrust;
                });
        }

        if (this.right) {
            this.thrusters
                .filter(({ direction }) => direction === 'right')
                .forEach(({ energy, thrust }) => {
                    cost += energy;

                    if (this.strafe) sideThrust.r += thrust;
                    else turnThrust.r += thrust;
                });
        }

        this.rotation -= turnThrust.l * 0.1;
        this.rotation += turnThrust.r * 0.1;

        this.vx += sideThrust.r * Math.sin(this.rotation + Math.PI / 2) * 0.1;
        this.vy += sideThrust.r * -Math.cos(this.rotation + Math.PI / 2) * 0.1;
        this.vx += sideThrust.l * Math.sin(this.rotation - Math.PI / 2) * 0.1;
        this.vy += sideThrust.l * -Math.cos(this.rotation - Math.PI / 2) * 0.1;

        this.vx += forwardThrust * Math.sin(this.rotation) * 0.1;
        this.vy += forwardThrust * -Math.cos(this.rotation) * 0.1;

        this.x += this.vx;
        this.y += this.vy;
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
}
