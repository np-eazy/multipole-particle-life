import { hueToRgb } from "../graphics/Color";
import { affineTf, cameraTf } from "../graphics/Transformations";
import { Particle } from "../simulation/Particle";
import { ParticlePhysicsProps, ParticleProperties } from "../simulation/ParticleProperties";
import { testParticleRender } from "./GraphicsConfig";

export const homogenousProperties = (diversity: number, size: number, physics: ParticlePhysicsProps): ParticleProperties[] => {
    const properties: ParticleProperties[] = [];
    for (let i = 0; i < diversity; i++) {
        properties.push(new ParticleProperties(i, "h" + i.toString(), 
            physics, 
            { 
                color: hueToRgb(i * 360 / diversity), 
                size: size, 
                renderCallback: (ctx: any, particle: Particle, props: {
                    affineTf: affineTf,
                    cameraTf?: cameraTf,
            }) => {
                testParticleRender(ctx, particle, props.affineTf, props.cameraTf);
            } })
        );
    }
    return properties;
}
