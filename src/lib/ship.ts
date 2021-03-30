import type { MapItem, ShipStatObject } from '@data/types';
import { Sprite } from './sprite';
import type { Stage } from './stage';
import type { ParsedAssets } from '@data/assets';
import type { Asteroid } from './asteroid';
import type { Planet } from './planet';
import type { Star } from './star';
import { writable, Writable } from 'svelte/store';

export function ship(name: string, stage: Stage, stats: ShipStatObject, assets: ParsedAssets) {
    switch (name) {
        case 'Fighter':
            return new Fighter(stage, stats, assets);
        case 'Frigate':
        case 'Cruiser':
        default:
            return new Fighter(stage, stats, assets);
    }
}

export type ShipObject = Fighter;

class Fighter implements Ship {
    sprite: Sprite;
    thrusters: { sprite: Sprite; energy: number; thrust: number; direction: string }[];
    weapons: {}[];
    forward: boolean;
    left: boolean;
    right: boolean;
    mass: number;
    maxEnergy: number;
    energy: Writable<number>;
    energyGain: number;

    boost: boolean;
    strafe: boolean;

    constructor(stage: Stage, stats: ShipStatObject, assets: ParsedAssets) {
        const img = new Image(stats.width * 5, stats.height * 5);
        img.src = stats.image;

        this.sprite = new Sprite([img], stats.width, stats.height);
        this.thrusters = [];

        stats.thrusters.forEach(({ size, x, y, direction, thrust, energy }) => {
            const sprite = new Sprite([...assets.ionthrust], size / 2, size, x, y);
            sprite.r =
                direction === 'forward'
                    ? 0
                    : direction === 'reverse'
                    ? Math.PI
                    : direction === 'right'
                    ? Math.PI / 2
                    : direction === 'left'
                    ? -Math.PI / 2
                    : Math.PI;

            this.thrusters.push({ sprite, energy, thrust, direction });

            sprite.visible = false;

            this.mass = stats.mass;
            this.maxEnergy = stats.max_energy;
            this.energy = writable(0);
            this.energyGain = stats.energy_gain;

            this.forward = false;
            this.left = false;
            this.right = false;

            this.boost = false;
            this.strafe = false;
        });

        this.sprite.add(...this.thrusters.map((t) => t.sprite));
        stage.add(this.sprite);

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            event.preventDefault();

            switch (event.key) {
                case 'W':
                    this.boost = true;
                case 'w':
                    this.forward = true;

                    this.thrusters
                        .filter(({ direction }) => direction === 'forward')
                        .forEach(({ sprite }) => {
                            sprite.start(100);
                            sprite.visible = true;
                        });
                    break;
                case 'S':
                case 's':
                    break;
                case 'A':
                    this.strafe = true;
                case 'a':
                    this.left = true;

                    this.thrusters
                        .filter(({ direction }) => direction === 'left')
                        .forEach(({ sprite }) => {
                            sprite.start(100);
                            sprite.visible = true;
                        });
                    break;
                case 'D':
                    this.strafe = true;
                case 'd':
                    this.right = true;

                    this.thrusters
                        .filter(({ direction }) => direction === 'right')
                        .forEach(({ sprite }) => {
                            sprite.start(100);
                            sprite.visible = true;
                        });
                    break;
                case 'Shift':
                    this.boost = true;
                    this.strafe = true;
            }
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            event.preventDefault();
            switch (event.key) {
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
                case 'S':
                case 's':
                    break;
                case 'A':
                    this.strafe = false;
                case 'a':
                    this.left = false;

                    this.thrusters
                        .filter(({ direction }) => direction === 'left')
                        .forEach(({ sprite }) => {
                            sprite.stop();
                            sprite.visible = false;
                        });
                    break;
                case 'D':
                    this.strafe = false;
                case 'd':
                    this.right = false;

                    this.thrusters
                        .filter(({ direction }) => direction === 'right')
                        .forEach(({ sprite }) => {
                            sprite.stop();
                            sprite.visible = false;
                        });
                    break;
                case 'Shift':
                    this.strafe = false;
                    this.boost = false;
                    break;
            }
        });
    }

    update() {
        let cost = -this.energyGain;
        let forwardThrust = 0;

        let turnThrust = { l: 0, r: 0 };
        let sideThrust = { l: 0, r: 0 };

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
                    if (!this.strafe) turnThrust.l += thrust;
                    else sideThrust.l += thrust;
                });
        }

        if (this.right) {
            this.thrusters
                .filter(({ direction }) => direction === 'right')
                .forEach(({ energy, thrust }) => {
                    cost += energy;
                    if (!this.strafe) turnThrust.r += thrust;
                    else sideThrust.r += thrust;
                });
        }

        this.energy.update((e) =>
            e - cost < 0 ? 0 : e - cost > this.maxEnergy ? this.maxEnergy : e - cost
        );

        this.r -= turnThrust.l * 0.1;
        this.r += turnThrust.r * 0.1;

        this.vx += sideThrust.r * Math.sin(this.rotation + Math.PI / 2) * 0.1;
        this.vy += sideThrust.r * -Math.cos(this.rotation + Math.PI / 2) * 0.1;
        this.vx += sideThrust.l * Math.sin(this.rotation - Math.PI / 2) * 0.1;
        this.vy += sideThrust.l * -Math.cos(this.rotation - Math.PI / 2) * 0.1;

        this.vx += forwardThrust * Math.sin(this.rotation) * 0.1;
        this.vy += forwardThrust * -Math.cos(this.rotation) * 0.1;

        this.x += this.vx / this.mass;
        this.y += this.vy / this.mass;
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

    get rotation(): number {
        return this.sprite.r;
    }
    set rotation(value: number) {
        this.sprite.r = value;
    }

    get r(): number {
        return this.sprite.r;
    }
    set r(value: number) {
        this.sprite.r = value;
    }

    get x(): number {
        return this.sprite.x;
    }
    set x(val: number) {
        this.sprite.x = val;
    }

    get y(): number {
        return this.sprite.y;
    }
    set y(val: number) {
        this.sprite.y = val;
    }

    get vx(): number {
        return this.sprite.vx;
    }
    set vx(val: number) {
        this.sprite.vx = val;
    }

    get vy(): number {
        return this.sprite.vy;
    }
    set vy(val: number) {
        this.sprite.vy = val;
    }
}

interface Ship {
    sprite: Sprite;
    thrusters: Array<{
        sprite: Sprite;
        energy: number;
        thrust: number;
        direction: string;
    }>;
    weapons: Array<{}>;

    forward: boolean;
    left: boolean;
    right: boolean;
    mass: number;

    maxEnergy: number;
    energy: Writable<number>;
    energyGain: number;
}
