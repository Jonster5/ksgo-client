import type { ParsedMapItem, ParsedModeItem } from '@data/assetTypes';
import type { Writable } from 'svelte/store';

export interface InputOptionProperties {
	mode: Writable<string>;
	map: Writable<string>;
	gravity: Writable<number>;
	timeLimit: Writable<number>;
	killLimit: Writable<number>;
}

export interface OutputOptionProperties {
	mode: ParsedModeItem; // Asset for selected Mode
	map: ParsedMapItem; // Asset for selected Map
	gravity: number; // Gravity Multiplier
	timeLimit: number; // Time limit in seconds
	killLimit: number; // Kill limit
	extra: {
		// Extra options for modes/maps that require them
		[key: string]: any;
	};
}
