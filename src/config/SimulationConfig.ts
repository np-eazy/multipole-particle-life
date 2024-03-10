import { closedCircularBounds } from "../simulation/Boundary";
import { InteractionTable } from "../simulation/Interactions";
import { Moments } from "../simulation/Physics";
import { Simulation } from "../simulation/Simulation";
import { Vector } from "../simulation/Utils";
import { snake } from "./InteractionsConfig";
import { getGaussianDistribution } from "./ParticleInitializationConfig";
import { homogenousProperties } from "./ParticlePropertiesConfig";

export const globalRadius = 100;
const origin = new Vector([0, 0]);

const diversity = 7;
const particleProperties = homogenousProperties(diversity, 1, { mass: 1, radius: 0.5, momentCoefficient: Moments.UNIFORM_SPHERE });
export const sim = new Simulation({
    dimensions: 2,
    stepSize: 0.01,
    boundary: closedCircularBounds(globalRadius),
    particleProperties: particleProperties,
    rule: new InteractionTable({ particleProperties: particleProperties, monopoleTensor: snake(diversity, -1, 4, 3.5, 0) }),
    particles: getGaussianDistribution(particleProperties, origin, 50, 25),
});
