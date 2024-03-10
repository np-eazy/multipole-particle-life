import { Particle } from "./Particle";
import { reflect } from "./Physics";

export class Boundary {
    equation: Function;
    distanceMetric: Function;
    outOfBoundsCallback: Function;
    constructor({equation, distanceMetric, outOfBoundsCallback}: {equation: Function, distanceMetric: Function, outOfBoundsCallback: Function}) {
        this.equation = equation;
        this.distanceMetric = distanceMetric;
        this.outOfBoundsCallback = outOfBoundsCallback;
    }
    checkBounds(particles: Particle[]) {
        particles.forEach((particle: Particle) => {
            if (this.equation(particle) == false) {
                this.outOfBoundsCallback(particle);
            }
        });
    }
}

export const closedCircularBounds = (size: number) => new Boundary({
    equation: (particle: Particle) => {
        const radius = size;
        const inBounds = particle.position.getNorm(true) <= size * size;
        return inBounds;
    },
    distanceMetric: (p1: Particle, p2: Particle) => {
        return p1.position.getDistance(p2.position);
    },
    outOfBoundsCallback: (particle: Particle) => {
        particle.position.normalize();
        reflect(particle.velocity, particle.position);
        particle.velocity.scaleV(0.75);
        particle.position.normalize().scaleV(size);
    }
});

export const openSquareBounds = (size: number) => new Boundary({
    equation: (particle: Particle) => {
        const xSize = size;
        const ySize = size;
        const inBounds = Math.abs(particle.position.x[0]) < xSize && Math.abs(particle.position.x[1]) < ySize;
        return inBounds;
    },
    distanceMetric: (p1: Particle, p2: Particle) => {
        return p1.position.getDistance(p2.position);
    },
    outOfBoundsCallback: (particle: Particle) => {
        particle.markForDeletion();
    }
});

export const openCircularBounds = (size: number) => new Boundary({
    equation: (particle: Particle) => {
        const radius = size;
        const inBounds = particle.position.getNorm(true) <= size * size;
        return inBounds;
    },
    distanceMetric: (p1: Particle, p2: Particle) => {
        return p1.position.getDistance(p2.position);
    },
    outOfBoundsCallback: (particle: Particle) => {
        particle.markForDeletion();
    }
});
