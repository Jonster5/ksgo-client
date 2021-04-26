import type { DisplayObject } from './display';
import type { Stage } from './stage';

export class Canvas {
	parent: HTMLElement;
	element: HTMLCanvasElement;
	ar: number;

	ctx: CanvasRenderingContext2D;

	update: () => void;

	private rd: {
		timestamp: number;
		ups: number;
		prev: number;
		lag: number;

		times: Array<number>;
		fps: number;
	};

	private w: number;
	private h: number;

	readonly gx = 0;
	readonly gy = 0;

	animator: number;
	children: Set<DisplayObject>;
	fpschecker: number;

	constructor(target: HTMLElement, size: number) {
		this.parent = target;

		this.element = document.createElement('canvas');

		const dpr =
			window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

		this.ar = window.innerWidth / window.innerHeight;

		this.w = size;
		this.h = size / this.ar;

		this.element.width = this.w * dpr;
		this.element.height = this.h * dpr;

		this.ctx = this.element.getContext('2d');
		this.ctx.scale(dpr, dpr);

		this.element.setAttribute(
			'style',
			`display: block; width: 100vw; height: 100vh; border: none; background: transparent;';`
		);

		target.appendChild(this.element);

		this.rd = {
			timestamp: 0,
			ups: 30,
			prev: 0,
			lag: 0,

			times: [],
			fps: 60,
		};

		this.animator = null;

		this.children = new Set<DisplayObject>();
	}

	get UPS() {
		return this.rd.ups;
	}
	set UPS(value) {
		if (typeof value === 'number') this.rd.ups = value;
	}

	get FPS() {
		return this.rd.fps;
	}

	get width(): number {
		return this.w;
	}

	get height(): number {
		return this.h;
	}

	size(width?: number): void {
		const dpr =
			window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

		this.w = width;
		this.h = width / this.ar;

		this.element.width = width * dpr;
		this.element.height = (width / this.ar) * dpr;

		this.ctx.scale(dpr, dpr);
	}

	add(stage: Stage) {
		if (stage.parent) stage.parent.remove(stage);
		stage.parent = this;
		this.children.add(stage);
	}
	remove(stage: Stage) {
		this.children.delete(stage);
		stage.parent = null;
	}

	stop(delay?: number) {
		if (this.animator === null) return;
		if (delay) {
			setTimeout(this.stop, delay);
		} else {
			cancelAnimationFrame(this.animator);
			cancelAnimationFrame(this.fpschecker);
			this.animator = null;
			this.fpschecker = null;
		}
	}

	start() {
		this.render();
		this.refreshLoop();
	}

	step() {
		this.render();
		this.refreshLoop();
		this.stop();
	}

	private refreshLoop() {
		const now = performance.now();
		while (this.rd.times.length > 0 && this.rd.times[0] <= now - 1000)
			this.rd.times.shift();

		this.rd.times.push(now);
		this.rd.fps = this.rd.times.length;

		this.fpschecker = requestAnimationFrame(this.refreshLoop.bind(this));
	}

	private getLagOffset(timestamp: number) {
		const frameDuration = 1000 / this.rd.ups;

		if (!timestamp) timestamp = 0;

		const elapsed =
			timestamp - this.rd.prev > 1000
				? frameDuration
				: timestamp - this.rd.prev;

		this.rd.lag += elapsed;

		while (this.rd.lag >= frameDuration) {
			this.children.forEach((stage: Stage) => {
				stage.prevx = stage.x;
				stage.prevy = stage.y;
				stage.prevr = stage.r;

				stage.children.forEach(spp);

				function spp(sprite: DisplayObject) {
					sprite.prevx = sprite.x;
					sprite.prevy = sprite.y;
					sprite.prevr = sprite.r;

					if (sprite.children.size > 0) sprite.children.forEach(spp);
				}
			});

			if (this.update) this.update();
			this.rd.lag -= frameDuration;
		}
		this.rd.prev = timestamp;
		return this.rd.lag / frameDuration;
	}

	private render(timestamp?: number) {
		const lagOffset = this.getLagOffset(timestamp);

		this.ctx.clearRect(0, 0, this.width, this.height);

		this.ctx.save();

		this.ctx.translate(this.w / 2, this.h / 2);

		for (let stage of this.children)
			stage.render(this.ctx, lagOffset, {
				w: this.width,
				h: this.height,
			});

		this.ctx.restore();

		this.animator = requestAnimationFrame(this.render.bind(this));
	}
}
