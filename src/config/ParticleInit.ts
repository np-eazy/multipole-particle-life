import { hueToRgb } from "../graphics/Color";
import { ParticleGraphicsProps } from "../graphics/ParticleGraphicsProps";
import { drawCircle } from "../graphics/Shapes";
import { View } from "../graphics/View";
import { Particle } from "../simulation/Particle";
import { ParticlePhysicsProps, ParticleProperties } from "../simulation/ParticleProperties";
import { Vector, sample2DGaussian } from "../simulation/Utils";

export type SimulationDimensions = {
    globalSize: number;
    dimension: number;
    interactionCutoff: number;
    h: number;
};

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

export function testParticleRender(ctx: any, graphics: ParticleGraphicsProps, x: number, y: number, zoom: number = 1) {
    drawCircle(ctx, x, y, graphics.size * zoom, graphics.color);
}

export const renderCallback = (ctx: any, particle: Particle, view: View) => {
    const [x, y, z] = view.getRenderCoord(particle.position);
    testParticleRender(ctx, particle.graphics, x, y, z);
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
