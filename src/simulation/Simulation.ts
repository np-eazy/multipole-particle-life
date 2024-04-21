import { Boundary } from "./Boundary";
import { Particle } from "./Particle";
import { State } from "./State";
import { InteractionTable } from "./Interactions";
import { elasticCollision } from "./Physics";
import { ParticleProperties } from "./ParticleProperties";

export type SimulationProps = { 
    dimension: number,
    boundary: Boundary, 
    rule: InteractionTable, 
    particleProperties: ParticleProperties[], 
    particles: Particle[], 
    stepSize: number,

    interactionBound: number,
    collisionBound: number,
}

export type SimulationPhysicsProps = {
    drag: number,
}

export class Simulation {
    dimension: number;
    t: number;
    h: number;
    boundary: Boundary;
    particleProperties: ParticleProperties[];
    rule: InteractionTable;
    state: State;

    interactionBound: number;
    collisionBound: number;

    constructor(params: SimulationProps) {
        this.dimension = params.dimension;
        this.t = 0;
        this.h = params.stepSize;
        this.boundary = params.boundary;
        this.rule = params.rule;
        this.particleProperties = params.particleProperties;
        this.state = new State(params.dimension);
        params.particles.forEach((particle: Particle) => {
            this.state.addParticle(particle);
        })
        this.interactionBound = params.interactionBound;
        this.collisionBound = params.collisionBound;
    }

    eulerStep(h: number, state?: State) {
        const currState: State = state ?? this.state;
        if (!state)this.t += h;
        [...this.state.getPairs(this.interactionBound)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
            const delta = p1.position.getDelta(p2.position);
            p1.loadForce(this.rule.getForce(p1, p2, distance, delta));
            p2.loadForce(this.rule.getForce(p2, p1, distance, delta));
            // TODO: Generate dipole pairwise interactions by first filtering the charged particles
            if (p1.physics.charge && p2.physics.charge) {
                p1.loadTorque(this.rule.getTorque(p1, p2, distance, delta));
                p2.loadTorque(this.rule.getTorque(p2, p1, distance, delta));        
            }
        });
        currState.particles.forEach((particle: Particle) => {
            particle.move(h);
        });
        this.boundary.checkBounds(this.state.particles);
        currState.clearDeletedParticles();
    }

    rk4Step() {
        const loadDerivative = (state: State) => {
            [...state.getPairs(this.interactionBound)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
                p1.loadForce(this.rule.getForce(p1, p2, distance));
                p2.loadForce(this.rule.getForce(p2, p1, distance));
            });
        };
    
        const stateK1 = this.state.copy(); 
        loadDerivative(stateK1);
    
        const stateK2 = this.state.copy().perturb(stateK1, this.h / 2); 
        loadDerivative(stateK2);
    
        const stateK3 = this.state.copy().perturb(stateK2, this.h / 2);
        loadDerivative(stateK3);
    
        const stateK4 = this.state.copy().perturb(stateK3, this.h);
        loadDerivative(stateK4);

        this.state.perturb(stateK1, this.h / 6).perturb(stateK2, this.h / 3).perturb(stateK3, this.h / 3).perturb(stateK4, this.h / 6);
        this.state.particles.forEach((particle: Particle) => {
            particle.move(this.h);
        });
        this.correctOverlaps();
        this.boundary.checkBounds(this.state.particles);
        this.state.clearDeletedParticles();
    }

    correctOverlaps() {
        [...this.state.getPairs(this.collisionBound)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
            const [r1, r2] = [p1.physics.radius, p2.physics.radius, p1.physics.radius, p2.physics.radius];
            if (distance < r1 + r2) {
                p1.position.addScaledV(r1 +r2 - distance, p2.position.getDelta(p1.position).normalize());
                elasticCollision(p1, p2, 0.5);
            }
        });
    }
}
