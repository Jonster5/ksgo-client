import { Stage, Texture } from '@api/material';
import { Sprite } from '@api/sprite';
import { Vec2 } from '@api/vec2';
import type { Star, Planet, Asteroid } from '@classes/stellar';
import { ShipThruster } from '@classes/thruster';
import { Weapon } from '@classes/weapon';
import * as AMMO from '@classes/weapon';
import type { ParsedShipItem, ParsedAssets } from '@data/assetTypes';
import type { Ship, Player } from '@utils/shipUtils';
import { Writable, writable } from 'svelte/store';

export type ShipObject = PlayerShip;

export type PlayerShipObject = PlayerShip;

export class PlayerShip implements Ship, Player {
	sprite: Sprite<Texture>;
	thrusters: ShipThruster[];
	weapons: Weapon[];

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

	constructor(stage: Sprite<Stage>, stats: ParsedShipItem, assets: ParsedAssets) {
		this.sprite = new Sprite(new Texture({ frames: [stats.image] }), stats.size.clone());
		this.thrusters = [];

		this.thrusters = stats.thrusters.map((stats) => new ShipThruster(this, stats, assets));

		this.weapons = stats.weapons.map((stats) => new Weapon(AMMO[stats.type], stats));

		this.sprite.add(...this.thrusters.map((t) => t.sprite));
		stage.add(this.sprite);

		this.s = writable(0);
		this.e = writable(0);
		this.h = writable(stats.maxHull);
		this.c = writable(false);

		this.mass = stats.mass;
		this.maxSpeed = stats.maxSpeed;

		this.maxEnergy = stats.maxEnergy;
		this.energyGain = stats.energyGain;

		this.maxHull = stats.maxHull;

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

					!this.cooldown && this.thrusters.forEach((t) => t.on('right'));
					break;

				case 'D':
				case 'd':
					this.right = true;

					!this.cooldown && this.thrusters.forEach((t) => t.on('left'));
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

					this.thrusters.forEach((t) => t.off('right'));

					break;

				case 'D':
				case 'd':
					this.right = false;

					this.thrusters.forEach((t) => t.off('left'));
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

	update(stage: Sprite<Stage>) {
		let cost = -this.energyGain;

		let fv = new Vec2(0);

		if (this.energy <= 0) this.c.set(true);

		if (!this.cooldown) {
			this.thrusters
				.filter((t) => t.firing)
				.forEach((t) => {
					cost += t.energy;
					if (t.direction === 'forward') fv.add(0, t.thrust);
					if (t.direction === 'right') this.rotation += t.thrust * 0.1;
					if (t.direction === 'left') this.rotation -= t.thrust * 0.1;
				});
		} else {
			this.thrusters.forEach((t) => t.off());
			if (this.energy >= this.maxEnergy) this.c.set(false);
		}

		this.e.update((e) =>
			e - cost < 0 ? 0 : e - cost > this.maxEnergy ? this.maxEnergy : e - cost
		);

		fv.divide(this.mass * 10).rotate(this.rotation - Math.PI / 2);

		this.velocity.add(fv);

		this.s.set(this.velocity.magnitude);

		if (this.speed > this.maxSpeed) {
			this.velocity.magnitude = this.maxSpeed;
			this.s.set(this.maxSpeed);
		}

		this.position.add(this.velocity);
		stage.position.set(this.position.clone().negate());

		if (this.position.x > stage.halfSize.x) {
			this.sprite.setX(-stage.halfSize.x);
			stage.setX(stage.halfSize.x);
		} else if (this.position.x < -stage.halfSize.x) {
			this.sprite.setX(stage.halfSize.x);
			stage.setX(-stage.halfSize.x);
		}

		if (this.position.y > stage.halfSize.y) {
			this.sprite.setY(-stage.halfSize.y);
			stage.setY(stage.halfSize.y);
		} else if (this.position.y < -stage.halfSize.y) {
			this.sprite.setY(stage.halfSize.y);
			stage.setY(-stage.halfSize.y);
		}
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

	kill() {
		this.sprite.parent.remove(this.sprite);

		this.us();
		this.ue();
		this.uh();
	}

	get position(): Vec2 {
		return this.sprite.position;
	}
	get rotation(): number {
		return this.sprite.rotation;
	}
	set rotation(v: number) {
		this.sprite.rotation = v;
	}
	get velocity(): Vec2 {
		return this.sprite.velocity;
	}
	get rotationalVelocity(): number {
		return this.sprite.rotationVelocity;
	}
	set rotationVelocity(v: number) {
		this.sprite.rotationVelocity = v;
	}
}

// export class EnemyShip implements Ship, AI {
// 	sprite: Sprite<Texture>;
// 	thrusters: ShipThruster[];
// 	weapons: ShipLaser[];

// 	forward: boolean;
// 	left: boolean;
// 	right: boolean;
// 	mass: number;
// 	boost: boolean;

// 	e: Writable<number>;
// 	h: Writable<number>;
// 	s: Writable<number>;

// 	maxEnergy: number;
// 	energyGain: number;
// 	maxSpeed: number;
// 	maxHull: number;

// 	energy: number;
// 	speed: number;
// 	hull: number;

// 	ai: {
// 		target: ShipObject;
// 	};

// 	us: () => void;
// 	ue: () => void;
// 	uh: () => void;

// 	constructor(stage: Stage, stats: ParsedShipItem, assets: ParsedAssets) {
// 		super();

// 		this.sprite = new Sprite([stats.image], ...stats.size.get());
// 		this.thrusters = [];

// 		this.thrusters = stats.thrusters.map(
// 			(stats) => new ShipThruster(this, stats, assets)
// 		);
// 		this.weapons = stats.weapons.map(
// 			(stats) => new ShipLaser(this, stats, assets)
// 		);

// 		this.sprite.add(...this.thrusters.map((t) => t.sprite));
// 		stage.add(this.sprite);

// 		this.s = writable(0);
// 		this.e = writable(0);
// 		this.h = writable(stats.maxHull);

// 		this.mass = stats.mass;
// 		this.maxSpeed = stats.maxSpeed;

// 		this.maxEnergy = stats.maxEnergy;
// 		this.energyGain = stats.energyGain;

// 		this.maxHull = stats.maxHull;

// 		this.forward = false;
// 		this.left = false;
// 		this.right = false;
// 		this.boost = false;

// 		this.energy = 0;
// 		this.speed = 0;
// 		this.hull = this.maxHull;

// 		this.ai = {
// 			target: null,
// 		};

// 		this.us = this.s.subscribe((v) => (this.speed = v));
// 		this.ue = this.e.subscribe((e) => (this.energy = e));
// 		this.uh = this.h.subscribe((h) => (this.hull = h));
// 	}

// 	AItarget(entities: Array<ShipObject>) {
// 		this.ai.target = entities[Math.floor(Math.random() * entities.length)];
// 	}

// 	AIturn(distance: number, dr: number) {
// 		const margin = Math.log(distance) / Math.log(this.sprite.w);

// 		console.log(dr - margin, dr + margin);

// 		if (dr > dr - margin && dr < dr + margin) {
// 			this.r = dr;
// 		}

// 		this.thrusters
// 			.filter(({ direction: d }) => d === 'left' || d === 'right')
// 			.forEach(({ sprite }) => (sprite.visible = false));

// 		return false;
// 	}

// 	AImove(distance: number, size: number, facingTarget: boolean) {
// 		if (
// 			distance < size / 3 &&
// 			facingTarget &&
// 			this.speed < this.ai.target.speed * 2
// 		) {
// 			this.forward = true;
// 			this.thrusters
// 				.filter(({ direction: d }) => d === 'forward')
// 				.forEach(({ sprite }) => (sprite.visible = true));
// 		} else {
// 			this.forward = false;
// 			this.thrusters
// 				.filter(({ direction: d }) => d === 'forward')
// 				.forEach(({ sprite }) => (sprite.visible = false));
// 		}
// 	}

// 	AIcruise() {}

// 	AIfire(distance: number) {
// 		if (distance <= this.weapons.reduce((a, b) => Math.max(a, b.length), 0))
// 			this.weapons.forEach((w) => w.on());
// 		else this.weapons.forEach((w) => w.on());
// 	}

// 	AI(entities: Array<ShipObject>, { size }) {
// 		entities = entities.filter((e) => e !== this);
// 		if (!this.ai.target) this.AItarget(entities);

// 		const { x, y, w, h } = this.ai.target.sprite;

// 		const dy = x - this.x;
// 		const dx = y - this.y;
// 		const theta = Math.atan2(dy, dx);

// 		const dr =
// 			((theta + Math.PI + (this.r % (2 * Math.PI))) % (2 * Math.PI)) -
// 			Math.PI;
// 		const distance = Math.hypot(dy, dx);

// 		const facingTarget = this.AIturn(distance, dr);
// 		this.AImove(distance, size, facingTarget);
// 		this.AIfire(distance);
// 	}

// 	update(stage: Stage) {
// 		let cost = -this.energyGain;
// 		let forwardThrust = 0;

// 		let lv = 0;
// 		let rv = 0;

// 		if (this.forward) {
// 			this.thrusters
// 				.filter(({ direction }) => direction === 'forward')
// 				.forEach(({ energy, thrust }) => {
// 					cost += energy;
// 					forwardThrust += thrust;
// 				});
// 		}

// 		if (this.left) {
// 			this.thrusters
// 				.filter(({ direction }) => direction === 'left')
// 				.forEach(({ energy, thrust, sprite }) => {
// 					sprite.visible = true;
// 					cost += energy;
// 					lv += thrust;
// 				});
// 		}

// 		if (this.right) {
// 			this.thrusters
// 				.filter(({ direction }) => direction === 'right')
// 				.forEach(({ energy, thrust, sprite }) => {
// 					sprite.visible = true;
// 					cost += energy;
// 					rv += thrust;
// 				});
// 		}

// 		this.weapons.forEach((w) => w.fire(this));

// 		this.e.update((e) =>
// 			e - cost < 0
// 				? 0
// 				: e - cost > this.maxEnergy
// 				? this.maxEnergy
// 				: e - cost
// 		);

// 		this.r -= lv * 0.1;
// 		this.r += rv * 0.1;

// 		let d = forwardThrust / this.mass;

// 		let dx = this.vx + d * Math.sin(this.r) * 0.1;
// 		let dy = this.vy + d * -Math.cos(this.r) * 0.1;

// 		this.s.set(Math.hypot(dx, dy));

// 		if (this.speed > this.maxSpeed) {
// 			let lx = isNaN(dx / this.speed) ? 0 : dx / this.speed;
// 			let ly = isNaN(dy / this.speed) ? 0 : dy / this.speed;

// 			this.vx = lx * this.maxSpeed;
// 			this.vy = ly * this.maxSpeed;
// 		} else {
// 			this.vx = dx;
// 			this.vy = dy;
// 		}

// 		this.x += this.vx;
// 		this.y += this.vy;

// 		if (this.x > stage.halfWidth) this.sprite.setX(-stage.halfWidth);
// 		else if (this.x < -stage.halfWidth) this.sprite.setX(stage.halfWidth);

// 		if (this.y > stage.halfHeight) this.sprite.setY(-stage.halfHeight);
// 		else if (this.y < -stage.halfHeight) this.sprite.setY(stage.halfHeight);
// 	}

// 	updateGravity(
// 		stars: Array<Star>,
// 		planets: Array<Planet>,
// 		asteroids: Array<Asteroid>
// 	) {
// 		const gravity_modifier = { x: 0, y: 0 };

// 		if (stars.length > 0) {
// 			for (let star of stars) {
// 				let vx = star.x - this.x,
// 					vy = star.y - this.y;

// 				let m = Math.sqrt(vx * vx + vy * vy);

// 				let dx = vx / m,
// 					dy = vy / m;

// 				gravity_modifier.x += (dx * (star.mass * this.mass)) / m;
// 				gravity_modifier.y += (dy * (star.mass * this.mass)) / m;
// 			}
// 		}
// 		if (planets.length > 0) {
// 			for (let planet of planets) {
// 				let vx = planet.x - this.x,
// 					vy = planet.y - this.y;

// 				let m = Math.sqrt(vx * vx + vy * vy);

// 				let dx = vx / m,
// 					dy = vy / m;

// 				gravity_modifier.x += (dx * (planet.mass * this.mass)) / m;
// 				gravity_modifier.y += (dy * (planet.mass * this.mass)) / m;
// 			}
// 		}

// 		if (asteroids.length > 0) {
// 			for (let asteroid of asteroids) {
// 				let vx = asteroid.x - this.x,
// 					vy = asteroid.y - this.y;

// 				let m = Math.sqrt(vx * vx + vy * vy);

// 				let dx = vx / m,
// 					dy = vy / m;

// 				gravity_modifier.x += (dx * (asteroid.mass * this.mass)) / m;
// 				gravity_modifier.y += (dy * (asteroid.mass * this.mass)) / m;
// 			}
// 		}

// 		this.vx += gravity_modifier.x;
// 		this.vy += gravity_modifier.y;
// 	}

// 	kill() {
// 		this.sprite.parent.remove(this.sprite);

// 		this.us();
// 		this.ue();
// 		this.uh();
// 	}
// }
