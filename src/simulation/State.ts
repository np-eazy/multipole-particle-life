import { Particle } from "./Particle";
import { Orientation } from "./Physics";
import { getDistance } from "./utils";

export class State {
    dimension: number;
    particles: Particle[];
    particleMap: Map<string, Particle | undefined>;

    constructor(dimension: number) {
        this.dimension = dimension;
        this.particles = [];
        this.particleMap = new Map();
    }

    addParticle(particle: Particle) {
        this.particles.push(particle);
        this.particleMap.set(particle.id, particle);
    }

    clearDeletedParticles() {
        for (const particle of this.particles) {
            this.particleMap.set(particle.id, undefined);
        }
        this.particles = this.particles.filter((particle: Particle) => !particle.deleted);
    }

    *particlePairs(interactionThreshold: number) {
        for (let i = 0; i < this.particles.length - 1; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const distance = getDistance(this.particles[i].position.x, this.particles[j].position.x);
                if (distance < interactionThreshold) {
                    yield { p1: this.particles[i], p2: this.particles[j], distance: distance};
                }
            }
        }
    }

    // Analytics
    getMomentum() {
        const total = new Orientation(this.dimension);
        for (const particle of this.particles) {
            total.scaleAddX(particle.mass, particle.velocity);
        }
        return total.x;
    }

    getCenter() {
        const total = new Orientation(this.dimension);
        for (const particle of this.particles) {
            total.scaleAddX(particle.mass, particle.velocity);
        }
        total.scaleX(1 / this.particles.length);
        return total.x;
    }
}
