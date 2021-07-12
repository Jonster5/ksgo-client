import { Rectangle } from '@api/material';
import { Sprite } from '@api/sprite';
import { Vec2 } from '@api/vec2';
import type { ShipObject } from '@classes/ship';
import type {
	Direction,
	ParsedShipWeaponItem,
	ParsedAssets,
} from '@data/assetTypes';
import type { WeaponProperties, LauncherProperties } from '@utils/weaponUtils';

export class Weapon<T extends WeaponProperties = any>
	implements LauncherProperties {}

export class Laser implements Weapon, Laser {
	sprite: Sprite<Rectangle>;
	direction: Direction;

	energy: number;
	damage: number;
	firing: boolean;

	points: [Vec2, Vec2];
	readonly length: number;

	constructor(
		ship: ShipObject,
		stats: ParsedShipWeaponItem,
		assets: ParsedAssets
	) {
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

		this.points = [
			position.clone(),
			new Vec2(position.x, position.y + length),
		];
	}

	on() {
		this.sprite.visible = true;
	}
	off() {
		this.sprite.visible = false;
	}

	fire(ship: ShipObject) {}
}
