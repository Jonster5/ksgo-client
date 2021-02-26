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
