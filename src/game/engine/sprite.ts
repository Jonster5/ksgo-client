import { DisplayObject } from './display';

export class Sprite extends DisplayObject {
    frames: any[];
    frame: number;
    constructor(frames = [], width = 0, height = 0, x = 0, y = 0) {
        super();
        this.frames = frames;

        this.frame = 0;

        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(
            this.frames[this.frame],
            -this.halfWidth,
            -this.halfHeight,
            this.width,
            this.height
        );
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
