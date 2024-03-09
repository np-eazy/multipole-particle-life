import { circularClosedBounds } from "../simulation/Boundary";
import { Rule } from "../simulation/Interactions";
import { Moments } from "../simulation/Physics";
import { Simulation } from "../simulation/Simulation";
import { Orientation } from "../simulation/utils";
import { snake } from "./InteractionsConfig";
import { getGaussianDistribution } from "./ParticleInitializationConfig";
import { homogenousProperties } from "./ParticlePropertiesConfig";

export const globalRadius = 100;
const origin = new Orientation([0, 0]);

const diversity = 10;
const particleProperties = homogenousProperties(diversity, 1, { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE });

export const sim = new Simulation({
    dimensions: 2,
    stepSize: 0.01,
    boundary: circularClosedBounds(100),
    particleProperties: particleProperties,
    rule: new Rule({ particleProperties: particleProperties, monopoleTensor: snake(diversity, 0, 1, 0.1, -0.1) }),
    particles: getGaussianDistribution(particleProperties, origin, 25, 25),
});
