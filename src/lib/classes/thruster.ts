import { Texture } from '@api/material';
import { Sprite } from '@api/sprite';
import { Vec2 } from '@api/vec2';
import type { ShipObject } from '@classes/ship';
import type {
	Direction,
	ParsedAssets,
	ParsedShipThrustItem,
} from '@data/assetTypes';
import type { Thruster } from '@utils/thrusterUtils';

export class ShipThruster implements Thruster {
	sprite: Sprite<Texture>;
	energy: number;
	thrust: number;
	direction: Direction;
	firing: boolean;

	constructor(
		ship: ShipObject,
		stats: ParsedShipThrustItem,
		assets: ParsedAssets
	) {
		const { size, position, direction, thrust, energy } = stats;

		this.sprite = new Sprite(
			new Texture({ frames: [...assets.ionthrust] }),
			new Vec2(size / 2, size),
			position,
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

		this.direction = direction;
		this.thrust = thrust;
		this.energy = energy;
		this.firing = false;
	}
	on(d?: Direction): void {
		if (d === undefined) d = this.direction;
		if (d !== this.direction) return;
		this.sprite.visible = true;
		this.sprite.material.start(100);
		this.firing = true;
	}
	off(d?: Direction): void {
		if (d === undefined) d = this.direction;
		if (d !== this.direction) return;
		this.sprite.visible = false;
		this.sprite.material.stop();
		this.firing = false;
	}
}
