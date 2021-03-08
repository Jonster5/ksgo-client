import type { MapItem } from './maps';
import type { ShipStatObject } from './ships';

export interface Assets {
    maps: MapItem[];
    ships: ShipStatObject[];
    ionthrust: string[];
    gamebg: string[];
}
