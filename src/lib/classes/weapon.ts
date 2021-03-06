import { Rectangle } from '@api/rectangle';
import { Vec } from '@api/vec';
import type { ParsedAssets } from '@data/assets';
import type { Direction, ShipWeaponItem } from '@data/types';
import { WeaponUtils, Weapon, Laser } from '@utils/weaponUtils';
import type { ShipObject } from './ship';

export class ShipLaser extends WeaponUtils implements Weapon, Laser {
	sprite: Rectangle;
	direction: Direction;

	energy: number;
	damage: number;
	firing: boolean;

	points: [Vec, Vec];
	length: number;

	constructor(ship: ShipObject, stats: ShipWeaponItem, assets: ParsedAssets) {
		super();

		const { x, y, width, length, direction } = stats;

		this.sprite = new Rectangle(
			width,
			length,
			'red',
			'none',
			x,
			y - length / 2,
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

		this.points = [new Vec(x, y), new Vec(x, y + length)];
	}

	on() {
		this.sprite.visible = true;
	}
	off() {
		this.sprite.visible = false;
	}

	fire(ship: ShipObject) {}
}
