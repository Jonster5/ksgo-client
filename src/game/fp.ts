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
import { Circle } from './engine/circle';
import { Player } from './ships/player';
import type { Remote } from './ships/remote';

export class FP {
    canvas: Canvas;
    stage: Stage;
    remotes: Set<Remote>;
    user: Player;
    boundary: Rectangle;
    map: {
        stars: Array<Star>;
        planets: Array<Planet>;
        asteroids: Array<Asteroid>;
        spawns: Array<SpawnItem>;
    };
    pause: boolean;
    mount: boolean;

    needsShipRespawn: Writable<boolean>;

    constructor(p: HTMLElement) {
        this.canvas = new Canvas(p, 0);
        this.stage = new Stage(0, 0);
        this.canvas.add(this.stage);

        this.canvas.UPS = 30;

        this.remotes = new Set();
        this.user = null;

        this.mount = true;

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
        this.stage.height = m.size / 2;

        this.boundary = new Rectangle(m.size, m.size / 2, '', {
            color: 'red',
            thickness: 4,
        });
        this.stage.add(this.boundary);

        this.canvas.element.addEventListener('contextmenu', (e: Event) => {
            e.preventDefault();
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

            this.stage.x = -this.user?.x ?? 0;
            this.stage.y = -this.user?.y ?? 0;
        };

        this.canvas.start();

        this.needsShipRespawn.set(true);
    }

    spawn(u: ShipStatObject) {
        this.user = new Player(this.stage, u);
        this.needsShipRespawn.set(false);
        this.pause = false;

        if (this.mount) {
            this.canvas.element.addEventListener(
                'wheel',
                (e) => {
                    if (e.deltaY > 0) {
                        this.canvas.size(this.canvas.width + 100);
                        if (this.canvas.width >= this.user.sprite.height * 50)
                            this.canvas.size(this.user.sprite.height * 50);
                    } else {
                        this.canvas.size(this.canvas.width - 100);
                        if (this.canvas.width <= this.user.sprite.height * 10)
                            this.canvas.size(this.user.sprite.height * 10);
                    }
                },
                { passive: true }
            );

            this.mount = false;
        }

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

export default FP;
