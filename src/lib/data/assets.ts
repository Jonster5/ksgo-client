import type { MapItem, ShipStatObject } from './types';

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
