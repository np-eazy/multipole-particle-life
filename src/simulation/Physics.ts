import { Particle } from "./Particle";
import { Vector } from "./Utils";

export const Moments = {
    NORMAL: 1,
}

// Tuning Parameters
const baseCoefficient = 5;
const baseRepulsion = 3;
const baseRadius = 2;
const affineOffset = 0;
const permittivity = 1;

export const monopolePotential = (radius: number, affinity: number): Function => {
    return (r: number): number => {
        const effectiveRadius = r / (baseRadius * radius);
        return baseCoefficient * (baseRepulsion -  ((affinity + affineOffset) * effectiveRadius)) * Math.exp(-effectiveRadius);
    }
}

export const monopolePotentialDerivative = (radius: number, affinity: number): Function => {
    return (r: number): number => {
        const effectiveRadius = r / (baseRadius * radius);
        const totalAffinity = affinity + affineOffset;
        const dropoff = Math.exp(-effectiveRadius) / r;
        return -dropoff * baseCoefficient * ((baseRepulsion - (totalAffinity) * effectiveRadius) + totalAffinity)
    }
}

export const dipolePotential = (radius: number, affinity: number): Function => {
    return (r: number, cosine: number,): number => {
        const effectiveRadius = r / (baseRadius * radius);
        return -baseCoefficient * affinity * cosine / (effectiveRadius ** 2);
    }
}

const r0 = 5;
const CARDINAL = new Vector([1, 0, 0]);

export const dipolePotentialGradient = (p2: Particle): Function => {
    return (r: Vector): Vector => {
        return r
            .getRotatedV(p2.dimension == 2 ? // Rotate into the 2nd particle's frame of reference
                (p2.orientation as number) * -1 : // 2d case: orientation is vector
                CARDINAL.getCrossProduct(  // 3d case: use e1 x p2's direction to get rotation axis to bring r into p2's frame
                    p2.orientation as Vector
                )).scaleV(-1)
            .getTheta() // Using ideal dipole
            .scaleV(p2.physics.charge! / (4 * Math.PI * permittivity * ((r.getNorm() / r0) ** 3))); // Coulomb's Law at low velocity limit
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
