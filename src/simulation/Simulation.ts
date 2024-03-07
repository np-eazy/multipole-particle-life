import { Orientation, sample2DGaussian } from "./utils";
import { Boundary, squareBounds } from "./Boundary";
import { Particle, particleTypes } from "./Particle";
import { State } from "./State";
import { Rule } from "./Interactions";
import { interactionBound } from "./Physics";

export class Simulation {
    dimensions: number;
    t: number;
    h: number;
    boundary: Boundary;
    rule: Rule;
    state: State;

    constructor({ dimensions, boundary, rule, particles, stepSize }: { dimensions: number; boundary: Boundary, rule: Rule, particles: Particle[], stepSize: number }) {
        this.dimensions = dimensions;
        this.t = 0;
        this.h = stepSize;
        this.boundary = boundary;
        this.rule = rule;
        this.state = new State(dimensions);
        particles.forEach((particle: Particle) => {
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

    rk4Step(h: number) {
        const loadDerivative = (h1: number, state: State) => {
            [...state.particlePairs(interactionBound)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
                p1.loadForce(this.rule.getForce(p1, p2, distance));
                p2.loadForce(this.rule.getForce(p2, p1, distance));
            });
            // state.particles.forEach((particle: Particle) => {
            //     particle.move(h1);
            // });
        };
    
        const stateK1 = this.state.copy(); 
        loadDerivative(h / 6, stateK1);
    
        const stateK2 = this.state.copy().offsetBy(stateK1, h / 2); 
        loadDerivative(h / 6, stateK2);
    
        const stateK3 = this.state.copy().offsetBy(stateK2, h / 2);
        loadDerivative(h / 6, stateK3);
    
        const stateK4 = this.state.copy().offsetBy(stateK3, h);
        loadDerivative(h / 6, stateK4);

        this.state.offsetBy(stateK1, h / 6).offsetBy(stateK2, h / 3).offsetBy(stateK3, h / 3).offsetBy(stateK4, h / 6);
        this.state.particles.forEach((particle: Particle) => {
            particle.move(h);
        });
        this.correctOverlaps();
        this.boundary.checkBounds(this.state.particles);
    }

    correctOverlaps() {
        [...this.state.particlePairs(20)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
            if (distance < p1.radius + p2.radius) {
                p1.position.scaleAddX(p1.radius + p2.radius - distance, p2.position.deltaX(p1.position).normalize());
                const temp = p2.velocity.copy();
                p2.velocity.scaleX(2 * p1.mass / (p1.mass + p2.mass)).scaleAddX((p2.mass - p1.mass) / (p1.mass + p2.mass), temp);
                p1.velocity.scaleX((p1.mass - p2.mass) / (p1.mass + p2.mass)).scaleAddX(2 * p2.mass / (p1.mass + p2.mass), temp);
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
