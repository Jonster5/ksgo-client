import type { Vec2 } from '@api/vec2';

export type Direction = 'forward' | 'right' | 'left' | 'reverse';

export interface RawAssets {
	maps: RawMapItem[];
	ships: RawShipItem[];
	modes: RawModeItem[];
	ionthrust: string[];
	gamebg: string[];
}

export interface ParsedAssets {
	maps: ParsedMapItem[];
	ships: ParsedShipItem[];
	modes: ParsedModeItem[];
	ionthrust: HTMLImageElement[];
	gamebg: HTMLImageElement[];
}

export interface RawModeItem {
	name: string;
	description: string;

	setMap: true | string;
	setGravity: true | number;
	setTimeLimit: true | number;
	setKillLimit: true | number;

	thumb: string;
	alt: string;
}

export interface ParsedModeItem {
	name: string;
	description: string;

	setMap: true | string;
	setGravity: true | number;
	setTimeLimit: true | number;
	setKillLimit: true | number;

	thumb: HTMLImageElement;
	alt: string;
}

export interface RawMapItem {
	version: number;
	name: string;
	size: number;
	friction: number;
	stars: RawStarItem[];
	planets: RawPlanetItem[];
	asteroids: RawAsteroidItem[];
	spawn: RawSpawnItem[];
	thumb: string;
	alt: string;
}

export interface ParsedMapItem {
	version: number;
	name: string;
	size: number;
	friction: number;
	stars: ParsedStarItem[];
	planets: ParsedPlanetItem[];
	asteroids: ParsedAsteroidItem[];
	spawns: ParsedSpawnItem[];
	thumb: HTMLImageElement;
	alt: string;
}

export interface RawStarItem {
	x: number | string;
	y: number | string;
	diameter: number | string;
	mass: number | string;
	color: string;
}

export interface ParsedStarItem {
	uPosition: Vec2;
	lPosition: Vec2;

	uDiameter: number;
	lDiameter: number;

	uMass: number;
	lMass: number;

	color: string;
}

export interface RawPlanetItem {
	x: number | string;
	y: number | string;
	vx: number | string;
	vy: number | string;
	diameter: number | string;
	mass: number | string;
	color: string;
}

export interface ParsedPlanetItem {
	uPosition: Vec2;
	lPosition: Vec2;
	uVelocity: Vec2;
	lVelocity: Vec2;

	uDiameter: number;
	lDiameter: number;

	uMass: number;
	lMass: number;

	color: string;
}

export interface RawAsteroidItem {
	x: number | string;
	y: number | string;
	diameter: number | string;
	mass: number | string;
	color: string;
	vx: number | string;
	vy: number | string;
}

export interface ParsedAsteroidItem {
	uPosition: Vec2;
	lPosition: Vec2;
	uVelocity: Vec2;
	lVelocity: Vec2;

	uDiameter: number;
	lDiameter: number;

	uMass: number;
	lMass: number;

	color: string;
}

export interface RawSpawnItem {
	x: number;
	y: number;
	size: number;
}

export interface ParsedSpawnItem {
	position: Vec2;
	size: number;
}

export interface RawShipItem {
	version: number;
	name: string;
	faction: string;
	width: number;
	height: number;

	max_energy: number;
	energy_gain: number;
	max_hull: number;
	max_speed: number;

	mass: number;

	thrusters: RawShipThrustItem[];

	weapons: RawShipWeaponItem[];

	image: string;
	thumb: string;
}

export interface ParsedShipItem {
	version: number;
	name: string;
	faction: string;
	size: Vec2;

	maxEnergy: number;
	energyGain: number;
	maxHull: number;
	maxSpeed: number;

	mass: number;

	thrusters: ParsedShipThrustItem[];
	weapons: ParsedShipWeaponItem[];

	image: HTMLImageElement;
	thumb: HTMLImageElement;
}

export interface RawShipThrustItem {
	direction: Direction;
	size: number;
	x: number;
	y: number;
	energy: number;
	thrust: number;
}

export interface ParsedShipThrustItem {
	direction: Direction;
	size: number;
	position: Vec2;
	energy: number;
	thrust: number;
}

export interface RawShipWeaponItem {
	type: string;
	direction: Direction;
	length: number;
	width: number;
	x: number;
	y: number;

	damage: number;
	energy: number;
}

export interface ParsedShipWeaponItem {
	direction: Direction;
	type: string;
	length: number;
	width: number;
	position: Vec2;

	damage: number;
	energy: number;
}
