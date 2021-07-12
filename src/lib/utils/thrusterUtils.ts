import type { Sprite } from '@api/sprite';
import type { Direction } from '@data/assetTypes';

export interface Thruster {
	sprite: Sprite;
	energy: number;
	thrust: number;
	direction: Direction;
	firing: boolean;

	on(d?: Direction): void;
	off(d?: Direction): void;
}
