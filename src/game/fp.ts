'use strict';
import { Canvas } from './engine/canvas';
import { Stage } from './engine/stage';
import { AsteroidItem, MapItem, maps, PlanetItem, SpawnItem, StarItem } from './data/maps';
import { Star } from './stars/star';
import { Planet } from './stars/planet';
import { Asteroid } from './stars/asteroid';
import { Rectangle } from './engine/rectangle';

export class FP {
    canvas: Canvas;
    stage: Stage;
    remotes: Set<unknown>;
    user: any;
    map: {
        stars: Array<Star>;
        planets: Array<Planet>;
        asteroids: Array<Asteroid>;
        spawns: Array<SpawnItem>;
    };

    constructor(p: HTMLElement, smap: string) {
        this.canvas = new Canvas(p, 1500);
        this.stage = new Stage(1500, 750);

        this.canvas.add(this.stage);

        let box = new Rectangle(50, 50, 'white', { color: '', thickness: 0 });
        this.stage.add(box);

        box.x = 100;
        box.y = 100;

        box.vx = 2;

        this.canvas.UPS = 30;

        this.canvas.update = () => {
            box.x += box.vx;
            document.title = `FPS ${this.canvas.FPS}`;
        };

        this.remotes = new Set();
        this.user = null;

        this.map = {
            stars: [],
            planets: [],
            asteroids: [],
            spawns: [],
        };

        const m: MapItem = maps.find((m) => m.name === smap);

        if (!m) alert('broke');

        switch (m.version) {
            case 1.0:
                m.stars.forEach((s) => {
                    const star_stats: StarItem = {
                        diameter: null,
                        color: s.color,
                        mass: null,
                        x: null,
                        y: null,
                    };

                    if (typeof s.diameter === 'string') star_stats.diameter = generate(s.diameter);
                    else star_stats.diameter = s.diameter;

                    if (typeof s.mass === 'string') star_stats.mass = generate(s.mass);
                    else star_stats.mass = s.mass;

                    if (typeof s.x === 'string') star_stats.x = generate(s.x);
                    else star_stats.x = s.x;

                    if (typeof s.y === 'string') star_stats.y = generate(s.y);
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
                        planet_stats.diameter = generate(p.diameter);
                    else planet_stats.diameter = p.diameter;

                    if (typeof p.mass === 'string') planet_stats.mass = generate(p.mass);
                    else planet_stats.mass = p.mass;

                    if (typeof p.x === 'string') planet_stats.x = generate(p.x);
                    else planet_stats.x = p.x;

                    if (typeof p.y === 'string') planet_stats.y = generate(p.y);
                    else planet_stats.y = p.y;

                    if (typeof p.vx === 'string') planet_stats.vx = generate(p.vx);
                    else planet_stats.vx = p.vx;

                    if (typeof p.vy === 'string') planet_stats.vy = generate(p.vy);
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
                        asteroid_stats.diameter = generate(a.diameter);
                    else asteroid_stats.diameter = a.diameter;

                    if (typeof a.mass === 'string') asteroid_stats.mass = generate(a.mass);
                    else asteroid_stats.mass = a.mass;

                    if (typeof a.x === 'string') asteroid_stats.x = generate(a.x);
                    else asteroid_stats.x = a.x;

                    if (typeof a.y === 'string') asteroid_stats.y = generate(a.y);
                    else asteroid_stats.y = a.y;

                    if (typeof a.vx === 'string') asteroid_stats.vx = generate(a.vx);
                    else asteroid_stats.vx = a.vx;

                    if (typeof a.vy === 'string') asteroid_stats.vy = generate(a.vy);
                    else asteroid_stats.vy = a.vy;

                    this.map.asteroids.push(new Asteroid(this.stage, asteroid_stats));
                });
                break;
            default:
                alert('map version not supported ¯\\_(ツ)_/¯');
                break;
        }

        this.canvas.render();

        function generate(input: string) {
            const nums = input.split(' ').map((x) => parseFloat(x));

            return Math.floor(Math.random() * (nums[1] - nums[0] + 1)) + nums[0];
        }
    }
}

export default FP;
