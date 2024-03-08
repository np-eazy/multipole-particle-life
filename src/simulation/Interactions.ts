import { Particle, particleTypes } from "./Particle";
import { baseInteractionPotential } from "./Physics";
import { Orientation, secantApprox } from "./utils";

export const getInteractionId = (type1: string, type2: string): string => {
    return type1 + ":" + type2;
}

export class Interaction {
    potential: Function;
    type1: string;
    type2: string;
    interactionId: string;

    constructor({ type1, type2, potential }: { type1: string, type2: string, potential: Function }) {
        this.type1 = type1;
        this.type2 = type2;
        this.potential = potential;
        this.interactionId = type1.toString() + ":" + type2.toString();
    }
}

export class Rule {
    interactions: any[][];
    interactionMap = new Map();

    constructor({monopoleTensor}: {monopoleTensor: number[][]}) {
        const radius = 1;
        this.interactions = monopoleTensor.map(row => row.map(cell => 0));
        for (let i = 0; i < monopoleTensor.length; i++) {
            for (let j = 0; j < monopoleTensor[i].length; j++) {
                const type1 = particleTypes[i];
                const type2 = particleTypes[j];
                this.interactions[i][j] = new Interaction({type1: type1, type2: type2, potential: baseInteractionPotential(radius, monopoleTensor[i][j])});
                this.interactionMap.set(getInteractionId(type1, type2), this.interactions[i][j]);
            }
        }
    }

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
