import { Pattern, Rectangle } from '@api/material';
import { Sprite } from '@api/sprite';
import { Vec2 } from '@api/vec2';
import { Star, Planet, Asteroid, Spawn } from '@classes/stellar';
import type { ParsedAssets, ParsedMapItem } from '@data/assetTypes';
import type { GameMapObject } from '@utils/mapUtils';

export class GameMap implements GameMapObject {
	assets: ParsedAssets;

	tctx: CanvasRenderingContext2D;

	stars: Star[];
	planets: Planet[];
	asteroids: Asteroid[];
	spawns: Spawn[];

	bgSprite: Sprite<Rectangle>;
	bgMaterial: Rectangle;

	constructor(assets: ParsedAssets) {
		this.assets = assets;

		this.stars = [];
		this.planets = [];
		this.asteroids = [];
		this.spawns = [];

		const c = document.createElement('canvas');
		this.tctx = c.getContext('2d');
	}

	setupBackground(m: ParsedMapItem, stage: Sprite): void {
		const bgPattern = Pattern(this.assets.gamebg[0], 'repeat');

		this.bgMaterial = new Rectangle({
			texture: bgPattern,
			borderColor: 'red',
			borderWidth: 5,
		});

		this.bgSprite = new Sprite(this.bgMaterial, new Vec2(m.size));

		stage.add(this.bgSprite);
	}

	setupMap(m: ParsedMapItem, stage: Sprite) {
		switch (m.version) {
			case 0.1:
				m.stars.forEach((star) => {
					const position = new Vec2(
						this.rand(star.lPosition.x, star.uPosition.x),
						this.rand(star.lPosition.y, star.uPosition.y)
					);

					const diameter = this.rand(star.lDiameter, star.uDiameter);
					const mass = this.rand(star.lMass, star.uMass);
					const color = star.color;

					this.stars.push(
						new Star(stage, { position, diameter, mass, color })
					);
				});

				m.planets.forEach((planet) => {
					const position = new Vec2(
						this.rand(planet.lPosition.x, planet.uPosition.x),
						this.rand(planet.lPosition.y, planet.uPosition.y)
					);

					const velocity = new Vec2(
						this.rand(planet.lVelocity.x, planet.uVelocity.x),
						this.rand(planet.lVelocity.y, planet.uVelocity.y)
					);

					const diameter = this.rand(
						planet.lDiameter,
						planet.uDiameter
					);
					const mass = this.rand(planet.lMass, planet.uMass);
					const color = planet.color;

					this.stars.push(
						new Planet(stage, {
							position,
							velocity,
							diameter,
							mass,
							color,
						})
					);
				});

				m.asteroids.forEach((asteroid) => {
					const position = new Vec2(
						this.rand(asteroid.lPosition.x, asteroid.uPosition.x),
						this.rand(asteroid.lPosition.y, asteroid.uPosition.y)
					);

					const velocity = new Vec2(
						this.rand(asteroid.lVelocity.x, asteroid.uVelocity.x),
						this.rand(asteroid.lVelocity.y, asteroid.uVelocity.y)
					);

					const diameter = this.rand(
						asteroid.lDiameter,
						asteroid.uDiameter
					);
					const mass = this.rand(asteroid.lMass, asteroid.uMass);
					const color = asteroid.color;

					this.stars.push(
						new Asteroid(stage, {
							position,
							velocity,
							diameter,
							mass,
							color,
						})
					);
				});

				m.spawns.forEach((spawn) => {
					this.spawns.push(new Spawn(spawn.position, spawn.size));
				});
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

	updatePosition(stage: Sprite) {
		if (this.planets.length > 0) {
			this.planets.forEach((planet) => {
				planet.position.add(planet.velocity);

				// console.log(planet.x, this.stage.halfWidth);
				if (planet.position.x > stage.halfSize.x) {
					planet.sprite.setX(-stage.halfSize.x);
				}
				if (planet.position.x < -stage.halfSize.x) {
					planet.sprite.setX(stage.halfSize.x);
				}

				if (planet.position.y > stage.halfSize.y) {
					planet.sprite.setY(-stage.halfSize.y);
				}
				if (planet.position.y < -stage.halfSize.y) {
					planet.sprite.setY(stage.halfSize.y);
				}
			});
		}

		if (this.asteroids.length > 0) {
			this.asteroids.forEach((asteroid) => {
				asteroid.position.add(asteroid.velocity);

				// console.log(planet.x, this.stage.halfWidth);
				if (asteroid.position.x > stage.halfSize.x) {
					asteroid.sprite.setX(-stage.halfSize.x);
				}
				if (asteroid.position.x < -stage.halfSize.x) {
					asteroid.sprite.setX(stage.halfSize.x);
				}

				if (asteroid.position.y > stage.halfSize.y) {
					asteroid.sprite.setY(-stage.halfSize.y);
				}
				if (asteroid.position.y < -stage.halfSize.y) {
					asteroid.sprite.setY(stage.halfSize.y);
				}
			});
		}
	}

	getSpawnCoords(): { p: Vec2; r: number } {
		const p = this.spawns[this.rand(0, this.spawns.length)].getCoords();
		const r = (this.rand(0, 360) * Math.PI) / 180;

		return { p, r };
	}

	private rand(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}
