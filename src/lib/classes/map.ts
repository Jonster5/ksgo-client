import { Rectangle } from '@api/rectangle';
import { Sprite } from '@api/sprite';
import type { Stage } from '@api/stage';
import type { ParsedAssets } from '@data/assets';
import type { MapItem } from '@data/types';
import type { GameMapObject } from '@utils/mapUtils';
import { Star, Planet, Asteroid, Spawn } from './stellar';

export class GameMap implements GameMapObject {
	assets: ParsedAssets;

	stars: Star[];
	planets: Planet[];
	asteroids: Asteroid[];
	spawns: Spawn[];

	bgSprites: Sprite[];
	bgCount: number;

	boundary: Rectangle;

	constructor(assets: ParsedAssets) {
		this.assets = assets;

		this.stars = [];
		this.planets = [];
		this.asteroids = [];
		this.spawns = [];

		this.bgSprites = [];
		this.bgCount = 0;
	}

	setupBackground(m: MapItem, stage: Stage): void {
		this.bgCount = Math.ceil(m.size / 2000);

		for (let col = 0; col < this.bgCount; col++) {
			for (let row = 0; row < this.bgCount; row++) {
				const s = new Sprite(
					this.assets.gamebg,
					2000,
					2000,
					row * 2000 - stage.halfWidth + 1000,
					col * 2000 - stage.halfHeight + 1000
				);

				s.r = [0, Math.PI / 2, Math.PI, -Math.PI / 2][
					Math.floor(Math.random() * 4)
				];

				this.bgSprites.push(s);
			}
		}

		this.boundary = new Rectangle(m.size, m.size, '', {
			color: 'red',
			thickness: 4,
		});

		stage.add(...this.bgSprites, this.boundary);
	}

	setupMap(m: MapItem, stage: Stage) {
		switch (m.version) {
			case 0.1:
				this.stars = m.stars.map(({ diameter, color, mass, x, y }) => {
					diameter =
						typeof diameter === 'string'
							? this.generate(diameter)
							: diameter;
					mass =
						typeof mass === 'string' ? this.generate(mass) : mass;
					x = typeof x === 'string' ? this.generate(x) : x;
					y = typeof y === 'string' ? this.generate(y) : y;

					return new Star(stage, { diameter, color, mass, x, y });
				});

				this.planets = m.planets.map(
					({ diameter, color, mass, x, y, vx, vy }) => {
						diameter =
							typeof diameter === 'string'
								? this.generate(diameter)
								: diameter;
						mass =
							typeof mass === 'string'
								? this.generate(mass)
								: mass;
						x = typeof x === 'string' ? this.generate(x) : x;
						y = typeof y === 'string' ? this.generate(y) : y;
						vx = typeof vx === 'string' ? this.generate(vx) : vx;
						vy = typeof vy === 'string' ? this.generate(vy) : vy;

						return new Planet(stage, {
							diameter,
							color,
							mass,
							x,
							y,
							vx,
							vy,
						});
					}
				);

				this.asteroids = m.asteroids.map(
					({ diameter, color, mass, x, y, vx, vy }) => {
						diameter =
							typeof diameter === 'string'
								? this.generate(diameter)
								: diameter;
						mass =
							typeof mass === 'string'
								? this.generate(mass)
								: mass;
						x = typeof x === 'string' ? this.generate(x) : x;
						y = typeof y === 'string' ? this.generate(y) : y;
						vx = typeof vx === 'string' ? this.generate(vx) : vx;
						vy = typeof vy === 'string' ? this.generate(vy) : vy;

						return new Asteroid(stage, {
							diameter,
							color,
							mass,
							x,
							y,
							vx,
							vy,
						});
					}
				);

				this.spawns = m.spawn.map(
					({ x, y, size }) => new Spawn(x, y, size)
				);
				break;
			default:
				alert('map version not supported ¯\\_(ツ)_/¯');
				break;
		}
	}

	updateGravity() {
		this.planets.forEach((planet) => {
			planet.updateGravity(this.stars, this.planets);
		});
		this.asteroids.forEach((asteroid) => {
			asteroid.updateGravity(this.stars, this.planets, this.asteroids);
		});
	}

	updatePosition(stage: Stage) {
		if (this.planets.length > 0) {
			this.planets.forEach((planet) => {
				planet.x += planet.vx;
				planet.y += planet.vy;

				// console.log(planet.x, this.stage.halfWidth);
				if (planet.x > stage.halfWidth) {
					planet.sprite.setX(-stage.halfWidth);
				}
				if (planet.x < -stage.halfWidth) {
					planet.sprite.setX(stage.halfWidth);
				}

				if (planet.y > stage.halfHeight) {
					planet.sprite.setY(-stage.halfHeight);
				}
				if (planet.y < -stage.halfHeight) {
					planet.sprite.setY(stage.halfHeight);
				}
			});
		}

		if (this.asteroids.length > 0) {
			this.asteroids.forEach((asteroid) => {
				asteroid.x += asteroid.vx;
				asteroid.y += asteroid.vy;

				if (asteroid.x > stage.halfWidth) {
					asteroid.sprite.setX(-stage.halfWidth);
				}
				if (asteroid.x < -stage.halfWidth) {
					asteroid.sprite.setX(stage.halfWidth);
				}

				if (asteroid.y > stage.halfHeight) {
					asteroid.sprite.setY(-stage.halfHeight);
				}
				if (asteroid.y < -stage.halfHeight) {
					asteroid.sprite.setY(stage.halfHeight);
				}
			});
		}
	}

	getSpawnCoords(): { x: number; y: number; r: number } {
		const { x, y } =
			this.spawns[this.rand(0, this.spawns.length)].getCoords();

		const r = (this.rand(0, 360) * Math.PI) / 180;
		return { x, y, r };
	}

	private rand(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	private generate(input: string) {
		const nums = input.split(' ').map(parseFloat);

		return Math.floor(Math.random() * (nums[1] - nums[0] + 1)) + nums[0];
	}
}
