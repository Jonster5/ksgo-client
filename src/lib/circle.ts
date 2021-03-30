import type {
    DisplayObject,
    DisplayProperties,
    ColorProperties,
    CircularProperties,
} from '@lib/display';

export class Circle implements DisplayProperties, CircularProperties, ColorProperties {
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

    color: string;
    border: { color: string; thickness: number };

    visible: boolean;
    parent: any;
    children: Set<DisplayObject>;

    constructor(
        radius: number,
        color: string,
        border?: { color: string; thickness: number },
        x?: number,
        y?: number,
        rotation?: number
    ) {
        this.ra = radius;

        this.color = color;
        this.border = border;

        this.x = x;
        this.prevx = x;
        this.y = y;
        this.prevy = y;
        this.r = rotation;
        this.prevr = rotation;

        this.vx = 0;
        this.vy = 0;
        this.vr = 0;

        this.visible = true;
        this.children = new Set();
    }

    get halfWidth() {
        return this.ra;
    }
    get halfHeight() {
        return this.ra;
    }

    get width() {
        return this.diameter;
    }
    get height() {
        return this.diameter;
    }
    set width(value: number) {
        this.diameter = value;
    }
    set height(value: number) {
        this.diameter = value;
    }

    get w(): number {
        return this.diameter;
    }
    get h(): number {
        return this.diameter;
    }

    get radius() {
        return this.ra;
    }
    set radius(value: number) {
        this.ra = value;
        this.diameter = value * 2;
    }
    get diameter() {
        return this.ra / 2;
    }
    set diameter(value: number) {
        this.ra = value / 2;
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
            !this.visible // ||
            // this.x - this.halfWidth > this.parent.width / 2 ||
            // this.x + this.halfWidth < -this.parent.width / 2 ||
            // this.y - this.halfHeight > this.parent.height / 2 ||
            // this.y + this.halfHeight < -this.parent.height / 2
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
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        if (this.color !== 'none' && this.color) ctx.fill();
        if (this.border.color !== 'none' && this.border.color) ctx.stroke();

        if (this.children.size > 0)
            for (let child of this.children) child.render(ctx, lagOffset, dm);

        ctx.restore();
    }
}
