import { Particle } from "./Particle";
import { Orientation } from "./Utils";

export const Moments = {
    UNIFORM_SPHERE: 0.4,
}

export const baseInteractionPotential = (radius: number, affinity: number) => {
    const baseCoefficient = 5;
    const baseRepulsion = 10;
    const baseRadius = 3;
    const affineOffset = 0.5;
    return (r: number) => {
        const effectiveRadius = r / (baseRadius * radius);
        return baseCoefficient * (baseRepulsion -  ((affinity * Math.abs(affinity) + affineOffset) * effectiveRadius)) * Math.exp(-effectiveRadius);
    }
}

export const decayRate = 0.5;

export const interactionBound = 500;

export const elasticCollision = (p1: Particle, p2: Particle, restitution: number = 1) => {
    const temp = p2.velocity.copy();
    const m1 = p1.physics.mass;
    const m2 = p2.physics.mass;
    p2.velocity.scaleX(2 * m1 / (m1 + m2)).scaleAddX((m2 - m1) / (m1 + m2), p1.velocity.copy()).scaleX(restitution);
    p1.velocity.scaleX((m1 - m2) / (m1 + m2)).scaleAddX(2 * m2 / (m1 + m2), temp).scaleX(restitution);
}

export const reflect = (v: Orientation, normal: Orientation) => {
    v.scaleAddX(-2 * v.getDotX(normal) / normal.getNormX(false), normal);
}