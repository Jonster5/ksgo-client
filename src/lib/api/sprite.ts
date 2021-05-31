import type {
	DisplayObject,
	DimensionProperties,
	DisplayProperties,
	FrameProperties,
} from './utils';

export class Sprite
	implements DisplayProperties, FrameProperties, DimensionProperties
{
	frames: HTMLImageElement[];
	frame: number;
	frameShifter: number;

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

	visible: boolean;
	parent: any;
	children: Set<any>;

	constructor(
		frames: HTMLImageElement[],
		width: number,
		height: number,
		x?: number,
		y?: number
	) {
		this.frames = frames;

		this.frame = 0;
		this.frameShifter = null;

		this.w = width;
		this.h = height;
		this.x = x ?? 0;
		this.prevx = x ?? 0;
		this.y = y ?? 0;
		this.prevy = x ?? 0;
		this.r = this.rotation ?? 0;
		this.prevr = this.rotation ?? 0;

		this.vx = 0;
		this.vy = 0;
		this.vr = 0;

		this.visible = true;
		this.children = new Set();
	}

	get width(): number {
		return this.w;
	}

	set width(v: number) {
		this.w = v;
	}

	get height(): number {
		return this.h;
	}

	set height(v: number) {
		this.h = v;
	}

	get halfWidth(): number {
		return this.w / 2;
	}

	get halfHeight(): number {
		return this.h / 2;
	}

	get gx(): number {
		return (this.parent.gx ?? 0) + this.x;
	}

	get gy(): number {
		return (this.parent.gy ?? 0) + this.y;
	}

	get rotation(): number {
		return this.r;
	}

	set rotation(v: number) {
		this.r = v;
	}

	setX(v: number) {
		this.x = v;
		this.prevx = v;
	}

	setY(v: number) {
		this.y = v;
		this.prevy = v;
	}

	setR(v: number) {
		this.r = v;
		this.prevr = v;
	}

	add(...sprites: Array<DisplayObject>): void {
		if (sprites.length < 1) return;
		for (let sprite of sprites) {
			if (sprite.parent) sprite.parent.remove(sprite);
			if (sprite.parent === this) continue;
			sprite.parent = this;
			this.children.add(sprite);
		}
	}
	remove(...sprites: Array<DisplayObject>): void {
		if (sprites.length < 1) return;
		for (let sprite of sprites) {
			if (sprite.parent !== this)
				throw new Error('Sprite must already be a child');
			this.children.delete(sprite);
			sprite.parent = null;
		}
	}

	start(delay: number) {
		this.frameShifter = setInterval(() => {
			this.frame++;
			if (this.frame >= this.frames.length) this.frame = 0;
		}, delay) as unknown as number;
	}

	stop() {
		if (this.frameShifter) clearInterval(this.frameShifter);
		this.frameShifter = null;
	}

	render(
		ctx: CanvasRenderingContext2D,
		lagOffset: number,
		dm: { w: number; h: number }
	): void {
		if (
			!this.visible ||
			this.gx - this.halfWidth > dm.w / 2 ||
			this.gx + this.halfWidth < -dm.w / 2 ||
			this.gy - this.halfHeight > dm.h / 2 ||
			this.gy + this.halfHeight < -dm.h / 2
		)
			return;

		ctx.save();

		const renderX = (this.x - this.prevx) * lagOffset + this.prevx;
		const renderY = (this.y - this.prevy) * lagOffset + this.prevy;
		const renderR = (this.r - this.prevr) * lagOffset + this.prevr;

		ctx.translate(renderX, renderY);
		ctx.rotate(renderR);

		ctx.drawImage(
			this.frames[this.frame],
			-this.halfWidth,
			-this.halfHeight,
			this.width,
			this.height
		);

		if (this.children.size > 0)
			for (let child of this.children) child.render(ctx, lagOffset, dm);

		ctx.restore();
	}
}

// export class Text extends displayObject {
// 	constructor(content = '', font = '', ctx) {
// 		super();
// 		this._c = content;
// 		this.font = font;
// 		// this.color = color;
// 		this.ctx = ctx;

// 		this.textBaseline = 'top';
// 		this.strokeText = 'none';

// 		this._w = 0;
// 		this._h = 0;

// 		this.ctx.font = this.font;
// 		this.ctx.strokeStyle = 'none';
// 		this.ctx.lineWidth = 0;
// 		// this.ctx.fillStyle = this.color;

// 		this._w = this.ctx.measureText(this._c).width;
// 		this._h = this.ctx.measureText('M').width;
// 	}
// 	get Width() {
// 		return this._w;
// 	}
// 	get Height() {
// 		return this._h;
// 	}
// 	get halfWidth() {
// 		return this._w / 2;
// 	}
// 	get halfHeight() {
// 		return this._h / 2;
// 	}

// 	get content() {
// 		return this._c;
// 	}
// 	set content(value) {
// 		this.ctx.font = this.font;
// 		this.ctx.strokeStyle = 'none';
// 		this.ctx.lineWidth = 0;
// 		// this.ctx.fillStyle = this.color;

// 		this._w = this.ctx.measureText(this._c).width;
// 		this._h = this.ctx.measureText('M').width;

// 		this._c = value;
// 	}

// 	render(ctx) {
// 		ctx.font = this.font;
// 		ctx.fillStyle = this.color;
// 		ctx.strokeStyle = 'none';
// 		ctx.lineWidth = 0;
// 		ctx.fillStyle = this.color;

// 		ctx.translate(-this.halfWidth, -this.halfHeight);
// 		ctx.fillText(this.content, 0, 0);
// 	}
// }
