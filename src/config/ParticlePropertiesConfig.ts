import { hueToRgb } from "../graphics/utils";
import { ParticlePhysicsProps, ParticleProperties } from "../simulation/ParticleProperties";

export const homogenousProperties = (diversity: number, size: number, physics: ParticlePhysicsProps): ParticleProperties[] => {
    const properties: ParticleProperties[] = [];
    for (let i = 0; i < diversity; i++) {
        properties.push(new ParticleProperties(i, "h" + i.toString(), 
            physics, 
            { color: hueToRgb(i * 360 / diversity), size: size })
        );
    }
    return properties;
}
