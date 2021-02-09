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
    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.border.color;
        ctx.lineWidth = this.border.thickness;
        ctx.beginPath();
        ctx.rect(-this.halfWidth, -this.halfHeight, this.width, this.height);
        if (this.color !== 'none' && this.color) ctx.fill();
        if (this.border.color !== 'none' && this.border.color) ctx.stroke();
    }
}
