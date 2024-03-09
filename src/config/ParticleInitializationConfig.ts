import { Particle } from "../simulation/Particle";
import { ParticleProperties } from "../simulation/ParticleProperties";
import { Orientation, sample2DGaussian } from "../simulation/utils";

export const getGaussianDistribution = (particleProperties: ParticleProperties[], center: Orientation, density: number, sigma: number): Particle[] => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleProperties.length; i++) {
        for (let j = 0; j < density; j++) {
            particles.push(new Particle({
                properties: particleProperties[i],
                position: (new Orientation(sample2DGaussian(sigma))).addX(center),
            }))
        }
    }
    return particles;
}
