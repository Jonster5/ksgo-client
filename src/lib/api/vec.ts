export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Vec {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone(): Vec {
        return new Vec(this.x, this.y);
    }

    add(n: Vec | number): this {
        if (typeof n === 'number') {
            this.x += n;
            this.y += n;
        } else if (n instanceof Vec) {
            this.x += n.x;
            this.y += n.y;
        }
        return this;
    }

    subtract(n: Vec | number): this {
        if (typeof n === 'number') {
            this.x -= n;
            this.y -= n;
        } else if (n instanceof Vec) {
            this.x -= n.x;
            this.y -= n.y;
        }
        return this;
    }

    multiply(n: Vec | number): this {
        if (typeof n === 'number') {
            this.x *= n;
            this.y *= n;
        } else if (n instanceof Vec) {
            this.x *= n.x;
            this.y *= n.y;
        }
        return this;
    }

    divide(n: Vec | number): this {
        if (typeof n === 'number') {
            this.x /= n;
            this.y /= n;
        } else if (n instanceof Vec) {
            this.x /= n.x;
            this.y /= n.y;
        }
        return this;
    }

    normalize(): this {
        return this.divide(this.magnitude);
    }

    get magnitude(): number {
        return Math.hypot(this.x, this.y);
    }

    get angle(): number {
        return Math.atan2(this.y, this.x);
    }
}
