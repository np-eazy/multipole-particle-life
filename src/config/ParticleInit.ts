import { hueToRgb } from "../graphics/Color";
import { renderCallback } from "../graphics/Particle";
import { Particle } from "../simulation/Particle";
import { ParticlePhysicsProps, ParticleProperties } from "../simulation/ParticleProperties";
import { Vector, gaussianSample } from "../simulation/Utils";

export type SimulationDimensions = {
    globalSize: number;
    dimension: number;
    interactionCutoff: number;
    h: number;
};

export const getGaussianDistribution = (particleProperties: ParticleProperties[], n: number, center: Vector, sigma: number): Particle[] => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleProperties.length; i++) {
        for (let j = 0; j < n; j++) {
            particles.push(new Particle({
                properties: particleProperties[i],
                position: (new Vector(gaussianSample(center.x.length, n))).addV(center),
            }))
        }
    }
    return particles;
}

export const homogenousProperties = (diversity: number, size: number, physics: ParticlePhysicsProps): ParticleProperties[] => {
    const properties: ParticleProperties[] = [];
    for (let i = 0; i < diversity; i++) {
        properties.push(new ParticleProperties(i, "h" + i.toString(), 
            physics, 
            { 
                color: hueToRgb(i * 360 / diversity), 
                size: size, 
                renderCallback: renderCallback,
            })
        );
    }
    return properties;
}
