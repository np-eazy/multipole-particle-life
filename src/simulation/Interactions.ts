import { Particle } from "./Particle";
import { ParticleProperties } from "./ParticleProperties";
import { baseInteractionPotential, baseInteractionPotentialDerivative } from "./Physics";
import { Vector } from "./Utils";

export const getInteractionId = (prop1: ParticleProperties, prop2: ParticleProperties): string => {
    return prop1.name + ":" + prop2.name;
}

export type Interaction = {
    potential: Function;
    derivative: Function;
    propA: ParticleProperties;
    propB: ParticleProperties;
    interactionId: string;
}

export class InteractionTable {
    interactions: any[][];
    interactionMap = new Map();

    constructor(params: {particleProperties: ParticleProperties[], monopoleTensor: number[][]}) {
        const radius = 1;
        this.interactions = params.monopoleTensor.map(row => row.map(cell => 0));
        for (let i = 0; i < params.monopoleTensor.length; i++) {
            for (let j = 0; j < params.monopoleTensor[i].length; j++) {
                const prop1 = params.particleProperties[i];
                const prop2 = params.particleProperties[j];
                this.interactions[i][j] = {
                    prop1: prop1, 
                    prop2: prop2, 
                    potential: baseInteractionPotential(radius, params.monopoleTensor[i][j]),
                    derivative: baseInteractionPotentialDerivative(radius, params.monopoleTensor[i][j]),
                    interactionId: getInteractionId(prop1, prop2),
                };
                this.interactionMap.set(this.interactions[i][j].interactionId, this.interactions[i][j]);
            }
        }
    }

    // BOTTLENECK //
    getForce(p1: Particle, p2: Particle, distance: number): Vector {
        return p1.position
            .getDelta(p2.position)
            .scaleV(this.interactionMap.get(getInteractionId(p1.properties, p2.properties)).derivative(distance) / distance);
    }
}
