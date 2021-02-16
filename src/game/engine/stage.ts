'use strict';

import { DisplayObject } from './display';
import type { Canvas } from './canvas';

export class Stage extends DisplayObject {
    parent: Canvas;

    constructor(width = 0, height = 0) {
        super();
        this.width = width;
        this.height = height;
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

        const renderX = (this.x - this.prevx) * lagOffset + this.prevx;

        const renderY = (this.y - this.prevy) * lagOffset + this.prevy;

        const renderR = (this.r - this.prevr) * lagOffset + this.prevr;

        ctx.translate(renderX, renderY);
        ctx.rotate(renderR);

        if (this.children.size > 0) for (let child of this.children) child.render(ctx, lagOffset);

        ctx.restore();
    }
}
