import { Ellipse } from '@api/material';
import { Sprite } from '@api/sprite';
import { Vec2 } from '@api/vec2';
import type { ParsedPlanetItem, ParsedAsteroidItem } from '@data/assetTypes';
import { StellarUtils, StellarObject, SpawnObject } from '@utils/stellarUtils';

export class Star extends StellarUtils implements StellarObject {
	sprite: Sprite<Ellipse>;
	mass: number;

	constructor(
		stage: Sprite,
		stats: { position: Vec2; mass: number; diameter: number; color: string }
	) {
		super();

		const { position, mass, diameter, color } = stats;

		this.sprite = new Sprite(new Ellipse({ texture: color }), new Vec2(diameter), position);
		stage.add(this.sprite);

		this.mass = mass / 10;
	}
}

export class Planet extends StellarUtils implements StellarObject {
	sprite: Sprite<Ellipse>;
	mass: number;

	constructor(
		stage: Sprite,
		stats: {
			position: Vec2;
			velocity: Vec2;
			mass: number;
			diameter: number;
			color: string;
		}
	) {
		super();

		const { position, velocity, mass, diameter, color } = stats;

		this.sprite = new Sprite(new Ellipse({ texture: color }), new Vec2(diameter), position);

		this.sprite.velocity.set(velocity);

		stage.add(this.sprite);

		this.mass = mass / 10;
	}

	updateGravity(stars: Star[], planets: Planet[]) {
		const gm = new Vec2(0);

		if (stars.length > 0) {
			for (let star of stars) {
				const v = star.position.clone().subtract(this.position);

				const m = v.magnitude;

				gm.add(
					v
						.normalize()
						.multiply(star.mass * this.mass)
						.divide(m)
				);
			}
		}
		if (planets.length > 0) {
			for (let planet of planets) {
				if (planet === this) continue;
				const v = planet.position.clone().subtract(this.position);

				const m = v.magnitude;

				gm.add(
					v
						.normalize()
						.multiply(planet.mass * this.mass)
						.divide(m)
				);
			}
		}

		this.sprite.velocity.add(gm);
	}
}

export class Asteroid extends StellarUtils implements StellarObject {
	sprite: Sprite<Ellipse>;
	mass: number;

	constructor(
		stage: Sprite,
		stats: {
			position: Vec2;
			velocity: Vec2;
			mass: number;
			diameter: number;
			color: string;
		}
	) {
		super();

		const { position, velocity, mass, diameter, color } = stats;

		this.sprite = new Sprite(new Ellipse({ texture: color }), new Vec2(diameter), position);

		this.sprite.velocity.set(velocity);

		stage.add(this.sprite);

		this.mass = mass / 10;
	}

	updateGravity(stars: Star[], planets: Planet[], asteroids: Asteroid[]) {
		const gm = new Vec2(0);

		if (stars.length > 0) {
			for (let star of stars) {
				const v = star.position.clone().subtract(this.position);

				const m = v.magnitude;

				gm.add(
					v
						.normalize()
						.multiply(star.mass * this.mass)
						.divide(m)
				);
			}
		}
		if (planets.length > 0) {
			for (let planet of planets) {
				const v = planet.position.clone().subtract(this.position);

				const m = v.magnitude;

				gm.add(
					v
						.normalize()
						.multiply(planet.mass * this.mass)
						.divide(m)
				);
			}
		}
		if (asteroids.length > 0) {
			for (let asteroid of asteroids) {
				if (asteroid === this) continue;
				const v = asteroid.position.clone().subtract(this.position);

				const m = v.magnitude;

				gm.add(
					v
						.normalize()
						.multiply(asteroid.mass * this.mass)
						.divide(m)
				);
			}
		}

		this.sprite.velocity.add(gm);
	}
}

export class Spawn implements SpawnObject {
	position: Vec2;
	size: number;

	constructor(p: Vec2, s: number) {
		this.position = p.clone();
		this.size = s;
	}

	getCoords(): Vec2 {
		return new Vec2(
			Math.floor(Math.random() * this.size),
			Math.floor(Math.random() * this.size)
		)
			.subtract(this.size / 2)
			.add(this.position);
	}
}
