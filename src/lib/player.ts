export default 'nothing here';

// import type { ShipStatObject } from '@data/types';
// import type { Sprite } from '@lib/sprite';
// import type { Stage } from '@lib/stage';
// import type { Asteroid } from '@lib/asteroid';
// import type { Planet } from '@lib/planet';
// import type { Star } from '@lib/star';
// import { Ship } from '@lib/ship';
// import type { ParsedAssets } from '@data/assets';
// import { writable, Writable } from 'svelte/store';
// import type { Ability } from '@lib/abilities';

// export class Player {
//     abilities: Array<any>;

//     mass: number;
//     isAlive: boolean;

//     primary: boolean;

//     maxEnergy: number;
//     energy: Writable<number>;
//     energyGain: number;

//     constructor(stage: Stage, stats: ShipStatObject, assets: ParsedAssets, abilities: Array<any>) {
//         this.isAlive = true;

//         this.abilities = abilities.map((ab) => new ab(stage, stats, assets));

//         window.addEventListener('keydown', (e: KeyboardEvent) => {
//             e.preventDefault();
//         });

//         window.addEventListener('keyup', (e: KeyboardEvent) => {
//             e.preventDefault();

//             switch (e.key) {
//                 case 'w':
//                     this.forward = false;

//                     this.thrusters
//                         .filter(({ direction }) => direction === 'forward')
//                         .forEach(({ sprite }) => {
//                             sprite.stop();
//                             sprite.visible = false;
//                         });
//                     break;
//                 case 'a':
//                     this.thrusters
//                         .filter(({ direction }) => direction === 'left')
//                         .forEach(({ sprite }) => {
//                             sprite.stop();
//                             sprite.visible = false;
//                         });

//                     this.left = false;
//                     break;
//                 case 'd':
//                     this.thrusters
//                         .filter(({ direction }) => direction === 'right')
//                         .forEach(({ sprite }) => {
//                             sprite.stop();
//                             sprite.visible = false;
//                         });

//                     this.right = false;
//                     break;
//             }
//         });
//     }

//     update() {}
// }
