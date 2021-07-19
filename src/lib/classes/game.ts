import { Canvas } from '@api/canvas';
import { Stage } from '@api/material';
import { Sprite } from '@api/sprite';
import { Vec2 } from '@api/vec2';
import { GameMap } from '@classes/map';
import { PlayerShip, PlayerShipObject } from '@classes/ship';
import type { ParsedAssets, ParsedMapItem, ParsedShipItem } from '@data/assetTypes';
import { GameUtils, PeacefulGameProperties } from '@utils/gameUtils';
import { Writable, writable } from 'svelte/store';

export class PeacefulFreeplayGame extends GameUtils implements PeacefulGameProperties {
	assets: ParsedAssets;

	canvas: Canvas;
	stage: Sprite<Stage>;

	map: GameMap;

	player!: PlayerShipObject;

	pause: boolean;
	needsShipRespawn: Writable<boolean>;

	constructor(p: HTMLElement, assets: ParsedAssets) {
		super();
		this.assets = assets;

		this.canvas = new Canvas(p, window.innerWidth);
		this.stage = new Sprite(new Stage(), new Vec2(0));
		this.canvas.add(this.stage);

		this.canvas.UPS = 30;

		this.player = null;

		this.map = new GameMap(this.assets);

		this.pause = true;
		this.needsShipRespawn = writable(false);
	}

	init(m: ParsedMapItem) {
		this.canvas.setSize(m.size / 2);
		this.stage.size.set(m.size);

		this.map.setupBackground(m, this.stage);
		this.map.setupMap(m, this.stage);

		this.canvas.element.addEventListener('contextmenu', (e: Event) => e.preventDefault());

		window.addEventListener('resize', () => {
			this.canvas.ar = window.innerWidth / window.innerHeight;
			this.canvas.setSize(this.canvas.width);
		});

		this.canvas.update = () => {
			if (this.pause) return;

			this.map.updateGravity();

			this.player.updateGravity(this.map.stars, this.map.planets, this.map.asteroids);

			this.map.updatePosition(this.stage);

			this.player.update(this.stage);
		};

		this.canvas.start();

		this.needsShipRespawn.set(true);

		this.canvas.element.addEventListener(
			'wheel',
			(e) => {
				if (e.deltaY > 0) {
					if (this.canvas.width + 100 >= this.player.sprite.size.y * 50) return;
					this.canvas.setSize(this.canvas.width + 100);
				} else {
					if (this.canvas.width - 100 <= this.player.sprite.size.y * 10) return;
					this.canvas.setSize(this.canvas.width - 100);
				}
			},
			{ passive: true }
		);
	}

	spawnPlayer(u: ParsedShipItem) {
		if (this.player) {
			this.player.kill();
		}

		this.player = new PlayerShip(this.stage, u, this.assets);

		const { p, r } = this.map.getSpawnCoords();

		this.player.sprite.setPosition(p, r);

		this.needsShipRespawn.set(false);
		this.pause = false;

		this.canvas.setSize(this.player.sprite.size.y * 30);
	}

	kill(): void {
		this.player.kill();
		this.canvas.stop();
	}
}

/*
export class HostGame extends GameUtils implements Game, HostedGameProperties {
	assets: ParsedAssets;

	canvas: Canvas;
	stage: Stage;

	queue: RemoteSendInfo[];
	ID: string;
	open: Writable<boolean>;

	playerCount: number;
	maxPlayers: number;

	map: GameMap;

	ref: DocRef;
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
		FS: Database
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

		this.ref = FS.collection('public-games').doc();

		this.ID = this.ref.id;

		this.server = new Server(this.ref);

		this.open = writable(false);

		this.playerCount = 1;
		this.maxPlayers = options.players;

		this.map = new GameMap(this.assets);

		this.pause = true;
		this.needsShipRespawn = writable(false);
	}

	async init(m: MapItem) {
		this.canvas.size(m.size / 2);
		this.stage.width = m.size;
		this.stage.height = m.size;

		this.map.setupBackground(m, this.stage);
		this.map.setupMap(m, this.stage);

		await this.server.init(this.ID, m, {
			mp: this.maxPlayers,
			private: false,
		});

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

export class ClientGame
	extends GameUtils
	implements Game, ClientGameProperties
{
	assets: ParsedAssets;

	canvas: Canvas;
	stage: Stage;

	queue: RemoteSendInfo[];
	ID: string;
	open: Writable<boolean>;

	playerCount: number;
	maxPlayers: number;

	map: GameMap;

	ref: DocRef;
	connection: Client;

	user: PlayerShipObject;
	enemies: Set<EnemyShipObject>;
	remotes: Set<RemoteShipObject>;

	pause: boolean;
	needsShipRespawn: Writable<boolean>;

	constructor(
		p: HTMLElement,
		assets: ParsedAssets,
		options: GameOptions,
		FS: Database
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

		this.ref = FS.collection('public-games').doc();

		this.ID = this.ref.id;

		this.connection = new Client(this.ref);

		this.open = writable(false);

		this.playerCount = 1;
		this.maxPlayers = options.players;

		this.map = new GameMap(this.assets);

		this.pause = true;
		this.needsShipRespawn = writable(false);
	}
	addRemote(): void {
		throw new Error('Method not implemented.');
	}
	removeRemote(): void {
		throw new Error('Method not implemented.');
	}

	init(m: MapItem): void {}
	kill(): void {
		throw new Error('Method not implemented.');
	}
	spawnPlayer(u: ShipStatObject): void {
		throw new Error('Method not implemented.');
	}
	spawnEnemy(u: ShipStatObject): void {
		throw new Error('Method not implemented.');
	}
}
*/
