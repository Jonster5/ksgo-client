import type { Canvas } from '@api/canvas';
import type { Sprite } from '@api/sprite';
import type { Vec2 } from '@api/vec2';

export interface SpriteProperties<Material extends MaterialProperties = any> {
	visible: boolean;
	parent: Sprite | Canvas | null;

	material: Material;
	children: Sprite[];

	position: Vec2;
	size: Vec2;
	rotation: number;

	velocity: Vec2;
	rotationVelocity: number;

	prev: Vec2;
	prevr: number;

	add(...sprites: Sprite[]): void;
	remove(...sprites: Sprite[]): void;

	render(ctx: CanvasRenderingContext2D, lagOffset: number, dm: Vec2): void;

	get globalPosition(): Vec2;
	get halfSize(): Vec2;

	setPosition(pos: Vec2, R?: number): void;
	setX(X: number): void;
	setY(Y: number): void;
	setR(R: number): void;

	setVelocity(vel: Vec2, R?: number): void;
	setVX(X: number): void;
	setVY(Y: number): void;
	setVR(R: number): void;
}

export interface MaterialProperties {
	draw(ctx: CanvasRenderingContext2D, hs: Vec2): void;
}
