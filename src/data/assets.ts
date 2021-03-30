import type { MapItem } from '@data/types';
import type { ShipStatObject } from '@data/types';

export interface RawAssets {
    maps: MapItem[];
    ships: ShipStatObject[];
    ionthrust: string[];
    gamebg: string[];
}

export interface ParsedAssets {
    maps: MapItem[];
    ships: ShipStatObject[];
    ionthrust: HTMLImageElement[];
    gamebg: HTMLImageElement[];
}
