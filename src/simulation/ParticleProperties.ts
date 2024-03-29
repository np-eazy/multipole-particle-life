import { ParticleGraphicsProps as ParticleGraphicsProps } from "../graphics/Particle";

export type ParticlePhysicsProps = {
    mass: number;
    radius: number;
    momentOfInertia: number;
    charge?: number;
}

export const particlePropertiesMap = new Map();

export class ParticleProperties {
    readonly index: number;
    name: string;
    physics: ParticlePhysicsProps;
    graphics: ParticleGraphicsProps;

    constructor(index: number, name: string, physics: ParticlePhysicsProps, graphics: ParticleGraphicsProps) {
        this.index = index;
        this.name = name;
        this.physics = physics;
        this.graphics = graphics;
        this.graphics.parent = this;
        particlePropertiesMap.set(this.name, this);
    }
}
