import type { Stage, Texture } from '@api/material';
import type { Sprite } from '@api/sprite';
import type { ShipObject } from '@classes/ship';
import type { Star, Planet, Asteroid } from '@classes/stellar';
import type { ShipThruster } from '@classes/thruster';
import type { ShipLaser } from '@classes/weapon';
import type { Writable } from 'svelte/store';

export interface Ship {
	sprite: Sprite<Texture>;
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

	update(stage: Sprite<Stage>): void;
	updateGravity(
		stars: Star[],
		planets: Planet[],
		asteroids: Asteroid[]
	): void;
}

export interface AI {
	ai: {
		target: ShipObject;
	};
	AI(entities: ShipObject[], { size: number }): void;
	AItarget(entities: ShipObject[]): void;
	AIturn(distance: number, dr: number): boolean;
	AImove(distance: number, size: number, facingTarget: boolean): void;
	AIfire(distance: number): void;
	AIcruise(distance: number): void;
	update(stage: Stage): void;
}
