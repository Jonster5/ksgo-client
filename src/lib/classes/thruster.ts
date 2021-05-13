import { Sprite } from '@api/sprite';
import type { ParsedAssets } from '@data/assets';
import type { Direction, ShipThrustItem } from '@data/types';
import { ThrusterUtils, Thruster } from '@utils/thrusterUtils';
import type { ShipObject } from './ship';

export class ShipThruster extends ThrusterUtils implements Thruster {
	sprite: Sprite;
	energy: number;
	thrust: number;
	direction: Direction;
	firing: boolean;

	constructor(ship: ShipObject, stats: ShipThrustItem, assets: ParsedAssets) {
		super();

		const { size, x, y, direction, thrust, energy } = stats;

		this.sprite = new Sprite([...assets.ionthrust], size / 2, size, x, y);
		this.sprite.r =
			direction === 'forward'
				? 0
				: direction === 'reverse'
				? Math.PI
				: direction === 'right'
				? Math.PI / 2
				: direction === 'left'
				? -Math.PI / 2
				: Math.PI;
		this.sprite.visible = false;
		ship.sprite.add(this.sprite);

		this.direction = direction;
		this.thrust = thrust;
		this.energy = energy;
		this.firing = false;
	}
	on(d?: Direction): void {
		if (d === undefined) d = this.direction;
		if (d !== this.direction) return;
		this.sprite.visible = true;
		this.sprite.start(100);
		this.firing = true;
	}
	off(d?: Direction): void {
		if (d === undefined) d = this.direction;
		if (d !== this.direction) return;
		this.sprite.visible = false;
		this.sprite.stop();
		this.firing = false;
	}
}
