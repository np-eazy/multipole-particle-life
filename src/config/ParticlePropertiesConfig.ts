import { Color, hueToRgb } from "../graphics/utils";
import { ParticlePhysicsProps, ParticleProperties } from "../simulation/ParticleProperties";
import { Moments } from "../simulation/Physics";

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

export const helloWorldConfig = [
    new ParticleProperties(0, "RED", 
        { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE }, 
        { color: new Color(255, 0, 0), size: 1 }),

    new ParticleProperties(1, "GREEN", 
        { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE }, 
        { color: new Color(0, 200, 0), size: 1 }),

    new ParticleProperties(2, "BLUE", 
        { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE }, 
        { color: new Color(0, 100, 255), size: 1 }),

    new ParticleProperties(3, "MAGENTA", 
        { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE }, 
        { color: new Color(255, 0, 255), size: 1 }),

    new ParticleProperties(4, "ORANGE", 
        { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE }, 
        { color: new Color(255, 140, 0), size: 1 }),

    new ParticleProperties(5, "YELLOW", 
        { mass: 0.5, radius: 0.5, momentCoefficient: Moments.UNIFORM_SPHERE }, 
        { color: new Color(255, 255, 0), size: 0.5 }),

    new ParticleProperties(6, "CYAN", 
        { mass: 0.5, radius: 0.5, momentCoefficient: Moments.UNIFORM_SPHERE }, 
        { color: new Color(0, 255, 255), size: 0.5 }),

    new ParticleProperties(7, "BLACK", 
        { mass: 10, radius: 3, momentCoefficient: Moments.UNIFORM_SPHERE }, 
        { color: new Color(50, 50, 50), size: 3 }),
];

console.log(helloWorldConfig);
console.log(homogenousProperties(8, 1, { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE }));

export const particlePropertiesConfig = homogenousProperties(8, 1, { mass: 1, radius: 1, momentCoefficient: Moments.UNIFORM_SPHERE });

export const particlePropertiesMap = new Map();
particlePropertiesConfig.forEach((props: ParticleProperties) => {
    particlePropertiesMap.set(props.name, props);
})
