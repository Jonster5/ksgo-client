import type { Rectangle } from '@api/material';
import type { Sprite } from '@api/sprite';
import type { Vec2 } from '@api/vec2';
import type { Star, Planet, Asteroid, Spawn } from '@classes/stellar';
import type { ParsedAssets, ParsedMapItem } from '@data/assetTypes';

export interface GameMapObject {
	assets: ParsedAssets;

	tctx: CanvasRenderingContext2D;

	stars: Star[];
	planets: Planet[];
	asteroids: Asteroid[];
	spawns: Spawn[];

	bgMaterial: Rectangle;
	bgSprite: Sprite;

	setupBackground(m: ParsedMapItem, stage: Sprite): void;
	setupMap(m: ParsedMapItem, stage: Sprite): void;

	updateGravity(): void;
	updatePosition(stage: Sprite): void;

	getSpawnCoords(): { p: Vec2; r: number };
}
