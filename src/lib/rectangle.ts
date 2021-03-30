import type {
    DisplayProperties,
    DisplayObject,
    ColorProperties,
    DimensionProperties,
} from '@lib/display';

export class Rectangle implements DisplayProperties, ColorProperties, DimensionProperties {
    x: number;
    y: number;
    r: number;
    visible: boolean;
    parent: any;
    children: Set<DisplayObject>;
    vx: number;
    vy: number;
    vr: number;
    prevx: number;
    prevy: number;
    prevr: number;
    w: number;
    h: number;

    color: string;
    border: { color: string; thickness: number };

    constructor(
        width: number,
        height: number,
        color: string,
        border?: { color: string; thickness: number } | 'none',
        x?: number,
        y?: number,
        rotation?: number
    ) {
        this.w = width;
        this.h = height;
        this.color = color;
        this.border = border === 'none' ? { color: '', thickness: 0 } : border;
        this.x = x ?? 0;
        this.prevx = x ?? 0;
        this.y = y ?? 0;
        this.prevy = y ?? 0;
        this.r = rotation ?? 0;
        this.prevr = rotation ?? 0;

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
        this.prevy;
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
            if (sprite.parent !== this) throw new Error('Sprite must already be a child');
            this.children.delete(sprite);
            sprite.parent = null;
        }
    }

    render(ctx: CanvasRenderingContext2D, lagOffset: number, dm: { w: number; h: number }) {
        if (
            !this.visible ||
            this.gx - this.halfWidth > dm.w / 2 ||
            this.gx + this.halfWidth < -dm.w / 2 ||
            this.gy - this.halfHeight > dm.h / 2 ||
            this.gy + this.halfHeight < -dm.h / 2
        )
            return;

        ctx.save();

        const renderX =
            this.prevx !== undefined ? (this.x - this.prevx) * lagOffset + this.prevx : this.x;

        const renderY =
            this.prevy !== undefined ? (this.y - this.prevy) * lagOffset + this.prevy : this.y;

        const renderR =
            this.prevr !== undefined ? (this.r - this.prevr) * lagOffset + this.prevr : this.r;

        ctx.translate(renderX, renderY);
        ctx.rotate(renderR);

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.border.color;
        ctx.lineWidth = this.border.thickness;
        ctx.beginPath();
        ctx.rect(-this.halfWidth, -this.halfHeight, this.width, this.height);
        if (this.color !== 'none' && this.color) ctx.fill();
        if (this.border.color !== 'none' && this.border.color) ctx.stroke();

        if (this.children.size > 0)
            for (let child of this.children) child.render(ctx, lagOffset, dm);
        ctx.restore();
    }
}
