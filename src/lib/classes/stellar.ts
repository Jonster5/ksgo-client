import { Circle } from '@api/circle';
import type { Stage } from '@api/stage';
import { Vec } from '@api/vec';
import type { StarItem, PlanetItem, AsteroidItem } from '@data/types';
import { StellarUtils, StellarObject, SpawnObject } from '@utils/stellarUtils';

export class Star extends StellarUtils implements StellarObject {
	sprite: Circle;
	mass: number;

	constructor(stage: Stage, stats: StarItem) {
		super();

		const { x, y, mass, diameter, color } = stats;

		this.sprite = new Circle((diameter as number) / 2, color, {
			color: '',
			thickness: 0,
		});
		stage.add(this.sprite);

		this.sprite.x = x as number;
		this.sprite.y = y as number;

		this.mass = (mass as number) / 10;
	}
}

export class Planet extends StellarUtils implements StellarObject {
	sprite: Circle;
	mass: number;

	constructor(stage: Stage, stats: PlanetItem) {
		super();

		const { x, y, vx, vy, mass, diameter, color } = stats;

		this.sprite = new Circle((diameter as number) / 2, color, {
			color: '',
			thickness: 0,
		});
		stage.add(this.sprite);

		this.sprite.x = x as number;
		this.sprite.y = y as number;
		this.sprite.vx = vx as number;
		this.sprite.vy = vy as number;

		this.mass = (mass as number) / 10;
	}

	updateGravity(stars: Array<Star>, planets: Array<Planet>) {
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
				if (planet === this) continue;
				let vx = planet.x - this.x,
					vy = planet.y - this.y;

				let m = Math.sqrt(vx * vx + vy * vy);

				let dx = vx / m,
					dy = vy / m;

				gravity_modifier.x += (dx * (planet.mass * this.mass)) / m;
				gravity_modifier.y += (dy * (planet.mass * this.mass)) / m;
			}
		}

		this.vx += gravity_modifier.x;
		this.vy += gravity_modifier.y;
	}
}

export class Asteroid extends StellarUtils implements StellarObject {
	sprite: Circle;
	mass: number;

	constructor(stage: Stage, stats: AsteroidItem) {
		super();

		const { x, y, vx, vy, mass, diameter, color } = stats;

		this.sprite = new Circle((diameter as number) / 2, color, {
			color: '',
			thickness: 0,
		});
		stage.add(this.sprite);

		this.sprite.x = x as number;
		this.sprite.y = y as number;
		this.sprite.vx = vx as number;
		this.sprite.vy = vy as number;

		this.mass = (mass as number) / 10;
	}

	updateGravity(
		stars: Array<Star>,
		planets: Array<Planet>,
		asteroids: Array<Asteroid>
	) {
		let gravity_modifier = { x: 0, y: 0 };

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
				if (asteroid === this) continue;
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

export class Spawn implements SpawnObject {
	x: number;
	y: number;
	size: number;

	constructor(x: number, y: number, s: number) {
		this.x = x;
		this.y = y;
		this.size = s;
	}

	getCoords(): Vec {
		return new Vec(
			Math.floor(Math.random() * this.size),
			Math.floor(Math.random() * this.size)
		)
			.subtract(this.size / 2)
			.add(new Vec(this.x, this.y));
	}
}
