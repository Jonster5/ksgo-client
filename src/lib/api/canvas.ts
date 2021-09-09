import type { Sprite } from '@api/sprite';
import { Vec2 } from '@api/vec2';

export class Canvas {
	target: HTMLElement;
	element: HTMLCanvasElement;
	ar: number;

	ctx: CanvasRenderingContext2D;

	update!: () => void;

	private rd: {
		timestamp: number;
		ups: number;
		prev: number;
		lag: number;

		times: Array<number>;
		fps: number;
	};

	private size: Vec2;
	private default: DOMMatrix;

	animator: number | null;
	fpschecker: number | null;

	children: Sprite[];

	constructor(target: HTMLElement, width: number) {
		this.target = target;

		this.element = document.createElement('canvas');

		const dpr = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

		this.ar = window.innerWidth / window.innerHeight;

		this.size = new Vec2(width, width / this.ar);

		this.element.width = this.size.x * dpr;
		this.element.height = this.size.y * dpr;

		this.ctx = this.element.getContext('2d')!;
		this.ctx.transform(dpr, 0, 0, -dpr, this.element.width / 2, this.element.height / 2);
		this.default = this.ctx.getTransform();

		this.element.setAttribute(
			'style',
			`display: block; width: 100%; height: 100%; border: none; background: transparent;`
		);

		this.element.addEventListener('contextmenu', (e) => e.preventDefault());

		this.target.appendChild(this.element);

		this.rd = {
			timestamp: 0,
			ups: 30,
			prev: 0,
			lag: 0,

			times: [],
			fps: 60,
		};

		this.animator = null;
		this.fpschecker = null;

		this.children = [];
	}

	get globalPosition(): Vec2 {
		return new Vec2(0);
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
		return this.size.x;
	}

	get height(): number {
		return this.size.y;
	}

	setSize(width: number): void {
		const dpr = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

		this.size.set(width, width / this.ar);

		this.element.width = width * dpr;
		this.element.height = (width / this.ar) * dpr;

		this.ctx.resetTransform();

		this.ctx.transform(dpr, 0, 0, -dpr, this.element.width / 2, this.element.height / 2);
		this.default = this.ctx.getTransform();
	}

	add(...sprites: Sprite[]): void {
		for (let sprite of sprites) {
			if (sprite.parent) sprite.parent.remove(sprite);

			sprite.parent = this;
			this.children.push(sprite);
		}
	}
	remove(...sprites: Sprite[]): void {
		for (let sprite of sprites) {
			if (sprite.parent !== this) {
				throw new Error('Sprite must already be a child');
			}

			sprite.parent = null;
			this.children.splice(
				this.children.findIndex((s) => s === sprite),
				1
			);
		}
	}

	stop(delay?: number) {
		if (this.animator === null) return;
		if (delay) {
			setTimeout(this.stop, delay);
		} else {
			cancelAnimationFrame(this.animator);
			cancelAnimationFrame(this.fpschecker as number);
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
		cancelAnimationFrame(this.animator!);
		this.animator = null;
	}

	private refreshLoop() {
		const now = performance.now();
		while (this.rd.times.length > 0 && this.rd.times[0] <= now - 1000) this.rd.times.shift();

		this.rd.times.push(now);
		this.rd.fps = this.rd.times.length;

		this.fpschecker = requestAnimationFrame(this.refreshLoop.bind(this));
	}

	private getLagOffset(timestamp: number) {
		const frameDuration = 1000 / this.rd.ups;

		const elapsed = timestamp - this.rd.prev > 1000 ? frameDuration : timestamp - this.rd.prev;

		this.rd.lag += elapsed;

		while (this.rd.lag >= frameDuration) {
			this.children.forEach((stage) => {
				stage.prev.set(stage.position);
				stage.prevr = stage.rotation;

				stage.children.forEach(spp);

				function spp(sprite: Sprite) {
					sprite.prev.set(sprite.position);
					sprite.prevr = sprite.rotation;

					if (sprite.children.length > 0) sprite.children.forEach(spp);
				}
			});

			if (this.update) this.update();
			this.rd.lag -= frameDuration;
		}
		this.rd.prev = timestamp;
		return this.rd.lag / frameDuration;
	}

	private render(timestamp?: number) {
		const lagOffset = this.getLagOffset(timestamp ?? 0);

		this.ctx.setTransform(this.default);

		this.ctx.clearRect(-this.size.x, -this.size.y, this.size.x * 2, this.size.y * 2);

		for (let sprite of this.children) {
			sprite.render(this.ctx, lagOffset, this.size);
		}

		this.animator = requestAnimationFrame(this.render.bind(this));
	}
}
