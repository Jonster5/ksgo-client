import { DisplayObject } from './display';

export class Rectangle extends DisplayObject {
    color: string;
    border: { color: string; thickness: number };

    constructor(
        width: number,
        height: number,
        color: string,
        border: { color: string; thickness: number } | 'none',
        x?: number,
        y?: number,
        rotation?: number
    ) {
        super();
        this.width = width;
        this.height = height;
        this.color = color;
        this.border = border === 'none' ? { color: '', thickness: 0 } : border;
        this.x = x ?? 0;
        this.prevx = x ?? 0;
        this.y = y ?? 0;
        this.prevy = y ?? 0;
        this.rotation = rotation ?? 0;
        this.prevr = rotation ?? 0;
    }
    render(ctx: CanvasRenderingContext2D, lagOffset: number) {
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
        ctx.rect(-this.halfWidth, -this.halfHeight, this.width, this.height);
        if (this.color !== 'none' && this.color) ctx.fill();
        if (this.border.color !== 'none' && this.border.color) ctx.stroke();

        if (this.children.size > 0) for (let child of this.children) child.render(ctx, lagOffset);
        ctx.restore();
    }
}
