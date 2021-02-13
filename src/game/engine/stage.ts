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
}
