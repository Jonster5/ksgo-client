import type { MaterialProperties } from '@api/utils';
import type { Vec2 } from '@api/vec2';

export class Stage implements MaterialProperties {
	// filter: string;
	// alpha: number;

	// constructor(options: { filter?: string; alpha?: number }) {
	// 	const { filter, alpha } = options;

	// 	this.filter = filter ?? 'none';
	// 	this.alpha = alpha ?? 1;
	// }

	draw() {}
}

export class Texture implements MaterialProperties {
	frames: HTMLImageElement[];

	private index: number;
	private frameShifter: NodeJS.Timeout;

	filter: string;
	alpha: number;

	constructor(options: {
		frames?: HTMLImageElement[];
		index?: number;
		filter?: string;
		alpha?: number;
	}) {
		const { frames, index, filter, alpha } = options;

		this.frames = frames ?? [];
		this.index = index ?? 0;
		this.filter = filter ?? 'none';
		this.alpha = alpha ?? 1;
	}

	get currentFrame(): HTMLImageElement {
		return this.frames[this.index];
	}

	start(delay: number) {
		this.frameShifter = setInterval(() => {
			this.index++;
			if (this.index >= this.frames.length) this.index = 0;
		}, delay);
	}

	stop() {
		if (this.frameShifter !== undefined) clearInterval(this.frameShifter);
		this.frameShifter = null;
	}

	goto(i: number) {
		this.index = i;
	}

	draw(ctx: CanvasRenderingContext2D, hs: Vec2) {
		ctx.filter = this.filter;
		ctx.globalAlpha = this.alpha;

		ctx.save();
		ctx.scale(1, -1);

		ctx.beginPath();
		ctx.drawImage(this.currentFrame, -hs.x, -hs.y, hs.x * 2, hs.y * 2);

		ctx.restore();
	}
}

export class Rectangle implements MaterialProperties {
	texture: string | CanvasGradient | CanvasPattern;
	borderColor: string;
	borderWidth: number;
	filter: string;
	alpha: number;

	constructor(options: {
		texture?: string | CanvasGradient | CanvasPattern;
		borderColor?: string;
		borderWidth?: number;
		filter?: string;
		alpha?: number;
	}) {
		const { texture, borderColor, borderWidth, filter, alpha } = options;

		this.texture = texture ?? '';
		this.borderColor = borderColor ?? '';
		this.borderWidth = borderWidth ?? 0;
		this.filter = filter ?? 'none';
		this.alpha = alpha ?? 1;
	}

	draw(ctx: CanvasRenderingContext2D, hs: Vec2) {
		ctx.filter = this.filter;
		ctx.globalAlpha = this.alpha;

		ctx.save();
		ctx.scale(1, -1);

		ctx.beginPath();
		ctx.rect(-hs.x, -hs.y, hs.x * 2, hs.y * 2);
		if (this.texture) {
			ctx.fillStyle = this.texture;
			ctx.fill();
		}
		if (this.borderColor && this.borderWidth) {
			ctx.strokeStyle = this.borderColor;
			ctx.lineWidth = this.borderWidth;
			ctx.stroke();
		}

		ctx.restore();
	}
}

export class Ellipse implements MaterialProperties {
	texture: string | CanvasGradient | CanvasPattern;
	borderColor: string;
	borderWidth: number;
	filter: string;
	alpha: number;

	constructor(options: {
		texture?: string | CanvasGradient | CanvasPattern;
		borderColor?: string;
		borderWidth?: number;
		filter?: string;
		alpha?: number;
	}) {
		const { texture, borderColor, borderWidth, filter, alpha } = options;

		this.texture = texture ?? '';
		this.borderColor = borderColor ?? '';
		this.borderWidth = borderWidth ?? 0;
		this.filter = filter ?? 'none';
		this.alpha = alpha ?? 1;
	}

	draw(ctx: CanvasRenderingContext2D, hs: Vec2) {
		ctx.filter = this.filter;
		ctx.globalAlpha = this.alpha;

		ctx.save();
		ctx.scale(1, -1);

		ctx.beginPath();
		ctx.ellipse(0, 0, hs.x, hs.y, 0, 0, 2 * Math.PI);
		if (this.texture) {
			ctx.fillStyle = this.texture;
			ctx.fill();
		}
		if (this.borderColor && this.borderWidth) {
			ctx.strokeStyle = this.borderColor;
			ctx.lineWidth = this.borderWidth;
			ctx.stroke();
		}

		ctx.restore();
	}
}

// export function Gradient(): CanvasGradient {}

export function Pattern(
	image: CanvasImageSource,
	repeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
): CanvasPattern {
	const tctx = document.createElement('canvas').getContext('2d')!;

	const pattern = tctx.createPattern(image, repeat ?? 'repeat')!;

	pattern.setTransform(
		new DOMMatrix([1, 0, 0, 1, 0, 0]).translate(-image.width / 2, -image.height / 2)
	);

	return pattern;
}
