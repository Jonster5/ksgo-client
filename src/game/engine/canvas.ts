import type { DisplayObject } from './display';
import type { Stage } from './stage';

export class Canvas {
    parent: HTMLElement;
    element: HTMLCanvasElement;

    ctx: CanvasRenderingContext2D;

    update: () => void | null;

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

        const dpr = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

        this.w = size;
        this.h = size / 2;

        this.element.width = this.w * dpr;
        this.element.height = this.h * dpr;

        this.ctx = this.element.getContext('2d');
        this.ctx.scale(dpr, dpr);

        this.element.setAttribute(
            'style',
            `display: block; width: calc(100% - 4px); height: auto; border: 2px solid gold; background: 'url(../../images/game/backgr.png)';`
        );

        console.log(target.appendChild(this.element));

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

    size(width: number): void {
        const dpr = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

        this.w = width;
        this.h = width / 2;

        this.element.width = width * dpr;
        this.element.height = (width / 2) * dpr;

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
        while (this.rd.times.length > 0 && this.rd.times[0] <= now - 1000) this.rd.times.shift();

        this.rd.times.push(now);
        this.rd.fps = this.rd.times.length;

        this.fpschecker = requestAnimationFrame(this.refreshLoop.bind(this));
    }

    private getLagOffset(timestamp: number) {
        const frameDuration = 1000 / this.rd.ups;

        if (!timestamp) timestamp = 0;

        const elapsed = timestamp - this.rd.prev > 1000 ? frameDuration : timestamp - this.rd.prev;

        this.rd.lag += elapsed;

        while (this.rd.lag >= frameDuration) {
            this.children.forEach((stage: Stage) => {
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

    private displaySprite(sprite: DisplayObject, lagOffset: number) {
        if (
            sprite.visible &&
            sprite.gx < this.w + sprite.halfWidth &&
            sprite.gx + sprite.halfWidth > 0 &&
            sprite.gy < this.h + sprite.halfHeight &&
            sprite.gy + sprite.halfWidth > 0
        ) {
            this.ctx.save();

            const renderX = sprite.prevx
                ? (sprite.x - sprite.prevx) * lagOffset + sprite.prevx
                : sprite.x;

            const renderY = sprite.prevy
                ? (sprite.y - sprite.prevy) * lagOffset + sprite.prevy
                : sprite.y;

            const renderR = sprite.prevr
                ? (sprite.r - sprite.prevr) * lagOffset + sprite.prevr
                : sprite.r;

            this.ctx.translate(renderX, renderY);

            this.ctx.rotate(renderR);

            if (sprite.render) sprite.render(this.ctx);

            if (sprite.children.size > 0) {
                for (let child of sprite.children) this.displaySprite.call(this, child);
            }

            this.ctx.restore();
        }
    }

    private render(timestamp?: number) {
        const lagOffset = this.getLagOffset(timestamp);

        this.ctx.clearRect(0, 0, this.element.width, this.element.height);

        for (let stage of this.children) {
            if (
                !stage.visible ||
                stage.x > this.w ||
                stage.x + stage.width < 0 ||
                stage.y > this.h ||
                stage.y + stage.height < 0
            )
                continue;

            this.ctx.save();

            const renderX =
                stage.prevx !== undefined
                    ? (stage.x - stage.prevx) * lagOffset + stage.prevx
                    : stage.x;

            const renderY =
                stage.prevy !== undefined
                    ? (stage.y - stage.prevy) * lagOffset + stage.prevy
                    : stage.y;

            const renderR =
                stage.prevr !== undefined
                    ? (stage.r - stage.prevr) * lagOffset + stage.prevr
                    : stage.r;

            this.ctx.translate(renderX + stage.halfWidth, renderY + stage.halfHeight);

            this.ctx.rotate(renderR);

            if (stage.children.size > 0) {
                // this.ctx.translate(-stage.halfWidth, -stage.halfHeight);

                for (let child of stage.children) this.displaySprite.call(this, child, lagOffset);
            }

            this.ctx.restore();
        }

        this.animator = requestAnimationFrame(this.render.bind(this));
    }
}
