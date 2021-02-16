import { DisplayObject } from './display';

export class Circle extends DisplayObject {
    private ra: number;
    private d: number;
    color: string;
    border: { color: string; thickness: number };
    constructor(
        radius = 0,
        color = '',
        border = { color: '', thickness: 0 },
        x = 0,
        y = 0,
        rotation = 0
    ) {
        super();
        this.ra = radius;
        this.d = radius * 2;

        this.color = color;
        this.border = border;

        this.x = x;
        this.prevx = x;
        this.y = y;
        this.prevy = y;
        this.rotation = rotation;
        this.prevr = rotation;
    }

    get halfWidth() {
        return this.ra;
    }
    get halfHeight() {
        return this.ra;
    }

    get width() {
        return this.d;
    }
    get height() {
        return this.d;
    }
    set width(value: number) {
        this.diameter = value;
    }
    set height(value: number) {
        this.diameter = value;
    }

    get radius() {
        return this.ra;
    }
    set radius(value: number) {
        this.ra = value;
        this.d = value * 2;
    }
    get diameter() {
        return this.d;
    }
    set diameter(value: number) {
        this.d = value;
        this.ra = value / 2;
    }

    render(ctx: CanvasRenderingContext2D, lagOffset: number) {
        if (
            !this.visible ||
            this.x - this.halfWidth > this.parent.width / 2 ||
            this.x + this.halfWidth < -this.parent.width / 2 ||
            this.y - this.halfHeight > this.parent.height / 2 ||
            this.y + this.halfHeight < -this.parent.height / 2
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

        if (this.children.size > 0) for (let child of this.children) child.render(ctx, lagOffset);

        ctx.restore();
    }
}
