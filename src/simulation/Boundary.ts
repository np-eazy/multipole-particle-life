import { Particle } from "./Particle";
import { reflect } from "./Physics";
import { Vector } from "./Utils";

export class Boundary {
    globalBounds: Vector;
    equation: Function;
    distanceMetric: Function;
    outOfBoundsCallback: Function;
    constructor(params: {
        globalBounds: Vector,
        equation: Function, 
        distanceMetric: Function, 
        outOfBoundsCallback: Function,
    }) {
        this.equation = params.equation;
        this.globalBounds = params.globalBounds;
        this.distanceMetric = params.distanceMetric;
        this.outOfBoundsCallback = params.outOfBoundsCallback;
    }
    checkBounds(particles: Particle[]) {
        particles.forEach((particle: Particle) => {
            if (this.equation(particle) == false) {
                this.outOfBoundsCallback(particle);
            }
        });
    }
}

export const closedCircularBounds = (dimension: number, size: number) => new Boundary({
    equation: (particle: Particle) => {
        const radius = size * 100;
        const inBounds = particle.position.getNorm(true) <= radius * radius;
        return inBounds;
    },
    globalBounds: new Vector((new Array(dimension)).fill(size / 2)),
    distanceMetric: (p1: Particle, p2: Particle) => {
        return p1.position.getDistance(p2.position);
    },
    outOfBoundsCallback: (particle: Particle) => {
        particle.position.normalize();
        reflect(particle.velocity, particle.position);
        particle.velocity.scaleV(0.75);
        particle.position.normalize().scaleV(size * 100);
    }
});

export const openSquareBounds = (dimension: number, size: number) => new Boundary({
    equation: (particle: Particle) => {
        const xSize = size;
        const ySize = size;
        const inBounds = Math.abs(particle.position.x[0]) < xSize && Math.abs(particle.position.x[1]) < ySize;
        return inBounds;
    },
    globalBounds: new Vector((new Array(dimension)).fill(size / 2)),
    distanceMetric: (p1: Particle, p2: Particle) => {
        return p1.position.getDistance(p2.position);
    },
    outOfBoundsCallback: (particle: Particle) => {
        particle.markForDeletion();
    }
});

export const openCircularBounds = (dimension: number, size: number) => new Boundary({
    equation: (particle: Particle) => {
        const radius = size;
        const inBounds = particle.position.getNorm(true) <= size * size;
        return inBounds;
    },
    globalBounds: new Vector((new Array(dimension)).fill(size / 2)),
    distanceMetric: (p1: Particle, p2: Particle) => {
        return p1.position.getDistance(p2.position);
    },
    outOfBoundsCallback: (particle: Particle) => {
        particle.markForDeletion();
    }
});
