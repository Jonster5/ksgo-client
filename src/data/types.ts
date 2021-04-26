export type Direction = 'forward' | 'right' | 'left' | 'reverse';
export enum AIStep {
    target, // select a target
    turn, // turn to face the target
    move, // move towards the target
    fire, // fire weapons
}

export interface GameOptions {
    players: number;
    map: string;
    private: boolean;
}
export interface MapItem {
    version: number;
    name: string;
    size: number;
    friction: number;
    stars: Array<StarItem>;
    planets: Array<PlanetItem>;
    asteroids: Array<AsteroidItem>;
    spawn: Array<SpawnItem>;
    thumb: string;
    alt: string;
}

export interface StarItem {
    x: number | string;
    y: number | string;
    diameter: number | string;
    mass: number | string;
    color: string;
}

export interface PlanetItem {
    x: number | string;
    y: number | string;
    diameter: number | string;
    mass: number | string;
    color: string;
    vx: number | string;
    vy: number | string;
}

export interface AsteroidItem {
    x: number | string;
    y: number | string;
    diameter: number | string;
    mass: number | string;
    color: string;
    vx: number | string;
    vy: number | string;
}

export interface SpawnItem {
    x: number;
    y: number;
    size: number;
}

export interface ShipStatObject {
    version: number;
    name: string;
    width: number;
    height: number;

    max_energy: number;
    energy_gain: number;
    max_hull: number;
    max_speed: number;

    mass: number;

    thrusters: Array<ShipThrustItem>;

    weapons: Array<ShipWeaponItem>;

    image: string;
    thumb: string;
    enemy: string;
}

export interface ShipThrustItem {
    direction: Direction;
    size: number;
    x: number;
    y: number;
    energy: number;
    thrust: number;
}

export interface ShipWeaponItem {
    type: string;
    direction: Direction;
    length: number;
    width: number;
    x: number;
    y: number;

    damage: number;
    energy: number;
}
