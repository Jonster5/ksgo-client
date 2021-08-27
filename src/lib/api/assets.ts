import { Vec2 } from '@api/vec2';
import type {
	ParsedAssets,
	RawAssets,
	RawMapItem,
	RawShipItem,
	RawModeItem,
	ParsedMapItem,
	ParsedShipItem,
	ParsedModeItem,
	RawShipThrustItem,
	ParsedShipThrustItem,
	RawShipWeaponItem,
	ParsedShipWeaponItem,
	RawStarItem,
	ParsedStarItem,
	RawPlanetItem,
	ParsedPlanetItem,
	RawAsteroidItem,
	ParsedAsteroidItem,
	RawSpawnItem,
	ParsedSpawnItem,
} from '@data/assetTypes';

const SHIP_BASE = '/data/ships/';
const MAP_BASE = '/data/maps/';
const MODE_BASE = '/data/modes/';
const IMAGE_BASE = '/data/images/';

export async function LoadAssets(assetURL: string): Promise<ParsedAssets> {
	try {
		const response = await fetch(assetURL);
		if (!response.ok) throw new Error(response.statusText);

		const json = await response.json();

		const rawAssets: RawAssets = {
			maps: await Promise.all(
				json.maps.map(
					(m: string): Promise<RawMapItem> =>
						fetch(`${MAP_BASE}${m}`).then((r) => r.json())
				)
			),
			ships: await Promise.all(
				json.ships.map(
					(m: string): Promise<RawShipItem> =>
						fetch(`${SHIP_BASE}${m}`).then((r) => r.json())
				)
			),
			modes: await Promise.all(
				json.modes.map(
					(m: string): Promise<RawModeItem> =>
						fetch(`${MODE_BASE}${m}`).then((r) => r.json())
				)
			),
			ionthrust: json.ionthrust,
			gamebg: json.gamebg,
		};

		const maps: ParsedMapItem[] = await Promise.all(rawAssets.maps.map(LoadMap));
		const ships: ParsedShipItem[] = await Promise.all(rawAssets.ships.map(LoadShip));
		const modes: ParsedModeItem[] = await Promise.all(rawAssets.modes.map(LoadMode));
		const ionthrust: HTMLImageElement[] = await Promise.all(
			rawAssets.ionthrust.map((i) => LoadImage(IMAGE_BASE + i))
		);
		const gamebg: HTMLImageElement[] = await Promise.all(
			rawAssets.gamebg.map((g) => LoadImage(IMAGE_BASE + g))
		);

		return {
			maps,
			ships,
			modes,
			ionthrust,
			gamebg,
		};
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export function LoadImage(input: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const out = new Image();
		out.src = input;

		out.onerror = (err) => {
			reject(`Image ${input} failed to load: ${err}`);
		};

		out.onload = () => {
			resolve(out);
		};
	});
}

export function LoadFuzzyNumber(input: number | string): [number, number] {
	if (typeof input === 'string') {
		const s: [string, string] = input.split(' ') as [string, string];
		return s.map(parseFloat) as [number, number];
	} else {
		return [input, input];
	}
}

export async function LoadMode(input: RawModeItem): Promise<ParsedModeItem> {
	const { name, description, setMap, setGravity, setTimeLimit, setKillLimit, thumb, alt } = input;

	return {
		name,
		description,

		setMap,
		setGravity,
		setTimeLimit,
		setKillLimit,

		thumb: await LoadImage(MODE_BASE + thumb),
		alt,
	};
}

export async function LoadShip(input: RawShipItem): Promise<ParsedShipItem> {
	const {
		version,
		name,
		faction,
		width,
		height,
		max_energy,
		energy_gain,
		max_hull,
		max_speed,
		mass,
		thrusters,
		weapons,
		image,
		thumb,
	} = input;

	return {
		version,
		name,
		faction,
		size: new Vec2(width, height),
		maxEnergy: max_energy,
		energyGain: energy_gain,
		maxHull: max_hull,
		maxSpeed: max_speed,
		mass,
		thrusters: thrusters.map(LoadShipThruster),
		weapons: weapons.map(LoadShipWeapon),
		image: await LoadImage(SHIP_BASE + image),
		thumb: await LoadImage(SHIP_BASE + thumb),
	};
}

export function LoadShipThruster(input: RawShipThrustItem): ParsedShipThrustItem {
	const { x, y, size, thrust, direction, energy } = input;

	return {
		position: new Vec2(x, y),
		size,
		thrust,
		direction,
		energy,
	};
}

export function LoadShipWeapon(input: RawShipWeaponItem): ParsedShipWeaponItem {
	const { x, y, direction, energy, damage, length, type, width } = input;

	return {
		position: new Vec2(x, y),
		direction,
		damage,
		energy,
		length,
		width,
		type,
	};
}

export async function LoadMap(input: RawMapItem): Promise<ParsedMapItem> {
	const { version, name, size, friction, stars, planets, asteroids, spawn, thumb, alt } = input;

	return {
		version,
		name,
		size,
		friction,

		stars: stars.map(LoadStar),
		planets: planets.map(LoadPlanet),
		asteroids: asteroids.map(LoadAsteroid),
		spawns: spawn.map(LoadSpawn),

		thumb: await LoadImage(MAP_BASE + thumb),
		alt,
	};
}

export function LoadStar(input: RawStarItem): ParsedStarItem {
	const { x, y, diameter, mass, color } = input;

	const parsedX = LoadFuzzyNumber(x);
	const parsedY = LoadFuzzyNumber(y);

	const pDiameter = LoadFuzzyNumber(diameter);
	const pMass = LoadFuzzyNumber(mass);

	const uPosition = new Vec2(parsedX[1], parsedY[1]);
	const lPosition = new Vec2(parsedX[0], parsedY[0]);
	const uDiameter: number = pDiameter[1];
	const lDiameter: number = pDiameter[0];
	const uMass = pMass[1];
	const lMass = pMass[0];

	return {
		uPosition,
		lPosition,
		uDiameter,
		lDiameter,
		uMass,
		lMass,
		color,
	};
}

export function LoadPlanet(input: RawPlanetItem): ParsedPlanetItem {
	const { x, y, vx, vy, diameter, mass, color } = input;

	const parsedX = LoadFuzzyNumber(x);
	const parsedY = LoadFuzzyNumber(y);
	const parsedVX = LoadFuzzyNumber(vx);
	const parsedVY = LoadFuzzyNumber(vy);

	const pDiameter = LoadFuzzyNumber(diameter);
	const pMass = LoadFuzzyNumber(mass);

	const uPosition = new Vec2(parsedX[1], parsedY[1]);
	const lPosition = new Vec2(parsedX[0], parsedY[0]);
	const uVelocity = new Vec2(parsedVX[1], parsedVY[1]);
	const lVelocity = new Vec2(parsedVX[0], parsedVY[0]);
	const uDiameter: number = pDiameter[1];
	const lDiameter: number = pDiameter[0];
	const uMass = pMass[1];
	const lMass = pMass[0];

	return {
		uPosition,
		lPosition,
		uVelocity,
		lVelocity,
		uDiameter,
		lDiameter,
		uMass,
		lMass,
		color,
	};
}
export function LoadAsteroid(input: RawAsteroidItem): ParsedAsteroidItem {
	const { x, y, vx, vy, diameter, mass, color } = input;

	const parsedX = LoadFuzzyNumber(x);
	const parsedY = LoadFuzzyNumber(y);
	const parsedVX = LoadFuzzyNumber(vx);
	const parsedVY = LoadFuzzyNumber(vy);

	const pDiameter = LoadFuzzyNumber(diameter);
	const pMass = LoadFuzzyNumber(mass);

	const uPosition = new Vec2(parsedX[1], parsedY[1]);
	const lPosition = new Vec2(parsedX[0], parsedY[0]);
	const uVelocity = new Vec2(parsedVX[1], parsedVY[1]);
	const lVelocity = new Vec2(parsedVX[0], parsedVY[0]);
	const uDiameter: number = pDiameter[1];
	const lDiameter: number = pDiameter[0];
	const uMass = pMass[1];
	const lMass = pMass[0];

	return {
		uPosition,
		lPosition,
		uVelocity,
		lVelocity,
		uDiameter,
		lDiameter,
		uMass,
		lMass,
		color,
	};
}

export function LoadSpawn(input: RawSpawnItem): ParsedSpawnItem {
	const { x, y, size } = input;

	const position = new Vec2(x, y);

	return {
		position,
		size,
	};
}
