import type { Vec2 } from '@api/vec2';

//function that adds to number if it is not zero
const addIfNotZero = (num: number, add: number) => num + add;

export function SegmentIntersection2(p1: Vec2, p2: Vec2, p3: Vec2, p4: Vec2) {
	const x1 = p1.x;
	const y1 = p1.y;
	const x2 = p2.x;
	const y2 = p2.y;
	const x3 = p3.x;
	const y3 = p3.y;
	const x4 = p4.x;
	const y4 = p4.y;

	const denom = (y4 - y3) * (x2 - x1) - (y2 - y1) * (x4 - x3);
	if (denom === 0) {
		return false;
	}

	const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
	const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

	return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

//function that returns true of a point is inside a pol
export function PointInPolygon(point: Vec2, polygon: Array<Vec2>): boolean {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;

		const intersect =
			yi > point.y !== yj > point.y &&
			point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
		if (intersect) {
			inside = !inside;
		}
	}

	return inside;
}

export function PointInCircle(point: Vec2, circle: Vec2, radius: number): boolean {
	return Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2) <= Math.pow(radius, 2);
}
