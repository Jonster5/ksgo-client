import type { Rectangle } from '@api/material';
import type { Sprite } from '@api/sprite';
import type { Vec2 } from '@api/vec2';
import type { Direction } from '@data/assetTypes';

export interface WeaponProperties<Ammo extends AmmoProperties = any> {
	ammo: Ammo;
	instances: AmmoInstance[];

	position: Vec2;
	size: Vec2;
	damage: number;
	energy: number;
	direction: Direction;

	on(): void;
	off(): void;
}

export interface AmmoProperties {
	materialProps: { texture: string };

	interval: number;
	maxInstances: number;

	fire(d: Direction): void;

	update(entities: []): void;
}

export interface AmmoInstance {
	sprite: Sprite<Rectangle>;

	points: [Vec2, Vec2];
	thickness: number;
}
