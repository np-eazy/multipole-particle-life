import { Boundary } from "./Boundary";
import { Particle } from "./Particle";
import { State } from "./State";
import { Rule } from "./Interactions";
import { elasticCollision, interactionBound } from "./Physics";
import { ParticleProperties } from "./ParticleProperties";

export class Simulation {
    dimensions: number;
    t: number;
    h: number;
    boundary: Boundary;
    particleProperties: ParticleProperties[];
    rule: Rule;
    state: State;

    constructor(params: { dimensions: number; boundary: Boundary, rule: Rule, particleProperties: ParticleProperties[], particles: Particle[], stepSize: number }) {
        this.dimensions = params.dimensions;
        this.t = 0;
        this.h = params.stepSize;
        this.boundary = params.boundary;
        this.rule = params.rule;
        this.particleProperties = params.particleProperties;
        this.state = new State(params.dimensions);
        params.particles.forEach((particle: Particle) => {
            this.state.addParticle(particle);
        })
    }

    eulerStep(h: number, state?: State) {
        const currState: State = state ?? this.state;
        if (!state)this.t += h;
        [...this.state.particlePairs(interactionBound)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
            p1.loadForce(this.rule.getForce(p1, p2, distance));
            p2.loadForce(this.rule.getForce(p2, p1, distance));
        });
        currState.particles.forEach((particle: Particle) => {
            particle.move(h);
        });
        this.boundary.checkBounds(this.state.particles);
        currState.clearDeletedParticles();
    }

    rk4Step() {
        const loadDerivative = (state: State) => {
            [...state.particlePairs(interactionBound)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
                p1.loadForce(this.rule.getForce(p1, p2, distance));
                p2.loadForce(this.rule.getForce(p2, p1, distance));
            });
            // state.particles.forEach((particle: Particle) => {
            //     particle.move(h1);
            // });
        };
    
        const stateK1 = this.state.copy(); 
        loadDerivative(stateK1);
    
        const stateK2 = this.state.copy().offsetBy(stateK1, this.h / 2); 
        loadDerivative(stateK2);
    
        const stateK3 = this.state.copy().offsetBy(stateK2, this.h / 2);
        loadDerivative(stateK3);
    
        const stateK4 = this.state.copy().offsetBy(stateK3, this.h);
        loadDerivative(stateK4);

        this.state.offsetBy(stateK1, this.h / 6).offsetBy(stateK2, this.h / 3).offsetBy(stateK3, this.h / 3).offsetBy(stateK4, this.h / 6);
        this.state.particles.forEach((particle: Particle) => {
            particle.move(this.h);
        });
        this.correctOverlaps();
        this.boundary.checkBounds(this.state.particles);
    }

    correctOverlaps() {
        [...this.state.particlePairs(20)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
            const [r1, r2] = [p1.physics.radius, p2.physics.radius, p1.physics.radius, p2.physics.radius];
            if (distance < r1 + r2) {
                p1.position.scaleAddX(r1 +r2 - distance, p2.position.deltaX(p1.position).normalize());
                elasticCollision(p1, p2, 0.9);
            }
        });
    }

    textDump() {
        return [
            "Time elapsed: " + this.t.toString(),
            "Center: " + this.state.getCenter(),
            "Momentum: " + this.state.getMomentum(), 
            // "Particles: " + this.state.particles.map(particle => "{"+particle.position.x.map(x_i => +Math.floor(x_i * 10000) / 10000).join(',')+"}"), 
        ].join("\n");
    }
}
