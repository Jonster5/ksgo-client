import type { ParsedAssets } from '@data/assets';
import type { Direction, ShipWeaponItem } from '@data/types';
import { Rectangle } from './api/rectangle';
import type { ShipObject } from './ship';
import { Point } from './api/vec';
import { WeaponUtils, Weapon, Laser } from './utils/weaponUtils';

export class ShipLaser extends WeaponUtils implements Weapon, Laser {
    sprite: Rectangle;
    direction: Direction;

    energy: number;
    damage: number;
    firing: boolean;

    points: [Point, Point];
    length: number;

    constructor(ship: ShipObject, stats: ShipWeaponItem, assets: ParsedAssets) {
        super();

        const { x, y, width, length, direction } = stats;

        this.sprite = new Rectangle(
            width,
            length,
            'red',
            'none',
            x,
            y - length / 2,
            direction === 'forward'
                ? 0
                : direction === 'reverse'
                ? Math.PI
                : direction === 'right'
                ? Math.PI / 2
                : direction === 'left'
                ? -Math.PI / 2
                : Math.PI
        );
        this.sprite.visible = false;

        ship.sprite.add(this.sprite);

        this.length = length;
        this.firing = false;

        this.points = [new Point(x, y), new Point(x, y + length)];
    }

    on() {
        this.sprite.visible = true;
    }
    off() {
        this.sprite.visible = false;
    }

    fire(ship: ShipObject) {}
}
