import { Particle } from "./Particle";
import { Vector } from "./Utils";

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
            state.addParticle(particle.copy());
        })
        return state;
    }

    perturb(other: State, h: number): State {
        // for each particle, 4 logs are numbers, 3 are vectors, meaning that the differentiator is the 3 perturbations on copies, apart from the 4 summation perturbations on the final copy.
        // copied states result in vector orientation for whatever reasion, but not the original.
        // This implies particles are not being copied the right way.
        this.t += h;
        other.particles.forEach((particle: Particle) => {
            this.particleMap.get(particle.id)!.position.addScaledV(h, other.particleMap.get(particle.id)!.velocity);
            this.particleMap.get(particle.id)!.velocity.addScaledV(h / particle.physics.mass, other.particleMap.get(particle.id)!.force);

            if (this.dimension == 2) {
                this.particleMap.get(particle.id)!.orientation = (this.particleMap.get(particle.id)!.orientation as number) + (other.particleMap.get(particle.id)!.angularVelocity as number) * h;
                this.particleMap.get(particle.id)!.angularVelocity = (this.particleMap.get(particle.id)!.angularVelocity as number) + (other.particleMap.get(particle.id)!.torque as number) * h / particle.physics.momentOfInertia;
            } else {
                (this.particleMap.get(particle.id)!.orientation as Vector).addScaledV(h, (other.particleMap.get(particle.id)!.angularVelocity as Vector));

                (this.particleMap.get(particle.id)!.angularVelocity as Vector).addScaledV(h / particle.physics.momentOfInertia, (other.particleMap.get(particle.id)!.torque as Vector));
            }
        })
        return this;
    }

    addParticle(particle: Particle) {
        this.particles.push(particle);
        this.particleMap.set(particle.id, particle);
    }

    clearDeletedParticles() {
        for (const particle of this.particles.filter(particle => particle.deleted)) {
            this.particleMap.set(particle.id, undefined);
        }
        this.particles = this.particles.filter((particle: Particle) => !particle.deleted);
    }

    *getPairs(interactionThreshold: number) {
        for (let i = 0; i < this.particles.length - 1; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const distance = this.particles[i].position.getDistance(this.particles[j].position);
                if (distance < interactionThreshold) {
                    yield { p1: this.particles[i], p2: this.particles[j], distance: distance};
                }
            }
        }
    }
}
