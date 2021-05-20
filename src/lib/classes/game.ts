import { Canvas } from '@api/canvas';
import { Stage } from '@api/stage';
import type { ParsedAssets } from '@data/assets';
import { RemoteSendInfo, GET_KSGO_ID, FireStore } from '@data/multiplayer';
import type { MapItem, ShipStatObject, GameOptions } from '@data/types';
import { GameUtils, Game, HostedGame } from '@utils/gameUtils';
import { Writable, writable } from 'svelte/store';
import { GameMap } from './map';
import {
	PlayerShipObject,
	EnemyShipObject,
	PlayerSpectator,
	PlayerShip,
	EnemyShip,
	RemoteShipObject,
} from './ship';
import { Server } from './socket';

export class FreeplayGame extends GameUtils implements Game {
	assets: ParsedAssets;

	canvas: Canvas;
	stage: Stage;

	map: GameMap;

	user: PlayerShipObject;
	enemies: Set<EnemyShipObject>;

	pause: boolean;
	needsShipRespawn: Writable<boolean>;

	constructor(p: HTMLElement, assets: ParsedAssets) {
		super();
		this.assets = assets;

		this.canvas = new Canvas(p, 0);
		this.stage = new Stage(0, 0);
		this.canvas.add(this.stage);

		this.canvas.UPS = 30;

		this.enemies = new Set();
		this.user = null;

		this.map = new GameMap(this.assets);

		this.pause = true;
		this.needsShipRespawn = writable(false);
	}

	init(m: MapItem) {
		this.canvas.size(m.size / 2);
		this.stage.width = m.size;
		this.stage.height = m.size;

		this.map.setupBackground(m, this.stage);
		this.map.setupMap(m, this.stage);

		this.canvas.element.addEventListener('contextmenu', (e: Event) =>
			e.preventDefault()
		);

		window.addEventListener('resize', () => {
			this.canvas.ar = window.innerWidth / window.innerHeight;
			this.canvas.size(this.canvas.width);
		});

		this.canvas.update = () => {
			if (this.pause) return;

			this.map.updateGravity();

			this.user?.updateGravity(
				this.map.stars,
				this.map.planets,
				this.map.asteroids
			);

			this.enemies.forEach((e) =>
				e.updateGravity(
					this.map.stars,
					this.map.planets,
					this.map.asteroids
				)
			);

			this.map.updatePosition(this.stage);

			this.user.update(this.stage);

			this.enemies.forEach((e) =>
				e.AI([this.user, ...Array.from(this.enemies)], {
					size: this.stage.width,
				})
			);
			this.enemies.forEach((e) => e.update(this.stage));
		};

		this.canvas.start();

		this.needsShipRespawn.set(true);

		this.canvas.element.addEventListener(
			'wheel',
			(e) => {
				if (e.deltaY > 0) {
					if (this.canvas.width + 100 >= this.user.sprite.height * 50)
						return;
					this.canvas.size(this.canvas.width + 100);
				} else {
					if (this.canvas.width - 100 <= this.user.sprite.height * 10)
						return;
					this.canvas.size(this.canvas.width - 100);
				}
			},
			{ passive: true }
		);
	}

	spawnPlayer(u: ShipStatObject) {
		if (this.user) {
			this.user.kill();
			this.enemies.forEach((e) => e.kill());
		}

		this.user =
			u.name === 'Spectator'
				? new PlayerSpectator(this.stage, u, this.assets)
				: new PlayerShip(this.stage, u, this.assets);

		const { x, y, r } = this.map.getSpawnCoords();

		this.user.sprite.setX(x);
		this.user.sprite.setY(y);
		this.user.sprite.setR(r);

		this.needsShipRespawn.set(false);
		this.pause = false;

		this.canvas.size(this.user.sprite.height * 30);
	}

	spawnEnemy(u: ShipStatObject) {
		const newEnemy = new EnemyShip(this.stage, u, this.assets);

		const { x, y, size } =
			this.map.spawns[Math.floor(Math.random() * this.map.spawns.length)];

		const sx = Math.floor(
			Math.random() * (x + size / 2 - x - size / 2 + 1) + x + size
		);
		const sy = Math.floor(
			Math.random() * (y + size / 2 - y - size / 2 + 1) + y + size
		);
		const sr = Math.floor((Math.random() * 360 * Math.PI) / 180);

		newEnemy.sprite.setX(sx);
		newEnemy.sprite.setY(sy);
		newEnemy.sprite.setR(sr);

		this.enemies.add(newEnemy);
	}

	kill(): void {
		this.user.kill();
		this.canvas.stop();
	}
}

export class HostGame extends GameUtils implements Game, HostedGame {
	assets: ParsedAssets;

	canvas: Canvas;
	stage: Stage;

	queue: RemoteSendInfo[];
	ID: string;
	open: Writable<boolean>;

	playerCount: number;
	maxPlayers: number;

	map: GameMap;

	server: Server;

	user: PlayerShipObject;
	enemies: Set<EnemyShipObject>;
	remotes: Set<RemoteShipObject>;

	pause: boolean;
	needsShipRespawn: Writable<boolean>;

	constructor(
		p: HTMLElement,
		assets: ParsedAssets,
		options: GameOptions,
		FS: FireStore
	) {
		super();
		this.assets = assets;

		this.canvas = new Canvas(p, 0);
		this.stage = new Stage(0, 0);
		this.canvas.add(this.stage);

		this.canvas.UPS = 30;

		this.enemies = new Set();
		this.user = null;

		this.queue = [];

		this.server = new Server(FS);

		this.ID = GET_KSGO_ID('HOST');
		this.open = writable(false);

		this.playerCount = 1;
		this.maxPlayers = options.players;

		this.map = new GameMap(this.assets);

		this.pause = true;
		this.needsShipRespawn = writable(false);
	}

	init(m: MapItem) {
		this.canvas.size(m.size / 2);
		this.stage.width = m.size;
		this.stage.height = m.size;

		this.map.setupBackground(m, this.stage);
		this.map.setupMap(m, this.stage);

		this.server.init(this.ID, m);

		this.canvas.element.addEventListener('contextmenu', (e: Event) =>
			e.preventDefault()
		);

		window.addEventListener('resize', () => {
			this.canvas.ar = window.innerWidth / window.innerHeight;
			this.canvas.size(this.canvas.width);
		});

		this.canvas.update = () => {
			if (this.pause) return;

			this.map.updateGravity();

			this.user?.updateGravity(
				this.map.stars,
				this.map.planets,
				this.map.asteroids
			);

			this.enemies.forEach((e) =>
				e.updateGravity(
					this.map.stars,
					this.map.planets,
					this.map.asteroids
				)
			);

			this.map.updatePosition(this.stage);

			this.user.update(this.stage);

			this.enemies.forEach((e) =>
				e.AI([this.user, ...Array.from(this.enemies)], {
					size: this.stage.width,
				})
			);
			this.enemies.forEach((e) => e.update(this.stage));
		};

		this.canvas.start();

		this.needsShipRespawn.set(true);

		this.canvas.element.addEventListener(
			'wheel',
			(e) => {
				if (e.deltaY > 0) {
					if (this.canvas.width + 100 >= this.user.sprite.height * 50)
						return;
					this.canvas.size(this.canvas.width + 100);
				} else {
					if (this.canvas.width - 100 <= this.user.sprite.height * 10)
						return;
					this.canvas.size(this.canvas.width - 100);
				}
			},
			{ passive: true }
		);
	}

	spawnPlayer(u: ShipStatObject) {
		if (this.user) {
			this.user.kill();
			this.user = null;
		}

		this.user =
			u.name === 'Spectator'
				? new PlayerSpectator(this.stage, u, this.assets)
				: new PlayerShip(this.stage, u, this.assets);

		const { x, y, r } = this.map.getSpawnCoords();

		this.user.sprite.setX(x);
		this.user.sprite.setY(y);
		this.user.sprite.setR(r);

		this.needsShipRespawn.set(false);
		this.pause = false;

		this.canvas.size(this.user.sprite.height * 30);
	}

	spawnEnemy(u: ShipStatObject) {
		const newEnemy = new EnemyShip(this.stage, u, this.assets);

		const { x, y, r } = this.map.getSpawnCoords();

		newEnemy.sprite.setX(x);
		newEnemy.sprite.setY(y);
		newEnemy.sprite.setR(r);

		this.enemies.add(newEnemy);
	}

	kill(): void {
		this.user.kill();
		this.canvas.stop();
		this.server.destroy();
		this.server.remove();
	}

	addRemote(): void {}

	removeRemote(): void {}
}
