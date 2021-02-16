import { DisplayObject } from './display';

export class Rectangle extends DisplayObject {
    color: string;
    border: { color: string; thickness: number };

    constructor(
        width = 0,
        height = 0,
        color = '',
        border = { color: '', thickness: 0 },
        x = 0,
        y = 0,
        rotation = 0
    ) {
        super();
        this.width = width;
        this.height = height;
        this.color = color;
        this.border = border;
        this.x = x;
        this.prevx = x;
        this.y = y;
        this.prevy = y;
        this.rotation = rotation;
        this.prevr = rotation;
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

        ctx.translate(renderX + this.parent.width / 2, renderY + this.parent.height / 2);

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
