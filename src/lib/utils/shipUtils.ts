import type { Sprite } from '@api/sprite';
import type { Stage } from '@api/stage';
import type { ShipObject } from '@classes/ship';
import type { Star, Planet, Asteroid } from '@classes/stellar';
import type { ShipThruster } from '@classes/thruster';
import type { ShipLaser } from '@classes/weapon';
import type { RemoteSendInfo } from '@data/multiplayer';
import type { Writable } from 'svelte/store';

export interface Ship {
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

	us: () => void;
	ue: () => void;
	uh: () => void;

	kill(): void;
}

export interface Player {
	c: Writable<boolean>;
	cooldown: boolean;

	uc: () => void;

	update(stage: Stage): void;
	updateGravity(
		stars: Array<Star>,
		planets: Array<Planet>,
		asteroids: Array<Asteroid>
	): void;
}

export interface AI {
	ai: {
		target: ShipObject;
	};
	AI(entities: Array<ShipObject>, { size: number }): void;
	AItarget(entities: Array<ShipObject>): void;
	AIturn(distance: number, dr: number): boolean;
	AImove(distance: number, size: number, facingTarget: boolean): void;
	AIfire(distance: number): void;
	AIcruise(distance: number): void;
	update(stage: Stage): void;
}

export interface Remote {
	update(info: RemoteSendInfo): void;
}

export interface Client {
	sendInfo(): void;
}

export abstract class ShipUtils {
	sprite: Sprite;
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
