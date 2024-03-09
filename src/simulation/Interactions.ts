import { Particle } from "./Particle";
import { ParticleProperties } from "./ParticleProperties";
import { baseInteractionPotential } from "./Physics";
import { Orientation, secantApprox } from "./utils";

export const getInteractionId = (type1: string, type2: string): string => {
    return type1 + ":" + type2;
}

export class Interaction {
    potential: Function;
    type1: ParticleProperties;
    type2: ParticleProperties;
    interactionId: string;

    constructor({ prop1: type1, prop2: type2, potential: potential }: { prop1: ParticleProperties, prop2: ParticleProperties, potential: Function }) {
        this.type1 = type1;
        this.type2 = type2;
        this.potential = potential;
        this.interactionId = type1 + ":" + type2;
    }
}

export class Rule {
    interactions: any[][];
    interactionMap = new Map();

    constructor(params: {particleProperties: ParticleProperties[], monopoleTensor: number[][]}) {
        const radius = 1;
        this.interactions = params.monopoleTensor.map(row => row.map(cell => 0));
        for (let i = 0; i < params.monopoleTensor.length; i++) {
            for (let j = 0; j < params.monopoleTensor[i].length; j++) {
                const prop1 = params.particleProperties[i];
                const prop2 = params.particleProperties[j];
                this.interactions[i][j] = new Interaction({prop1: prop1, prop2: prop2, potential: baseInteractionPotential(radius, params.monopoleTensor[i][j])});
                this.interactionMap.set(getInteractionId(prop1.name, prop2.name), this.interactions[i][j]);
            }
        }
    }

    // BOTTLENECK //
    getForce(p1: Particle, p2: Particle, distance: number): Orientation {
        const interaction: Interaction = this.interactionMap.get(getInteractionId(p1.properties.name, p2.properties.name));

        if (interaction) {
            const potential = interaction.potential;
            const forceMagnitude = secantApprox(potential, distance, true);
            const force = p1.position.unitDeltaX(p2.position);
            force.scaleX(forceMagnitude);
            return force;
        } else {
            return new Orientation((new Array(p1.dimension)).fill(0));
        }
    }
}
