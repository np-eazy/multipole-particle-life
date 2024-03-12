import { InteractionTable } from "../../simulation/Interactions";
import { Moments } from "../../simulation/Physics";
import { Simulation } from "../../simulation/Simulation";
import { Vector, zeroV } from "../../simulation/Utils";
import { closedCircularBounds } from "../../simulation/Boundary";
import { SimulationDimensions, getGaussianDistribution as gaussianParticles, homogenousProperties } from "../ParticleInit";

const BACKGROUND_REPULSION = 0;
const SELF_ATTRACTION = 20;
const NEXT_ATTRACTION = 10;
const PREV_REPULSION = 0;

export type SnakeSimulationProps = {
    interactionCutoff: number,
    diversity: number,
    particleSize: number,
    particleInitSigma: number,
    particlesPerType: number,

    backgroundRepulsion?: number,
    selfAttraction?: number,
    nextAttraction?: number,
    prevRepulsion?: number,
}

export const snakeInteractionTensor = (diversity: number, lambdaRepulsion: number, selfAttraction: number, couplingAttraction: number, couplingRepulsion: number): number[][] => {
    const allInteractions = [];
    for (let i = 0; i < diversity; i++) {
        const interactions = [];
        for (let j = 0; j < diversity; j++) {
            interactions.push(i == j ? selfAttraction :
                i == (j + 3) % diversity ? couplingAttraction / 25:
                i == (j + 2) % diversity ? couplingAttraction / 5:
                i == (j + 1) % diversity ? couplingAttraction :
                i == (j - 1) % diversity ? couplingAttraction :
                i == (j - 2) % diversity ? couplingAttraction / 5:
                i == (j - 3) % diversity ? couplingAttraction / 25:
                lambdaRepulsion);
        }
        allInteractions.push(interactions);
    }
    return allInteractions;
}

export const snakeSimulation = (dimensions: SimulationDimensions, props: SnakeSimulationProps) => {
    const particleProperties = homogenousProperties(props.diversity, props.particleSize, { mass: 1, radius: props.particleSize, momentOfInertia: Moments.UNIFORM_SPHERE });
    return new Simulation({
        dimension: dimensions.dimension,
        stepSize: dimensions.h,
        boundary: closedCircularBounds(dimensions.dimension, dimensions.globalSize),
        particleProperties: particleProperties,
        rule: new InteractionTable({ particleProperties: particleProperties, monopoleTensor: snakeInteractionTensor(props.diversity, 
            props.backgroundRepulsion ?? BACKGROUND_REPULSION, 
            props.selfAttraction ?? SELF_ATTRACTION, 
            props.nextAttraction ?? NEXT_ATTRACTION, 
            props.prevRepulsion ?? PREV_REPULSION,
        )}),
        particles: gaussianParticles(particleProperties, props.particlesPerType, zeroV(dimensions.dimension), props.particleInitSigma),

        interactionBound: props.interactionCutoff,
        collisionBound: props.particleSize * 2,
    });
}
