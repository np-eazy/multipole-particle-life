import { circularClosedBounds } from "../simulation/Boundary";
import { Rule } from "../simulation/Interactions";
import { Particle } from "../simulation/Particle";
import { ParticleProperties } from "../simulation/ParticleProperties";
import { Moments } from "../simulation/Physics";
import { Simulation } from "../simulation/Simulation";
import { Orientation, sample2DGaussian } from "../simulation/utils";
import { snake } from "./InteractionsConfig";
import { homogenousProperties } from "./ParticlePropertiesConfig";

const diversity = 8;
const density = 25;

export const globalRadius = 100;
export const stepSize = 0.01;
const particles = [];

const particlePropertiesConfig = homogenousProperties(8, 1, { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE });
const particlePropertiesMap = new Map();

particlePropertiesConfig.forEach((props: ParticleProperties) => {
    particlePropertiesMap.set(props.name, props);
})

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
    stepSize: stepSize,
    boundary: circularClosedBounds(globalRadius),
    rule: new Rule({ monopoleTensor: snake(diversity, 0, 1, 0.1, -0.1) }),
    particles: particles,
});

