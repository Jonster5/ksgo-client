import { Rectangle } from '@api/material';
import { Sprite } from '@api/sprite';
import { Vec2 } from '@api/vec2';
import type { ShipObject } from '@classes/ship';
import type { Direction, ParsedShipWeaponItem, ParsedAssets } from '@data/assetTypes';
import type { AmmoInstance, AmmoProperties, WeaponProperties } from '@utils/weaponUtils';

export class Weapon<Ammo extends AmmoProperties = any> implements WeaponProperties {
	position: Vec2;
	size: Vec2;
	damage: number;
	energy: number;
	direction: Direction;

	instances: AmmoInstance[];
	ammo: Ammo;

	fireInterval: NodeJS.Timeout;

	constructor(ammo: Ammo, stats: ParsedShipWeaponItem) {
		const { width, length, damage, direction, energy, position } = stats;

		this.ammo = ammo;

		this.size = new Vec2(width, length);
		this.damage = damage;
		this.direction = direction;
		this.energy = energy;
		this.position = position;
	}

	on(): void {
		if (this.ammo.maxInstances === 1) {
			this.instances.push({
				points: [
					this.position.clone(),
					new Vec2(this.position.x, this.position.y + this.size.y),
				],
				sprite: new Sprite(
					new Rectangle(this.ammo.materialProps),
					this.size,
					new Vec2(this.position.x, this.position.y + this.size.y / 2)
				),
				thickness: this.size.x,
			});
		} else {
		}
	}

	off(): void {
		throw new Error('Method not implemented.');
	}
}

export class Laser implements AmmoProperties {
	materialProps: { texture: string };

	interval: number;
	maxInstances: number;

	constructor(stats: { interval: number; maxInstances: number }) {
		const { interval, maxInstances } = stats;

		this.interval = interval;
		this.maxInstances = maxInstances;
		this.materialProps = { texture: 'crimson' };
	}

	fire(d: Direction): void {
		throw new Error('Method not implemented.');
	}

	update(): void {
		throw new Error('Method not implemented.');
	}
}

export class toBeRemoved {
	sprite: Sprite<Rectangle>;
	direction: Direction;

	energy: number;
	damage: number;
	firing: boolean;

	points: [Vec2, Vec2];
	readonly length: number;

	constructor(ship: ShipObject, stats: ParsedShipWeaponItem, assets: ParsedAssets) {
		const { position, width, length, direction } = stats;

		this.sprite = new Sprite(
			new Rectangle({ texture: 'red' }),
			new Vec2(width, length),
			new Vec2(position.x, position.y + length / 2),
			direction === 'forward'
				? 0
				: direction === 'reverse'
				? Math.PI
				: direction === 'right'
				? Math.PI / 2
				: direction === 'left'
				? -Math.PI / 2
				: Math.PI
		);

		this.sprite.visible = false;

		ship.sprite.add(this.sprite);

		this.length = length;
		this.firing = false;

		this.points = [position.clone(), new Vec2(position.x, position.y + length)];
	}

	on() {
		this.sprite.visible = true;
	}
	off() {
		this.sprite.visible = false;
	}

	fire(ship: ShipObject) {}
}
