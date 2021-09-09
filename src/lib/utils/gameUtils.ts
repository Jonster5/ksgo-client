import type { Canvas } from '@api/canvas';
import type { Stage } from '@api/material';
import type { Sprite } from '@api/sprite';
import type { GameMap } from '@classes/map';
import type { PlayerShipObject, PlayerShip } from '@classes/ship';
import type { ParsedAssets, ParsedMapItem, ParsedShipItem } from '@data/assetTypes';
import type { OutputOptionProperties } from '@data/gameTypes';
import type { Writable } from 'svelte/store';

export interface PeacefulGameProperties {
	assets: ParsedAssets;
	options: OutputOptionProperties;

	canvas: Canvas;
	stage: Sprite<Stage>;

	map: GameMap;

	player: PlayerShipObject;

	pause: boolean;
	needsShipRespawn: Writable<boolean>;

	kill(): void;

	spawnPlayer(u: ParsedShipItem): void;
}

// export interface HostedGameProperties {
// 	server: Server;

// 	remotes: Set<RemoteShipObject>;

// 	maxPlayers: number;
// 	ID: string;

// 	playerCount: number;

// 	queue: RemoteSendInfo[];
// 	open: Writable<boolean>;

// 	addRemote(): void;
// 	removeRemote(): void;
// }

// export interface ClientGameProperties {
// 	remotes: Set<RemoteShipObject>;

// 	connection: Client;

// 	init(m: MapItem, remotes: any[]): void;

// 	addRemote(): void;
// 	removeRemote(): void;
// }

export abstract class GameUtils {
	player: PlayerShip;
	getUIProps() {
		return {
			energy: this.player.e,
			maxEnergy: this.player.maxEnergy,
			speed: this.player.s,
			maxSpeed: this.player.maxSpeed,
			hull: this.player.h,
			maxHull: this.player.maxHull,
			cooldown: this.player.c,
		};
	}
}

interface PersonProperties {
	firstName: string;
	lastName: string;
	age?: number;
}

const Chuckie: PersonProperties = {
	firstName: 'Chuckie',
	lastName: 'Call',
};

const Nick = {};
