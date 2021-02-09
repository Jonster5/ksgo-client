import fighter from './fighter.json';

export interface ShipStatObject {
    version: number;
    name: string;
    width: number;
    height: number;

    max_energy: number;
    energy_gain: number;
    max_hull: number;

    mass: number;

    thrusters: Array<ShipThrustItem>;

    weapons: Array<ShipWeaponItem>;

    image: string;
}

export interface ShipThrustItem {
    direction: 'forward' | 'reverse' | 'left' | 'right';
    size: number;
    x: number;
    y: number;
    energy: number;
    thrust: number;
}

export interface ShipWeaponItem {
    type: 'red laser';
    direction: 'forward' | 'reverse' | 'left' | 'right';
    x: number;
    y: number;

    damage: number;
    energy: number;
}

export const ships: Array<ShipStatObject> = [fighter as ShipStatObject];

export default ships;
