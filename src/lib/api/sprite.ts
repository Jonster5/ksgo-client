import type { Canvas } from '@api/canvas';
import type { Stage, Texture, Rectangle, Ellipse, Blank } from '@api/material';
import type { MaterialProperties, SpriteProperties } from '@api/utils';
import { Vec2 } from '@api/vec2';

export class Sprite<Material extends MaterialProperties = Blank>
	implements SpriteProperties
{
	material: Material;

	position: Vec2;
	size: Vec2;
	rotation: number;

	velocity: Vec2;
	rotationVelocity: number;

	prev: Vec2;
	prevr: number;

	visible: boolean;
	parent!: Sprite | Canvas | null;
	children: Sprite[];

	constructor(
		material: Material,
		size: Vec2,
		position?: Vec2,
		rotation?: number
	) {
		this.material = material;

		this.size = size.clone();

		this.position = position !== undefined ? position.clone() : new Vec2(0);
		this.rotation = rotation ?? 0;

		this.velocity = new Vec2(0);
		this.rotationVelocity = 0;

		this.prev = this.position.clone();
		this.prevr = rotation ?? 0;

		this.visible = true;
		this.children = [];

		this.parent = null;
	}

	get globalPosition(): Vec2 {
		if (this.parent) {
			return this.parent.globalPosition.clone().add(this.position);
		} else {
			return this.position.clone();
		}
	}

	get halfSize(): Vec2 {
		return this.size.clone().divide(2);
	}

	add(...sprites: Sprite[]): void {
		for (let sprite of sprites) {
			if (sprite.parent) sprite.parent.remove(sprite);

			sprite.parent = this;
			this.children.push(sprite);
		}
	}
	remove(...sprites: Sprite[]): void {
		for (let sprite of sprites) {
			if (sprite.parent !== this) {
				throw new Error('Sprite must already be a child');
			}

			sprite.parent = null;
			this.children.splice(
				this.children.findIndex((s) => s === sprite),
				1
			);
		}
	}

	render(ctx: CanvasRenderingContext2D, lagOffset: number, dm: Vec2) {
		if (
			!this.visible ||
			this.globalPosition.x - this.halfSize.x > dm.x / 2 ||
			this.globalPosition.x + this.halfSize.x < -dm.x / 2 ||
			this.globalPosition.y - this.halfSize.y > dm.y / 2 ||
			this.globalPosition.y + this.halfSize.y < -dm.y / 2
		)
			return;

		const save = ctx.getTransform();

		const renderPos = this.position
			.clone()
			.subtract(this.prev)
			.multiply(lagOffset)
			.add(this.prev);
		const renderR = (this.rotation - this.prevr) * lagOffset + this.prevr;

		ctx.translate(...renderPos.get());
		ctx.rotate(renderR);

		if (this.material.draw) this.material.draw(ctx, this.halfSize);

		if (this.children.length > 0)
			for (let child of this.children) child.render(ctx, lagOffset, dm);

		ctx.setTransform(save);
	}

	setPosition(pos: Vec2, R?: number) {
		this.position.set(pos);
		this.prev.set(pos);
		if (R !== undefined) this.rotation = R;
	}
	setX(X: number) {
		this.position.x = X;
		this.prev.x = X;
	}
	setY(Y: number) {
		this.position.y = Y;
		this.prev.y = Y;
	}
	setR(R: number) {
		this.rotation = R;
		this.prevr = R;
	}

	setVelocity(vel: Vec2, R?: number) {
		this.velocity.set(vel);
		if (R !== undefined) this.rotationVelocity = R;
	}
	setVX(X: number) {
		this.velocity.x = X;
	}
	setVY(Y: number) {
		this.velocity.y = Y;
	}
	setVR(R: number) {
		this.rotationVelocity = R;
	}
}
