import { Particle } from "../simulation/Particle";
import { ParticleProperties } from "../simulation/ParticleProperties";
import { Vector, sample2DGaussian } from "../simulation/Utils";

export const getGaussianDistribution = (particleProperties: ParticleProperties[], center: Vector, density: number, sigma: number): Particle[] => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleProperties.length; i++) {
        for (let j = 0; j < density; j++) {
            particles.push(new Particle({
                properties: particleProperties[i],
                position: (new Vector(sample2DGaussian(sigma))).addV(center),
            }))
        }
    }
    return particles;
}
