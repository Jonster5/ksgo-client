import type { ParsedAssets } from '@data/assets';
import type { RemoteSendInfo } from '@data/multiplayer';
import type { ShipStatObject } from '@data/types';
import { Writable, writable } from 'svelte/store';
import { Sprite } from './api/sprite';
import type { Stage } from './api/stage';
import { Vec } from './api/vec';
import type { Star, Planet, Asteroid } from './stellar';
import { ShipThruster } from './thruster';
import { ShipUtils, Ship, Player, AI, Client, Remote } from './utils/shipUtils';
import { ShipLaser } from './weapon';

export type ShipObject =
    | PlayerShip
    | EnemyShip
    | RemoteShip
    | ClientShip
    | PlayerSpectator
    | ClientSpectator;

export type PlayerShipObject = PlayerShip | PlayerSpectator;
export type EnemyShipObject = EnemyShip;
export type RemoteShipObject = RemoteShip;
export type ClientShipObject = ClientShip | ClientSpectator;

export class PlayerShip extends ShipUtils implements Ship, Player {
    sprite: Sprite;
    thrusters: ShipThruster[];
    weapons: ShipLaser[];

    forward: boolean;
    left: boolean;
    right: boolean;
    mass: number;
    boost: boolean;

    e: Writable<number>;
    h: Writable<number>;
    s: Writable<number>;
    c: Writable<boolean>;

    maxEnergy: number;
    energyGain: number;
    maxSpeed: number;
    maxHull: number;

    energy: number;
    speed: number;
    hull: number;
    cooldown: boolean;

    us: () => void;
    ue: () => void;
    uh: () => void;
    uc: () => void;

    constructor(stage: Stage, stats: ShipStatObject, assets: ParsedAssets) {
        super();
        const img = new Image(stats.width * 5, stats.height * 5);
        img.src = stats.image;

        this.sprite = new Sprite([img], stats.width, stats.height);
        this.thrusters = [];

        this.thrusters = stats.thrusters.map((stats) => new ShipThruster(this, stats, assets));

        this.weapons = stats.weapons.map((stats) => new ShipLaser(this, stats, assets));

        this.sprite.add(...this.thrusters.map((t) => t.sprite));
        stage.add(this.sprite);

        this.s = writable(0);
        this.e = writable(0);
        this.h = writable(stats.max_hull);
        this.c = writable(false);

        this.mass = stats.mass;
        this.maxSpeed = stats.max_speed;

        this.maxEnergy = stats.max_energy;
        this.energyGain = stats.energy_gain;

        this.maxHull = stats.max_hull;

        this.forward = false;
        this.left = false;
        this.right = false;
        this.boost = false;

        this.energy = 0;
        this.speed = 0;
        this.hull = this.maxHull;
        this.cooldown = false;

        this.us = this.s.subscribe((v) => (this.speed = v));
        this.ue = this.e.subscribe((e) => (this.energy = e));
        this.uh = this.h.subscribe((h) => (this.hull = h));
        this.uc = this.c.subscribe((c) => (this.cooldown = c));

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            event.preventDefault();

            switch (event.key) {
                case 'W':
                    this.boost = true;
                case 'w':
                    this.forward = true;

                    !this.cooldown && this.thrusters.forEach((t) => t.on('forward'));
                    break;
                case 'S':
                case 's':
                    break;

                case 'A':
                case 'a':
                    this.left = true;

                    !this.cooldown && this.thrusters.forEach((t) => t.on('left'));
                    break;

                case 'D':
                case 'd':
                    this.right = true;

                    !this.cooldown && this.thrusters.forEach((t) => t.on('right'));
                    break;
                case ' ':
                    !this.cooldown && this.weapons.forEach((w) => w.on());
                    break;
                case 'Shift':
                    this.boost = true;
            }
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            event.preventDefault();
            switch (event.key) {
                case 'W':
                    this.boost = false;
                case 'w':
                    this.forward = false;

                    this.thrusters.forEach((t) => t.off('forward'));
                    break;
                case 'S':
                case 's':
                    break;

                case 'A':
                case 'a':
                    this.left = false;

                    this.thrusters.forEach((t) => t.off('left'));

                    break;

                case 'D':
                case 'd':
                    this.right = false;

                    this.thrusters.forEach((t) => t.off('right'));
                    break;
                case ' ':
                    this.weapons.forEach((w) => w.off());
                    break;
                case 'Shift':
                    this.boost = false;
                    break;
            }
        });
    }

    update(stage: Stage) {
        let cost = -this.energyGain;

        let fv = 0;
        let lv = 0;
        let rv = 0;

        if (this.energy <= 0) this.c.set(true);

        if (!this.cooldown) {
            this.thrusters
                .filter((t) => t.firing)
                .forEach((t) => {
                    cost += t.energy;
                    if (t.direction === 'forward') fv += t.thrust;
                    if (t.direction === 'right') rv += t.thrust;
                    if (t.direction === 'left') lv += t.thrust;
                });
            this.weapons.forEach((w) => w.fire(this));
        } else {
            this.thrusters.forEach((t) => t.off());
            if (this.energy >= this.maxEnergy) this.c.set(false);
        }

        this.e.update((e) =>
            e - cost < 0 ? 0 : e - cost > this.maxEnergy ? this.maxEnergy : e - cost
        );

        this.r -= lv * 0.1;
        this.r += rv * 0.1;

        let d = fv / this.mass;

        let dx = this.vx + d * Math.sin(this.r) * 0.1;
        let dy = this.vy + d * -Math.cos(this.r) * 0.1;

        this.s.set(Math.hypot(dx, dy));

        if (this.speed > this.maxSpeed) {
            let lx = isNaN(dx / this.speed) ? 0 : dx / this.speed;
            let ly = isNaN(dy / this.speed) ? 0 : dy / this.speed;

            this.vx = lx * this.maxSpeed;
            this.vy = ly * this.maxSpeed;
        } else {
            this.vx = dx;
            this.vy = dy;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x > stage.halfWidth) {
            this.sprite.setX(-stage.halfWidth);
            stage.setX(-this.x);
        } else if (this.x < -stage.halfWidth) {
            this.sprite.setX(stage.halfWidth);
            stage.setX(-this.x);
        }

        if (this.y > stage.halfHeight) {
            this.sprite.setY(-stage.halfHeight);
            stage.setY(-this.y);
        } else if (this.y < -stage.halfHeight) {
            this.sprite.setY(stage.halfHeight);
            stage.setY(-this.y);
        }

        stage.x = -this.x ?? 0;
        stage.y = -this.y ?? 0;
    }

    updateGravity(stars: Array<Star>, planets: Array<Planet>, asteroids: Array<Asteroid>) {
        let gm = new Vec(0, 0);

        if (stars.length > 0) {
            for (let star of stars) {
                const v = new Vec(star.x - this.x, star.y - this.y);

                const m = v.magnitude;

                v.normalize()
                    .multiply(star.mass * this.mass)
                    .divide(m);

                gm.add(v);
            }
        }
        if (planets.length > 0) {
            for (let planet of planets) {
                let vx = planet.x - this.x,
                    vy = planet.y - this.y;

                let m = Math.sqrt(vx * vx + vy * vy);

                let dx = vx / m,
                    dy = vy / m;

                gm.x += (dx * (planet.mass * this.mass)) / m;
                gm.y += (dy * (planet.mass * this.mass)) / m;
            }
        }

        if (asteroids.length > 0) {
            for (let asteroid of asteroids) {
                let vx = asteroid.x - this.x,
                    vy = asteroid.y - this.y;

                let m = Math.sqrt(vx * vx + vy * vy);

                let dx = vx / m,
                    dy = vy / m;

                gm.x += (dx * (asteroid.mass * this.mass)) / m;
                gm.y += (dy * (asteroid.mass * this.mass)) / m;
            }
        }

        this.vx += gm.x;
        this.vy += gm.y;
    }

    kill() {
        this.us();
        this.ue();
        this.uh();
    }
}

export class EnemyShip extends ShipUtils implements Ship, AI {
    sprite: Sprite;
    thrusters: ShipThruster[];
    weapons: ShipLaser[];

    forward: boolean;
    left: boolean;
    right: boolean;
    mass: number;
    boost: boolean;

    e: Writable<number>;
    h: Writable<number>;
    s: Writable<number>;

    maxEnergy: number;
    energyGain: number;
    maxSpeed: number;
    maxHull: number;

    energy: number;
    speed: number;
    hull: number;

    ai: {
        target: ShipObject;
    };

    us: () => void;
    ue: () => void;
    uh: () => void;

    constructor(stage: Stage, stats: ShipStatObject, assets: ParsedAssets) {
        super();
        const img = new Image(stats.width * 5, stats.height * 5);
        img.src = stats.enemy;

        this.sprite = new Sprite([img], stats.width, stats.height);
        this.thrusters = [];

        this.thrusters = stats.thrusters.map((stats) => new ShipThruster(this, stats, assets));
        this.weapons = stats.weapons.map((stats) => new ShipLaser(this, stats, assets));

        this.sprite.add(...this.thrusters.map((t) => t.sprite));
        stage.add(this.sprite);

        this.s = writable(0);
        this.e = writable(0);
        this.h = writable(stats.max_hull);

        this.mass = stats.mass;
        this.maxSpeed = stats.max_speed;

        this.maxEnergy = stats.max_energy;
        this.energyGain = stats.energy_gain;

        this.maxHull = stats.max_hull;

        this.forward = false;
        this.left = false;
        this.right = false;
        this.boost = false;

        this.energy = 0;
        this.speed = 0;
        this.hull = this.maxHull;

        this.ai = {
            target: null,
        };

        this.us = this.s.subscribe((v) => (this.speed = v));
        this.ue = this.e.subscribe((e) => (this.energy = e));
        this.uh = this.h.subscribe((h) => (this.hull = h));
    }

    AItarget(entities: Array<ShipObject>) {
        this.ai.target = entities[Math.floor(Math.random() * entities.length)];
    }

    AIturn(distance: number, dr: number) {
        const margin = Math.log(distance) / Math.log(this.sprite.w);

        console.log(dr - margin, dr + margin);

        if (dr > dr - margin && dr < dr + margin) {
            this.r = dr;
        }

        this.thrusters
            .filter(({ direction: d }) => d === 'left' || d === 'right')
            .forEach(({ sprite }) => (sprite.visible = false));

        return false;
    }

    AImove(distance: number, size: number, facingTarget: boolean) {
        if (distance < size / 3 && facingTarget && this.speed < this.ai.target.speed * 2) {
            this.forward = true;
            this.thrusters
                .filter(({ direction: d }) => d === 'forward')
                .forEach(({ sprite }) => (sprite.visible = true));
        } else {
            this.forward = false;
            this.thrusters
                .filter(({ direction: d }) => d === 'forward')
                .forEach(({ sprite }) => (sprite.visible = false));
        }
    }

    AIcruise() {}

    AIfire(distance: number) {
        if (distance <= this.weapons.reduce((a, b) => Math.max(a, b.length), 0))
            this.weapons.forEach((w) => w.on());
        else this.weapons.forEach((w) => w.on());
    }

    AI(entities: Array<ShipObject>, { size }) {
        entities = entities.filter((e) => e !== this);
        if (!this.ai.target) this.AItarget(entities);

        const { x, y, w, h } = this.ai.target.sprite;

        const dy = x - this.x;
        const dx = y - this.y;
        const theta = Math.atan2(dy, dx);

        const dr = ((theta + Math.PI + (this.r % (2 * Math.PI))) % (2 * Math.PI)) - Math.PI;
        const distance = Math.hypot(dy, dx);

        const facingTarget = this.AIturn(distance, dr);
        this.AImove(distance, size, facingTarget);
        this.AIfire(distance);
    }

    update(stage: Stage) {
        let cost = -this.energyGain;
        let forwardThrust = 0;

        let lv = 0;
        let rv = 0;

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
                .forEach(({ energy, thrust, sprite }) => {
                    sprite.visible = true;
                    cost += energy;
                    lv += thrust;
                });
        }

        if (this.right) {
            this.thrusters
                .filter(({ direction }) => direction === 'right')
                .forEach(({ energy, thrust, sprite }) => {
                    sprite.visible = true;
                    cost += energy;
                    rv += thrust;
                });
        }

        this.weapons.forEach((w) => w.fire(this));

        this.e.update((e) =>
            e - cost < 0 ? 0 : e - cost > this.maxEnergy ? this.maxEnergy : e - cost
        );

        this.r -= lv * 0.1;
        this.r += rv * 0.1;

        let d = forwardThrust / this.mass;

        let dx = this.vx + d * Math.sin(this.r) * 0.1;
        let dy = this.vy + d * -Math.cos(this.r) * 0.1;

        this.s.set(Math.hypot(dx, dy));

        if (this.speed > this.maxSpeed) {
            let lx = isNaN(dx / this.speed) ? 0 : dx / this.speed;
            let ly = isNaN(dy / this.speed) ? 0 : dy / this.speed;

            this.vx = lx * this.maxSpeed;
            this.vy = ly * this.maxSpeed;
        } else {
            this.vx = dx;
            this.vy = dy;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x > stage.halfWidth) this.sprite.setX(-stage.halfWidth);
        else if (this.x < -stage.halfWidth) this.sprite.setX(stage.halfWidth);

        if (this.y > stage.halfHeight) this.sprite.setY(-stage.halfHeight);
        else if (this.y < -stage.halfHeight) this.sprite.setY(stage.halfHeight);
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

    kill() {
        this.us();
        this.ue();
        this.uh();
    }
}

export class RemoteShip extends ShipUtils implements Ship, Remote {
    thrusters: ShipThruster[];
    weapons: ShipLaser[];
    forward: boolean;
    left: boolean;
    right: boolean;
    mass: number;
    boost: boolean;
    e: Writable<number>;
    h: Writable<number>;
    s: Writable<number>;
    maxEnergy: number;
    energyGain: number;
    maxSpeed: number;
    maxHull: number;
    energy: number;
    speed: number;
    hull: number;
    us: () => void;
    ue: () => void;
    uh: () => void;
    kill(): void {
        throw new Error('Method not implemented.');
    }
    update(info: RemoteSendInfo): void {
        throw new Error('Method not implemented.');
    }
}

export class ClientShip extends ShipUtils implements Ship, Player, Client {
    thrusters: ShipThruster[];
    weapons: ShipLaser[];
    forward: boolean;
    left: boolean;
    right: boolean;
    mass: number;
    boost: boolean;
    e: Writable<number>;
    h: Writable<number>;
    s: Writable<number>;
    maxEnergy: number;
    energyGain: number;
    maxSpeed: number;
    maxHull: number;
    energy: number;
    speed: number;
    hull: number;
    us: () => void;
    ue: () => void;
    uh: () => void;
    kill(): void {
        throw new Error('Method not implemented.');
    }
    c: Writable<boolean>;
    cooldown: boolean;
    uc: () => void;
    update(stage: Stage): void {
        throw new Error('Method not implemented.');
    }
    updateGravity(stars: Star[], planets: Planet[], asteroids: Asteroid[]): void {
        throw new Error('Method not implemented.');
    }
    sendInfo(): void {
        throw new Error('Method not implemented.');
    }
}

export class PlayerSpectator extends ShipUtils implements Ship, Player {
    sprite: Sprite;
    thrusters: ShipThruster[];
    weapons: ShipLaser[];

    forward: boolean;
    left: boolean;
    right: boolean;
    mass: number;
    boost: boolean;

    e: Writable<number>;
    h: Writable<number>;
    s: Writable<number>;

    maxEnergy: number;
    energyGain: number;
    maxSpeed: number;

    energy: number;
    speed: number;
    hull: number;

    us: () => void;
    ue: () => void;
    uh: () => void;
    up: boolean;
    down: boolean;
    constructor(stage: Stage, stats: ShipStatObject, assets: ParsedAssets) {
        super();
        const img = new Image(stats.width * 5, stats.height * 5);
        img.src = stats.image;

        this.sprite = new Sprite([img], stats.width, stats.height);

        stage.add(this.sprite);

        this.s = writable(1);
        this.e = writable(1);
        this.h = writable(1);
        this.c = writable(false);

        this.maxSpeed = stats.max_speed;

        this.up = false;
        this.left = false;
        this.right = false;
        this.down = false;
        this.boost = false;

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            event.preventDefault();

            switch (event.key) {
                case 'W':
                    this.boost = true;
                case 'w':
                    this.up = true;
                    break;
                case 'S':
                    this.boost = true;
                case 's':
                    this.down = true;
                    break;
                case 'A':
                    this.boost = true;
                case 'a':
                    this.left = true;
                    break;
                case 'D':
                    this.boost = true;
                case 'd':
                    this.right = true;
                    break;
                case 'Shift':
                    this.boost = true;
                    break;
            }
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            event.preventDefault();
            switch (event.key) {
                case 'W':
                    this.boost = false;
                case 'w':
                    this.up = false;
                    break;
                case 'S':
                    this.boost = false;
                case 's':
                    this.down = false;
                    break;
                case 'A':
                    this.boost = false;
                case 'a':
                    this.left = false;
                    break;
                case 'D':
                    this.boost = false;
                case 'd':
                    this.right = false;
                    break;
                case 'Shift':
                    this.boost = false;
                    break;
            }
        });
    }
    c: Writable<boolean>;
    cooldown: boolean;
    uc: () => void;
    maxHull: number;

    update(stage: Stage) {
        this.r = 0;
        this.vx = 0;
        this.vy = 0;

        if (this.up) this.vy += -this.maxSpeed;
        if (this.down) this.vy += this.maxSpeed;
        if (this.left) this.vx += -this.maxSpeed;
        if (this.right) this.vx += this.maxSpeed;

        if (this.boost) this.vx *= 2;
        if (this.boost) this.vy *= 2;

        this.s.set(Math.hypot(this.vx, this.vy));

        this.x += this.vx;
        this.y += this.vy;

        if (this.x > stage.halfWidth) {
            this.sprite.setX(-stage.halfWidth);
            stage.setX(-this.x);
        } else if (this.x < -stage.halfWidth) {
            this.sprite.setX(stage.halfWidth);
            stage.setX(-this.x);
        }

        if (this.y > stage.halfHeight) {
            this.sprite.setY(-stage.halfHeight);
            stage.setY(-this.y);
        } else if (this.y < -stage.halfHeight) {
            this.sprite.setY(stage.halfHeight);
            stage.setY(-this.y);
        }

        stage.x = -this.x ?? 0;
        stage.y = -this.y ?? 0;
    }

    updateGravity(stars: Array<Star>, planets: Array<Planet>, asteroids: Array<Asteroid>) {}

    kill() {
        this.us();
        this.ue();
        this.uh();
    }
}

export class ClientSpectator extends ShipUtils implements Ship, Player, Client {
    thrusters: ShipThruster[];
    weapons: ShipLaser[];
    forward: boolean;
    left: boolean;
    right: boolean;

    mass: number;
    boost: boolean;
    e: Writable<number>;
    h: Writable<number>;
    s: Writable<number>;
    maxEnergy: number;
    energyGain: number;
    maxSpeed: number;
    maxHull: number;
    energy: number;
    speed: number;
    hull: number;
    us: () => void;
    ue: () => void;
    uh: () => void;

    constructor() {
        super();
    }
    c: Writable<boolean>;
    cooldown: boolean;
    uc: () => void;
    info: { fd: boolean; rt: boolean; lt: boolean; rn: number };

    update(): void {
        throw new Error('Method not implemented.');
    }
    updateGravity(stars: Star[], planets: Planet[], asteroids: Asteroid[]): void {
        throw new Error('Method not implemented.');
    }
    sendInfo(): void {
        throw new Error('Method not implemented.');
    }
    kill(): void {
        throw new Error('Method not implemented.');
    }
}
