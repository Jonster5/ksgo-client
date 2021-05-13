import type { Rectangle } from '@api/rectangle';
import type { Sprite } from '@api/sprite';
import type { Stage } from '@api/stage';
import type { Star, Planet, Asteroid, Spawn } from '@classes/stellar';
import type { ParsedAssets } from '@data/assets';
import type { MapItem } from '@data/types';

export interface GameMapObject {
	assets: ParsedAssets;

	stars: Star[];
	planets: Planet[];
	asteroids: Asteroid[];
	spawns: Spawn[];

	bgSprites: Sprite[];
	bgCount: number;

	boundary: Rectangle;

	setupBackground(m: MapItem, stage: Stage): void;
	setupMap(m: MapItem, stage: Stage): void;

	updateGravity(): void;
	updatePosition(stage: Stage): void;

	getSpawnCoords(): { x: number; y: number; r: number };
}
