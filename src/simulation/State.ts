import { Particle } from "./Particle";
import { Orientation, getDistance } from "./utils";

export class State {
    dimension: number;
    t: number;
    particles: Particle[];
    particleMap: Map<string, Particle | undefined>;

    constructor(dimension: number) {
        this.dimension = dimension;
        this.t = 0;
        this.particles = [];
        this.particleMap = new Map();
    }

    copy(): State {
        const state = new State(this.dimension);
        state.t = this.t;
        this.particles.forEach((particle: Particle) => {
            const p = new Particle({
                id: particle.id,
                particleType: particle.particleType,
                mass: particle.mass,
                radius: particle.radius,
                momentCoefficient: particle.momentCoefficient,
                position: particle.position.copy(),
                velocity: particle.velocity.copy(),
                forceTorque: particle.forceTorque.copy(),
            });
            state.addParticle(p);
        })
        return state;
    }

    offsetBy(other: State, h: number): State {
        this.t += h;
        other.particles.forEach((particle: Particle) => {
            this.particleMap.get(particle.id)!.position.scaleAddX(h, other.particleMap.get(particle.id)!.velocity);
            this.particleMap.get(particle.id)!.velocity.scaleAddX(h / particle.mass, other.particleMap.get(particle.id)!.forceTorque);
        })
        return this;
    }

    addParticle(particle: Particle) {
        this.particles.push(particle);
        this.particleMap.set(particle.id, particle);
    }

    clearDeletedParticles() {
        for (const particle of this.particles.filter(particle => particle.markForDeletion)) {
            this.particleMap.set(particle.id, undefined);
        }
        this.particles = this.particles.filter((particle: Particle) => !particle.deleted);
    }

    *particlePairs(interactionThreshold: number) {
        for (let i = 0; i < this.particles.length - 1; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const distance = this.particles[i].position.getDistance(this.particles[j].position);
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
