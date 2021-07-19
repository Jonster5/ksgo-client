import type { Vec2 } from '@api/vec2';

const CCW = (a: Vec2, b: Vec2, c: Vec2) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);

export function SegmentIntersection(p1: Vec2, p2: Vec2, p3: Vec2, p4: Vec2) {
	return CCW(p1, p3, p4) != CCW(p2, p3, p4) && CCW(p1, p2, p3) != CCW(p1, p2, p4);
}
