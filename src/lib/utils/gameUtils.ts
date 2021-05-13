import type { Canvas } from '@api/canvas';
import type { Stage } from '@api/stage';
import type { GameMap } from '@classes/map';
import type { Server } from '@classes/server';
import type {
	PlayerShipObject,
	EnemyShipObject,
	RemoteShipObject,
	PlayerShip,
} from '@classes/ship';
import type { ParsedAssets } from '@data/assets';
import type { RemoteSendInfo } from '@data/multiplayer';
import type { MapItem, ShipStatObject } from '@data/types';
import type { Writable } from 'svelte/store';

export interface Game {
	assets: ParsedAssets;

	canvas: Canvas;
	stage: Stage;

	map: GameMap;

	user: PlayerShipObject;
	enemies: Set<EnemyShipObject>;

	pause: boolean;
	needsShipRespawn: Writable<boolean>;

	init(m: MapItem): void;
	kill(): void;

	spawnPlayer(u: ShipStatObject): void;
	spawnEnemy(u: ShipStatObject): void;
}

export interface HostedGame {
	remotes: Set<RemoteShipObject>;

	queue: RemoteSendInfo[];
	readonly ID: string;
	server: Server;
	open: Writable<boolean>;

	playerCount: number;
	readonly maxPlayers: number;

	addRemote(): void;
	removeRemote(): void;
}

export interface ClientGame {
	remotes: Set<RemoteShipObject>;

	init(m: MapItem, remotes: any[]): void;

	addRemote(): void;
	removeRemote(): void;
}

export abstract class GameUtils {
	user: PlayerShip;
	getUIProps() {
		return {
			energy: this.user.e,
			maxEnergy: this.user.maxEnergy,
			speed: this.user.s,
			maxSpeed: this.user.maxSpeed,
			hull: this.user.h,
			maxHull: this.user.maxHull,
			cooldown: this.user.c,
		};
	}
}
