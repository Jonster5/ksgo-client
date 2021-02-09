'use strict';

import { DisplayObject } from './display';
import type { Canvas } from './canvas';

export class Stage extends DisplayObject {
    constructor(width = 0, height = 0, canvas: Canvas) {
        super();
        this.width = width;
        this.height = height;

        if (canvas) canvas.add(this);
    }
}
