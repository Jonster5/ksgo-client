import type { Sprite } from '@api/sprite';
import type { Vec2 } from '@api/vec2';

export interface SpawnObject {
	position: Vec2;
	size: number;

	getCoords(): Vec2;
}

export interface StellarObject {
	sprite: Sprite;
	mass: number;
}

export abstract class StellarUtils {
	sprite: Sprite;

	get position(): Vec2 {
		return this.sprite.position;
	}

	get velocity(): Vec2 {
		return this.sprite.velocity;
	}
}
