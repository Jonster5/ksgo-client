'use strict';
import { Canvas } from './engine/canvas';
import type { Stage } from './engine/stage';
import { MapItem, maps, SpawnItem } from './data/maps';
import { Star } from './stars/star';
import { Planet } from './stars/planet';
import { Asteroid } from './stars/asteroid';

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
        this.canvas = new Canvas(p, 0);
        // this.stage = new Stage(0, 0, this.canvas);

        this.remotes = new Set();
        this.user = null;

        this.map = {
            stars: [],
            planets: [],
            asteroids: [],
            spawns: [],
        };

        const m: MapItem = maps.find((m) => m.name === smap);

        // this.stage.width = m.size;
        // this.stage.height = m.size / 2;

        if (!m) alert('broke');

        switch (m.version) {
            case 1.0:
                // this.canvas.size(m.size);
                console.log(m);

                m.stars.forEach((s) => {
                    this.map.stars.push(new Star(this.stage, this.map.stars, s));
                });
                m.planets.forEach((p) => {
                    this.map.planets.push(new Planet(this.stage, this.map.planets, p));
                });
                m.asteroids.forEach((a) => {
                    this.map.asteroids.push(new Asteroid(this.stage, this.map.asteroids, a));
                });
                break;
            default:
                alert('map version not supported ¯\\_(ツ)_/¯');
                break;
        }

        this.canvas.render();
    }
}

export default FP;
