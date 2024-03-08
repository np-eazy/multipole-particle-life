import { circularClosedBounds } from "../simulation/Boundary";
import { Rule } from "../simulation/Interactions";
import { Particle } from "../simulation/Particle";
import { Simulation } from "../simulation/Simulation";
import { Orientation, sample2DGaussian } from "../simulation/utils";
import { particlePropertiesConfig } from "./ParticlePropertiesConfig";

const density = 25;
const interactionRule = [
    [4, 0, 0, 0, 0],
    [0.5, 4,  -0.5, 0, 0],
    [-0.5, 0.5, 2, -5, 0],
    [-0.5, 0.5, 0, 2, 5],
    [-0.5, 0.5, 5, 0, 2],
];
const snek = [
    [5, 5, 0, 0, 0],
    [5, 5, 3, 0, 0],
    [-2, 5, 5, 3, 0],
    [-1, 5, -2, 5, 3],
    [1, 5, -1, -2, 5],
];
export const simulationRadius = 100;
export const stepSize = 0.01;
const particles = [];

for (let i = 0; i < particlePropertiesConfig.length; i++) {
    for (let j = 0; j < density; j++) {
        particles.push(new Particle({
            properties: particlePropertiesConfig[i],
            position: (new Orientation(sample2DGaussian(50))).addX(new Orientation([0, 0])),
        }))
    }
}
export const sim = new Simulation({
    dimensions: 2,
    stepSize: 0.004,
    boundary: circularClosedBounds(simulationRadius),
    rule: new Rule({ monopoleTensor: snek }),
    particles: particles,
});