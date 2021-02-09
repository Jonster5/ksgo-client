'use strict';
import { Canvas } from './engine/canvas';
import type { Stage } from './engine/stage';
import { maps } from './maps/maps';

export class FP {
    canvas: Canvas;
    stage: Stage;
    remotes: Set<unknown>;
    user: any;
    map: { stars: any[]; planets: any[]; asteroids: any[]; spawns: any[] };

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

        const m = maps[smap];

        this.canvas.Size(m.size);
        // this.stage.width = m.size;
        this.stage.height = m.size / 2;

        // switch (m.version) {
        //     case 1:
        //         m.stars.forEach((s) => {
        //             this.map.stars.push(new Star(this.stage, this.map.stars, s));
        //         });
        //         m.planets.forEach((p) => {
        //             this.map.planets.push(new Planet(this.stage, this.map.planets, p));
        //         });
        //         m.asteroids.forEach((a) => {
        //             this.map.asteroids.push(new Asteroid(this.stage, this.map.asteroids, a));
        //         });
        //         break;
        //     default:
        //         alert('map version not supported ¯\\_(ツ)_/¯');
        //         break;
        // }

        this.canvas.render();
    }
}

export default FP;
