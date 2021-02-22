import fighter from './fighter.json';
import thumbtack from './thumbtack.json';

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
    direction: string;
    size: number;
    x: number;
    y: number;
    energy: number;
    thrust: number;
}

export interface ShipWeaponItem {
    type: string;
    direction: string;
    x: number;
    y: number;

    damage: number;
    energy: number;
}

export const ships: Array<ShipStatObject> = [fighter, thumbtack];

export default ships;
