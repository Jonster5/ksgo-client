'use strict';

export abstract class DisplayObject {
    x: number = 0;
    y: number = 0;
    r: number = 0;
    visible: boolean = true;
    parent: any;
    children: Set<DisplayObject>;
    vx: number = 0;
    vy: number = 0;
    vr: number = 0;
    prevx: number = 0;
    prevy: number = 0;
    prevr: number = 0;

    protected w: number = 0;
    protected h: number = 0;

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

    add(...sprites: Array<DisplayObject>): void {
        if (sprites.length < 1) return;
        for (let sprite of sprites) {
            if (sprite.parent !== null) sprite.parent.remove(sprite);
            if (sprite.parent === this) continue;
            sprite.parent = this;
            this.children.add(sprite);
        }
    }
    remove(...sprites: Array<DisplayObject>): void {
        if (sprites.length < 1) return;
        for (let sprite of sprites) {
            if (sprite.parent !== this) throw new Error('Sprite must already be a child');
            this.children.delete(sprite);
            sprite.parent = null;
        }
    }

    rotation: number;

    get gx() {
        return this.x + this.parent.gx;
    }
    get gy() {
        return this.y + this.parent.gy;
    }

    forcePosition({ x, y, r }: { x: number; y: number; r: number }): void {}

    render(ctx: CanvasRenderingContext2D): void {}
}
