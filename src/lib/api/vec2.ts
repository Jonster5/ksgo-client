export class Vec2 {
	private _x: number;
	private _y: number;

	private _xUpperLim: number;
	private _xLowerLim: number;
	private _yUpperLim: number;
	private _yLowerLim: number;

	private _magUpperLim: number;
	private _magLowerLim: number;

	private _limTrigger: 'wrap' | 'cap' | 'none';

	autoLimitCalculations: boolean;

	constructor(x: number | Vec2, y?: number) {
		if (x instanceof Vec2) {
			this._x = x._x;
			this._y = x._y;
		} else if (typeof x === 'number') {
			if (y === undefined) {
				this._x = x;
				this._y = x;
			} else {
				this._x = x;
				this._y = y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}

		this._xUpperLim = Infinity;
		this._xLowerLim = -Infinity;
		this._yUpperLim = Infinity;
		this._yLowerLim = -Infinity;

		this._magUpperLim = Infinity;
		this._magLowerLim = -Infinity;

		this._limTrigger = 'none';

		this.autoLimitCalculations = false;
	}

	clone(): Vec2 {
		return new Vec2(this);
	}

	setUpperLimits(lim: Vec2) {
		this._xUpperLim = lim.x;
		this._yUpperLim = lim.y;
	}

	setLowerLimits(lim: Vec2) {
		this._xLowerLim = lim.x;
		this._yLowerLim = lim.y;
	}

	setMagnitudeUpperLimit(lim: number) {
		this._magUpperLim = lim;
	}

	setMagnitudeLowerLimit(lim: number) {
		this._magLowerLim = lim;
	}

	private calculateLimits() {
		if (this._xUpperLim !== Infinity && this._x > this._xUpperLim) {
			if (this._limTrigger === 'wrap') {
				this._x = this._xLowerLim !== -Infinity ? this._xLowerLim : Number.MIN_SAFE_INTEGER;
			} else if (this._limTrigger === 'cap') {
				this.x = this._xUpperLim;
			}
		} else if (this._xLowerLim !== -Infinity && this._x < this._xLowerLim) {
			if (this._limTrigger === 'wrap') {
				this._x = this._xUpperLim !== Infinity ? this._xUpperLim : Number.MAX_SAFE_INTEGER;
			} else if (this._limTrigger === 'cap') {
				this.x = this._xLowerLim;
			}
		}

		if (this._yUpperLim !== Infinity && this._y > this._yUpperLim) {
			if (this._limTrigger === 'wrap') {
				this._y = this._yLowerLim !== -Infinity ? this._yLowerLim : Number.MIN_SAFE_INTEGER;
			} else if (this._limTrigger === 'cap') {
				this.y = this._yUpperLim;
			}
		} else if (this._yLowerLim !== -Infinity && this._y < this._yLowerLim) {
			if (this._limTrigger === 'wrap') {
				this._y = this._yUpperLim !== Infinity ? this._yUpperLim : Number.MAX_SAFE_INTEGER;
			} else if (this._limTrigger === 'cap') {
				this.y = this._yLowerLim;
			}
		}

		const mg = Math.hypot(this._y, this._x);
		if (this._magUpperLim !== Infinity && mg > this._magUpperLim) {
			if (this._limTrigger === 'wrap') {
				this._x /= mg;
				this._y /= mg;

				this._x *=
					this._magLowerLim !== -Infinity ? this._magLowerLim : Number.MIN_SAFE_INTEGER;
				this._y *=
					this._magLowerLim !== -Infinity ? this._magLowerLim : Number.MIN_SAFE_INTEGER;
			} else if (this._limTrigger === 'cap') {
				this._x /= mg;
				this._y /= mg;

				this._x *= this._magUpperLim;
				this._y *= this._magUpperLim;
			}
		} else if (this._magLowerLim !== -Infinity && mg < this._magLowerLim) {
			if (this._limTrigger === 'wrap') {
				this._x /= mg;
				this._y /= mg;

				this._x *=
					this._magUpperLim !== Infinity ? this._magUpperLim : Number.MAX_SAFE_INTEGER;
				this._y *=
					this._magUpperLim !== Infinity ? this._magUpperLim : Number.MAX_SAFE_INTEGER;
			} else if (this._limTrigger === 'cap') {
				this._x /= mg;
				this._y /= mg;

				this._x *= this._magLowerLim;
				this._y *= this._magLowerLim;
			}
		}
	}

	set(x: number | Vec2, y?: number): this {
		if (x instanceof Vec2) {
			this._x = x._x;
			this._y = x._y;
		} else if (typeof x === 'number') {
			if (y === undefined) {
				this._x = x;
				this._y = x;
			} else {
				this._x = x;
				this._y = y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}

		if (this.autoLimitCalculations) this.calculateLimits();

		return this;
	}

	add(x: number | Vec2, y?: number): this {
		if (x instanceof Vec2) {
			this._x += x._x;
			this._y += x._y;
		} else if (typeof x === 'number') {
			if (y === undefined) {
				this._x += x;
				this._y += x;
			} else {
				this._x += x;
				this._y += y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}

		if (this.autoLimitCalculations) this.calculateLimits();

		return this;
	}

	subtract(x: number | Vec2, y?: number): this {
		if (x instanceof Vec2) {
			this._x -= x._x;
			this._y -= x._y;
		} else if (typeof x === 'number') {
			if (y === undefined) {
				this._x -= x;
				this._y -= x;
			} else {
				this._x -= x;
				this._y -= y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}

		if (this.autoLimitCalculations) this.calculateLimits();

		return this;
	}

	multiply(x: number | Vec2, y?: number): this {
		if (x instanceof Vec2) {
			this._x *= x._x;
			this._y *= x._y;
		} else if (typeof x === 'number') {
			if (y === undefined) {
				this._x *= x;
				this._y *= x;
			} else {
				this._x *= x;
				this._y *= y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}

		if (this.autoLimitCalculations) this.calculateLimits();

		return this;
	}

	divide(x: number | Vec2, y?: number): this {
		if (x instanceof Vec2) {
			this._x /= x._x;
			this._y /= x._y;
		} else if (typeof x === 'number') {
			if (y === undefined) {
				this._x /= x;
				this._y /= x;
			} else {
				this._x /= x;
				this._y /= y;
			}
		} else {
			throw new Error(`${x} is an invalid input`);
		}

		if (this.autoLimitCalculations) this.calculateLimits();

		return this;
	}

	equalTo(v: Vec2, or?: boolean) {
		if (or) return this.x === v.x || this.y === v.y;
		else return this.x === v.x && this.y === v.y;
	}

	notEqualTo(v: Vec2, or?: boolean) {
		if (or) return this.x !== v.x || this.y !== v.y;
		else return this.x !== v.x && this.y !== v.y;
	}

	greaterThan(v: Vec2, or?: boolean) {
		if (or) return this.x > v.x || this.y > v.y;
		else return this.x > v.x && this.y > v.y;
	}

	greaterThanOrEqualTo(v: Vec2, or?: boolean) {
		if (or) return this.x > v.x || this.y > v.y;
		else return this.x >= v.x && this.y >= v.y;
	}

	lessThan(v: Vec2, or?: boolean) {
		if (or) return this.x < v.x || this.y < v.y;
		else return this.x < v.x && this.y < v.y;
	}

	lessThanOrEqualTo(v: Vec2, or?: boolean) {
		if (or) return this.x <= v.x || this.y <= v.y;
		else return this.x <= v.x && this.y <= v.y;
	}

	print(name?: string): this {
		if (name)
			console.log(
				`${name} { x: ${this._x} y: ${this._y} r: ${this.angle} m: ${this.magnitude}`
			);
		else console.log(`x: ${this._x} y: ${this._y} r: ${this.angle} m: ${this.magnitude}`);

		return this;
	}

	abs(): this {
		this._x = Math.abs(this._x);
		this._y = Math.abs(this._y);

		if (this.autoLimitCalculations) this.calculateLimits();

		return this;
	}

	negate(): this {
		this._x = -this._x;
		this._y = -this._y;

		if (this.autoLimitCalculations) this.calculateLimits();

		return this;
	}

	normalize(): this {
		return this.divide(this.magnitude);
	}

	checkLimits(): this {
		this.calculateLimits();
		return this;
	}

	getCrossProduct(x: number | Vec2, y?: number): number {
		if (x instanceof Vec2) {
			return this._x * x.y - this._y * x.x;
		} else if (typeof x === 'number' && y !== undefined) {
			return this._x * x - this._y * y;
		} else {
			throw new Error(`${x} is an invalid input`);
		}
	}

	getDotProduct(x: number | Vec2, y?: number): number {
		if (x instanceof Vec2) {
			return this._x * x._x + this._y * x._y;
		} else if (typeof x === 'number' && y !== undefined) {
			return this._x * x + this._y + y;
		} else {
			throw new Error(`${x} is an invalid input`);
		}
	}

	get leftNormal(): Vec2 {
		return new Vec2(this._y, -this._x);
	}

	get rightNormal(): Vec2 {
		return new Vec2(-this._y, this._x);
	}

	get magnitude(): number {
		return Math.hypot(this._y, this._x);
	}

	set magnitude(v: number) {
		const mg = Math.hypot(this._y, this._x);

		this._x /= mg;
		this._y /= mg;

		this._x *= v;
		this._y *= v;

		if (this.autoLimitCalculations) this.calculateLimits();
	}

	setMagnitude(v: number): this {
		this.magnitude = v;

		return this;
	}

	get angle(): number {
		return Math.atan2(this._y, this._x);
	}

	getAngleBetween(v: Vec2): number {
		const mg = this.magnitude + v.magnitude;
		// mag &&.. short circuits if mag == 0
		const cos = mg && this.getDotProduct(v) / mg;
		// Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1
		return Math.acos(Math.min(Math.max(cos, -1), 1));
	}

	set angle(v: number) {
		const m = Math.hypot(this._y, this._x);

		this._x = m * Math.cos(v);
		this._y = m * Math.sin(v);

		if (this.autoLimitCalculations) this.calculateLimits();
	}

	rotate(v: number): this {
		this.angle = v;

		return this;
	}

	get x(): number {
		return this._x;
	}
	set x(v: number) {
		this._x = v;

		if (this.autoLimitCalculations) this.calculateLimits();
	}

	get y(): number {
		return this._y;
	}
	set y(v: number) {
		this._y = v;

		if (this.autoLimitCalculations) this.calculateLimits();
	}

	get(): [number, number] {
		return [this._x, this._y];
	}
}

