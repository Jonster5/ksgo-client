import type { Rectangle } from './rectangle';
import type { Sprite } from './sprite';
import type { Circle } from './circle';
import type { Stage } from './stage';

export type DisplayObject = Stage | Rectangle | Sprite | Circle;

export interface SpriteObject {}

export interface DisplayProperties {
	visible: boolean;
	parent: any;
	children: Set<DisplayObject>;
	render(
		ctx: CanvasRenderingContext2D,
		lagOffset: number,
		dm: { w: number; h: number }
	): void;

	add(...sprites: Array<DisplayObject>): void;
	remove(...sprites: Array<DisplayObject>): void;
}

export interface ColorProperties {
	color: string;
	border: { color: string; thickness: number };
}

export interface DimensionProperties {
	x: number;
	y: number;
	r: number;
	w: number;
	h: number;
	vx: number;
	vy: number;
	vr: number;
	prevx: number;
	prevy: number;
	prevr: number;

	width: number;
	height: number;
	gx: number;
	gy: number;
	halfWidth: number;
	halfHeight: number;
	rotation: number;

	setX(X: number): void;
	setY(Y: number): void;
	setR(R: number): void;
}

export interface CircularProperties {
	x: number;
	y: number;
	r: number;
	ra: number;
	vx: number;
	vy: number;
	vr: number;
	prevx: number;
	prevy: number;
	prevr: number;

	width: number;
	height: number;
	gx: number;
	gy: number;
	halfWidth: number;
	halfHeight: number;
	rotation: number;
	radius: number;
	diameter: number;

	setX(X: number): void;
	setY(Y: number): void;
	setR(R: number): void;
}

export interface FrameProperties {
	frames: HTMLImageElement[];
	frame: number;
	frameShifter: number;

	start(delay: number): void;
	stop(): void;
}
