import { Particle } from "./Particle";

export class Physics {
    constructor() {

    }
}




export const baseInteractionPotential = (radius: number, affinity: number) => {
    const baseCoefficient = 15;
    const baseRepulsion = 1.5;
    const effectiveRadius = 4;
    return (r: number) => {
        return (baseRepulsion * r - baseCoefficient * ((affinity + 1) * r) / (effectiveRadius * radius)) * Math.exp(-r / (effectiveRadius * radius));
    }
}

export const decayRate = 1;

export const interactionBound = 500;

export const elasticCollision = (p1: Particle, p2: Particle) => {
    const temp = p2.velocity.copy();
    p2.velocity.scaleX(2 * p1.mass / (p1.mass + p2.mass)).scaleAddX((p2.mass - p1.mass) / (p1.mass + p2.mass), temp);
    p1.velocity.scaleX((p1.mass - p2.mass) / (p1.mass + p2.mass)).scaleAddX(2 * p2.mass / (p1.mass + p2.mass), temp);
}