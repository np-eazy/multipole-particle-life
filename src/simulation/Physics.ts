import { Particle } from "./Particle";
import { Vector } from "./Utils";

export const Moments = {
    UNIFORM_SPHERE: 0.4,
}

// Tuning Parameters
const baseCoefficient = 5;
const baseRepulsion = 3;
const baseRadius = 2;
const affineOffset = 0;

export const baseInteractionPotential = (radius: number, affinity: number): Function => {
    return (r: number): number => {
        const effectiveRadius = r / (baseRadius * radius);
        return baseCoefficient * (baseRepulsion -  ((affinity + affineOffset) * effectiveRadius)) * Math.exp(-effectiveRadius);
    }
}

export const baseInteractionPotentialDerivative = (radius: number, affinity: number): Function => {
    return (r: number): number => {
        const effectiveRadius = r / (baseRadius * radius);
        const totalAffinity = affinity + affineOffset;
        const dropoff = Math.exp(-effectiveRadius) / r;
        return -dropoff * baseCoefficient * ((baseRepulsion - (totalAffinity) * effectiveRadius) + totalAffinity)
    }
}


export const elasticCollision = (p1: Particle, p2: Particle, restitution: number = 1) => {
    const temp = p2.velocity.copy();
    const m1 = p1.physics.mass;
    const m2 = p2.physics.mass;
    p2.velocity.scaleV(2 * m1 / (m1 + m2)).addScaledV((m2 - m1) / (m1 + m2), p1.velocity.copy()).scaleV(restitution);
    p1.velocity.scaleV((m1 - m2) / (m1 + m2)).addScaledV(2 * m2 / (m1 + m2), temp).scaleV(restitution);
}

export const reflect = (v: Vector, normal: Vector) => {
    v.addScaledV(-2 * v.getDotX(normal) / normal.getNorm(false), normal);
}
