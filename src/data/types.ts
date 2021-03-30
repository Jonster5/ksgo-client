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

    mass: number;

    abilities: Array<string>;

    thrusters: Array<ShipThrustItem>;

    weapons: Array<ShipWeaponItem>;

    image: string;
    thumb: string;
}

export interface ShipThrustItem {
    direction: string;
    size: number;
    x: number;
    y: number;
    energy: number;
    thrust: number;
}

export interface ShipWeaponItem {
    type: string;
    direction: string;
    x: number;
    y: number;

    damage: number;
    energy: number;
}
