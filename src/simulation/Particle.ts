import { ParticleGraphicsProps } from "../graphics/ParticleGraphicsProps";
import { ParticlePhysicsProps, ParticleProperties } from "./ParticleProperties";
import { decayRate } from "./Physics";
import { Vector } from "./Utils";

export class Particle {
    id: string;
    dimension: number;
    properties: ParticleProperties;
    physics: ParticlePhysicsProps;
    graphics: ParticleGraphicsProps;
    position: Vector;
    velocity: Vector;
    forceTorque: Vector;
    deleted: boolean;

    constructor(params: {
        id?: string, 
        properties: ParticleProperties, 
        position: Vector, 
        velocity?: Vector, 
        forceTorque?: Vector
    }) {
        this.id = params.id ?? (Date.now() + Math.random() * 100000).toString();
        this.dimension = params.position.x.length;

        // Redundant referencing for easier coding
        this.properties = params.properties;
        this.graphics = params.properties.graphics;
        this.physics = params.properties.physics;

        this.position = params.position;
        this.velocity = params.velocity ?? new Vector(this.dimension);
        this.forceTorque = params.forceTorque ?? new Vector(this.dimension);
        this.deleted = false;
    }

    loadForce(force: Vector) {
        this.forceTorque.addV(force);
        // TODO: handle torque
    }

    move(h: number) {
        this.forceTorque.scaleV(h / this.physics.mass);
        // TODO: handle torque
        this.velocity.addV(this.forceTorque);
        this.position.addV(this.velocity);
        this.velocity.scaleV(1 - h * (1 - decayRate));

        this.forceTorque = new Vector(this.dimension);
    }

    markForDeletion() {
        this.deleted = true;
    }
}
