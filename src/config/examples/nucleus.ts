import { hueToRgb } from "../../graphics/Color";
import { closedCircularBounds } from "../../simulation/Boundary";
import { InteractionTable } from "../../simulation/Interactions";
import { ParticleProperties } from "../../simulation/ParticleProperties";
import { Moments } from "../../simulation/Physics";
import { Simulation } from "../../simulation/Simulation";
import { zeroV } from "../../simulation/Utils";
import { SimulationDimensions, getGaussianDistribution } from "../ParticleInit";

export const nucleusSimulation = (dimensions: SimulationDimensions) => {
    const particleProperties = [
        new ParticleProperties(
            0,
            "red",{ mass: 1, radius: 1, momentOfInertia: Moments.UNIFORM_SPHERE },
            { 
                color: hueToRgb(0), 
                size: 2, 
            }
        ),
        new ParticleProperties(
            1,
            "green",{ mass: 1, radius: 1, momentOfInertia: Moments.UNIFORM_SPHERE },
            { 
                color: hueToRgb(120), 
                size: 2, 
            }
        ),
        new ParticleProperties(
            2,
            "blue",{ mass: 1, radius: 1, momentOfInertia: Moments.UNIFORM_SPHERE },
            { 
                color: hueToRgb(240), 
                size: 2, 
            }
        ),
        new ParticleProperties(
            3,
            "purple",{ mass: 0.001, radius: 1, momentOfInertia: Moments.UNIFORM_SPHERE },
            { 
                color: hueToRgb(275), 
                size: 5, 
            }
        ),
    ]
    
    const c = 200;
    const e = 5;
    return new Simulation({
        dimension: dimensions.dimension,
        stepSize: dimensions.h,
        boundary: closedCircularBounds(dimensions.dimension, dimensions.globalSize),
        particleProperties: particleProperties,
        rule: new InteractionTable({ particleProperties: particleProperties, monopoleTensor: [
                [-c * 2 - 1 * e / 9, c, c, e / 3, ],
                [c, -c * 2 - 1 * e / 9, c, e / 3, ],
                [c, c, -c * 2 - 1 * e / 9, e / 3, ],
                [e / 3, e / 3, e / 3, -e],
        ]}),
        particles: getGaussianDistribution(particleProperties, 50, zeroV(dimensions.dimension), dimensions.globalSize / 2),
        interactionBound: dimensions.globalSize,
        collisionBound: 2,
    });
}
