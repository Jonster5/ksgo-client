'use strict';
import { writable, Writable } from 'svelte/store';
import { Canvas } from './engine/canvas';
import { Stage } from './engine/stage';
import type { AsteroidItem, MapItem, PlanetItem, SpawnItem, StarItem } from './data/maps';
import type { ShipStatObject } from './data/ships';
import { Star } from './stars/star';
import { Planet } from './stars/planet';
import { Asteroid } from './stars/asteroid';
import { Rectangle } from './engine/rectangle';
import { Player } from './ships/player';
import type { Remote } from './ships/remote';
import type { Assets } from './data/assets';
import { Sprite } from './engine/sprite';

export class FP {
    canvas: Canvas;
    stage: Stage;
    remotes: Set<Remote>;
    user: Player;
    boundary: Rectangle;
    background: {
        sprites: Sprite[];
        count: number;
    };
    map: {
        stars: Array<Star>;
        planets: Array<Planet>;
        asteroids: Array<Asteroid>;
        spawns: Array<SpawnItem>;
    };
    pause: boolean;

    assets: Assets;

    needsShipRespawn: Writable<boolean>;

    constructor(p: HTMLElement, assets: Assets) {
        this.canvas = new Canvas(p, 0);
        this.stage = new Stage(0, 0);
        this.canvas.add(this.stage);

        this.assets = assets;

        this.canvas.UPS = 30;

        this.remotes = new Set();
        this.user = null;

        this.background = {
            count: 0,
            sprites: [],
        };

        this.map = {
            stars: [],
            planets: [],
            asteroids: [],
            spawns: [],
        };

        this.pause = true;
        this.needsShipRespawn = writable(false);
    }

    init(m: MapItem) {
        this.canvas.size(m.size / 2);
        this.stage.width = m.size;
        this.stage.height = m.size;

        let col = 0;
        let row = 0;
        this.background.count = Math.ceil(m.size / 500);
        for (let i = 0; i < this.background.count ** 2; i++) {
            console.log(
                row * 500 - this.stage.halfWidth + 250,
                col * 500 - this.stage.halfHeight + 250
            );
            const s = new Sprite(
                this.assets.gamebg,
                500,
                500,
                row * 500 - this.stage.halfWidth + 250,
                col * 500 - this.stage.halfHeight + 250
            );

            row += 1;
            if (i % this.background.count === 9) {
                col += 1;
                row = 0;
            }

            s.r = [0, Math.PI / 2, Math.PI, -Math.PI / 2][Math.floor(Math.random() * 4)];

            this.background.sprites.push(s);
        }

        this.boundary = new Rectangle(m.size, m.size, '', { color: 'red', thickness: 4 });

        this.stage.add(...this.background.sprites, this.boundary);

        this.canvas.element.addEventListener('contextmenu', (e: Event) => e.preventDefault());

        window.addEventListener('resize', () => {
            this.canvas.ar = window.innerWidth / window.innerHeight;
            this.canvas.size(this.canvas.width);
        });

        switch (m.version) {
            case 0.1:
                m.stars.forEach((s) => {
                    const star_stats: StarItem = {
                        diameter: null,
                        color: s.color,
                        mass: null,
                        x: null,
                        y: null,
                    };

                    if (typeof s.diameter === 'string')
                        star_stats.diameter = this.generate(s.diameter);
                    else star_stats.diameter = s.diameter;

                    if (typeof s.mass === 'string') star_stats.mass = this.generate(s.mass);
                    else star_stats.mass = s.mass;

                    if (typeof s.x === 'string') star_stats.x = this.generate(s.x);
                    else star_stats.x = s.x;

                    if (typeof s.y === 'string') star_stats.y = this.generate(s.y);
                    else star_stats.y = s.y;

                    this.map.stars.push(new Star(this.stage, star_stats));
                });
                m.planets.forEach((p) => {
                    const planet_stats: PlanetItem = {
                        diameter: null,
                        color: p.color,
                        mass: null,
                        x: null,
                        y: null,
                        vx: null,
                        vy: null,
                    };

                    if (typeof p.diameter === 'string')
                        planet_stats.diameter = this.generate(p.diameter);
                    else planet_stats.diameter = p.diameter;

                    if (typeof p.mass === 'string') planet_stats.mass = this.generate(p.mass);
                    else planet_stats.mass = p.mass;

                    if (typeof p.x === 'string') planet_stats.x = this.generate(p.x);
                    else planet_stats.x = p.x;

                    if (typeof p.y === 'string') planet_stats.y = this.generate(p.y);
                    else planet_stats.y = p.y;

                    if (typeof p.vx === 'string') planet_stats.vx = this.generate(p.vx);
                    else planet_stats.vx = p.vx;

                    if (typeof p.vy === 'string') planet_stats.vy = this.generate(p.vy);
                    else planet_stats.vy = p.vy;

                    this.map.planets.push(new Planet(this.stage, planet_stats));
                });
                m.asteroids.forEach((a) => {
                    const asteroid_stats: AsteroidItem = {
                        diameter: null,
                        color: a.color,
                        mass: null,
                        x: null,
                        y: null,
                        vx: null,
                        vy: null,
                    };

                    if (typeof a.diameter === 'string')
                        asteroid_stats.diameter = this.generate(a.diameter);
                    else asteroid_stats.diameter = a.diameter;

                    if (typeof a.mass === 'string') asteroid_stats.mass = this.generate(a.mass);
                    else asteroid_stats.mass = a.mass;

                    if (typeof a.x === 'string') asteroid_stats.x = this.generate(a.x);
                    else asteroid_stats.x = a.x;

                    if (typeof a.y === 'string') asteroid_stats.y = this.generate(a.y);
                    else asteroid_stats.y = a.y;

                    if (typeof a.vx === 'string') asteroid_stats.vx = this.generate(a.vx);
                    else asteroid_stats.vx = a.vx;

                    if (typeof a.vy === 'string') asteroid_stats.vy = this.generate(a.vy);
                    else asteroid_stats.vy = a.vy;

                    this.map.asteroids.push(new Asteroid(this.stage, asteroid_stats));
                });

                this.map.spawns = [...m.spawn];
                break;
            default:
                alert('map version not supported ¯\\_(ツ)_/¯');
                break;
        }

        this.canvas.update = () => {
            if (this.pause) return;

            this.map.planets.forEach((planet) => {
                planet.updateGravity(this.map.stars, this.map.planets);
            });

            this.map.asteroids.forEach((asteroid) => {
                asteroid.updateGravity(this.map.stars, this.map.planets, this.map.asteroids);
            });

            this.user?.updateGravity(this.map.stars, this.map.planets, this.map.asteroids);

            if (this.map.planets.length > 0) {
                this.map.planets.forEach((planet) => {
                    planet.x += planet.vx;
                    planet.y += planet.vy;

                    // console.log(planet.x, this.stage.halfWidth);
                    if (planet.x > this.stage.halfWidth) {
                        planet.sprite.setX(-this.stage.halfWidth);
                    }
                    if (planet.x < -this.stage.halfWidth) {
                        planet.sprite.setX(this.stage.halfWidth);
                    }

                    if (planet.y > this.stage.halfHeight) {
                        planet.sprite.setY(-this.stage.halfHeight);
                    }
                    if (planet.y < -this.stage.halfHeight) {
                        planet.sprite.setY(this.stage.halfHeight);
                    }
                });
            }

            if (this.map.asteroids.length > 0) {
                this.map.asteroids.forEach((asteroid) => {
                    asteroid.x += asteroid.vx;
                    asteroid.y += asteroid.vy;

                    if (asteroid.x > this.stage.halfWidth) {
                        asteroid.sprite.setX(-this.stage.halfWidth);
                    }
                    if (asteroid.x < -this.stage.halfWidth) {
                        asteroid.sprite.setX(this.stage.halfWidth);
                    }

                    if (asteroid.y > this.stage.halfHeight) {
                        asteroid.sprite.setY(-this.stage.halfHeight);
                    }
                    if (asteroid.y < -this.stage.halfHeight) {
                        asteroid.sprite.setY(this.stage.halfHeight);
                    }
                });
            }

            this.user.update();

            if (this.user.x > this.stage.halfWidth) {
                this.user.sprite.setX(-this.stage.halfWidth);
                this.stage.setX(-this.user.x);
            }
            if (this.user.x < -this.stage.halfWidth) {
                this.user.sprite.setX(this.stage.halfWidth);
                this.stage.setX(-this.user.x);
            }
            if (this.user.y > this.stage.halfHeight) {
                this.user.sprite.setY(-this.stage.halfHeight);
                this.stage.setY(-this.user.y);
            }
            if (this.user.y < -this.stage.halfHeight) {
                this.user.sprite.setY(this.stage.halfHeight);
                this.stage.setY(-this.user.y);
            }

            this.stage.x = -this.user?.x ?? 0;
            this.stage.y = -this.user?.y ?? 0;
        };

        this.canvas.start();

        this.needsShipRespawn.set(true);

        this.canvas.element.addEventListener(
            'wheel',
            (e) => {
                if (e.deltaY > 0) {
                    if (this.canvas.width + 100 >= this.user.sprite.height * 50) return;
                    this.canvas.size(this.canvas.width + 100);
                } else {
                    if (this.canvas.width - 100 <= this.user.sprite.height * 10) return;
                    this.canvas.size(this.canvas.width - 100);
                }
            },
            { passive: true }
        );
    }

    spawn(u: ShipStatObject) {
        this.user = new Player(this.stage, u, this.assets);

        const { x, y, size } = this.map.spawns[Math.floor(Math.random() * this.map.spawns.length)];

        const sx = Math.floor(Math.random() * (x + size / 2 - x - size / 2 + 1) + x + size);
        const sy = Math.floor(Math.random() * (y + size / 2 - y - size / 2 + 1) + y + size);

        this.user.sprite.setX(sx);
        this.user.sprite.setY(sy);

        this.needsShipRespawn.set(false);
        this.pause = false;

        this.canvas.size(this.user.sprite.height * 30);
    }

    private generate(input: string) {
        const nums = input.split(' ').map((x) => parseFloat(x));

        return Math.floor(Math.random() * (nums[1] - nums[0] + 1)) + nums[0];
    }

    kill(): void {
        this.canvas.stop();
    }
}
