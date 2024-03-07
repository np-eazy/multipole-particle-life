import { sample2DGaussian } from "./utils";
import { Boundary, unitSquare } from "./Boundary";
import { Particle, particleTypes } from "./Particle";
import { State } from "./State";
import { Rule } from "./Interactions";
import { Orientation } from "./Physics";

export class Simulation {
    dimensions: number;
    t: number;
    boundary: Boundary;
    rule: Rule;
    state: State;

    constructor({ dimensions, boundary, rule, particles }: { dimensions: number; boundary: Boundary, rule: Rule, particles: Particle[] }) {
        this.dimensions = dimensions;
        this.t = 0;
        this.boundary = boundary;
        this.rule = rule;
        this.state = new State(dimensions);
        particles.forEach((particle: Particle) => {
            this.state.addParticle(particle);
        })
    }

    eulerStep(h: number) {
        this.t += h;
        [...this.state.particlePairs(1)].forEach(({p1, p2, distance}: { p1: Particle, p2: Particle, distance: number}) => {
            p1.loadForce(this.rule.getForce(p1, p2, distance));
            p2.loadForce(this.rule.getForce(p2, p1, distance));
        });
        this.state.particles.forEach((particle: Particle) => {
            particle.move(h);
        });
        this.boundary.checkBounds(this.state.particles);
        this.state.clearDeletedParticles();
    }

    textDump() {
        return [
            "Time elapsed: " + this.t.toString(),
            "Center: " + this.state.getCenter(),
            "Momentum: " + this.state.getMomentum(), 
            "Particles: " + this.state.particles.map(particle => "{"+particle.position.x.map(x_i => +Math.floor(x_i * 10000) / 10000).join(',')+"}"), 
        ].join("\n");
    }
}

export const unitSquareSimulation = new Simulation({
    dimensions: 2,
    boundary: unitSquare(),
    rule: new Rule({ monopoleTensor: [
        [0.5, -1, 0],
        [-1, 0.5, 1],
        [0, 1, 0.5],
    ]}),
    particles: (new Array(10)).fill(0).map((_: number) => new Particle({
        particleType: particleTypes[0],
        mass: 1,
        radius: 0.001,
        momentCoefficient: 2/5,
        position: new Orientation(sample2DGaussian(1/3)),
    })).concat((new Array(10)).fill(0).map((_: number) => new Particle({
        particleType: particleTypes[1],
        mass: 1,
        radius: 0.001,
        momentCoefficient: 2/5,
        position: new Orientation(sample2DGaussian(1/3)),
    })).concat((new Array(10)).fill(0).map((_: number) => new Particle({
        particleType: particleTypes[2],
        mass: 1,
        radius: 0.001,
        momentCoefficient: 2/5,
        position: new Orientation(sample2DGaussian(1/3)),
    })))),
}); 

console.log("Hello world!");
for (let i = 0; i < 100; i++) {
    unitSquareSimulation.eulerStep(0.01);
    console.log(unitSquareSimulation.textDump());
}
