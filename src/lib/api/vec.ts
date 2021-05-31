export class Vec {
	x: number;
	y: number;

	constructor(x: number | Vec, y?: number) {
		if (x instanceof Vec) {
			this.x = x.x;
			this.y = x.y;
		} else if (typeof x === 'number') {
			if (!y) {
				this.x = x;
				this.y = x;
			} else {
				this.x = x;
				this.y = y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}
	}

	clone(): Vec {
		return new Vec(this.x, this.y);
	}

	set(x: number | Vec, y?: number): this {
		if (x instanceof Vec) {
			this.x = x.x;
			this.y = x.y;
		} else if (typeof x === 'number') {
			if (!y) {
				this.x = x;
				this.y = x;
			} else {
				this.x = x;
				this.y = y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}
		return this;
	}

	add(x: number | Vec, y?: number): this {
		if (x instanceof Vec) {
			this.x += x.x;
			this.y += x.y;
		} else if (typeof x === 'number') {
			if (!y) {
				this.x += x;
				this.y += x;
			} else {
				this.x += x;
				this.y += y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}
		return this;
	}

	subtract(x: number | Vec, y?: number): this {
		if (x instanceof Vec) {
			this.x -= x.x;
			this.y -= x.y;
		} else if (typeof x === 'number') {
			if (!y) {
				this.x -= x;
				this.y -= x;
			} else {
				this.x -= x;
				this.y -= y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}
		return this;
	}

	multiply(x: number | Vec, y?: number): this {
		if (x instanceof Vec) {
			this.x *= x.x;
			this.y *= x.y;
		} else if (typeof x === 'number') {
			if (!y) {
				this.x *= x;
				this.y *= x;
			} else {
				this.x *= x;
				this.y *= y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}
		return this;
	}

	divide(x: number | Vec, y?: number): this {
		if (x instanceof Vec) {
			this.x /= x.x;
			this.y /= x.y;
		} else if (typeof x === 'number') {
			if (!y) {
				this.x /= x;
				this.y /= x;
			} else {
				this.x /= x;
				this.y /= y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}
		return this;
	}

	print(name?: string): this {
		if (name)
			console.log(
				`${name} { x: ${this.x} y: ${this.y} r: ${this.angle} }`
			);
		else console.log(`x: ${this.x} y: ${this.y} r: ${this.angle}`);
		return this;
	}

	normalize(): this {
		return this.divide(this.magnitude);
	}

	get magnitude(): number {
		return Math.hypot(this.y, this.x);
	}

	get angle(): number {
		return Math.atan2(this.y, this.x);
	}

	set angle(v: number) {
		this.x = -Math.cos(v);
		this.y = Math.sin(v);
	}
}
