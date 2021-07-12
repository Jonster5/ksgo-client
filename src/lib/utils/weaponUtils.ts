import type { Rectangle } from '@api/material';
import type { Sprite } from '@api/sprite';
import type { Vec2 } from '@api/vec2';
import type { ShipObject } from '@classes/ship';
import type { Direction } from '@data/assetTypes';

export interface LauncherProperties<Weapon extends WeaponProperties = any> {}

export interface WeaponProperties {
	hitboxes: [];
	damage: number;
}

export interface WeaponInstanceProperties {
	points: [Vec2, Vec2];
	thickness: number;
}
